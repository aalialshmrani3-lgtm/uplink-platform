import { db } from "../db";
import {
  matchingRequests,
  matches,
  users,
  investorProfiles,
  innovatorProfiles,
  companyProfiles,
} from "../../drizzle/schema";
import { calculateMatchScore, analyzeIdea } from "../ai/idea-analyzer";
import { ideas } from "../../drizzle/schema";
import { eq, and, gte } from "drizzle-orm";

/**
 * UPLINK2 Smart Matching Engine
 * Automatically matches innovators with investors, sponsors with events, etc.
 */

export async function findMatches(requestId: number) {
  // Get matching request
  const request = await db.query.matchingRequests.findFirst({
    where: eq(matchingRequests.id, requestId),
  });

  if (!request) {
    throw new Error("Matching request not found");
  }

  // Find potential matches based on type
  let potentialMatches: any[] = [];

  if (request.seekingType === "investor") {
    // Find investors
    potentialMatches = await db
      .select()
      .from(users)
      .innerJoin(investorProfiles, eq(users.id, investorProfiles.userId))
      .where(eq(users.userType, "investor"));
  } else if (request.seekingType === "innovator") {
    // Find innovators
    potentialMatches = await db
      .select()
      .from(users)
      .innerJoin(innovatorProfiles, eq(users.id, innovatorProfiles.userId))
      .where(eq(users.userType, "innovator"));
  } else if (request.seekingType === "sponsor") {
    // Find companies/investors
    potentialMatches = await db
      .select()
      .from(users)
      .innerJoin(companyProfiles, eq(users.id, companyProfiles.userId))
      .where(eq(users.userType, "company"));
  }

  // Get requester's ideas to extract AI tags
  const requesterIdeas = await db.query.ideas.findMany({
    where: eq(ideas.userId, request.userId),
    orderBy: (ideas, { desc }) => [desc(ideas.createdAt)],
    limit: 5, // Get last 5 ideas for better tag coverage
  });

  // Extract AI tags from ideas
  const requesterTags: string[] = [];
  const requesterIndustries: string[] = [];
  let avgInnovationScore = 0;
  let avgFeasibilityScore = 0;

  for (const idea of requesterIdeas) {
    if (idea.aiAnalysis) {
      const analysis = JSON.parse(idea.aiAnalysis as string);
      if (analysis.tags) requesterTags.push(...analysis.tags);
      if (analysis.industry) requesterIndustries.push(analysis.industry);
      if (analysis.innovationScore) avgInnovationScore += analysis.innovationScore;
      if (analysis.feasibilityScore) avgFeasibilityScore += analysis.feasibilityScore;
    }
  }

  if (requesterIdeas.length > 0) {
    avgInnovationScore /= requesterIdeas.length;
    avgFeasibilityScore /= requesterIdeas.length;
  }

  // Calculate match scores for each potential match
  const matchResults = [];

  for (const potential of potentialMatches) {
    // Get potential match's ideas/interests
    const potentialIdeas = await db.query.ideas.findMany({
      where: eq(ideas.userId, potential.users.id),
      orderBy: (ideas, { desc }) => [desc(ideas.createdAt)],
      limit: 5,
    });

    const potentialTags: string[] = [];
    const potentialIndustries: string[] = [];
    let potentialAvgInnovation = 0;
    let potentialAvgFeasibility = 0;

    for (const idea of potentialIdeas) {
      if (idea.aiAnalysis) {
        const analysis = JSON.parse(idea.aiAnalysis as string);
        if (analysis.tags) potentialTags.push(...analysis.tags);
        if (analysis.industry) potentialIndustries.push(analysis.industry);
        if (analysis.innovationScore) potentialAvgInnovation += analysis.innovationScore;
        if (analysis.feasibilityScore) potentialAvgFeasibility += analysis.feasibilityScore;
      }
    }

    if (potentialIdeas.length > 0) {
      potentialAvgInnovation /= potentialIdeas.length;
      potentialAvgFeasibility /= potentialIdeas.length;
    }

    // Calculate AI-enhanced match score
    const tagSimilarity = calculateTagSimilarity(requesterTags, potentialTags);
    const industrySimilarity = calculateIndustrySimilarity(requesterIndustries, potentialIndustries);
    const innovationAlignment = 100 - Math.abs(avgInnovationScore - potentialAvgInnovation);
    const feasibilityAlignment = 100 - Math.abs(avgFeasibilityScore - potentialAvgFeasibility);

    // Weighted score calculation
    const aiEnhancedScore = Math.round(
      tagSimilarity * 0.4 +
      industrySimilarity * 0.3 +
      innovationAlignment * 0.15 +
      feasibilityAlignment * 0.15
    );

    // Get base match score from original algorithm
    const baseMatchScore = await calculateMatchScore(
      request,
      potential,
      `${request.seekingType}-${potential.users.userType}` as any
    );

    // Combine base score with AI-enhanced score (70% AI, 30% base)
    const finalScore = Math.round(aiEnhancedScore * 0.7 + baseMatchScore.score * 0.3);

    const matchReasons = [
      ...baseMatchScore.reasons,
      `Tag Similarity: ${tagSimilarity}%`,
      `Industry Match: ${industrySimilarity}%`,
      `Innovation Alignment: ${Math.round(innovationAlignment)}%`,
    ];

    const commonTags = requesterTags.filter(tag => potentialTags.includes(tag));
    if (commonTags.length > 0) {
      matchReasons.push(`Common Tags: ${commonTags.slice(0, 3).join(", ")}`);
    }

    // Only create match if score >= 50%
    if (finalScore >= 50) {
      const [match] = await db
        .insert(matches)
        .values({
          requestId: request.id,
          matchedUserId: potential.users.id,
          score: finalScore.toString(),
          reasons: matchReasons,
          aiTags: JSON.stringify(commonTags),
          status: "pending",
        })
        .$returningId();

      matchResults.push({
        matchId: match.id,
        userId: potential.users.id,
        userName: potential.users.name,
        score: finalScore,
        reasons: matchReasons,
        aiTags: commonTags,
      });
    }
  }

  return {
    requestId,
    matchesFound: matchResults.length,
    matches: matchResults,
  };
}

export async function acceptMatch(matchId: number, userId: number) {
  // Update match status
  await db
    .update(matches)
    .set({ status: "accepted" })
    .where(eq(matches.id, matchId));

  // TODO: Create notification for both parties
  // TODO: Create contract in UPLINK3

  return { success: true };
}

export async function rejectMatch(
  matchId: number,
  userId: number,
  reason?: string
) {
  await db
    .update(matches)
    .set({ status: "rejected" })
    .where(eq(matches.id, matchId));

  return { success: true };
}

/**
 * Calculate tag similarity using Jaccard Index
 */
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  if (tags1.length === 0 || tags2.length === 0) return 0;

  const set1 = new Set(tags1.map(t => t.toLowerCase()));
  const set2 = new Set(tags2.map(t => t.toLowerCase()));

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return Math.round((intersection.size / union.size) * 100);
}

/**
 * Calculate industry similarity
 */
function calculateIndustrySimilarity(industries1: string[], industries2: string[]): number {
  if (industries1.length === 0 || industries2.length === 0) return 0;

  const set1 = new Set(industries1.map(i => i.toLowerCase()));
  const set2 = new Set(industries2.map(i => i.toLowerCase()));

  const intersection = new Set([...set1].filter(x => set2.has(x)));

  return intersection.size > 0 ? 100 : 0; // Binary: same industry or not
}

export async function getMyMatches(userId: number) {
  // Get all matches where user is either requester or matched user
  const myRequests = await db.query.matchingRequests.findMany({
    where: eq(matchingRequests.userId, userId),
    with: {
      matches: {
        with: {
          matchedUser: true,
        },
      },
    },
  });

  return myRequests;
}

import { db } from "../db";
import {
  matchingRequests,
  matches,
  users,
  investorProfiles,
  innovatorProfiles,
  companyProfiles,
} from "../../drizzle/schema";
import { calculateMatchScore } from "../ai/idea-analyzer";
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

  // Calculate match scores for each potential match
  const matchResults = [];

  for (const potential of potentialMatches) {
    const matchScore = await calculateMatchScore(
      request,
      potential,
      `${request.seekingType}-${potential.users.userType}` as any
    );

    // Only create match if score >= 50%
    if (matchScore.score >= 50) {
      const [match] = await db
        .insert(matches)
        .values({
          requestId: request.id,
          matchedUserId: potential.users.id,
          score: matchScore.score.toString(),
          reasons: matchScore.reasons,
          status: "pending",
        })
        .$returningId();

      matchResults.push({
        matchId: match.id,
        userId: potential.users.id,
        userName: potential.users.name,
        score: matchScore.score,
        reasons: matchScore.reasons,
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

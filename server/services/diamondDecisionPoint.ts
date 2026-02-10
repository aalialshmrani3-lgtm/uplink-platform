import { getDb } from "../db";
import { vettingReviews, vettingDecisions, ipRegistrations, projects, ideaTransitions } from "../../drizzle/schema";
import { eq, and, count } from "drizzle-orm";

/**
 * Diamond Decision Point System
 * 
 * This system automatically evaluates IP registrations after receiving 3 expert reviews
 * (1 legal + 1 technical + 1 commercial) and makes a final decision.
 * 
 * Decision Logic:
 * - Average Score ≥ 70: APPROVED → Move to UPLINK3
 * - Average Score 50-69: NEEDS_REVISION → Send feedback to innovator
 * - Average Score < 50: REJECTED → Feedback Loop to UPLINK1
 */

export interface DiamondDecisionResult {
  decision: "approved" | "rejected" | "needs_revision";
  averageScore: number;
  legalScore: number;
  technicalScore: number;
  commercialScore: number;
  feedback: string;
  movedToUPLINK3?: boolean;
}

/**
 * Check if an IP has received all 3 required expert reviews
 */
export async function checkReviewCompleteness(ipRegistrationId: number): Promise<boolean> {
  const db = getDb();
  
  const reviews = await db.select()
    .from(vettingReviews)
    .where(eq(vettingReviews.ipRegistrationId, ipRegistrationId));
  
  // Check if we have 1 review from each expert type
  const hasLegal = reviews.some(r => r.expertType === "legal");
  const hasTechnical = reviews.some(r => r.expertType === "technical");
  const hasCommercial = reviews.some(r => r.expertType === "commercial");
  
  return hasLegal && hasTechnical && hasCommercial;
}

/**
 * Execute Diamond Decision Point logic
 */
export async function executeDiamondDecision(ipRegistrationId: number): Promise<DiamondDecisionResult> {
  const db = getDb();
  
  // Get all reviews for this IP
  const reviews = await db.select()
    .from(vettingReviews)
    .where(eq(vettingReviews.ipRegistrationId, ipRegistrationId));
  
  if (reviews.length < 3) {
    throw new Error("Not enough reviews to make a decision");
  }
  
  // Extract scores by expert type
  const legalReview = reviews.find(r => r.expertType === "legal");
  const technicalReview = reviews.find(r => r.expertType === "technical");
  const commercialReview = reviews.find(r => r.expertType === "commercial");
  
  if (!legalReview || !technicalReview || !commercialReview) {
    throw new Error("Missing required expert reviews");
  }
  
  const legalScore = legalReview.score;
  const technicalScore = technicalReview.score;
  const commercialScore = commercialReview.score;
  
  // Calculate average score
  const averageScore = Math.round((legalScore + technicalScore + commercialScore) / 3);
  
  // Determine final decision
  let finalDecision: "approved" | "rejected" | "needs_revision";
  let feedback: string;
  let movedToUPLINK3 = false;
  
  if (averageScore >= 70) {
    finalDecision = "approved";
    feedback = `تهانينا! تم قبول ملكيتك الفكرية بدرجة ${averageScore}%. سيتم نقلها إلى UPLINK3 للعرض على المستثمرين.`;
    movedToUPLINK3 = true;
    
    // Update IP status
    await db.update(ipRegistrations)
      .set({ status: "approved" })
      .where(eq(ipRegistrations.id, ipRegistrationId));
    
    // Move associated project to UPLINK3
    await db.update(projects)
      .set({ engine: "uplink3", status: "approved" })
      .where(eq(projects.ipRegistrationId, ipRegistrationId));
    
    // Create transition record
    const ipRecord = await db.select().from(ipRegistrations)
      .where(eq(ipRegistrations.id, ipRegistrationId))
      .limit(1);
    
    if (ipRecord[0]) {
      await db.insert(ideaTransitions).values({
        ideaId: ipRecord[0].id,
        userId: ipRecord[0].userId,
        fromEngine: "uplink2",
        toEngine: "uplink3",
        reason: `Approved by Diamond Decision Point with score ${averageScore}%`,
        score: averageScore.toString(),
        metadata: JSON.stringify({
          legalScore,
          technicalScore,
          commercialScore,
          reviews: reviews.map(r => ({
            expertType: r.expertType,
            score: r.score,
            recommendation: r.recommendation,
          })),
        }),
      });
    }
    
  } else if (averageScore >= 50) {
    finalDecision = "needs_revision";
    feedback = `ملكيتك الفكرية حصلت على درجة ${averageScore}%. يرجى مراجعة الملاحظات التالية وإعادة التقديم:\n\n`;
    
    // Collect revision suggestions
    if (legalReview.revisionSuggestions) {
      feedback += `**المراجعة القانونية:** ${legalReview.revisionSuggestions}\n\n`;
    }
    if (technicalReview.revisionSuggestions) {
      feedback += `**المراجعة الفنية:** ${technicalReview.revisionSuggestions}\n\n`;
    }
    if (commercialReview.revisionSuggestions) {
      feedback += `**المراجعة التجارية:** ${commercialReview.revisionSuggestions}\n\n`;
    }
    
    // Update IP status
    await db.update(ipRegistrations)
      .set({ status: "under_review" })
      .where(eq(ipRegistrations.id, ipRegistrationId));
    
  } else {
    finalDecision = "rejected";
    feedback = `عذراً، ملكيتك الفكرية حصلت على درجة ${averageScore}% ولم تستوفِ المعايير المطلوبة. سيتم إعادتها إلى UPLINK1 للتطوير.`;
    
    // Feedback Loop: Move back to UPLINK1
    await db.update(ipRegistrations)
      .set({ status: "rejected" })
      .where(eq(ipRegistrations.id, ipRegistrationId));
    
    await db.update(projects)
      .set({ engine: "uplink1", status: "draft" })
      .where(eq(projects.ipRegistrationId, ipRegistrationId));
    
    // Create transition record
    const ipRecord = await db.select().from(ipRegistrations)
      .where(eq(ipRegistrations.id, ipRegistrationId))
      .limit(1);
    
    if (ipRecord[0]) {
      await db.insert(ideaTransitions).values({
        ideaId: ipRecord[0].id,
        userId: ipRecord[0].userId,
        fromEngine: "uplink2",
        toEngine: "uplink1",
        reason: `Rejected by Diamond Decision Point with score ${averageScore}% - Feedback Loop`,
        score: averageScore.toString(),
        metadata: JSON.stringify({
          legalScore,
          technicalScore,
          commercialScore,
          feedback,
        }),
      });
    }
  }
  
  // Save decision to database
  await db.insert(vettingDecisions).values({
    ipRegistrationId,
    finalDecision,
    averageScore,
    legalScore,
    technicalScore,
    commercialScore,
    feedback,
    movedToUPLINK3,
    movedToUPLINK3At: movedToUPLINK3 ? new Date() : null,
  });
  
  return {
    decision: finalDecision,
    averageScore,
    legalScore,
    technicalScore,
    commercialScore,
    feedback,
    movedToUPLINK3,
  };
}

/**
 * Auto-trigger Diamond Decision Point after each review submission
 */
export async function autoTriggerDecision(ipRegistrationId: number): Promise<DiamondDecisionResult | null> {
  const isComplete = await checkReviewCompleteness(ipRegistrationId);
  
  if (!isComplete) {
    return null; // Not ready yet
  }
  
  // Check if decision already exists
  const db = getDb();
  const existingDecision = await db.select()
    .from(vettingDecisions)
    .where(eq(vettingDecisions.ipRegistrationId, ipRegistrationId))
    .limit(1);
  
  if (existingDecision.length > 0) {
    return null; // Decision already made
  }
  
  // Execute decision
  return await executeDiamondDecision(ipRegistrationId);
}

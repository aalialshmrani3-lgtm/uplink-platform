/**
 * Database Helpers for Idea Outcomes (Real Data Collection)
 * UPLINK 5.0 Platform
 */

import { getDb } from "./db";
import { ideaOutcomes, InsertIdeaOutcome } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Create a new idea outcome record
 */
export async function createIdeaOutcome(data: InsertIdeaOutcome) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [outcome] = await db.insert(ideaOutcomes).values(data);
  return outcome;
}

/**
 * Get idea outcome by ID
 */
export async function getIdeaOutcomeById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [outcome] = await db
    .select()
    .from(ideaOutcomes)
    .where(eq(ideaOutcomes.id, id));
  return outcome;
}

/**
 * Get all idea outcomes for a user
 */
export async function getIdeaOutcomesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(ideaOutcomes)
    .where(eq(ideaOutcomes.userId, userId))
    .orderBy(desc(ideaOutcomes.createdAt));
}

/**
 * Get pending idea outcomes (not yet classified)
 */
export async function getPendingIdeaOutcomes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(ideaOutcomes)
    .where(eq(ideaOutcomes.outcome, "pending"))
    .orderBy(desc(ideaOutcomes.createdAt));
}

/**
 * Get classified idea outcomes (success or failure)
 */
export async function getClassifiedIdeaOutcomes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db
    .select()
    .from(ideaOutcomes)
    .where(and(
      eq(ideaOutcomes.outcome, "success"),
      eq(ideaOutcomes.outcome, "failure")
    ))
    .orderBy(desc(ideaOutcomes.classifiedAt));
}

/**
 * Update idea outcome (classify as success/failure)
 */
export async function updateIdeaOutcome(
  id: number,
  data: {
    outcome?: "success" | "failure" | "pending";
    outcomeDate?: Date;
    outcomeNotes?: string;
    classifiedBy?: number;
    classifiedAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = {};
  if (data.outcome) updateData.outcome = data.outcome;
  if (data.outcomeDate) updateData.outcomeDate = data.outcomeDate.toISOString();
  if (data.outcomeNotes) updateData.outcomeNotes = data.outcomeNotes;
  if (data.classifiedBy) updateData.classifiedBy = data.classifiedBy;
  if (data.classifiedAt) updateData.classifiedAt = data.classifiedAt.toISOString();
  
  await db
    .update(ideaOutcomes)
    .set(updateData)
    .where(eq(ideaOutcomes.id, id));
  
  return await getIdeaOutcomeById(id);
}

/**
 * Get idea outcomes count by outcome type
 */
export async function getIdeaOutcomesStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const all = await db.select().from(ideaOutcomes);
  
  const stats = {
    total: all.length,
    success: all.filter((o: any) => o.outcome === "success").length,
    failure: all.filter((o: any) => o.outcome === "failure").length,
    pending: all.filter((o: any) => o.outcome === "pending").length,
  };
  
  return stats;
}

/**
 * Get training data for ML model (only classified outcomes)
 */
export async function getTrainingData() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const classified = await db
    .select()
    .from(ideaOutcomes)
    .where(and(
      eq(ideaOutcomes.outcome, "success"),
      eq(ideaOutcomes.outcome, "failure")
    ));
  
  // Transform to training format
  return classified.map((outcome: any) => ({
    budget: outcome.budget ? parseFloat(outcome.budget) : 0,
    team_size: outcome.teamSize || 0,
    timeline_months: outcome.timelineMonths || 0,
    market_demand: outcome.marketDemand ? parseFloat(outcome.marketDemand) : 0,
    technical_feasibility: outcome.technicalFeasibility ? parseFloat(outcome.technicalFeasibility) : 0,
    competitive_advantage: outcome.competitiveAdvantage ? parseFloat(outcome.competitiveAdvantage) : 0,
    user_engagement: outcome.userEngagement ? parseFloat(outcome.userEngagement) : 0,
    tags_count: outcome.tagsCount || 0,
    hypothesis_validation_rate: outcome.hypothesisValidationRate ? parseFloat(outcome.hypothesisValidationRate) : 0,
    rat_completion_rate: outcome.ratCompletionRate ? parseFloat(outcome.ratCompletionRate) : 0,
    title_length: outcome.title.length,
    description_length: outcome.description.length,
    success: outcome.outcome === "success" ? 1 : 0,
  }));
}

/**
 * Delete idea outcome (admin only)
 */
export async function deleteIdeaOutcome(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ideaOutcomes).where(eq(ideaOutcomes.id, id));
}

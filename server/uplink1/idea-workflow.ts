import { getDb } from "../db";
import { pipelineIdeas } from "../../drizzle/schema";
import { analyzeIdea } from "../ai/idea-analyzer";
import { eq } from "drizzle-orm";

/**
 * UPLINK1 Internal System
 * Handles idea submission, AI analysis, and automatic transition to UPLINK2
 */

export async function submitIdeaWithAnalysis(
  userId: number,
  title: string,
  description: string,
  category?: string
) {
  // 1. Create idea in database
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [idea] = await db
    .insert(pipelineIdeas)
    .values({
      challengeId: 0, // Default challenge
      userId,
      title,
      description,
    })
    .$returningId();

  // 2. Run AI analysis
  const analysis = await analyzeIdea(title, description, category);

  // 3. Update idea with AI analysis
  const db2 = await getDb();
  if (!db2) throw new Error("Database not available");
  await db2
    .update(pipelineIdeas)
    .set({
      aiAnalysis: JSON.stringify(analysis),
      aiScore: analysis.overallScore.toString(),
      tags: analysis.tags,
      status: analysis.uplink2Eligible ? "approved" : "parked",
    })
    .where(eq(pipelineIdeas.id, idea.id));

  // 4. Auto-move to UPLINK2 if eligible (>= 70%)
  if (analysis.uplink2Eligible) {
    await moveToUplink2(idea.id, userId);
  }

  return {
    ideaId: idea.id,
    analysis,
    movedToUplink2: analysis.uplink2Eligible,
  };
}

export async function moveToUplink2(ideaId: number, userId: number) {
  // Update idea status
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(pipelineIdeas)
    .set({
      status: "approved",
    })
    .where(eq(pipelineIdeas.id, ideaId));

  // TODO: Create notification for user
  // TODO: Create matching request in UPLINK2

  return { success: true };
}

export async function getIdeaAnalysis(ideaId: number) {
  const db = await getDb();
  if (!db) return null;
  const ideas = await db.select().from(pipelineIdeas).where(eq(pipelineIdeas.id, ideaId)).limit(1);
  const idea = ideas[0];

  if (!idea || !idea.aiAnalysis) {
    return null;
  }

  return JSON.parse(idea.aiAnalysis as string);
}

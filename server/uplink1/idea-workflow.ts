import { db } from "../db";
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
  const [idea] = await db
    .insert(pipelineIdeas)
    .values({
      userId,
      title,
      description,
      category,
      stage: "idea_generation",
      status: "pending",
    })
    .$returningId();

  // 2. Run AI analysis
  const analysis = await analyzeIdea(title, description, category);

  // 3. Update idea with AI analysis
  await db
    .update(pipelineIdeas)
    .set({
      aiAnalysis: JSON.stringify(analysis),
      innovationScore: analysis.innovationScore.toString(),
      marketScore: analysis.marketPotentialScore.toString(),
      feasibilityScore: analysis.feasibilityScore.toString(),
      overallScore: analysis.overallScore.toString(),
      classification: analysis.classification,
      tags: analysis.tags,
      status: analysis.uplink2Eligible ? "approved" : "needs_improvement",
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
  await db
    .update(pipelineIdeas)
    .set({
      stage: "challenge_matching", // UPLINK2 stage
      status: "approved",
      movedToUplink2At: new Date(),
    })
    .where(eq(pipelineIdeas.id, ideaId));

  // TODO: Create notification for user
  // TODO: Create matching request in UPLINK2

  return { success: true };
}

export async function getIdeaAnalysis(ideaId: number) {
  const idea = await db.query.pipelineIdeas.findFirst({
    where: eq(pipelineIdeas.id, ideaId),
  });

  if (!idea || !idea.aiAnalysis) {
    return null;
  }

  return JSON.parse(idea.aiAnalysis as string);
}

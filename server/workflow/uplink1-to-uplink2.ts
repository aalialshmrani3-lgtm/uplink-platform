/**
 * UPLINK 1 → UPLINK 2 Auto-Transfer Workflow
 * 
 * This workflow automatically transfers ideas from UPLINK 1 to UPLINK 2
 * when they meet the criteria (≥70% innovation score or 50-69% commercial score)
 */

import { getDb } from "../db";
import { ideas, ideaAnalysis, ideaTransitions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Transfer idea from UPLINK 1 to UPLINK 2
 */
export async function transferIdeaToUplink2(ideaId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // 1. Get idea and its analysis
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
    if (!idea) {
      throw new Error("Idea not found");
    }
    
    const [analysis] = await db.select().from(ideaAnalysis).where(eq(ideaAnalysis.ideaId, ideaId)).limit(1);
    if (!analysis) {
      throw new Error("Analysis not found");
    }
    
    // 2. Check if idea meets criteria for transfer
    const score = parseFloat(analysis.overallScore.toString());
    const classification = analysis.classification;
    
    let shouldTransfer = false;
    let reason = "";
    
    if (classification === "innovation" && score >= 70) {
      shouldTransfer = true;
      reason = "High innovation score (≥70%) - Qualified for UPLINK 2 matching";
    } else if (classification === "commercial" && score >= 50 && score < 70) {
      shouldTransfer = true;
      reason = "Commercial project (50-69%) - Qualified for UPLINK 2 commercial matching";
    }
    
    if (!shouldTransfer) {
      throw new Error("Idea does not meet criteria for UPLINK 2 transfer");
    }
    
    // 3. Update idea status to transferred_to_uplink2
    await db.update(ideas)
      .set({ 
        status: "transferred_to_uplink2",
        updatedAt: new Date()
      })
      .where(eq(ideas.id, ideaId));
    
    // 4. Record transition
    await db.insert(ideaTransitions).values({
      ideaId,
      userId,
      fromEngine: "uplink1",
      toEngine: "uplink2",
      reason,
      score: analysis.overallScore,
      metadata: {
        classification,
        transferredAt: new Date().toISOString()
      }
    });
    
    // 5. TODO: Trigger AI matching in UPLINK 2
    // This will be implemented in Phase 2
    
    return {
      success: true,
      message: "Idea transferred to UPLINK 2 successfully",
      ideaId,
      score,
      classification,
      reason
    };
    
  } catch (error) {
    console.error("[UPLINK1→2] Transfer failed:", error);
    throw error;
  }
}

/**
 * Auto-transfer all eligible ideas from UPLINK 1 to UPLINK 2
 * This can be run as a cron job or triggered manually
 */
export async function autoTransferEligibleIdeas() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Get all analyzed ideas that haven't been transferred yet
    const eligibleIdeas = await db
      .select({
        idea: ideas,
        analysis: ideaAnalysis
      })
      .from(ideas)
      .innerJoin(ideaAnalysis, eq(ideas.analysisId, ideaAnalysis.id))
      .where(eq(ideas.status, "analyzed"));
    
    const results = [];
    
    for (const { idea, analysis } of eligibleIdeas) {
      const score = parseFloat(analysis.overallScore.toString());
      const classification = analysis.classification;
      
      // Check if eligible for transfer
      if (
        (classification === "innovation" && score >= 70) ||
        (classification === "commercial" && score >= 50 && score < 70)
      ) {
        try {
          const result = await transferIdeaToUplink2(idea.id, idea.userId);
          results.push(result);
        } catch (error) {
          console.error(`[UPLINK1→2] Failed to transfer idea ${idea.id}:`, error);
        }
      }
    }
    
    return {
      success: true,
      transferred: results.length,
      results
    };
    
  } catch (error) {
    console.error("[UPLINK1→2] Auto-transfer failed:", error);
    throw error;
  }
}

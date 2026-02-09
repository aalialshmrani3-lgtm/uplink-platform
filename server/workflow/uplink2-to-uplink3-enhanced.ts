/**
 * UPLINK 2 → UPLINK 3 Auto-Transfer Workflow (Enhanced)
 * 
 * This workflow automatically transfers matched ideas from UPLINK 2 to UPLINK 3
 * when both parties (innovator + organization) approve the match
 */

import { getDb } from "../db";
import { ideas, matches, contracts, ideaTransitions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
// import { createSmartContract } from "../blockchain/blockchain-service"; // Will be implemented later

/**
 * Transfer matched idea from UPLINK 2 to UPLINK 3
 * Creates a Smart Contract automatically
 */
export async function transferMatchToUplink3(matchId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // 1. Get match details
    const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
    if (!match) {
      throw new Error("Match not found");
    }
    
    // 2. Verify match is accepted by both parties
    if (match.status !== "accepted") {
      throw new Error("Match must be accepted by both parties before transfer to UPLINK 3");
    }
    
    // 3. Get idea details
    const [idea] = await db.select().from(ideas).where(eq(ideas.id, match.requestId)).limit(1);
    if (!idea) {
      throw new Error("Idea not found");
    }
    
    // 4. Create Smart Contract
    // Note: This is a placeholder - actual blockchain deployment will be done in Phase 4
    const contractData = {
      partyA: idea.userId,
      partyB: match.matchedUserId,
      ideaId: idea.id,
      matchId: match.id,
      contractType: "innovation", // Will be determined based on match type
      totalAmount: 100000, // Placeholder - will be determined in negotiation
      milestones: [
        {
          title: "Milestone 1: Prototype Development",
          amount: 30000,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        },
        {
          title: "Milestone 2: MVP Launch",
          amount: 40000,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 180 days
        },
        {
          title: "Milestone 3: Market Validation",
          amount: 30000,
          deadline: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000) // 270 days
        }
      ]
    };
    
    // Create blockchain contract (this will be implemented in Phase 4)
    let blockchainContractId = "pending_blockchain_deployment";
    // TODO: Implement blockchain deployment
    // try {
    //   const blockchainResult = await createSmartContract(contractData);
    //   blockchainContractId = blockchainResult.contractId || "pending";
    // } catch (error) {
    //   console.warn("[UPLINK2→3] Blockchain deployment pending:", error);
    // }
    
    // 5. Create contract record in database
    const [newContract] = await db.insert(contracts).values({
      partyA: idea.userId,
      partyB: match.matchedUserId,
      projectId: idea.id,
      type: "investment",
      title: `Investment Contract - ${idea.title}`,
      description: `Smart contract for idea: ${idea.title}`,
      status: "draft",
      totalValue: contractData.totalAmount.toString(),
      currency: "USD",
      startDate: new Date(),
      endDate: contractData.milestones[contractData.milestones.length - 1].deadline,
      terms: JSON.stringify({
        milestones: contractData.milestones,
        paymentTerms: "Milestone-based payment with escrow",
        intellectualProperty: "Shared ownership based on contribution",
        confidentiality: "Standard NDA applies"
      }),
      blockchainHash: blockchainContractId,
      milestones: JSON.stringify(contractData.milestones)
    }).$returningId();
    
    // 6. Update idea status
    await db.update(ideas)
      .set({ 
        status: "contracted" as any, // Will be added to schema
        updatedAt: new Date()
      })
      .where(eq(ideas.id, idea.id));
    
    // 7. Update match status
    await db.update(matches)
      .set({ 
        status: "transferred_to_uplink3" as any, // Will be added to schema
        updatedAt: new Date()
      })
      .where(eq(matches.id, matchId));
    
    // 8. Record transition
    await db.insert(ideaTransitions).values({
      ideaId: idea.id,
      userId: idea.userId,
      fromEngine: "uplink2",
      toEngine: "uplink3",
      reason: "Match accepted by both parties - Creating Smart Contract",
      score: match.score,
      metadata: {
        matchId,
        contractId: newContract.id,
        blockchainContractId,
        transferredAt: new Date().toISOString()
      }
    });
    
    return {
      success: true,
      message: "Match transferred to UPLINK 3 successfully",
      contractId: newContract.id,
      blockchainContractId,
      ideaId: idea.id,
      matchId
    };
    
  } catch (error) {
    console.error("[UPLINK2→3] Transfer failed:", error);
    throw error;
  }
}

/**
 * Auto-transfer all accepted matches from UPLINK 2 to UPLINK 3
 */
export async function autoTransferAcceptedMatches() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Get all accepted matches that haven't been transferred yet
    const acceptedMatches = await db
      .select()
      .from(matches)
      .where(eq(matches.status, "accepted"));
    
    const results = [];
    
    for (const match of acceptedMatches) {
      try {
        const result = await transferMatchToUplink3(match.id);
        results.push(result);
      } catch (error) {
        console.error(`[UPLINK2→3] Failed to transfer match ${match.id}:`, error);
      }
    }
    
    return {
      success: true,
      transferred: results.length,
      results
    };
    
  } catch (error) {
    console.error("[UPLINK2→3] Auto-transfer failed:", error);
    throw error;
  }
}

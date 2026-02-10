/**
 * UPLINK3 Milestone Management
 * 
 * This module handles milestone operations with blockchain integration
 */

import { blockchainService } from "./blockchain/blockchain-service";
import { getDb } from "./db";
import { contracts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Get milestones for a contract from blockchain
 */
export async function getContractMilestones(contractId: number, blockchainContractId: number) {
  try {
    // Get contract from blockchain
    const contractInfo = await blockchainService.getContract(blockchainContractId);
    
    const milestones = [];
    for (let i = 0; i < contractInfo.milestoneCount; i++) {
      const milestone = await blockchainService.getMilestone(blockchainContractId, i);
      milestones.push({
        index: i,
        description: milestone.description,
        amount: milestone.amount,
        deadline: new Date(milestone.deadline * 1000), // Convert Unix timestamp to Date
        status: getMilestoneStatusText(milestone.status),
        fundsReleased: milestone.fundsReleased,
      });
    }
    
    return milestones;
  } catch (error: any) {
    console.error('[Milestones] Get milestones error:', error);
    throw new Error(`Failed to get milestones: ${error.message}`);
  }
}

/**
 * Start milestone (Innovator)
 */
export async function startMilestone(params: {
  contractId: number;
  blockchainContractId: number;
  milestoneIndex: number;
  privateKey: string;
}) {
  try {
    const result = await blockchainService.startMilestone({
      contractId: params.blockchainContractId,
      milestoneIndex: params.milestoneIndex,
      privateKey: params.privateKey,
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'تم بدء المرحلة بنجاح',
    };
  } catch (error: any) {
    console.error('[Milestones] Start milestone error:', error);
    throw new Error(`Failed to start milestone: ${error.message}`);
  }
}

/**
 * Complete milestone (Innovator)
 */
export async function completeMilestone(params: {
  contractId: number;
  blockchainContractId: number;
  milestoneIndex: number;
  privateKey: string;
}) {
  try {
    const result = await blockchainService.completeMilestone({
      contractId: params.blockchainContractId,
      milestoneIndex: params.milestoneIndex,
      privateKey: params.privateKey,
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'تم إكمال المرحلة بنجاح',
    };
  } catch (error: any) {
    console.error('[Milestones] Complete milestone error:', error);
    throw new Error(`Failed to complete milestone: ${error.message}`);
  }
}

/**
 * Approve milestone and release funds (Investor)
 */
export async function approveMilestone(params: {
  contractId: number;
  blockchainContractId: number;
  milestoneIndex: number;
  privateKey: string;
}) {
  try {
    const result = await blockchainService.approveMilestone({
      contractId: params.blockchainContractId,
      milestoneIndex: params.milestoneIndex,
      privateKey: params.privateKey,
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'تم الموافقة على المرحلة وإطلاق الأموال',
    };
  } catch (error: any) {
    console.error('[Milestones] Approve milestone error:', error);
    throw new Error(`Failed to approve milestone: ${error.message}`);
  }
}

/**
 * Reject milestone (Investor)
 */
export async function rejectMilestone(params: {
  contractId: number;
  blockchainContractId: number;
  milestoneIndex: number;
  privateKey: string;
}) {
  try {
    const result = await blockchainService.rejectMilestone({
      contractId: params.blockchainContractId,
      milestoneIndex: params.milestoneIndex,
      privateKey: params.privateKey,
    });
    
    return {
      success: true,
      transactionHash: result.transactionHash,
      message: 'تم رفض المرحلة',
    };
  } catch (error: any) {
    console.error('[Milestones] Reject milestone error:', error);
    throw new Error(`Failed to reject milestone: ${error.message}`);
  }
}

/**
 * Get contract details with milestones
 */
export async function getContractWithMilestones(contractId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  try {
    // Get contract from database
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, contractId));
    
    if (!contract) {
      throw new Error('Contract not found');
    }
    
    // Get milestones from blockchain if contract has blockchain hash
    let milestones: any[] = [];
    if (contract.blockchainHash) {
      // Extract blockchain contract ID from hash (simplified - in production, store this separately)
      // For now, we'll return empty milestones
      milestones = [];
    }
    
    return {
      contract,
      milestones,
    };
  } catch (error: any) {
    console.error('[Milestones] Get contract with milestones error:', error);
    throw new Error(`Failed to get contract: ${error.message}`);
  }
}

/**
 * Helper: Convert milestone status number to text
 */
function getMilestoneStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    0: 'pending',
    1: 'in_progress',
    2: 'completed',
    3: 'rejected',
  };
  return statusMap[status] || 'unknown';
}

/**
 * Helper: Get milestone status badge color
 */
export function getMilestoneStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'gray',
    in_progress: 'blue',
    completed: 'green',
    rejected: 'red',
  };
  return colorMap[status] || 'gray';
}

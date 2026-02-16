// Added for Flowchart Match - UPLINK3 Escrow Management Module
import { z } from "zod";
import * as db from "./db";

export const depositSchema = z.object({
  contractId: z.number(),
  amount: z.string(),
  paymentMethod: z.enum(['bank_transfer', 'credit_card', 'wallet']),
  transactionReference: z.string().optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;

/**
 * Deposit funds to escrow
 */
export async function depositToEscrow(data: DepositInput, userId: number) {
  const contract = await db.getContractById(data.contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  // Only party A can deposit
  if (contract.partyA !== userId) {
    throw new Error('Only contract creator can deposit funds');
  }

  const escrow = await db.getEscrowByContractId(data.contractId);
  
  if (!escrow) {
    throw new Error('Escrow not found');
  }

  // Create deposit transaction
  const transactionId = await db.createEscrowTransaction({
    escrowId: escrow.id,
    amount: data.amount,
    type: 'deposit',
    status: 'pending',
    description: `Deposit via ${data.paymentMethod} - Ref: ${data.transactionReference || 'N/A'}`,
  });

  // Update escrow balance
  const currentBalance = parseFloat(escrow.releasedAmount || '0');
  const pendingAmount = parseFloat(escrow.totalAmount) - currentBalance;

  await db.updateEscrow(escrow.id, {
    pendingAmount: (pendingAmount - parseFloat(data.amount)).toString(),
    status: (pendingAmount - parseFloat(data.amount)) <= 0 ? 'funded' : 'pending_deposit',
  });

  return {
    success: true,
    transactionId,
    pendingAmount: (pendingAmount - parseFloat(data.amount)).toString(),
  };
}

/**
 * Request release from escrow (TODO: releaseRequests table not yet created)
 */
/*
export async function requestRelease(
  contractId: number,
  milestoneIndex: number,
  amount: string,
  userId: number
) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  // Only party B can request release
  if (contract.partyB !== userId) {
    throw new Error('Only service provider can request release');
  }

  const escrow = await db.getEscrowByContractId(contractId);
  
  if (!escrow) {
    throw new Error('Escrow not found');
  }

  // Create release request
  const requestId = await db.createReleaseRequest({
    escrowId: escrow.id,
    contractId,
    milestoneIndex,
    amount,
    requestedBy: userId,
    status: 'pending',
    createdAt: new Date(),
  });

  return {
    success: true,
    requestId,
  };
}
*/

/**
 * Approve release request (TODO: releaseRequests table not yet created)
 */
/*
export async function approveRelease(requestId: number, userId: number) {
  const request = await db.getReleaseRequestById(requestId);
  
  if (!request) {
    throw new Error('Release request not found');
  }

  const contract = await db.getContractById(request.contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  // Only party A can approve
  if (contract.partyA !== userId) {
    throw new Error('Only contract creator can approve release');
  }

  const escrow = await db.getEscrowById(request.escrowId);
  
  if (!escrow) {
    throw new Error('Escrow not found');
  }

  // Check if sufficient balance
  const totalAmount = parseFloat(escrow.totalAmount || '0');
  const releasedAmount = parseFloat(escrow.releasedAmount || '0');
  const availableBalance = totalAmount - releasedAmount;
  const releaseAmount = parseFloat(request.amount);

  if (availableBalance < releaseAmount) {
    throw new Error('Insufficient escrow balance');
  }

  // Update release request
  await db.updateReleaseRequest(requestId, {
    status: 'approved',
    approvedAt: new Date(),
  });

  // Create release transaction
  await db.createEscrowTransaction({
    escrowId: escrow.id,
    amount: request.amount,
    type: 'release',
    status: 'completed',
  });

  // Update escrow balance
  const newReleasedAmount = releasedAmount + releaseAmount;

  await db.updateEscrow(escrow.id, {
    releasedAmount: newReleasedAmount.toString(),
    status: newReleasedAmount >= parseFloat(escrow.totalAmount) ? 'fully_released' : 'partially_released',
  });

  // Update milestone status
  const milestones = contract.milestones ? JSON.parse(contract.milestones as string) : [];
  if (milestones[request.milestoneIndex]) {
    milestones[request.milestoneIndex].status = 'completed';
    milestones[request.milestoneIndex].completedAt = new Date().toISOString();
    
    await db.updateContract(contract.id, {
      milestones: JSON.stringify(milestones),
    });
  }

  return { success: true };
}
*/

/**
 * Reject release request (TODO: releaseRequests table not yet created)
 */
/*
export async function rejectRelease(requestId: number, userId: number, reason: string) {
  const request = await db.getReleaseRequestById(requestId);
  
  if (!request) {
    throw new Error('Release request not found');
  }

  const contract = await db.getContractById(request.contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  // Only party A can reject
  if (contract.partyA !== userId) {
    throw new Error('Only contract creator can reject release');
  }

  await db.updateReleaseRequest(requestId, {
    status: 'rejected',
    rejectionReason: reason,
  });

  return { success: true };
}
*/

/**
 * Get escrow transactions
 */
export async function getEscrowTransactions(contractId: number, userId: number) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  const escrow = await db.getEscrowByContractId(contractId);
  
  if (!escrow) {
    return [];
  }

  return await db.getEscrowTransactions(escrow.id);
}

/**
 * Get release requests (TODO: releaseRequests table not yet created)
 */
/*
export async function getReleaseRequests(contractId: number, userId: number) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  return await db.getReleaseRequestsByContractId(contractId);
}
*/

/**
 * Get escrow statistics
 */
export async function getEscrowStats(userId: number) {
  const contracts = await db.getUserContracts(userId);
  const escrows = await Promise.all(
    contracts.map(contract => db.getEscrowByContractId(contract.id))
  );

  const totalEscrow = escrows.reduce((sum, escrow) => {
    if (!escrow) return sum;
    const total = parseFloat(escrow.totalAmount || '0');
    const released = parseFloat(escrow.releasedAmount || '0');
    return sum + (total - released);
  }, 0);

  const totalReleased = escrows.reduce((sum, escrow) => {
    if (!escrow) return sum;
    return sum + parseFloat(escrow.releasedAmount || '0');
  }, 0);

  return {
    totalEscrow: totalEscrow.toString(),
    totalReleased: totalReleased.toString(),
    activeEscrows: escrows.filter(e => e && e.status === 'funded').length,
    completedEscrows: escrows.filter(e => e && e.status === 'fully_released').length,
  };
}

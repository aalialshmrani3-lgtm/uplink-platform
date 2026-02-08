// Added for Flowchart Match - UPLINK3 Smart Contracts & Escrow Module
import { z } from "zod";
import * as db from "./db";

export const contractSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  partyB: z.number(),
  totalAmount: z.string(),
  currency: z.string().default('SAR'),
  milestones: z.array(z.object({
    title: z.string(),
    amount: z.string(),
    dueDate: z.string().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  })).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  terms: z.string().optional(),
});

export type ContractInput = z.infer<typeof contractSchema>;

/**
 * Create a new contract
 */
export async function createContract(data: ContractInput, partyAId: number) {
  const contractId = await db.createContract({
    ...data,
    partyA: partyAId,
    milestones: data.milestones ? JSON.stringify(data.milestones) : undefined,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    status: 'draft',
    createdAt: new Date(),
  });

  return {
    id: contractId,
    success: true,
  };
}

/**
 * Sign a contract
 */
export async function signContract(contractId: number, userId: number, signature: string) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  // Check if user is party A or party B
  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  // Update signatures
  const signatures = contract.signatures ? JSON.parse(contract.signatures) : {};
  signatures[userId] = {
    signature,
    signedAt: new Date().toISOString(),
  };

  await db.updateContract(contractId, {
    signatures: JSON.stringify(signatures),
  });

  // Check if both parties signed
  if (signatures[contract.partyA] && signatures[contract.partyB]) {
    await db.updateContract(contractId, {
      status: 'active',
    });

    // Create escrow account
    await db.createEscrowAccount({
      contractId,
      totalAmount: contract.totalAmount,
      currency: contract.currency,
      status: 'pending',
      createdAt: new Date(),
    });
  }

  return { success: true };
}

/**
 * Update milestone status
 */
export async function updateMilestone(
  contractId: number,
  milestoneIndex: number,
  status: 'pending' | 'completed' | 'cancelled',
  userId: number
) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  const milestones = contract.milestones ? JSON.parse(contract.milestones) : [];
  
  if (!milestones[milestoneIndex]) {
    throw new Error('Milestone not found');
  }

  milestones[milestoneIndex].status = status;
  milestones[milestoneIndex].updatedAt = new Date().toISOString();

  await db.updateContract(contractId, {
    milestones: JSON.stringify(milestones),
  });

  // If milestone completed, release funds from escrow
  if (status === 'completed') {
    const escrow = await db.getEscrowByContractId(contractId);
    if (escrow) {
      await releaseMilestoneFunds(escrow.id, milestones[milestoneIndex].amount);
    }
  }

  return { success: true };
}

/**
 * Release milestone funds from escrow
 */
async function releaseMilestoneFunds(escrowId: number, amount: string) {
  const escrow = await db.getEscrowById(escrowId);
  
  if (!escrow) {
    throw new Error('Escrow not found');
  }

  const releasedAmount = parseFloat(escrow.releasedAmount || '0') + parseFloat(amount);
  const totalAmount = parseFloat(escrow.totalAmount);

  await db.updateEscrow(escrowId, {
    releasedAmount: releasedAmount.toString(),
    status: releasedAmount >= totalAmount ? 'completed' : 'partial',
  });

  // Create transaction record
  await db.createEscrowTransaction({
    escrowId,
    amount,
    type: 'release',
    status: 'completed',
    createdAt: new Date(),
  });

  return { success: true };
}

/**
 * Get contract details
 */
export async function getContract(contractId: number, userId: number) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  return contract;
}

/**
 * Get user contracts
 */
export async function getUserContracts(userId: number) {
  return await db.getUserContracts(userId);
}

/**
 * Cancel contract
 */
export async function cancelContract(contractId: number, userId: number, reason?: string) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  await db.updateContract(contractId, {
    status: 'cancelled',
    cancelReason: reason,
  });

  // Refund escrow if exists
  const escrow = await db.getEscrowByContractId(contractId);
  if (escrow && escrow.status !== 'completed') {
    await db.updateEscrow(escrow.id, {
      status: 'refunded',
    });
  }

  return { success: true };
}

/**
 * Get escrow details
 */
export async function getEscrowDetails(contractId: number, userId: number) {
  const contract = await db.getContractById(contractId);
  
  if (!contract) {
    throw new Error('Contract not found');
  }

  if (contract.partyA !== userId && contract.partyB !== userId) {
    throw new Error('Unauthorized');
  }

  const escrow = await db.getEscrowByContractId(contractId);
  const transactions = escrow ? await db.getEscrowTransactions(escrow.id) : [];

  return {
    escrow,
    transactions,
  };
}

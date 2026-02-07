/**
 * UPLINK3: Smart Contracts System
 * 
 * This module manages digital contracts for asset transactions.
 * It handles contract creation, signing, execution, and dispute resolution.
 */

import { db } from "./db";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ContractInput {
  transactionId: number;
  partyAId: number; // Seller
  partyBId: number; // Buyer
  contractType: "license" | "sale" | "partnership" | "service";
  terms: string;
  conditions: Record<string, any>[];
  deliverables: Record<string, any>[];
  paymentTerms: {
    totalAmount: number;
    currency: string;
    paymentSchedule: {
      milestone: string;
      amount: number;
      dueDate?: Date;
    }[];
  };
  startDate: Date;
  endDate?: Date;
  autoRenew?: boolean;
  renewalTerms?: string;
}

export interface ContractMilestone {
  contractId: number;
  milestone: string;
  description: string;
  dueDate: Date;
  amount: number;
  status: "pending" | "completed" | "verified" | "disputed";
}

// ============================================
// CONTRACT CREATION & MANAGEMENT
// ============================================

/**
 * Create a new contract
 */
export async function createContract(input: ContractInput) {
  try {
    // Verify transaction exists
    const transaction = await db.getAssetTransactionById(input.transactionId);
    
    if (!transaction) {
      throw new Error("المعاملة غير موجودة");
    }

    // Verify parties match transaction
    if (transaction.sellerId !== input.partyAId || 
        transaction.buyerId !== input.partyBId) {
      throw new Error("أطراف العقد لا تتطابق مع المعاملة");
    }

    const contract = await db.createContract({
      ...input,
      status: "draft",
      partyASignedAt: null,
      partyBSignedAt: null,
    });

    // Update transaction with contract ID
    await db.updateAssetTransaction(input.transactionId, {
      contractId: contract.id,
    });

    return {
      success: true,
      contractId: contract.id,
      message: "تم إنشاء العقد بنجاح",
    };
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
}

/**
 * Get contract details
 */
export async function getContractDetails(contractId: number, userId: number) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId && contract.partyBId !== userId) {
      throw new Error("غير مصرح لك بعرض هذا العقد");
    }

    // Get parties details
    const partyA = await db.getUserById(contract.partyAId);
    const partyB = await db.getUserById(contract.partyBId);

    // Get milestones
    const milestones = await db.getContractMilestones(contractId);

    return {
      ...contract,
      partyA: {
        id: partyA.id,
        name: partyA.name,
        userType: partyA.userType,
      },
      partyB: {
        id: partyB.id,
        name: partyB.name,
        userType: partyB.userType,
      },
      milestones,
      isPartyA: contract.partyAId === userId,
      isPartyB: contract.partyBId === userId,
    };
  } catch (error) {
    console.error("Error fetching contract details:", error);
    throw error;
  }
}

/**
 * Update contract (only in draft status)
 */
export async function updateContract(
  contractId: number,
  userId: number,
  updates: Partial<ContractInput>
) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId) {
      throw new Error("فقط الطرف الأول (البائع) يمكنه تعديل العقد");
    }

    if (contract.status !== "draft") {
      throw new Error("لا يمكن تعديل عقد تم توقيعه");
    }

    await db.updateContract(contractId, updates);

    return {
      success: true,
      message: "تم تحديث العقد بنجاح",
    };
  } catch (error) {
    console.error("Error updating contract:", error);
    throw error;
  }
}

// ============================================
// CONTRACT SIGNING
// ============================================

/**
 * Sign a contract
 */
export async function signContract(
  contractId: number,
  userId: number,
  signature: string
) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId && contract.partyBId !== userId) {
      throw new Error("غير مصرح لك بتوقيع هذا العقد");
    }

    const isPartyA = contract.partyAId === userId;
    const isPartyB = contract.partyBId === userId;

    // Check if already signed
    if (isPartyA && contract.partyASignedAt) {
      throw new Error("لقد وقعت على هذا العقد بالفعل");
    }
    if (isPartyB && contract.partyBSignedAt) {
      throw new Error("لقد وقعت على هذا العقد بالفعل");
    }

    // Update signature
    const updates: any = {};
    if (isPartyA) {
      updates.partyASignedAt = new Date();
      updates.partyASignature = signature;
    } else {
      updates.partyBSignedAt = new Date();
      updates.partyBSignature = signature;
    }

    // Check if both parties signed
    const bothSigned = (isPartyA && contract.partyBSignedAt) || 
                      (isPartyB && contract.partyASignedAt);

    if (bothSigned) {
      updates.status = "active";
      updates.executedAt = new Date();
    } else {
      updates.status = "pending_signature";
    }

    await db.updateContract(contractId, updates);

    // If both signed, create escrow account
    if (bothSigned) {
      await createEscrowForContract(contractId);
    }

    return {
      success: true,
      message: bothSigned 
        ? "تم توقيع العقد من الطرفين. العقد نافذ الآن" 
        : "تم توقيع العقد. في انتظار توقيع الطرف الآخر",
      contractStatus: updates.status,
    };
  } catch (error) {
    console.error("Error signing contract:", error);
    throw error;
  }
}

/**
 * Create escrow account for contract
 */
async function createEscrowForContract(contractId: number) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      return;
    }

    // Create escrow account
    await db.createEscrowAccount({
      contractId,
      buyerId: contract.partyBId,
      sellerId: contract.partyAId,
      totalAmount: contract.paymentTerms.totalAmount,
      currency: contract.paymentTerms.currency,
      status: "awaiting_deposit",
    });
  } catch (error) {
    console.error("Error creating escrow for contract:", error);
  }
}

// ============================================
// MILESTONE MANAGEMENT
// ============================================

/**
 * Add a milestone to contract
 */
export async function addContractMilestone(
  contractId: number,
  userId: number,
  milestone: Omit<ContractMilestone, "contractId">
) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId) {
      throw new Error("فقط الطرف الأول يمكنه إضافة معالم");
    }

    if (contract.status !== "draft") {
      throw new Error("لا يمكن إضافة معالم لعقد تم توقيعه");
    }

    const newMilestone = await db.createContractMilestone({
      ...milestone,
      contractId,
      status: "pending",
    });

    return {
      success: true,
      milestoneId: newMilestone.id,
      message: "تم إضافة المعلم بنجاح",
    };
  } catch (error) {
    console.error("Error adding contract milestone:", error);
    throw error;
  }
}

/**
 * Mark milestone as completed (by seller)
 */
export async function completeMilestone(
  milestoneId: number,
  userId: number,
  proof?: string
) {
  try {
    const milestone = await db.getContractMilestoneById(milestoneId);
    
    if (!milestone) {
      throw new Error("المعلم غير موجود");
    }

    const contract = await db.getContractById(milestone.contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId) {
      throw new Error("فقط البائع يمكنه تحديد المعلم كمكتمل");
    }

    if (milestone.status !== "pending") {
      throw new Error("المعلم تمت معالجته بالفعل");
    }

    await db.updateContractMilestone(milestoneId, {
      status: "completed",
      completedAt: new Date(),
      proof,
    });

    // TODO: Notify buyer for verification

    return {
      success: true,
      message: "تم تحديد المعلم كمكتمل. في انتظار تأكيد المشتري",
    };
  } catch (error) {
    console.error("Error completing milestone:", error);
    throw error;
  }
}

/**
 * Verify milestone completion (by buyer)
 */
export async function verifyMilestone(
  milestoneId: number,
  userId: number,
  approved: boolean,
  notes?: string
) {
  try {
    const milestone = await db.getContractMilestoneById(milestoneId);
    
    if (!milestone) {
      throw new Error("المعلم غير موجود");
    }

    const contract = await db.getContractById(milestone.contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyBId !== userId) {
      throw new Error("فقط المشتري يمكنه التحقق من المعلم");
    }

    if (milestone.status !== "completed") {
      throw new Error("المعلم لم يتم تحديده كمكتمل بعد");
    }

    const newStatus = approved ? "verified" : "disputed";

    await db.updateContractMilestone(milestoneId, {
      status: newStatus,
      verifiedAt: approved ? new Date() : null,
      verificationNotes: notes,
    });

    // If verified, release payment from escrow
    if (approved) {
      await releaseEscrowForMilestone(milestone.contractId, milestone.amount);
    }

    return {
      success: true,
      message: approved 
        ? "تم التحقق من المعلم وإطلاق الدفعة" 
        : "تم رفض المعلم. يمكنك فتح نزاع",
    };
  } catch (error) {
    console.error("Error verifying milestone:", error);
    throw error;
  }
}

/**
 * Release escrow payment for milestone
 */
async function releaseEscrowForMilestone(contractId: number, amount: number) {
  try {
    const escrow = await db.getEscrowByContractId(contractId);
    
    if (!escrow) {
      return;
    }

    await db.updateEscrowAccount(escrow.id, {
      releasedAmount: (escrow.releasedAmount || 0) + amount,
    });

    // Check if all amount released
    if ((escrow.releasedAmount || 0) + amount >= escrow.totalAmount) {
      await db.updateEscrowAccount(escrow.id, {
        status: "completed",
        completedAt: new Date(),
      });

      // Update contract status
      await db.updateContract(contractId, {
        status: "completed",
        completedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error releasing escrow for milestone:", error);
  }
}

// ============================================
// DISPUTE MANAGEMENT
// ============================================

/**
 * Open a dispute on a contract
 */
export async function openDispute(
  contractId: number,
  userId: number,
  reason: string,
  details: string
) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.partyAId !== userId && contract.partyBId !== userId) {
      throw new Error("غير مصرح لك بفتح نزاع على هذا العقد");
    }

    if (contract.status === "completed" || contract.status === "cancelled") {
      throw new Error("لا يمكن فتح نزاع على عقد مكتمل أو ملغى");
    }

    await db.updateContract(contractId, {
      status: "disputed",
      disputeOpenedBy: userId,
      disputeReason: reason,
      disputeDetails: details,
      disputeOpenedAt: new Date(),
    });

    // Update transaction status
    if (contract.transactionId) {
      await db.updateAssetTransaction(contract.transactionId, {
        status: "disputed",
      });
    }

    // TODO: Notify platform admins

    return {
      success: true,
      message: "تم فتح النزاع. سيتم مراجعته من قبل فريق المنصة",
    };
  } catch (error) {
    console.error("Error opening dispute:", error);
    throw error;
  }
}

/**
 * Resolve a dispute (admin only)
 */
export async function resolveDispute(
  contractId: number,
  adminId: number,
  resolution: "favor_seller" | "favor_buyer" | "split" | "cancel",
  notes: string
) {
  try {
    const contract = await db.getContractById(contractId);
    
    if (!contract) {
      throw new Error("العقد غير موجود");
    }

    if (contract.status !== "disputed") {
      throw new Error("العقد ليس في حالة نزاع");
    }

    // TODO: Verify adminId has admin role

    const newStatus = resolution === "cancel" ? "cancelled" : "completed";

    await db.updateContract(contractId, {
      status: newStatus,
      disputeResolvedBy: adminId,
      disputeResolution: resolution,
      disputeResolutionNotes: notes,
      disputeResolvedAt: new Date(),
    });

    // Handle escrow based on resolution
    const escrow = await db.getEscrowByContractId(contractId);
    if (escrow) {
      switch (resolution) {
        case "favor_seller":
          await db.updateEscrowAccount(escrow.id, {
            releasedAmount: escrow.totalAmount,
            status: "completed",
          });
          break;
        case "favor_buyer":
          await db.updateEscrowAccount(escrow.id, {
            refundedAmount: escrow.totalAmount,
            status: "refunded",
          });
          break;
        case "split":
          const splitAmount = escrow.totalAmount / 2;
          await db.updateEscrowAccount(escrow.id, {
            releasedAmount: splitAmount,
            refundedAmount: splitAmount,
            status: "completed",
          });
          break;
        case "cancel":
          await db.updateEscrowAccount(escrow.id, {
            refundedAmount: escrow.totalAmount,
            status: "refunded",
          });
          break;
      }
    }

    return {
      success: true,
      message: "تم حل النزاع بنجاح",
    };
  } catch (error) {
    console.error("Error resolving dispute:", error);
    throw error;
  }
}

// ============================================
// CONTRACT QUERIES
// ============================================

/**
 * Get user's contracts
 */
export async function getUserContracts(
  userId: number,
  filters?: {
    status?: string;
    role?: "seller" | "buyer";
  }
) {
  try {
    const contracts = await db.getUserContracts(userId, filters);
    
    // Enrich with other party details
    const enriched = await Promise.all(
      contracts.map(async (contract) => {
        const otherPartyId = contract.partyAId === userId 
          ? contract.partyBId 
          : contract.partyAId;
        const otherParty = await db.getUserById(otherPartyId);
        
        return {
          ...contract,
          otherParty: {
            id: otherParty.id,
            name: otherParty.name,
          },
          role: contract.partyAId === userId ? "seller" : "buyer",
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching user contracts:", error);
    throw new Error("فشل في جلب العقود");
  }
}

/**
 * Get contract statistics
 */
export async function getContractStatistics(userId: number) {
  try {
    const stats = await db.getUserContractStats(userId);

    return {
      totalContracts: stats.totalContracts,
      activeContracts: stats.activeContracts,
      completedContracts: stats.completedContracts,
      disputedContracts: stats.disputedContracts,
      totalValue: stats.totalValue,
      contractsByType: stats.contractsByType,
    };
  } catch (error) {
    console.error("Error fetching contract statistics:", error);
    throw new Error("فشل في جلب إحصائيات العقود");
  }
}

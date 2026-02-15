/**
 * Purchase Options System for UPLINK 3
 * 
 * Provides three purchase options for organizations:
 * 1. Solution Purchase (شراء الحل)
 * 2. License Purchase (شراء التصريح/الترخيص)
 * 3. Full Acquisition (الاستحواذ الكامل)
 */

import { getDb } from "../db";
import { contracts, escrowTransactions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
// import { createSmartContract } from "../blockchain/blockchain-service"; // TODO: Implement blockchain service

export type PurchaseType = "solution" | "license" | "acquisition";

interface PurchaseOption {
  type: PurchaseType;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  features: string[];
  paymentStructure: "one-time" | "milestone-based" | "subscription";
  intellectualProperty: "shared" | "licensed" | "full-transfer";
}

/**
 * Available purchase options
 */
export const PURCHASE_OPTIONS: Record<PurchaseType, PurchaseOption> = {
  solution: {
    type: "solution",
    title: "Solution Purchase",
    titleAr: "شراء الحل",
    description: "Purchase the implemented solution with usage rights",
    descriptionAr: "شراء الحل المنفذ مع حقوق الاستخدام",
    features: [
      "Implemented solution delivery",
      "Usage rights for the organization",
      "Technical support (1 year)",
      "Updates and maintenance (1 year)",
      "Training and documentation"
    ],
    paymentStructure: "milestone-based",
    intellectualProperty: "licensed"
  },
  license: {
    type: "license",
    title: "License Purchase",
    titleAr: "شراء الترخيص",
    description: "Purchase a license to use the intellectual property",
    descriptionAr: "شراء ترخيص لاستخدام الملكية الفكرية",
    features: [
      "Exclusive or non-exclusive license",
      "Usage rights within specified territory",
      "Royalty-based or fixed-fee structure",
      "Technical documentation",
      "Limited support"
    ],
    paymentStructure: "subscription",
    intellectualProperty: "licensed"
  },
  acquisition: {
    type: "acquisition",
    title: "Full Acquisition",
    titleAr: "الاستحواذ الكامل",
    description: "Full acquisition of the project and intellectual property",
    descriptionAr: "الاستحواذ الكامل على المشروع والملكية الفكرية",
    features: [
      "Complete ownership transfer",
      "All intellectual property rights",
      "Source code and documentation",
      "Team transfer option",
      "Ongoing support from innovator (optional)"
    ],
    paymentStructure: "one-time",
    intellectualProperty: "full-transfer"
  }
};

/**
 * Create a purchase contract
 */
export async function createPurchaseContract(data: {
  innovatorId: number;
  organizationId: number;
  projectId: number;
  purchaseType: PurchaseType;
  totalAmount: number;
  currency?: string;
  milestones?: Array<{
    title: string;
    amount: number;
    deadline: Date;
  }>;
  terms?: Record<string, any>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    const option = PURCHASE_OPTIONS[data.purchaseType];
    
    // Prepare contract terms
    const contractTerms = {
      purchaseType: data.purchaseType,
      purchaseOption: option,
      paymentStructure: option.paymentStructure,
      intellectualProperty: option.intellectualProperty,
      milestones: data.milestones || [],
      customTerms: data.terms || {},
      deliverables: option.features,
      supportPeriod: data.purchaseType === "solution" ? "1 year" : "As per agreement",
      confidentiality: "Standard NDA applies",
      disputeResolution: "Arbitration in accordance with local laws"
    };
    
    // Create Smart Contract on blockchain
    let blockchainContractId = "pending_blockchain_deployment";
    // TODO: Implement blockchain service
    // try {
    //   const blockchainResult = await createSmartContract({
    //     innovatorId: data.innovatorId,
    //     investorId: data.organizationId,
    //     ideaId: data.projectId,
    //     contractType: data.purchaseType,
    //     totalAmount: data.totalAmount,
    //     milestones: data.milestones || []
    //   });
    //   blockchainContractId = blockchainResult.contractId || "pending";
    // } catch (error) {
    //   console.warn("[Purchase Contract] Blockchain deployment pending:", error);
    // }
    
    // Create contract in database
    const contractResult = await db.insert(contracts).values({
      projectId: data.projectId || 0, // Will be updated later
      type: data.purchaseType === "solution" ? "service" : 
            data.purchaseType === "license" ? "license" : "acquisition",
      status: "draft",
      totalValue: data.totalAmount.toString(),
      currency: data.currency || "USD",
      terms: JSON.stringify(contractTerms),
      blockchainHash: blockchainContractId || undefined,
      partyA: data.organizationId, // Buyer (organization)
      partyB: data.innovatorId, // Seller (innovator),
      title: `${option.title} - Contract`,
    });
    const newContractId = Number(contractResult[0].insertId);
    
    // Create escrow account (using escrowAccounts table instead)
    const { escrowAccounts } = await import('../../drizzle/schema');
    const escrowAccountResult = await db.insert(escrowAccounts).values({
      contractId: newContractId,
      totalAmount: data.totalAmount.toString(),
      releasedAmount: "0",
      currency: data.currency || "SAR",
      status: "pending_deposit",
    });
    
    return {
      success: true,
      contractId: newContractId,
      blockchainContractId,
      purchaseType: data.purchaseType,
      totalAmount: data.totalAmount,
      escrowCreated: true
    };
    
  } catch (error) {
    console.error("[Purchase Contract] Creation failed:", error);
    throw error;
  }
}

/**
 * Process payment for a purchase contract
 */
export async function processPurchasePayment(data: {
  contractId: number;
  amount: number;
  paymentMethod: "credit_card" | "bank_transfer" | "crypto";
  paymentDetails?: Record<string, any>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    // Get contract
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, data.contractId)).limit(1);
    if (!contract) {
      throw new Error("Contract not found");
    }
    
    // Verify payment amount
    const totalAmount = parseFloat(contract.totalValue || "0");
    
    // Process payment (placeholder - integrate with actual payment gateway)
    const paymentResult = {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      amount: data.amount,
      timestamp: new Date()
    };
    
    // Update contract status to active after payment
    await db.update(contracts)
      .set({
        status: "active"
      })
      .where(eq(contracts.id, data.contractId));
    
    // Update escrow
    await db.update(escrowTransactions)
      .set({
        status: "completed",
      })
      .where(eq(escrowTransactions.escrowId, data.contractId));
    
    return {
      success: true,
      transactionId: paymentResult.transactionId,
      amount: data.amount,
      contractStatus: "active"
    };
    
  } catch (error) {
    console.error("[Purchase Payment] Processing failed:", error);
    throw error;
  }
}

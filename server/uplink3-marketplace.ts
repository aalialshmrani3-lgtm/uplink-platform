/**
 * UPLINK3: Marketplace & Asset Exchange
 * 
 * This module manages the trading of innovation assets:
 * - IP Licenses (Patents, Trademarks, Copyrights)
 * - Products (Physical & Digital)
 * - Company Acquisitions (Startups, SMEs)
 */

import * as db from "./db";
import { invokeLLM } from "./_core/llm";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface MarketplaceAssetInput {
  ownerId: number;
  assetType: "license" | "product" | "acquisition";
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  currency?: string;
  pricingModel: "fixed" | "negotiable" | "royalty" | "subscription" | "revenue_share";
  
  // License-specific fields
  licenseType?: "exclusive" | "non_exclusive" | "sole" | "sublicensable";
  licenseDuration?: string;
  royaltyRate?: number;
  
  // Product-specific fields
  productCategory?: string;
  productCondition?: "new" | "used" | "refurbished";
  inventory?: number;
  
  // Acquisition-specific fields
  companyName?: string;
  companyValuation?: number;
  revenue?: number;
  employees?: number;
  foundedYear?: number;
  
  // Common fields
  category?: string;
  industry?: string;
  keywords?: string[];
  ipRegistrationId?: number;
  patentNumber?: string;
  trademarkNumber?: string;
  dueDiligenceReport?: string;
  financialStatements?: Record<string, any>[];
  legalDocuments?: string[];
  images?: string[];
  videos?: string[];
  documents?: string[];
}

export interface AssetInquiryInput {
  assetId: number;
  buyerId: number;
  message: string;
  offerPrice?: number;
  proposedTerms?: string;
}

// ============================================
// ASSET LISTING MANAGEMENT
// ============================================

/**
 * List a new asset for sale
 */
export async function listAsset(input: MarketplaceAssetInput) {
  try {
    const asset = await db.createMarketplaceAsset({
      ...input,
      status: "draft",
      views: 0,
      inquiries: 0,
    });

    return {
      success: true,
      assetId: asset.id,
      message: "تم إنشاء الإعلان كمسودة",
    };
  } catch (error) {
    console.error("Error listing asset:", error);
    throw new Error("فشل في إنشاء الإعلان");
  }
}

/**
 * Publish an asset (make it visible on marketplace)
 */
export async function publishAsset(assetId: number, ownerId: number) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.ownerId !== ownerId) {
      throw new Error("غير مصرح لك بنشر هذا الأصل");
    }

    if (asset.status !== "draft" && asset.status !== "pending_review") {
      throw new Error("الأصل منشور بالفعل");
    }

    // Validate required fields based on asset type
    validateAssetForPublishing(asset);

    await db.updateMarketplaceAsset(assetId, {
      status: "active",
      listedAt: new Date(),
    });

    return {
      success: true,
      message: "تم نشر الأصل بنجاح",
    };
  } catch (error) {
    console.error("Error publishing asset:", error);
    throw error;
  }
}

/**
 * Validate asset has all required fields before publishing
 */
function validateAssetForPublishing(asset: any) {
  if (!asset.title || !asset.description || !asset.price) {
    throw new Error("يجب ملء جميع الحقول المطلوبة");
  }

  if (asset.assetType === "license") {
    if (!asset.licenseType) {
      throw new Error("يجب تحديد نوع الترخيص");
    }
  } else if (asset.assetType === "product") {
    if (!asset.productCategory || !asset.productCondition) {
      throw new Error("يجب تحديد فئة وحالة المنتج");
    }
  } else if (asset.assetType === "acquisition") {
    if (!asset.companyName || !asset.companyValuation) {
      throw new Error("يجب تحديد اسم الشركة والتقييم");
    }
  }
}

/**
 * Update asset details
 */
export async function updateAsset(
  assetId: number,
  ownerId: number,
  updates: Partial<MarketplaceAssetInput>
) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.ownerId !== ownerId) {
      throw new Error("غير مصرح لك بتعديل هذا الأصل");
    }

    if (asset.status === "sold") {
      throw new Error("لا يمكن تعديل أصل تم بيعه");
    }

    await db.updateMarketplaceAsset(assetId, updates);

    return {
      success: true,
      message: "تم تحديث الأصل بنجاح",
    };
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
}

/**
 * Delist an asset
 */
export async function delistAsset(assetId: number, ownerId: number) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.ownerId !== ownerId) {
      throw new Error("غير مصرح لك بإزالة هذا الأصل");
    }

    if (asset.status === "sold") {
      throw new Error("لا يمكن إزالة أصل تم بيعه");
    }

    await db.updateMarketplaceAsset(assetId, {
      status: "delisted",
    });

    return {
      success: true,
      message: "تم إزالة الأصل من البورصة",
    };
  } catch (error) {
    console.error("Error delisting asset:", error);
    throw error;
  }
}

// ============================================
// ASSET BROWSING & SEARCH
// ============================================

/**
 * Get active marketplace assets
 */
export async function getMarketplaceAssets(filters?: {
  assetType?: string;
  category?: string;
  industry?: string;
  minPrice?: number;
  maxPrice?: number;
  pricingModel?: string;
  licenseType?: string;
  productCondition?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
}) {
  try {
    const assets = await db.getActiveMarketplaceAssets(filters);
    return assets;
  } catch (error) {
    console.error("Error fetching marketplace assets:", error);
    throw new Error("فشل في جلب الأصول");
  }
}

/**
 * Get asset details
 */
export async function getAssetDetails(assetId: number, viewerId?: number) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    // Increment views (only if not the owner)
    if (!viewerId || viewerId !== asset.ownerId) {
      await db.incrementAssetViews(assetId);
    }

    // Get owner details (limited info for privacy)
    const owner = await db.getUserById(asset.ownerId);

    return {
      ...asset,
      owner: {
        id: owner.id,
        name: owner.name,
        userType: owner.userType,
        verified: owner.verified,
      },
      isOwner: viewerId === asset.ownerId,
    };
  } catch (error) {
    console.error("Error fetching asset details:", error);
    throw error;
  }
}

/**
 * Search assets using AI-powered semantic search
 */
export async function searchAssets(query: string, filters?: any) {
  try {
    // Use AI to understand search intent and extract keywords
    const prompt = `
قم بتحليل استعلام البحث التالي واستخرج الكلمات المفتاحية والمعايير:

الاستعلام: "${query}"

استخرج:
1. نوع الأصل المطلوب (license, product, acquisition)
2. الصناعة أو المجال
3. الكلمات المفتاحية
4. نطاق السعر (إن وجد)
5. أي معايير أخرى
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "أنت خبير في فهم استعلامات البحث عن الأصول والابتكارات."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "search_criteria",
          strict: true,
          schema: {
            type: "object",
            properties: {
              assetType: { type: "string" },
              industry: { type: "string" },
              keywords: {
                type: "array",
                items: { type: "string" }
              },
              priceRange: {
                type: "object",
                properties: {
                  min: { type: "number" },
                  max: { type: "number" }
                },
                required: [],
                additionalProperties: false
              }
            },
            required: ["keywords"],
            additionalProperties: false
          }
        }
      }
    });

    const criteria = JSON.parse(response.choices[0].message.content);

    // Search database with extracted criteria
    const results = await db.searchMarketplaceAssets({
      ...filters,
      ...criteria,
    });

    return results;
  } catch (error) {
    console.error("Error searching assets:", error);
    throw new Error("فشل في البحث عن الأصول");
  }
}

// ============================================
// INQUIRY & OFFER MANAGEMENT
// ============================================

/**
 * Send an inquiry about an asset
 */
export async function sendAssetInquiry(input: AssetInquiryInput) {
  try {
    const asset = await db.getMarketplaceAssetById(input.assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.status !== "active") {
      throw new Error("الأصل غير متاح للشراء");
    }

    if (asset.ownerId === input.buyerId) {
      throw new Error("لا يمكنك الاستفسار عن أصل تملكه");
    }

    const inquiry = await db.createAssetInquiry({
      ...input,
      status: "pending",
    });

    // Increment inquiries count
    await db.incrementAssetInquiries(input.assetId);

    // TODO: Send notification to asset owner

    return {
      success: true,
      inquiryId: inquiry.id,
      message: "تم إرسال الاستفسار بنجاح",
    };
  } catch (error) {
    console.error("Error sending asset inquiry:", error);
    throw error;
  }
}

/**
 * Respond to an inquiry
 */
export async function respondToInquiry(
  inquiryId: number,
  sellerId: number,
  response: string,
  action: "accept" | "reject" | "negotiate"
) {
  try {
    const inquiry = await db.getAssetInquiryById(inquiryId);
    
    if (!inquiry) {
      throw new Error("الاستفسار غير موجود");
    }

    const asset = await db.getMarketplaceAssetById(inquiry.assetId);
    
    if (!asset || asset.ownerId !== sellerId) {
      throw new Error("غير مصرح لك بالرد على هذا الاستفسار");
    }

    const newStatus = action === "accept" ? "accepted" : 
                     action === "reject" ? "rejected" : 
                     "negotiating";

    await db.updateAssetInquiry(inquiryId, {
      status: newStatus,
      sellerResponse: response,
      respondedAt: new Date(),
    });

    // TODO: Send notification to buyer

    return {
      success: true,
      message: "تم الرد على الاستفسار بنجاح",
    };
  } catch (error) {
    console.error("Error responding to inquiry:", error);
    throw error;
  }
}

/**
 * Get inquiries for an asset (for owner)
 */
export async function getAssetInquiries(assetId: number, ownerId: number) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.ownerId !== ownerId) {
      throw new Error("غير مصرح لك بعرض الاستفسارات");
    }

    const inquiries = await db.getAssetInquiries(assetId);
    
    // Enrich with buyer details
    const enriched = await Promise.all(
      inquiries.map(async (inq) => {
        const buyer = await db.getUserById(inq.buyerId);
        return {
          ...inq,
          buyer: {
            id: buyer.id,
            name: buyer.name,
            userType: buyer.userType,
            verified: buyer.verified,
          },
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching asset inquiries:", error);
    throw error;
  }
}

/**
 * Get user's sent inquiries
 */
export async function getUserInquiries(userId: number) {
  try {
    const inquiries = await db.getUserAssetInquiries(userId);
    
    // Enrich with asset details
    const enriched = await Promise.all(
      inquiries.map(async (inq) => {
        const asset = await db.getMarketplaceAssetById(inq.assetId);
        return {
          ...inq,
          asset: {
            id: asset.id,
            title: asset.title,
            assetType: asset.assetType,
            price: asset.price,
            currency: asset.currency,
            status: asset.status,
          },
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching user inquiries:", error);
    throw new Error("فشل في جلب الاستفسارات");
  }
}

// ============================================
// TRANSACTION MANAGEMENT
// ============================================

/**
 * Initiate a transaction (after inquiry accepted)
 */
export async function initiateTransaction(
  assetId: number,
  buyerId: number,
  finalPrice: number,
  inquiryId?: number
) {
  try {
    const asset = await db.getMarketplaceAssetById(assetId);
    
    if (!asset) {
      throw new Error("الأصل غير موجود");
    }

    if (asset.status !== "active") {
      throw new Error("الأصل غير متاح للشراء");
    }

    if (asset.ownerId === buyerId) {
      throw new Error("لا يمكنك شراء أصل تملكه");
    }

    // Create transaction
    const transaction = await db.createAssetTransaction({
      assetId,
      sellerId: asset.ownerId,
      buyerId,
      finalPrice,
      currency: asset.currency,
      status: "pending",
    });

    // Update asset status
    await db.updateMarketplaceAsset(assetId, {
      status: "sold",
      soldAt: new Date(),
    });

    return {
      success: true,
      transactionId: transaction.id,
      message: "تم بدء عملية الشراء. سيتم التواصل معك لإتمام الإجراءات",
    };
  } catch (error) {
    console.error("Error initiating transaction:", error);
    throw error;
  }
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(transactionId: number, userId: number) {
  try {
    const transaction = await db.getAssetTransactionById(transactionId);
    
    if (!transaction) {
      throw new Error("المعاملة غير موجودة");
    }

    if (transaction.sellerId !== userId && transaction.buyerId !== userId) {
      throw new Error("غير مصرح لك بعرض هذه المعاملة");
    }

    // Get asset details
    const asset = await db.getMarketplaceAssetById(transaction.assetId);

    // Get other party details
    const otherPartyId = transaction.sellerId === userId 
      ? transaction.buyerId 
      : transaction.sellerId;
    const otherParty = await db.getUserById(otherPartyId);

    return {
      ...transaction,
      asset: {
        id: asset.id,
        title: asset.title,
        assetType: asset.assetType,
      },
      otherParty: {
        id: otherParty.id,
        name: otherParty.name,
        userType: otherParty.userType,
      },
      isSeller: transaction.sellerId === userId,
    };
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
}

/**
 * Get user's transactions
 */
export async function getUserTransactions(userId: number, role?: "buyer" | "seller") {
  try {
    const transactions = await db.getUserAssetTransactions(userId, role);
    
    // Enrich with asset details
    const enriched = await Promise.all(
      transactions.map(async (txn) => {
        const asset = await db.getMarketplaceAssetById(txn.assetId);
        const otherPartyId = txn.sellerId === userId ? txn.buyerId : txn.sellerId;
        const otherParty = await db.getUserById(otherPartyId);
        
        return {
          ...txn,
          asset: {
            id: asset.id,
            title: asset.title,
            assetType: asset.assetType,
          },
          otherParty: {
            id: otherParty.id,
            name: otherParty.name,
          },
          role: txn.sellerId === userId ? "seller" : "buyer",
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw new Error("فشل في جلب المعاملات");
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get marketplace statistics
 */
export async function getMarketplaceStatistics() {
  try {
    const stats = await db.getMarketplaceStats();

    return {
      totalAssets: stats.totalAssets,
      activeAssets: stats.activeAssets,
      soldAssets: stats.soldAssets,
      totalTransactionValue: stats.totalTransactionValue,
      assetsByType: stats.assetsByType,
      assetsByIndustry: stats.assetsByIndustry,
      averagePrice: stats.averagePrice,
      topAssets: stats.topAssets,
    };
  } catch (error) {
    console.error("Error fetching marketplace statistics:", error);
    throw new Error("فشل في جلب إحصائيات البورصة");
  }
}

/**
 * Get user's marketplace statistics
 */
export async function getUserMarketplaceStats(userId: number) {
  try {
    const stats = await db.getUserMarketplaceStats(userId);

    return {
      listedAssets: stats.listedAssets,
      activeAssets: stats.activeAssets,
      soldAssets: stats.soldAssets,
      totalRevenue: stats.totalRevenue,
      totalInquiries: stats.totalInquiries,
      purchasedAssets: stats.purchasedAssets,
      totalSpent: stats.totalSpent,
    };
  } catch (error) {
    console.error("Error fetching user marketplace stats:", error);
    throw new Error("فشل في جلب إحصائيات المستخدم");
  }
}

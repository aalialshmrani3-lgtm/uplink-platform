/**
 * UPLINK2: Smart Matching Engine
 * 
 * This module implements AI-powered matching between:
 * - Innovators and Investors
 * - Startups and Co-founders
 * - Ideas and Challenges
 * - Companies and Technical Partners
 */

import * as db from "./db";
import { invokeLLM } from "./_core/llm";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface MatchingRequestInput {
  userId: number;
  userType: "innovator" | "investor" | "company" | "government";
  title: string;
  description: string;
  lookingFor: "investor" | "co_founder" | "technical_partner" | "business_partner" | "mentor" | "innovation" | "startup" | "technology";
  industry?: string[];
  stage?: string[];
  location?: string[];
  fundingRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  keywords?: string[];
  requiredSkills?: string[];
  preferredAttributes?: Record<string, any>;
  expiresAt?: Date;
}

export interface MatchScore {
  matchedEntityId: number;
  matchedEntityType: "user" | "idea" | "project";
  score: number; // 0-100
  matchingFactors: {
    factor: string;
    score: number;
    weight: number;
    reasoning: string;
  }[];
  aiAnalysis: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

// ============================================
// MATCHING REQUEST MANAGEMENT
// ============================================

/**
 * Create a new matching request
 */
export async function createMatchingRequest(input: MatchingRequestInput) {
  try {
    const request = await db.createMatchingRequest({
      ...input,
      status: "active",
      matchesCount: 0,
    });

    // Start matching process asynchronously
    findMatches(request.id).catch(error => {
      console.error("Error in background matching:", error);
    });

    return {
      success: true,
      requestId: request.id,
      message: "تم إنشاء طلب المطابقة بنجاح. جاري البحث عن مطابقات...",
    };
  } catch (error) {
    console.error("Error creating matching request:", error);
    throw new Error("فشل في إنشاء طلب المطابقة");
  }
}

/**
 * Get user's matching requests
 */
export async function getUserMatchingRequests(userId: number) {
  try {
    const requests = await db.getUserMatchingRequests(userId);
    return requests;
  } catch (error) {
    console.error("Error fetching matching requests:", error);
    throw new Error("فشل في جلب طلبات المطابقة");
  }
}

/**
 * Get matching request details with results
 */
export async function getMatchingRequestDetails(requestId: number, userId: number) {
  try {
    const request = await db.getMatchingRequestById(requestId);
    
    if (!request) {
      throw new Error("طلب المطابقة غير موجود");
    }

    if (request.userId !== userId) {
      throw new Error("غير مصرح لك بعرض هذا الطلب");
    }

    // Get matching results
    const results = await db.getMatchingResults(requestId);

    return {
      request,
      results: results.map(r => ({
        ...r,
        matchingFactors: JSON.parse(r.matchingFactors || "[]"),
      })),
    };
  } catch (error) {
    console.error("Error fetching matching request details:", error);
    throw error;
  }
}

/**
 * Update matching request status
 */
export async function updateMatchingRequestStatus(
  requestId: number,
  userId: number,
  status: "active" | "matched" | "paused" | "closed"
) {
  try {
    const request = await db.getMatchingRequestById(requestId);
    
    if (!request) {
      throw new Error("طلب المطابقة غير موجود");
    }

    if (request.userId !== userId) {
      throw new Error("غير مصرح لك بتعديل هذا الطلب");
    }

    await db.updateMatchingRequest(requestId, { status });

    return {
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
    };
  } catch (error) {
    console.error("Error updating matching request status:", error);
    throw error;
  }
}

// ============================================
// MATCHING ALGORITHM
// ============================================

/**
 * Find matches for a matching request using AI
 */
export async function findMatches(requestId: number) {
  try {
    const request = await db.getMatchingRequestById(requestId);
    
    if (!request) {
      throw new Error("طلب المطابقة غير موجود");
    }

    // Get potential matches based on lookingFor type
    const candidates = await getCandidates(request);

    // Score each candidate using AI
    const matches: MatchScore[] = [];

    for (const candidate of candidates) {
      try {
        const score = await scoreMatch(request, candidate);
        
        if (score.score >= 50) { // Minimum threshold
          matches.push(score);
          
          // Save match result
          await db.createMatchingResult({
            requestId: request.id,
            matchedUserId: candidate.type === "user" ? candidate.id : null,
            matchedProjectId: candidate.type === "project" ? candidate.id : null,
            matchedIdeaId: candidate.type === "idea" ? candidate.id : null,
            matchScore: score.score,
            matchingFactors: JSON.stringify(score.matchingFactors),
            aiAnalysis: score.aiAnalysis,
            status: "suggested",
          });
        }
      } catch (error) {
        console.error(`Error scoring candidate ${candidate.id}:`, error);
      }
    }

    // Update request with matches count
    await db.updateMatchingRequest(requestId, {
      matchesCount: matches.length,
    });

    return matches;
  } catch (error) {
    console.error("Error finding matches:", error);
    throw error;
  }
}

/**
 * Get candidates for matching based on request type
 */
async function getCandidates(request: any) {
  const candidates: any[] = [];

  switch (request.lookingFor) {
    case "investor":
      // Get users with investor profile
      const investors = await db.getUsersByType("investor");
      candidates.push(...investors.map(u => ({ ...u, type: "user" })));
      break;

    case "co_founder":
    case "technical_partner":
    case "business_partner":
      // Get users with relevant skills
      const partners = await db.getUsersBySkills(request.requiredSkills);
      candidates.push(...partners.map(u => ({ ...u, type: "user" })));
      break;

    case "mentor":
      // Get users with mentor profile
      const mentors = await db.getUsersByType("mentor");
      candidates.push(...mentors.map(u => ({ ...u, type: "user" })));
      break;

    case "innovation":
    case "technology":
      // Get high-scoring ideas from UPLINK1
      const ideas = await db.getInnovationIdeas({
        minScore: 70,
        industry: request.industry,
      });
      candidates.push(...ideas.map(i => ({ ...i, type: "idea" })));
      break;

    case "startup":
      // Get projects/startups
      const startups = await db.getStartups({
        industry: request.industry,
        stage: request.stage,
      });
      candidates.push(...startups.map(s => ({ ...s, type: "project" })));
      break;
  }

  return candidates;
}

/**
 * Score a match using AI
 */
async function scoreMatch(request: any, candidate: any): Promise<MatchScore> {
  try {
    const prompt = `
قم بتقييم مدى التطابق بين الطلب والمرشح التالي:

**الطلب:**
النوع: ${request.lookingFor}
العنوان: ${request.title}
الوصف: ${request.description}
الصناعة: ${request.industry?.join(", ") || "غير محدد"}
المهارات المطلوبة: ${request.requiredSkills?.join(", ") || "غير محدد"}
الموقع: ${request.location?.join(", ") || "غير محدد"}

**المرشح:**
${candidate.type === "user" ? `
الاسم: ${candidate.name}
النوع: ${candidate.userType}
المهارات: ${candidate.skills?.join(", ") || "غير محدد"}
الخبرة: ${candidate.experience || "غير محدد"}
` : candidate.type === "idea" ? `
العنوان: ${candidate.title}
الوصف: ${candidate.description}
التصنيف: ${candidate.classification}
الدرجة: ${candidate.overallScore}
` : `
الاسم: ${candidate.name}
الوصف: ${candidate.description}
المرحلة: ${candidate.stage}
`}

قم بتقييم التطابق بناءً على:
1. التوافق في المجال والصناعة (30%)
2. توافق المهارات والخبرات (25%)
3. التوافق الجغرافي (15%)
4. التوافق في المرحلة/المستوى (15%)
5. عوامل أخرى (15%)

أعط درجة من 0-100 لكل عامل.
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "أنت خبير في مطابقة الأشخاص والمشاريع والأفكار. قم بتقييم التطابق بدقة وموضوعية."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "match_score",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchingFactors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    factor: { type: "string" },
                    score: { type: "number" },
                    weight: { type: "number" },
                    reasoning: { type: "string" }
                  },
                  required: ["factor", "score", "weight", "reasoning"],
                  additionalProperties: false
                }
              },
              aiAnalysis: { type: "string" },
              strengths: {
                type: "array",
                items: { type: "string" }
              },
              concerns: {
                type: "array",
                items: { type: "string" }
              },
              recommendations: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["matchingFactors", "aiAnalysis", "strengths", "concerns", "recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Calculate overall score (weighted average)
    let overallScore = 0;
    for (const factor of result.matchingFactors) {
      overallScore += (factor.score * factor.weight) / 100;
    }

    return {
      matchedEntityId: candidate.id,
      matchedEntityType: candidate.type,
      score: overallScore,
      matchingFactors: result.matchingFactors,
      aiAnalysis: result.aiAnalysis,
      strengths: result.strengths,
      concerns: result.concerns,
      recommendations: result.recommendations,
    };
  } catch (error) {
    console.error("Error scoring match:", error);
    throw error;
  }
}

// ============================================
// MATCH INTERACTION FUNCTIONS
// ============================================

/**
 * View a match (mark as viewed)
 */
export async function viewMatch(matchId: number, userId: number) {
  try {
    const match = await db.getMatchingResultById(matchId);
    
    if (!match) {
      throw new Error("المطابقة غير موجودة");
    }

    const request = await db.getMatchingRequestById(match.requestId);
    
    if (!request || request.userId !== userId) {
      throw new Error("غير مصرح لك بعرض هذه المطابقة");
    }

    if (match.status === "suggested") {
      await db.updateMatchingResult(matchId, {
        status: "viewed",
        viewedAt: new Date(),
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error viewing match:", error);
    throw error;
  }
}

/**
 * Contact a match
 */
export async function contactMatch(matchId: number, userId: number, message: string) {
  try {
    const match = await db.getMatchingResultById(matchId);
    
    if (!match) {
      throw new Error("المطابقة غير موجودة");
    }

    const request = await db.getMatchingRequestById(match.requestId);
    
    if (!request || request.userId !== userId) {
      throw new Error("غير مصرح لك بالتواصل مع هذه المطابقة");
    }

    await db.updateMatchingResult(matchId, {
      status: "contacted",
      contactedAt: new Date(),
    });

    // Create networking connection
    if (match.matchedUserId) {
      await db.createNetworkingConnection({
        userAId: userId,
        userBId: match.matchedUserId,
        connectionType: "match",
        contextId: matchId,
        status: "pending",
        message,
      });
    }

    return {
      success: true,
      message: "تم إرسال طلب التواصل بنجاح",
    };
  } catch (error) {
    console.error("Error contacting match:", error);
    throw error;
  }
}

/**
 * Accept or reject a match
 */
export async function respondToMatch(
  matchId: number,
  userId: number,
  action: "accept" | "reject"
) {
  try {
    const match = await db.getMatchingResultById(matchId);
    
    if (!match) {
      throw new Error("المطابقة غير موجودة");
    }

    const request = await db.getMatchingRequestById(match.requestId);
    
    if (!request || request.userId !== userId) {
      throw new Error("غير مصرح لك بالرد على هذه المطابقة");
    }

    await db.updateMatchingResult(matchId, {
      status: action === "accept" ? "accepted" : "rejected",
      respondedAt: new Date(),
    });

    if (action === "accept") {
      // Update request status to matched
      await db.updateMatchingRequest(request.id, {
        status: "matched",
      });
    }

    return {
      success: true,
      message: action === "accept" ? "تم قبول المطابقة" : "تم رفض المطابقة",
    };
  } catch (error) {
    console.error("Error responding to match:", error);
    throw error;
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get matching statistics
 */
export async function getMatchingStatistics(userId: number) {
  try {
    const stats = await db.getUserMatchingStats(userId);

    return {
      totalRequests: stats.totalRequests,
      activeRequests: stats.activeRequests,
      totalMatches: stats.totalMatches,
      viewedMatches: stats.viewedMatches,
      contactedMatches: stats.contactedMatches,
      acceptedMatches: stats.acceptedMatches,
      successRate: stats.totalMatches > 0 
        ? (stats.acceptedMatches / stats.totalMatches * 100).toFixed(2) 
        : 0,
    };
  } catch (error) {
    console.error("Error fetching matching statistics:", error);
    throw new Error("فشل في جلب إحصائيات المطابقة");
  }
}

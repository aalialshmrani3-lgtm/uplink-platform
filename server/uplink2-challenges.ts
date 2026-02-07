/**
 * UPLINK2: Challenges Module
 * 
 * This module handles challenges from ministries, companies, and government entities.
 * It manages challenge creation, submissions, evaluation, and winner selection.
 */

import * as db from "./db";
import { invokeLLM } from "./_core/llm";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ChallengeInput {
  ownerId: number;
  ownerType: "ministry" | "company" | "government" | "ngo";
  ownerName: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  problemStatement: string;
  desiredOutcome?: string;
  category?: string;
  subCategory?: string;
  industry?: string;
  keywords?: string[];
  eligibilityCriteria?: Record<string, any>;
  technicalRequirements?: Record<string, any>;
  constraints?: Record<string, any>;
  totalPrizePool?: number;
  currency?: string;
  prizeDistribution?: Record<string, any>[];
  fundingAvailable?: number;
  startDate: Date;
  endDate: Date;
  submissionDeadline: Date;
  evaluationDeadline?: Date;
  announcementDate?: Date;
  documents?: string[];
  images?: string[];
}

export interface ChallengeSubmissionInput {
  challengeId: number;
  userId: number;
  ideaId?: number;
  title: string;
  description: string;
  solution: string;
  expectedImpact?: string;
  teamName?: string;
  teamMembers?: Record<string, any>[];
  teamSize?: number;
  documents?: string[];
  images?: string[];
  video?: string;
  prototype?: string;
}

export interface EvaluationCriteria {
  name: string;
  weight: number;
  description: string;
}

export interface SubmissionEvaluation {
  submissionId: number;
  criteriaScores: {
    criterion: string;
    score: number;
    reasoning: string;
  }[];
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  rank?: number;
}

// ============================================
// CHALLENGE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Create a new challenge
 */
export async function createChallenge(input: ChallengeInput) {
  try {
    const challenge = await db.createChallenge({
      ...input,
      status: "draft",
      submissionsCount: 0,
      participantsCount: 0,
      views: 0,
    });

    return {
      success: true,
      challengeId: challenge.id,
      message: "تم إنشاء التحدي بنجاح",
    };
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw new Error("فشل في إنشاء التحدي");
  }
}

/**
 * Publish a challenge (change status from draft to open)
 */
export async function publishChallenge(challengeId: number, publisherId: number) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    if (challenge.ownerId !== publisherId) {
      throw new Error("غير مصرح لك بنشر هذا التحدي");
    }

    if (challenge.status !== "draft") {
      throw new Error("التحدي منشور بالفعل");
    }

    await db.updateChallenge(challengeId, {
      status: "open",
      publishedAt: new Date(),
    });

    return {
      success: true,
      message: "تم نشر التحدي بنجاح",
    };
  } catch (error) {
    console.error("Error publishing challenge:", error);
    throw error;
  }
}

/**
 * Get active challenges (open for submissions)
 */
export async function getActiveChallenges(filters?: {
  category?: string;
  industry?: string;
  ownerType?: string;
  minPrize?: number;
}) {
  try {
    const challenges = await db.getActiveChallenges(filters);
    return challenges;
  } catch (error) {
    console.error("Error fetching active challenges:", error);
    throw new Error("فشل في جلب التحديات النشطة");
  }
}

/**
 * Get challenge details
 */
export async function getChallengeDetails(challengeId: number) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    // Increment views
    await db.incrementChallengeViews(challengeId);

    // Get submissions count
    const submissionsCount = await db.getChallengeSubmissionsCount(challengeId);

    return {
      ...challenge,
      submissionsCount,
    };
  } catch (error) {
    console.error("Error fetching challenge details:", error);
    throw error;
  }
}

// ============================================
// SUBMISSION MANAGEMENT FUNCTIONS
// ============================================

/**
 * Submit a solution to a challenge
 */
export async function submitToChallenge(input: ChallengeSubmissionInput) {
  try {
    const challenge = await db.getChallengeById(input.challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    if (challenge.status !== "open") {
      throw new Error("التحدي غير مفتوح للتقديم");
    }

    if (new Date() > new Date(challenge.submissionDeadline)) {
      throw new Error("انتهى موعد التقديم على هذا التحدي");
    }

    const submission = await db.createChallengeSubmission({
      ...input,
      status: "draft",
      submittedAt: null,
    });

    return {
      success: true,
      submissionId: submission.id,
      message: "تم حفظ التقديم كمسودة",
    };
  } catch (error) {
    console.error("Error submitting to challenge:", error);
    throw error;
  }
}

/**
 * Finalize and submit a challenge submission
 */
export async function finalizeSubmission(submissionId: number, userId: number) {
  try {
    const submission = await db.getChallengeSubmissionById(submissionId);
    
    if (!submission) {
      throw new Error("التقديم غير موجود");
    }

    if (submission.userId !== userId) {
      throw new Error("غير مصرح لك بتعديل هذا التقديم");
    }

    if (submission.status !== "draft") {
      throw new Error("التقديم مرسل بالفعل");
    }

    await db.updateChallengeSubmission(submissionId, {
      status: "submitted",
      submittedAt: new Date(),
    });

    // Increment challenge submissions count
    await db.incrementChallengeSubmissions(submission.challengeId);

    return {
      success: true,
      message: "تم إرسال التقديم بنجاح",
    };
  } catch (error) {
    console.error("Error finalizing submission:", error);
    throw error;
  }
}

/**
 * Get user's submissions for a challenge
 */
export async function getUserSubmissions(userId: number, challengeId?: number) {
  try {
    const submissions = await db.getUserChallengeSubmissions(userId, challengeId);
    return submissions;
  } catch (error) {
    console.error("Error fetching user submissions:", error);
    throw new Error("فشل في جلب التقديمات");
  }
}

/**
 * Get all submissions for a challenge (for challenge owner/evaluators)
 */
export async function getChallengeSubmissions(
  challengeId: number,
  requesterId: number,
  filters?: {
    status?: string;
    minScore?: number;
  }
) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    // Check if requester is the challenge owner
    if (challenge.ownerId !== requesterId) {
      throw new Error("غير مصرح لك بعرض التقديمات");
    }

    const submissions = await db.getChallengeSubmissions(challengeId, filters);
    return submissions;
  } catch (error) {
    console.error("Error fetching challenge submissions:", error);
    throw error;
  }
}

// ============================================
// AI-POWERED EVALUATION FUNCTIONS
// ============================================

/**
 * Evaluate a challenge submission using AI
 */
export async function evaluateSubmission(
  submissionId: number,
  evaluatorId: number,
  customCriteria?: EvaluationCriteria[]
): Promise<SubmissionEvaluation> {
  try {
    const submission = await db.getChallengeSubmissionById(submissionId);
    
    if (!submission) {
      throw new Error("التقديم غير موجود");
    }

    const challenge = await db.getChallengeById(submission.challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    // Use custom criteria or default ones
    const criteria = customCriteria || getDefaultEvaluationCriteria();

    // Construct evaluation prompt
    const prompt = `
قم بتقييم التقديم التالي للتحدي:

**التحدي:**
${challenge.title}
${challenge.problemStatement}

**التقديم:**
العنوان: ${submission.title}
الوصف: ${submission.description}
الحل المقترح: ${submission.solution}
الأثر المتوقع: ${submission.expectedImpact || "غير محدد"}

**معايير التقييم:**
${criteria.map((c, i) => `${i + 1}. ${c.name} (${c.weight}%): ${c.description}`).join("\n")}

قم بتقييم التقديم بناءً على هذه المعايير وأعط درجة من 0-100 لكل معيار.
`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "أنت خبير في تقييم الحلول والابتكارات. قم بتقييم التقديم بموضوعية ودقة."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "submission_evaluation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              criteriaScores: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    criterion: { type: "string" },
                    score: { type: "number" },
                    reasoning: { type: "string" }
                  },
                  required: ["criterion", "score", "reasoning"],
                  additionalProperties: false
                }
              },
              strengths: {
                type: "array",
                items: { type: "string" }
              },
              weaknesses: {
                type: "array",
                items: { type: "string" }
              },
              recommendations: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["criteriaScores", "strengths", "weaknesses", "recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    const result = JSON.parse(response.choices[0].message.content);

    // Calculate overall score (weighted average)
    let overallScore = 0;
    for (const scoreData of result.criteriaScores) {
      const criterion = criteria.find(c => c.name === scoreData.criterion);
      if (criterion) {
        overallScore += (scoreData.score * criterion.weight) / 100;
      }
    }

    // Save evaluation to database
    await db.updateChallengeSubmission(submissionId, {
      evaluationScore: overallScore,
      evaluationNotes: JSON.stringify(result),
      status: "under_review",
    });

    return {
      submissionId,
      criteriaScores: result.criteriaScores,
      overallScore,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
    };
  } catch (error) {
    console.error("Error evaluating submission:", error);
    throw new Error("فشل في تقييم التقديم");
  }
}

/**
 * Get default evaluation criteria
 */
function getDefaultEvaluationCriteria(): EvaluationCriteria[] {
  return [
    {
      name: "relevance",
      weight: 25,
      description: "مدى ملاءمة الحل للمشكلة المطروحة في التحدي"
    },
    {
      name: "innovation",
      weight: 20,
      description: "مستوى الابتكار والجدة في الحل"
    },
    {
      name: "feasibility",
      weight: 20,
      description: "إمكانية تنفيذ الحل عملياً"
    },
    {
      name: "impact",
      weight: 20,
      description: "الأثر المتوقع للحل"
    },
    {
      name: "presentation",
      weight: 15,
      description: "جودة العرض والتوثيق"
    }
  ];
}

/**
 * Rank submissions based on evaluation scores
 */
export async function rankSubmissions(challengeId: number, evaluatorId: number) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    if (challenge.ownerId !== evaluatorId) {
      throw new Error("غير مصرح لك بترتيب التقديمات");
    }

    const submissions = await db.getChallengeSubmissions(challengeId, {
      status: "under_review"
    });

    // Sort by evaluation score (descending)
    const sorted = submissions.sort((a, b) => 
      (b.evaluationScore || 0) - (a.evaluationScore || 0)
    );

    // Update ranks
    for (let i = 0; i < sorted.length; i++) {
      await db.updateChallengeSubmission(sorted[i].id, {
        rank: i + 1
      });
    }

    return {
      success: true,
      rankedSubmissions: sorted.map((s, i) => ({
        submissionId: s.id,
        rank: i + 1,
        score: s.evaluationScore
      }))
    };
  } catch (error) {
    console.error("Error ranking submissions:", error);
    throw error;
  }
}

/**
 * Select winners for a challenge
 */
export async function selectWinners(
  challengeId: number,
  winnerIds: number[],
  evaluatorId: number
) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    if (challenge.ownerId !== evaluatorId) {
      throw new Error("غير مصرح لك باختيار الفائزين");
    }

    // Update winners' status
    for (const submissionId of winnerIds) {
      await db.updateChallengeSubmission(submissionId, {
        status: "winner"
      });
    }

    // Update challenge status
    await db.updateChallenge(challengeId, {
      status: "completed"
    });

    return {
      success: true,
      message: "تم اختيار الفائزين بنجاح",
      winnerIds
    };
  } catch (error) {
    console.error("Error selecting winners:", error);
    throw error;
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get challenge statistics
 */
export async function getChallengeStatistics(challengeId: number) {
  try {
    const challenge = await db.getChallengeById(challengeId);
    
    if (!challenge) {
      throw new Error("التحدي غير موجود");
    }

    const stats = await db.getChallengeStats(challengeId);

    return {
      challengeId,
      totalSubmissions: stats.totalSubmissions,
      uniqueParticipants: stats.uniqueParticipants,
      averageScore: stats.averageScore,
      topScore: stats.topScore,
      submissionsByStatus: stats.submissionsByStatus,
      views: challenge.views,
    };
  } catch (error) {
    console.error("Error fetching challenge statistics:", error);
    throw new Error("فشل في جلب إحصائيات التحدي");
  }
}

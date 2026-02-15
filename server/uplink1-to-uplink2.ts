/**
 * UPLINK 1 → UPLINK 2 Automation
 * 
 * عند نجاح التقييم (≥60%), يتم الانتقال التلقائي إلى UPLINK 2:
 * - إنشاء project في UPLINK 2
 * - البحث عن التحديات والفرص المناسبة
 * - إنشاء suggested_matches
 */

import * as db from "./db";

export interface PromoteToUplink2Input {
  ideaId: number;
  userId: number;
  overallScore: number;
  classificationPath: string;
  suggestedPartner: string;
}

export interface PromoteToUplink2Result {
  success: boolean;
  projectId: number;
  suggestedChallenges: Array<{
    id: number;
    title: string;
    matchScore: number;
  }>;
  message: string;
}

/**
 * ترقية الفكرة من UPLINK 1 إلى UPLINK 2
 */
export async function promoteToUplink2(
  input: PromoteToUplink2Input
): Promise<PromoteToUplink2Result> {
  const { ideaId, userId, overallScore, classificationPath, suggestedPartner } = input;

  // 1. التحقق من أن الدرجة ≥60%
  if (overallScore < 60) {
    throw new Error("Overall score must be ≥60% to promote to UPLINK 2");
  }

  // 2. قراءة الفكرة
  const idea = await db.getIdeaById(ideaId);
  if (!idea) {
    throw new Error("Idea not found");
  }

  // 3. إنشاء project في UPLINK 2
  // إنشاء project في UPLINK 2
  const projectId = await db.createProject({
    userId,
    title: idea.title,
    description: idea.description,
    category: idea.category || "general",
    status: "submitted",
  });

  // 4. تحديث الفكرة بـ uplink2ProjectId
  await db.updateIdea(ideaId, {
    uplink2ProjectId: projectId,
    status: "approved", // تغيير الحالة إلى approved
  });

  // 5. البحث عن التحديات المناسبة
  const suggestedChallenges = await findMatchingChallenges(idea, overallScore);

  // 6. إنشاء suggested_matches
  for (const challenge of suggestedChallenges) {
    // TODO: إنشاء suggested_match في قاعدة البيانات
    // await db.createSuggestedMatch(...)
  }

  return {
    success: true,
    projectId,
    suggestedChallenges,
    message: `تم الانتقال التلقائي إلى UPLINK 2! تم إنشاء مشروع جديد (ID: ${projectId}) وتم اقتراح ${suggestedChallenges.length} تحدي مناسب.`,
  };
}

/**
 * البحث عن التحديات المناسبة للفكرة
 */
async function findMatchingChallenges(
  idea: any,
  overallScore: number
): Promise<Array<{ id: number; title: string; matchScore: number }>> {
  // البحث عن التحديات النشطة
  const challenges = await db.getAllChallenges();

  // حساب match score لكل تحدي
  const matches = challenges.map((challenge: any) => {
    let matchScore = 0;

    // 1. تطابق الفئة (40%)
    if (idea.category === challenge.category) {
      matchScore += 40;
    }

    // 2. تطابق الكلمات المفتاحية (30%)
    const ideaKeywords = idea.keywords || [];
    const challengeKeywords = challenge.keywords || [];
    const commonKeywords = ideaKeywords.filter((k: string) =>
      challengeKeywords.includes(k)
    );
    matchScore += (commonKeywords.length / Math.max(ideaKeywords.length, 1)) * 30;

    // 3. درجة التقييم الإجمالية (30%)
    matchScore += (overallScore / 100) * 30;

    return {
      id: challenge.id,
      title: challenge.title,
      matchScore: Math.round(matchScore),
    };
  });

  // ترتيب حسب match score وإرجاع أفضل 5
  return matches
    .sort((a: any, b: any) => b.matchScore - a.matchScore)
    .slice(0, 5)
    .filter((m: any) => m.matchScore >= 50); // فقط التحديات بـ match score ≥50%
}

/**
 * AI Evaluation Service
 * تقييم الأفكار تلقائياً باستخدام الذكاء الاصطناعي
 */

import { invokeLLM } from "../_core/llm";
import { createAiEvaluation, createIdeaClassification, getIdeaById } from "../db";
import type { InsertAiEvaluation, InsertIdeaClassification } from "../../drizzle/schema";

/**
 * معايير التقييم
 */
const EVALUATION_CRITERIA = {
  innovation: {
    weight: 0.25,
    description: "مدى الابتكار والجدة في الفكرة",
  },
  feasibility: {
    weight: 0.20,
    description: "إمكانية التنفيذ والجدوى التقنية",
  },
  impact: {
    weight: 0.25,
    description: "التأثير المتوقع والقيمة المضافة",
  },
  team: {
    weight: 0.15,
    description: "قوة الفريق والخبرات",
  },
  market: {
    weight: 0.15,
    description: "حجم السوق والفرص التجارية",
  },
};

/**
 * تقييم فكرة باستخدام AI
 */
export async function evaluateIdea(ideaId: number): Promise<{
  evaluationId: number;
  classificationId: number;
  overallScore: number;
  classificationPath: 'innovation' | 'commercial' | 'guidance';
}> {
  // جلب تفاصيل الفكرة
  const idea = await getIdeaById(ideaId);
  if (!idea) {
    throw new Error(`Idea ${ideaId} not found`);
  }

  // إنشاء prompt للتقييم
  const prompt = `
أنت خبير في تقييم الأفكار الابتكارية والمشاريع الريادية. قم بتقييم الفكرة التالية بشكل موضوعي ودقيق:

**عنوان الفكرة:** ${idea.title}

**الوصف:** ${idea.description}

**الفئة:** ${idea.category || 'غير محدد'}

**المجال:** ${idea.field || 'غير محدد'}

**المرحلة:** ${idea.stage || 'غير محدد'}

قم بتقييم الفكرة على المعايير التالية (من 0 إلى 100):

1. **الابتكار (Innovation):** مدى الجدة والابتكار في الفكرة
2. **الجدوى (Feasibility):** إمكانية التنفيذ والجدوى التقنية
3. **التأثير (Impact):** التأثير المتوقع والقيمة المضافة
4. **الفريق (Team):** قوة الفريق والخبرات (إن وُجدت)
5. **السوق (Market):** حجم السوق والفرص التجارية

**تحليل SWOT:**
- نقاط القوة (Strengths)
- نقاط الضعف (Weaknesses)
- الفرص (Opportunities)
- التهديدات (Threats)

**التوصيات:** ما هي الخطوات التالية المقترحة لتطوير هذه الفكرة؟

**التصنيف المقترح:**
- **Innovation Path (≥70%):** للأفكار عالية الابتكار والتأثير
- **Commercial Path (60-70%):** للأفكار ذات الجدوى التجارية الجيدة
- **Guidance Path (<60%):** للأفكار التي تحتاج إلى تطوير وتوجيه

قدم إجابتك بصيغة JSON فقط.
`;

  // استدعاء LLM للتقييم
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "أنت خبير في تقييم الأفكار الابتكارية. قدم تقييمات موضوعية ودقيقة بصيغة JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "idea_evaluation",
        strict: true,
        schema: {
          type: "object",
          properties: {
            innovationScore: { type: "number", description: "درجة الابتكار (0-100)" },
            feasibilityScore: { type: "number", description: "درجة الجدوى (0-100)" },
            impactScore: { type: "number", description: "درجة التأثير (0-100)" },
            teamScore: { type: "number", description: "درجة الفريق (0-100)" },
            marketScore: { type: "number", description: "درجة السوق (0-100)" },
            strengths: {
              type: "array",
              items: { type: "string" },
              description: "نقاط القوة",
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
              description: "نقاط الضعف",
            },
            opportunities: {
              type: "array",
              items: { type: "string" },
              description: "الفرص",
            },
            threats: {
              type: "array",
              items: { type: "string" },
              description: "التهديدات",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description: "التوصيات",
            },
          },
          required: [
            "innovationScore",
            "feasibilityScore",
            "impactScore",
            "teamScore",
            "marketScore",
            "strengths",
            "weaknesses",
            "opportunities",
            "threats",
            "recommendations",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  // استخراج النتائج
  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const evaluation = JSON.parse(content);

  // حساب الدرجة الإجمالية
  const overallScore =
    evaluation.innovationScore * EVALUATION_CRITERIA.innovation.weight +
    evaluation.feasibilityScore * EVALUATION_CRITERIA.feasibility.weight +
    evaluation.impactScore * EVALUATION_CRITERIA.impact.weight +
    evaluation.teamScore * EVALUATION_CRITERIA.team.weight +
    evaluation.marketScore * EVALUATION_CRITERIA.market.weight;

  // تحديد المسار
  let classificationPath: 'innovation' | 'commercial' | 'guidance';
  let reason: string;

  if (overallScore >= 70) {
    classificationPath = 'innovation';
    reason = "الفكرة تتميز بدرجة عالية من الابتكار والتأثير، وتستحق الدخول في مسار التسريع والدعم المتقدم.";
  } else if (overallScore >= 60) {
    classificationPath = 'commercial';
    reason = "الفكرة لديها جدوى تجارية جيدة وتحتاج إلى دعم في الحاضنات والتطوير التجاري.";
  } else {
    classificationPath = 'guidance';
    reason = "الفكرة تحتاج إلى مزيد من التطوير والتوجيه قبل الانتقال إلى المراحل المتقدمة.";
  }

  // حفظ التقييم في قاعدة البيانات
  const aiEvaluationData: InsertAiEvaluation = {
    ideaId,
    overallScore: Number(overallScore.toFixed(2)),
    innovationScore: Number(evaluation.innovationScore.toFixed(2)),
    feasibilityScore: Number(evaluation.feasibilityScore.toFixed(2)),
    impactScore: Number(evaluation.impactScore.toFixed(2)),
    teamScore: Number(evaluation.teamScore.toFixed(2)),
    marketScore: Number(evaluation.marketScore.toFixed(2)),
    criteriaScores: {
      innovation: evaluation.innovationScore,
      feasibility: evaluation.feasibilityScore,
      impact: evaluation.impactScore,
      team: evaluation.teamScore,
      market: evaluation.marketScore,
    },
    strengths: evaluation.strengths,
    weaknesses: evaluation.weaknesses,
    opportunities: evaluation.opportunities,
    threats: evaluation.threats,
    recommendations: evaluation.recommendations,
    classificationPath,
  };

  const evaluationId = await createAiEvaluation(aiEvaluationData);

  // حفظ التصنيف
  const classificationData: InsertIdeaClassification = {
    ideaId,
    evaluationId,
    classificationPath,
    score: Number(overallScore.toFixed(2)),
    reason,
    nextSteps: evaluation.recommendations,
    status: 'pending',
  };

  const classificationId = await createIdeaClassification(classificationData);

  return {
    evaluationId,
    classificationId,
    overallScore: Number(overallScore.toFixed(2)),
    classificationPath,
  };
}

/**
 * الحصول على توصيات الشريك الاستراتيجي المناسب
 */
export async function recommendStrategicPartner(
  classificationPath: 'innovation' | 'commercial' | 'guidance',
  category?: string
): Promise<string[]> {
  const recommendations: Record<string, string[]> = {
    innovation: [
      "KAUST - جامعة الملك عبدالله للعلوم والتقنية (للأبحاث والتطوير التقني)",
      "SAIP - الهيئة السعودية للملكية الفكرية (لتسجيل براءات الاختراع)",
      "SDAIA - الهيئة السعودية للبيانات والذكاء الاصطناعي (للمشاريع التقنية)",
    ],
    commercial: [
      "Monsha'at - منشآت (للدعم التجاري والحاضنات)",
      "RDIA - هيئة تطوير البحث والتطوير والابتكار (للتمويل والدعم)",
      "MCIT - وزارة الاتصالات وتقنية المعلومات (للمشاريع التقنية)",
    ],
    guidance: [
      "Monsha'at - منشآت (للتوجيه والإرشاد)",
      "RDIA - هيئة تطوير البحث والتطوير والابتكار (للاستشارات)",
    ],
  };

  return recommendations[classificationPath] || [];
}

import { getDb } from "../db";
import { ideas, strategicGoals, ideaStrategicAlignment } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

// ==================== Smart Evaluation Engine ====================

export interface EvaluationResult {
  overallScore: number;
  strategicAlignment: number;
  marketPotential: number;
  technicalFeasibility: number;
  financialViability: number;
  socialImpact: number;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  suggestedPath: "uplink2" | "uplink3" | "refine";
}

/**
 * Evaluate idea with AI - Smart evaluation using LLM
 */
export async function evaluateIdeaWithAI(ideaId: number): Promise<EvaluationResult> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get idea details
  const idea = await db.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
  if (!idea.length) throw new Error("Idea not found");

  const ideaData = idea[0];

  // Get strategic goals for alignment calculation
  const goals = await db.select().from(strategicGoals);

  // Prepare prompt for LLM
  const prompt = `
أنت خبير تقييم ابتكارات عالمي. قم بتقييم الفكرة التالية بدقة:

**عنوان الفكرة:** ${ideaData.title}
**الوصف:** ${ideaData.description}
**الفئة:** ${ideaData.category || "غير محدد"}
**الفئة الفرعية:** ${ideaData.subCategory || "غير محدد"}

**الأهداف الاستراتيجية للمنصة:**
${goals.map((g: any) => `- ${g.title || g.titleAr}: ${g.description || g.descriptionAr}`).join("\n")}

قم بتقييم الفكرة على المقاييس التالية (0-100):
1. **التوافق الاستراتيجي** (Strategic Alignment): مدى توافق الفكرة مع الأهداف الاستراتيجية
2. **إمكانات السوق** (Market Potential): حجم السوق المستهدف وفرص النمو
3. **الجدوى الفنية** (Technical Feasibility): إمكانية التنفيذ تقنياً
4. **الجدوى المالية** (Financial Viability): العائد المتوقع والتكاليف
5. **الأثر الاجتماعي** (Social Impact): الفائدة للمجتمع

أيضاً:
- حدد **نقاط القوة** (Strengths) - 3-5 نقاط
- حدد **نقاط الضعف** (Weaknesses) - 3-5 نقاط
- قدم **توصيات** (Recommendations) - 3-5 توصيات عملية
- اقترح **المسار الأنسب** (Suggested Path):
  * "uplink2" إذا كانت الفكرة تحتاج مطابقة مع تحديات أو شركاء
  * "uplink3" إذا كانت الفكرة جاهزة للعرض في السوق مباشرة
  * "refine" إذا كانت الفكرة تحتاج تحسين

**أرجع النتيجة بصيغة JSON فقط:**
\`\`\`json
{
  "strategicAlignment": 85,
  "marketPotential": 90,
  "technicalFeasibility": 75,
  "financialViability": 80,
  "socialImpact": 70,
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "recommendations": ["توصية 1", "توصية 2", "توصية 3"],
  "suggestedPath": "uplink2"
}
\`\`\`
`;

  // Call LLM
  const response = await invokeLLM({
    messages: [
      { role: "system", content: "أنت خبير تقييم ابتكارات عالمي. أرجع JSON فقط بدون أي نص إضافي." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message.content;
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

  // Extract JSON from response
  let jsonMatch = contentStr.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    jsonMatch = contentStr.match(/\{[\s\S]*\}/);
  }

  if (!jsonMatch) {
    throw new Error("Failed to parse LLM response");
  }

  const evaluation = JSON.parse(jsonMatch[1] || jsonMatch[0]);

  // Calculate overall score
  const overallScore =
    (evaluation.strategicAlignment +
      evaluation.marketPotential +
      evaluation.technicalFeasibility +
      evaluation.financialViability +
      evaluation.socialImpact) /
    5;

  // Save strategic alignment
  await saveStrategicAlignment(ideaId, evaluation.strategicAlignment, goals);

  return {
    overallScore: Math.round(overallScore),
    strategicAlignment: evaluation.strategicAlignment,
    marketPotential: evaluation.marketPotential,
    technicalFeasibility: evaluation.technicalFeasibility,
    financialViability: evaluation.financialViability,
    socialImpact: evaluation.socialImpact,
    recommendations: evaluation.recommendations,
    strengths: evaluation.strengths,
    weaknesses: evaluation.weaknesses,
    suggestedPath: evaluation.suggestedPath,
  };
}

/**
 * Calculate strategic alignment score
 */
export async function calculateStrategicAlignment(ideaId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const alignments = await db.select().from(ideaStrategicAlignment).where(eq(ideaStrategicAlignment.ideaId, ideaId));

  if (!alignments.length) return 0;

  // Calculate weighted average
  const totalScore = alignments.reduce((sum, a) => sum + (parseFloat(a.alignmentScore || '0')), 0);
  return Math.round(totalScore / alignments.length);
}

/**
 * Save strategic alignment for an idea
 */
async function saveStrategicAlignment(ideaId: number, overallScore: number, goals: any[]) {
  const db = await getDb();
  if (!db) return;

  // Save alignment for each goal (simplified - equal distribution)
  for (const goal of goals) {
    await db.insert(ideaStrategicAlignment).values({
      ideaId,
      goalId: goal.id,
      alignmentScore: overallScore.toString(),
      aiReasoning: `تم حساب التوافق تلقائياً بواسطة محرك التقييم الذكي`,
      overallScore: overallScore.toString(),
    });
  }
}

/**
 * Generate recommendations for an idea
 */
export async function generateRecommendations(ideaId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const idea = await db.select().from(ideas).where(eq(ideas.id, ideaId)).limit(1);
  if (!idea.length) return [];

  const ideaData = idea[0];

  // Use LLM to generate recommendations
  const prompt = `
أنت مستشار ابتكار خبير. قدم 5 توصيات عملية قابلة للتنفيذ لتحسين الفكرة التالية:

**عنوان الفكرة:** ${ideaData.title}
**الوصف:** ${ideaData.description}

**التوصيات يجب أن تكون:**
- عملية وقابلة للتنفيذ
- محددة وواضحة
- تركز على تحسين الفكرة
- تساعد في زيادة فرص النجاح

أرجع النتيجة كقائمة JSON فقط:
\`\`\`json
["توصية 1", "توصية 2", "توصية 3", "توصية 4", "توصية 5"]
\`\`\`
`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "أنت مستشار ابتكار خبير. أرجع JSON فقط." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message.content;
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

  // Extract JSON from response
  let jsonMatch = contentStr.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) {
    jsonMatch = contentStr.match(/\[[\s\S]*\]/);
  }

  if (!jsonMatch) {
    return [];
  }

  const recommendations = JSON.parse(jsonMatch[1] || jsonMatch[0]);
  return recommendations;
}

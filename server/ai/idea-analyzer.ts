import { invokeLLM } from "../_core/llm";

/**
 * AI Analysis Engine for UPLINK1
 * Analyzes ideas and determines if they should move to UPLINK2
 */

export interface IdeaAnalysisResult {
  innovationScore: number; // 0-100
  feasibilityScore: number; // 0-100
  marketPotentialScore: number; // 0-100
  overallScore: number; // 0-100
  classification: "innovation" | "commercial" | "guidance";
  category: string;
  tags: string[];
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  uplink2Eligible: boolean;
  reasoning: string;
}

export async function analyzeIdea(
  title: string,
  description: string,
  category?: string
): Promise<IdeaAnalysisResult> {
  const prompt = `أنت محلل ذكاء اصطناعي متخصص في تقييم الأفكار الابتكارية.

**الفكرة:**
العنوان: ${title}
الوصف: ${description}
${category ? `الفئة: ${category}` : ""}

**مهمتك:**
1. تحليل نسبة الابتكار (Innovation Score): 0-100%
2. تحليل الجدوى التقنية (Feasibility Score): 0-100%
3. تحليل السوق المحتمل (Market Potential Score): 0-100%
4. حساب النتيجة الإجمالية (Overall Score): متوسط الثلاثة
5. التصنيف: innovation (إذا >= 70%), commercial (إذا 40-69%), guidance (إذا < 40%)
6. تحديد الفئة والكلمات المفتاحية
7. نقاط القوة والضعف
8. التوصيات للتحسين
9. هل مؤهل للانتقال إلى UPLINK2؟ (إذا Overall Score >= 70%)

**أجب بصيغة JSON فقط:**`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "أنت محلل ذكاء اصطناعي متخصص في تقييم الأفكار الابتكارية. أجب بصيغة JSON فقط.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "idea_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            innovationScore: {
              type: "number",
              description: "Innovation score from 0 to 100",
            },
            feasibilityScore: {
              type: "number",
              description: "Feasibility score from 0 to 100",
            },
            marketPotentialScore: {
              type: "number",
              description: "Market potential score from 0 to 100",
            },
            overallScore: {
              type: "number",
              description: "Overall score (average of the three)",
            },
            classification: {
              type: "string",
              enum: ["innovation", "commercial", "guidance"],
              description: "Classification based on overall score",
            },
            category: {
              type: "string",
              description: "Main category (AI, IoT, Blockchain, etc.)",
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Array of relevant tags",
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "Array of keywords",
            },
            strengths: {
              type: "array",
              items: { type: "string" },
              description: "Array of strengths",
            },
            weaknesses: {
              type: "array",
              items: { type: "string" },
              description: "Array of weaknesses",
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description: "Array of recommendations",
            },
            uplink2Eligible: {
              type: "boolean",
              description: "Whether eligible for UPLINK2 (>= 70%)",
            },
            reasoning: {
              type: "string",
              description: "Brief reasoning for the decision",
            },
          },
          required: [
            "innovationScore",
            "feasibilityScore",
            "marketPotentialScore",
            "overallScore",
            "classification",
            "category",
            "tags",
            "keywords",
            "strengths",
            "weaknesses",
            "recommendations",
            "uplink2Eligible",
            "reasoning",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  const analysis: IdeaAnalysisResult = JSON.parse(contentStr);
  return analysis;
}

/**
 * Calculate match score between two entities (0-100)
 */
export async function calculateMatchScore(
  entity1: any,
  entity2: any,
  matchingType: "investor-innovator" | "sponsor-event" | "partner-partner"
): Promise<{ score: number; reasons: string[] }> {
  const prompt = `أنت محرك مطابقة ذكي. احسب نسبة التطابق (0-100%) بين الكيانين التاليين:

**الكيان الأول:**
${JSON.stringify(entity1, null, 2)}

**الكيان الثاني:**
${JSON.stringify(entity2, null, 2)}

**نوع المطابقة:** ${matchingType}

**أجب بصيغة JSON فقط:**`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "أنت محرك مطابقة ذكي متخصص في ربط المبتكرين بالمستثمرين والرعاة بالفعاليات. أجب بصيغة JSON فقط.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "match_score",
        strict: true,
        schema: {
          type: "object",
          properties: {
            score: {
              type: "number",
              description: "Match score from 0 to 100",
            },
            reasons: {
              type: "array",
              items: { type: "string" },
              description: "Array of reasons for the match score",
            },
          },
          required: ["score", "reasons"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
  return JSON.parse(contentStr);
}

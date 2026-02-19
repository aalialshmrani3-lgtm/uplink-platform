/**
 * AI Matching System for NAQLA 2
 * 
 * يحسب match score بين الأفكار والتحديات/المستثمرين/الشركات
 * بناءً على:
 * - Keywords similarity
 * - Category matching
 * - Description semantic analysis
 * - Industry alignment
 */

import { invokeLLM } from "../_core/llm";

export interface MatchInput {
  // الفكرة
  ideaTitle: string;
  ideaDescription: string;
  ideaCategory: string;
  ideaKeywords?: string[];
  
  // الفرصة (تحدي/مستثمر/شركة)
  opportunityTitle: string;
  opportunityDescription: string;
  opportunityCategory?: string;
  opportunityIndustry?: string;
}

export interface MatchResult {
  matchScore: number; // 0-100%
  keywordSimilarity: number; // 0-100%
  categorySimilarity: number; // 0-100%
  semanticSimilarity: number; // 0-100%
  industrySimilarity: number; // 0-100%
  reasoning: string;
  recommendations: string[];
}

/**
 * حساب match score باستخدام AI
 */
export async function calculateMatchScore(input: MatchInput): Promise<MatchResult> {
  const prompt = `أنت خبير في مطابقة الأفكار الابتكارية مع الفرص المناسبة في منصة NAQLA.

**الفكرة:**
- العنوان: ${input.ideaTitle}
- الوصف: ${input.ideaDescription}
- الفئة: ${input.ideaCategory}
${input.ideaKeywords ? `- الكلمات المفتاحية: ${input.ideaKeywords.join(', ')}` : ''}

**الفرصة:**
- العنوان: ${input.opportunityTitle}
- الوصف: ${input.opportunityDescription}
${input.opportunityCategory ? `- الفئة: ${input.opportunityCategory}` : ''}
${input.opportunityIndustry ? `- الصناعة: ${input.opportunityIndustry}` : ''}

**مهمتك:**
1. حساب نسبة التطابق (Match Score) من 0-100%
2. تحليل التشابه في:
   - الكلمات المفتاحية (Keyword Similarity)
   - الفئة (Category Similarity)
   - المعنى الدلالي (Semantic Similarity)
   - الصناعة (Industry Similarity)
3. تقديم تفسير واضح للنتيجة
4. اقتراح توصيات لتحسين التطابق

**ملاحظات:**
- Match Score ≥80% = تطابق ممتاز (Excellent Match)
- Match Score 60-79% = تطابق جيد (Good Match)
- Match Score 40-59% = تطابق متوسط (Fair Match)
- Match Score <40% = تطابق ضعيف (Poor Match)`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "أنت خبير في مطابقة الأفكار الابتكارية. أجب بصيغة JSON فقط." },
      { role: "user", content: prompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "match_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            matchScore: {
              type: "number",
              description: "نسبة التطابق الإجمالية من 0-100"
            },
            keywordSimilarity: {
              type: "number",
              description: "نسبة تشابه الكلمات المفتاحية من 0-100"
            },
            categorySimilarity: {
              type: "number",
              description: "نسبة تشابه الفئة من 0-100"
            },
            semanticSimilarity: {
              type: "number",
              description: "نسبة التشابه الدلالي من 0-100"
            },
            industrySimilarity: {
              type: "number",
              description: "نسبة تشابه الصناعة من 0-100"
            },
            reasoning: {
              type: "string",
              description: "تفسير واضح لنتيجة التطابق"
            },
            recommendations: {
              type: "array",
              items: { type: "string" },
              description: "توصيات لتحسين التطابق"
            }
          },
          required: [
            "matchScore",
            "keywordSimilarity",
            "categorySimilarity",
            "semanticSimilarity",
            "industrySimilarity",
            "reasoning",
            "recommendations"
          ],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  if (!content || typeof content !== 'string') {
    throw new Error("فشل في الحصول على نتيجة من AI");
  }

  const result = JSON.parse(content) as MatchResult;
  
  // التأكد من أن النتائج في النطاق الصحيح (0-100)
  result.matchScore = Math.min(100, Math.max(0, result.matchScore));
  result.keywordSimilarity = Math.min(100, Math.max(0, result.keywordSimilarity));
  result.categorySimilarity = Math.min(100, Math.max(0, result.categorySimilarity));
  result.semanticSimilarity = Math.min(100, Math.max(0, result.semanticSimilarity));
  result.industrySimilarity = Math.min(100, Math.max(0, result.industrySimilarity));

  return result;
}

/**
 * حساب match score بسيط بدون AI (للاستخدام في الحالات الطارئة)
 */
export function calculateSimpleMatchScore(input: MatchInput): number {
  let score = 0;
  
  // Category matching (40%)
  if (input.ideaCategory.toLowerCase() === input.opportunityCategory?.toLowerCase()) {
    score += 40;
  } else if (
    input.ideaCategory.toLowerCase().includes(input.opportunityCategory?.toLowerCase() || '') ||
    input.opportunityCategory?.toLowerCase().includes(input.ideaCategory.toLowerCase())
  ) {
    score += 20;
  }
  
  // Keyword matching (30%)
  if (input.ideaKeywords && input.ideaKeywords.length > 0) {
    const oppText = `${input.opportunityTitle} ${input.opportunityDescription}`.toLowerCase();
    const matchingKeywords = input.ideaKeywords.filter(kw => 
      oppText.includes(kw.toLowerCase())
    );
    score += (matchingKeywords.length / input.ideaKeywords.length) * 30;
  }
  
  // Title similarity (20%)
  const ideaTitleWords = input.ideaTitle.toLowerCase().split(/\s+/);
  const oppTitleWords = input.opportunityTitle.toLowerCase().split(/\s+/);
  const commonWords = ideaTitleWords.filter(word => 
    oppTitleWords.includes(word) && word.length > 3
  );
  score += (commonWords.length / Math.max(ideaTitleWords.length, oppTitleWords.length)) * 20;
  
  // Description similarity (10%)
  const ideaDescWords = input.ideaDescription.toLowerCase().split(/\s+/).slice(0, 20);
  const oppDescWords = input.opportunityDescription.toLowerCase().split(/\s+/).slice(0, 20);
  const commonDescWords = ideaDescWords.filter(word => 
    oppDescWords.includes(word) && word.length > 4
  );
  score += (commonDescWords.length / Math.max(ideaDescWords.length, oppDescWords.length)) * 10;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}

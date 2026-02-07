/**
 * UPLINK1: AI-Powered Idea Analysis Engine
 * 
 * This module implements the core AI algorithm for analyzing and classifying ideas
 * based on 6 weighted evaluation criteria.
 */

import { invokeLLM } from "./_core/llm";

// ============================================
// EVALUATION CRITERIA WITH WEIGHTS
// ============================================

export interface EvaluationCriterion {
  name: string;
  weight: number; // Percentage (0-100)
  description: string;
  guidelines: string[];
}

export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    name: "novelty",
    weight: 25,
    description: "الجدة والابتكار - مدى جدة الفكرة وابتكارها مقارنة بالحلول الموجودة",
    guidelines: [
      "هل الفكرة جديدة تمامًا أم تحسين لفكرة موجودة؟",
      "ما مدى اختلافها عن الحلول الحالية في السوق؟",
      "هل تقدم نهجًا مبتكرًا لحل المشكلة؟",
      "هل هناك براءات اختراع أو ابتكارات مشابهة؟"
    ]
  },
  {
    name: "impact",
    weight: 20,
    description: "الأثر المحتمل - حجم الأثر الذي يمكن أن تحدثه الفكرة",
    guidelines: [
      "كم عدد الأشخاص الذين ستؤثر عليهم الفكرة؟",
      "ما مدى أهمية المشكلة التي تحلها؟",
      "هل لها تأثير اجتماعي أو اقتصادي كبير؟",
      "هل يمكن أن تغير صناعة أو قطاع بأكمله؟"
    ]
  },
  {
    name: "feasibility",
    weight: 20,
    description: "الجدوى التقنية - إمكانية تنفيذ الفكرة تقنيًا",
    guidelines: [
      "هل التكنولوجيا المطلوبة متوفرة حاليًا؟",
      "ما مدى تعقيد التنفيذ التقني؟",
      "هل هناك عوائق تقنية كبيرة؟",
      "ما هي الموارد التقنية المطلوبة؟"
    ]
  },
  {
    name: "commercial",
    weight: 15,
    description: "القيمة التجارية - إمكانية تحقيق عوائد مالية",
    guidelines: [
      "هل هناك سوق واضح للفكرة؟",
      "ما هو حجم السوق المحتمل؟",
      "هل العملاء مستعدون للدفع؟",
      "ما هو نموذج العمل المحتمل؟"
    ]
  },
  {
    name: "scalability",
    weight: 10,
    description: "قابلية التوسع - إمكانية توسيع الفكرة وتطويرها",
    guidelines: [
      "هل يمكن توسيع الفكرة لأسواق أخرى؟",
      "ما مدى سهولة التوسع الجغرافي؟",
      "هل يمكن إضافة ميزات جديدة بسهولة؟",
      "ما هي حدود النمو المحتملة؟"
    ]
  },
  {
    name: "sustainability",
    weight: 10,
    description: "الاستدامة - القدرة على الاستمرار على المدى الطويل",
    guidelines: [
      "هل الفكرة مستدامة بيئيًا؟",
      "هل لها نموذج عمل مستدام؟",
      "ما مدى اعتمادها على موارد محدودة؟",
      "هل يمكن أن تستمر لسنوات قادمة؟"
    ]
  }
];

// Validate that weights sum to 100
const totalWeight = EVALUATION_CRITERIA.reduce((sum, c) => sum + c.weight, 0);
if (totalWeight !== 100) {
  throw new Error(`Evaluation criteria weights must sum to 100, got ${totalWeight}`);
}

// ============================================
// CLASSIFICATION LEVELS
// ============================================

export interface ClassificationLevel {
  name: "innovation" | "commercial" | "weak";
  minScore: number;
  maxScore: number;
  label: string;
  labelEn: string;
  description: string;
  nextSteps: string[];
}

export const CLASSIFICATION_LEVELS: ClassificationLevel[] = [
  {
    name: "innovation",
    minScore: 70,
    maxScore: 100,
    label: "ابتكار حقيقي",
    labelEn: "True Innovation",
    description: "فكرة مبتكرة تحقق معايير الابتكار وتستحق الانتقال المباشر إلى UPLINK2 للمطابقة مع المستثمرين والتحديات",
    nextSteps: [
      "✅ تم قبول فكرتك كابتكار حقيقي!",
      "🚀 الانتقال التلقائي إلى UPLINK2 للمطابقة مع:",
      "   • التحديات من الوزارات والشركات",
      "   • المستثمرين المهتمين بمجالك",
      "   • الهاكاثونات والمسابقات القادمة",
      "📋 تسجيل الملكية الفكرية (إذا لزم الأمر)",
      "🔬 البدء في تطوير نموذج أولي (Prototype)",
      "💰 التقديم على برامج الدعم والتمويل الحكومي"
    ]
  },
  {
    name: "commercial",
    minScore: 50,
    maxScore: 69,
    label: "حل تجاري/بزنس",
    labelEn: "Business Solution",
    description: "فكرة رائدة لها قيمة تجارية وتحل مشكلة معينة، لكنها لا تصل لمستوى الابتكار الجذري. تنتقل إلى UPLINK2 للمطابقة مع الفرص التجارية",
    nextSteps: [
      "✅ تم قبول فكرتك كحل تجاري واعد!",
      "🚀 الانتقال التلقائي إلى UPLINK2 للمطابقة مع:",
      "   • الشركات المهتمة بحلول مشابهة",
      "   • المستثمرين في مجال ريادة الأعمال",
      "   • برامج الاحتضان والتسريع",
      "📊 تطوير خطة عمل تفصيلية (Business Plan)",
      "🔍 دراسة السوق والمنافسين بعمق",
      "🤝 البحث عن شركاء استراتيجيين",
      "💼 التقديم على برامج ريادة الأعمال"
    ]
  },
  {
    name: "weak",
    minScore: 0,
    maxScore: 49,
    label: "تحتاج تطوير",
    labelEn: "Needs Development",
    description: "فكرة لم تحقق المعايير المطلوبة حالياً. نشجعك على تطوير نفسك في المجالات المحددة وإعادة التقديم بعد التحسينات",
    nextSteps: [
      "📝 تم استلام فكرتك وتحليلها بعناية",
      "💡 فكرتك تحتاج إلى تطوير في المجالات التالية:",
      "   • راجع نقاط الضعف المحددة في التحليل أدناه",
      "   • ركز على تحسين الجوانب التقنية والتجارية",
      "📚 نوصي بالخطوات التالية:",
      "   • الالتحاق ببرامج تدريبية في مجالك",
      "   • دراسة الحلول المشابهة في السوق",
      "   • إعادة صياغة الفكرة بشكل أوضح وأكثر تفصيلاً",
      "   • بناء نموذج أولي بسيط (MVP) إن أمكن",
      "🔄 يمكنك إعادة تقديم فكرتك بعد التحسينات",
      "💪 لا تستسلم! العديد من الابتكارات الناجحة بدأت بأفكار تحتاج تطوير"
    ]
  }
];

// ============================================
// IDEA ANALYSIS INTERFACE
// ============================================

export interface IdeaInput {
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket?: string;
  uniqueValue?: string;
  category?: string;
}

export interface CriterionScore {
  criterion: string;
  score: number; // 0-100
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
}

export interface AnalysisResult {
  // Overall Results
  overallScore: number; // 0-100
  classification: "innovation" | "commercial" | "weak";
  classificationLabel: string;
  
  // Criterion Scores
  criterionScores: CriterionScore[];
  
  // Detailed Analysis
  aiAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  
  // Recommendations
  recommendations: string[];
  nextSteps: string[];
  similarInnovations: string[];
  
  // NLP Analysis
  extractedKeywords: string[];
  sentimentScore: number; // -1 to 1
  complexityLevel: "low" | "medium" | "high" | "very_high";
  
  // Market Analysis
  marketSize?: string;
  competitionLevel?: "low" | "medium" | "high" | "very_high";
  marketTrends?: string[];
  
  // Processing Info
  processingTime: number; // in seconds
}

// ============================================
// AI ANALYSIS FUNCTION
// ============================================

/**
 * Analyze an idea using AI and return detailed evaluation results
 */
export async function analyzeIdea(idea: IdeaInput): Promise<AnalysisResult> {
  const startTime = Date.now();
  
  try {
    // Step 1: Construct the analysis prompt
    const prompt = constructAnalysisPrompt(idea);
    
    // Step 2: Call LLM with structured output
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت محلل ذكاء اصطناعي متخصص في تقييم الأفكار والابتكارات. مهمتك تحليل الأفكار المقدمة بناءً على 6 معايير محددة وتصنيفها إلى 3 مستويات.

المعايير الستة (بأوزانها):
1. الجدة والابتكار (25%)
2. الأثر المحتمل (20%)
3. الجدوى التقنية (20%)
4. القيمة التجارية (15%)
5. قابلية التوسع (10%)
6. الاستدامة (10%)

المستويات الثلاثة:
- ابتكار حقيقي (80-100 نقطة)
- مشروع تجاري (50-79 نقطة)
- فكرة تحتاج تطوير (0-49 نقطة)

يجب أن يكون تحليلك موضوعيًا، مفصلاً، وبناءً.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "idea_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              criterionScores: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    criterion: { type: "string" },
                    score: { type: "number" },
                    reasoning: { type: "string" },
                    strengths: {
                      type: "array",
                      items: { type: "string" }
                    },
                    weaknesses: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["criterion", "score", "reasoning", "strengths", "weaknesses"],
                  additionalProperties: false
                }
              },
              aiAnalysis: { type: "string" },
              strengths: {
                type: "array",
                items: { type: "string" }
              },
              weaknesses: {
                type: "array",
                items: { type: "string" }
              },
              opportunities: {
                type: "array",
                items: { type: "string" }
              },
              threats: {
                type: "array",
                items: { type: "string" }
              },
              recommendations: {
                type: "array",
                items: { type: "string" }
              },
              nextSteps: {
                type: "array",
                items: { type: "string" }
              },
              similarInnovations: {
                type: "array",
                items: { type: "string" }
              },
              extractedKeywords: {
                type: "array",
                items: { type: "string" }
              },
              sentimentScore: { type: "number" },
              complexityLevel: {
                type: "string",
                enum: ["low", "medium", "high", "very_high"]
              },
              marketSize: { type: "string" },
              competitionLevel: {
                type: "string",
                enum: ["low", "medium", "high", "very_high"]
              },
              marketTrends: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: [
              "criterionScores",
              "aiAnalysis",
              "strengths",
              "weaknesses",
              "opportunities",
              "threats",
              "recommendations",
              "nextSteps",
              "similarInnovations",
              "extractedKeywords",
              "sentimentScore",
              "complexityLevel"
            ],
            additionalProperties: false
          }
        }
      }
    });
    
    // Step 3: Parse the response
    const content = response.choices[0].message.content;
    const aiResult = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content) || "{}");
    
    // Step 4: Calculate overall score (weighted average)
    const overallScore = calculateOverallScore(aiResult.criterionScores);
    
    // Step 5: Determine classification
    const classification = determineClassification(overallScore);
    const classificationLevel = CLASSIFICATION_LEVELS.find(l => l.name === classification)!;
    
    // Step 6: Calculate processing time
    const processingTime = Math.round((Date.now() - startTime) / 1000);
    
    // Step 7: Return complete analysis result
    return {
      overallScore,
      classification,
      classificationLabel: classificationLevel.label,
      criterionScores: aiResult.criterionScores,
      aiAnalysis: aiResult.aiAnalysis,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      opportunities: aiResult.opportunities,
      threats: aiResult.threats,
      recommendations: aiResult.recommendations,
      nextSteps: [...aiResult.nextSteps, ...classificationLevel.nextSteps],
      similarInnovations: aiResult.similarInnovations,
      extractedKeywords: aiResult.extractedKeywords,
      sentimentScore: aiResult.sentimentScore,
      complexityLevel: aiResult.complexityLevel,
      marketSize: aiResult.marketSize,
      competitionLevel: aiResult.competitionLevel,
      marketTrends: aiResult.marketTrends,
      processingTime
    };
    
  } catch (error) {
    console.error("Error analyzing idea:", error);
    throw new Error("فشل تحليل الفكرة. يرجى المحاولة مرة أخرى.");
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Construct the analysis prompt for the LLM
 */
function constructAnalysisPrompt(idea: IdeaInput): string {
  return `قم بتحليل الفكرة التالية بناءً على المعايير الستة المحددة:

**عنوان الفكرة:**
${idea.title}

**الوصف:**
${idea.description}

**المشكلة التي تحلها:**
${idea.problem}

**الحل المقترح:**
${idea.solution}

${idea.targetMarket ? `**السوق المستهدف:**\n${idea.targetMarket}\n` : ''}
${idea.uniqueValue ? `**القيمة الفريدة:**\n${idea.uniqueValue}\n` : ''}
${idea.category ? `**الفئة:**\n${idea.category}\n` : ''}

---

يرجى تقييم الفكرة بناءً على المعايير الستة التالية:

${EVALUATION_CRITERIA.map((c, i) => `
${i + 1}. **${c.description}** (الوزن: ${c.weight}%)
   معايير التقييم:
${c.guidelines.map(g => `   - ${g}`).join('\n')}
`).join('\n')}

---

يجب أن يتضمن تحليلك:

1. **تقييم كل معيار** (0-100 نقطة) مع التبرير
2. **نقاط القوة** في الفكرة
3. **نقاط الضعف** التي تحتاج تحسين
4. **الفرص** المتاحة للفكرة
5. **التهديدات** المحتملة
6. **التوصيات** لتحسين الفكرة
7. **الخطوات التالية** المقترحة
8. **ابتكارات مشابهة** (إن وجدت)
9. **الكلمات المفتاحية** المستخرجة
10. **تحليل المشاعر** (-1 إلى 1)
11. **مستوى التعقيد** (low, medium, high, very_high)
12. **حجم السوق** المحتمل
13. **مستوى المنافسة** (low, medium, high, very_high)
14. **اتجاهات السوق** ذات الصلة

كن موضوعيًا ومفصلاً في تحليلك.`;
}

/**
 * Calculate overall score as weighted average
 */
function calculateOverallScore(criterionScores: CriterionScore[]): number {
  let weightedSum = 0;
  
  for (const score of criterionScores) {
    const criterion = EVALUATION_CRITERIA.find(c => c.name === score.criterion);
    if (criterion) {
      weightedSum += (score.score * criterion.weight) / 100;
    }
  }
  
  return Math.round(weightedSum * 100) / 100; // Round to 2 decimal places
}

/**
 * Determine classification based on overall score
 */
function determineClassification(overallScore: number): "innovation" | "commercial" | "weak" {
  for (const level of CLASSIFICATION_LEVELS) {
    if (overallScore >= level.minScore && overallScore <= level.maxScore) {
      return level.name;
    }
  }
  
  // Default to weak if no match (shouldn't happen)
  return "weak";
}

/**
 * Get classification level details
 */
export function getClassificationLevel(classification: "innovation" | "commercial" | "weak"): ClassificationLevel {
  const level = CLASSIFICATION_LEVELS.find(l => l.name === classification);
  if (!level) {
    throw new Error(`Invalid classification: ${classification}`);
  }
  return level;
}

/**
 * Validate idea input
 */
export function validateIdeaInput(idea: Partial<IdeaInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!idea.title || idea.title.trim().length < 10) {
    errors.push("العنوان يجب أن يكون 10 أحرف على الأقل");
  }
  
  if (!idea.description || idea.description.trim().length < 50) {
    errors.push("الوصف يجب أن يكون 50 حرفًا على الأقل");
  }
  
  if (!idea.problem || idea.problem.trim().length < 30) {
    errors.push("وصف المشكلة يجب أن يكون 30 حرفًا على الأقل");
  }
  
  if (!idea.solution || idea.solution.trim().length < 30) {
    errors.push("وصف الحل يجب أن يكون 30 حرفًا على الأقل");
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

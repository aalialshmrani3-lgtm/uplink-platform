/**
 * NAQLA1: AI-Powered Idea Analysis Engine
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

// Enhanced from Innovation 360 best practices - 10 criteria instead of 6
export const EVALUATION_CRITERIA: EvaluationCriterion[] = [
  {
    name: "technicalNovelty",
    weight: 15,
    description: "الجدة التقنية - مدى جدة التكنولوجيا والنهج التقني",
    guidelines: [
      "هل التكنولوجيا المستخدمة جديدة أم مبتكرة؟",
      "هل يوجد نهج تقني فريد لحل المشكلة؟",
      "ما مدى اختلافها عن الحلول التقنية الموجودة؟"
    ]
  },
  {
    name: "socialImpact",
    weight: 15,
    description: "الأثر المجتمعي - حجم التأثير الاجتماعي والإنساني",
    guidelines: [
      "كم عدد الأشخاص الذين ستستفيد منها؟",
      "هل تحل مشكلة اجتماعية ملحة؟",
      "ما مدى تحسين جودة الحياة؟"
    ]
  },
  {
    name: "technicalFeasibility",
    weight: 12,
    description: "الجدوى التقنية - إمكانية التنفيذ التقني",
    guidelines: [
      "هل التكنولوجيا متوفرة ومجربة؟",
      "ما مدى تعقيد التنفيذ؟",
      "هل هناك عوائق تقنية كبيرة؟"
    ]
  },
  {
    name: "commercialValue",
    weight: 12,
    description: "القيمة التجارية - إمكانية تحقيق عوائد مالية",
    guidelines: [
      "هل هناك سوق واضح؟",
      "ما حجم السوق المحتمل؟",
      "ما نموذج العمل المقترح؟"
    ]
  },
  {
    name: "scalability",
    weight: 10,
    description: "قابلية التوسع - إمكانية التوسع والنمو",
    guidelines: [
      "هل يمكن توسيعها لأسواق أخرى؟",
      "ما مدى سهولة التوسع؟",
      "ما حدود النمو؟"
    ]
  },
  {
    name: "sustainability",
    weight: 10,
    description: "الاستدامة - القدرة على الاستمرار",
    guidelines: [
      "هل مستدامة بيئيًا؟",
      "هل نموذج العمل مستدام؟",
      "هل يمكن الاستمرار لسنوات؟"
    ]
  },
  {
    name: "technicalRisk",
    weight: 8,
    description: "المخاطر التقنية - تقييم المخاطر التقنية",
    guidelines: [
      "ما هي المخاطر التقنية المحتملة؟",
      "هل يمكن إدارة هذه المخاطر؟",
      "ما احتمالية الفشل التقني؟"
    ]
  },
  {
    name: "timeToMarket",
    weight: 8,
    description: "سرعة التنفيذ - الوقت المطلوب للوصول للسوق",
    guidelines: [
      "كم يستغرق التطوير؟",
      "هل يمكن إطلاقها بسرعة؟",
      "ما العوائق الزمنية؟"
    ]
  },
  {
    name: "competitiveAdvantage",
    weight: 5,
    description: "الميزة التنافسية - التفوق على المنافسين",
    guidelines: [
      "ما الميزة التنافسية الفريدة؟",
      "هل يمكن تقليدها بسهولة؟",
      "ما الحواجز التي تمنع الدخول؟"
    ]
  },
  {
    name: "organizationalReadiness",
    weight: 5,
    description: "الاستعداد التنظيمي - جاهزية الفريق والموارد",
    guidelines: [
      "هل الفريق مؤهل للتنفيذ؟",
      "هل الموارد متوفرة؟",
      "ما مدى جاهزية البنية التحتية؟"
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
    description: "فكرة مبتكرة تحقق معايير الابتكار وتستحق الانتقال المباشر إلى NAQLA2 للمطابقة مع المستثمرين والتحديات",
    nextSteps: [
      "✅ تم قبول فكرتك كابتكار حقيقي!",
      "🚀 الانتقال التلقائي إلى NAQLA2 للمطابقة مع:",
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
    description: "فكرة رائدة لها قيمة تجارية وتحل مشكلة معينة، لكنها لا تصل لمستوى الابتكار الجذري. تنتقل إلى NAQLA2 للمطابقة مع الفرص التجارية",
    nextSteps: [
      "✅ تم قبول فكرتك كحل تجاري واعد!",
      "🚀 الانتقال التلقائي إلى NAQLA2 للمطابقة مع:",
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
  
  // Recommended Path (NEW)
  recommendedPath: "naqla2" | "naqla3" | "both" | "guidance"; // المسار الموصى به
  pathRecommendations: {
    naqla2?: string; // لماذا NAQLA 2 مناسب
    naqla3?: string; // لماذا NAQLA 3 مناسب
    guidance?: string; // إرشادات للتحسين
  };
  
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
        type: "json_object"
      }
    });
    
    // Step 3: Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('استجابة AI فارغة');
    }
    
    const aiResult = JSON.parse(typeof content === 'string' ? content : JSON.stringify(content) || "{}");
    
    // Step 3.5: Convert criterionScores from object to array if needed
    let criterionScores: CriterionScore[];
    if (Array.isArray(aiResult.criterionScores)) {
      criterionScores = aiResult.criterionScores;
    } else if (typeof aiResult.criterionScores === 'object' && aiResult.criterionScores !== null) {
      // Convert object to array
      criterionScores = Object.entries(aiResult.criterionScores).map(([criterion, data]: [string, any]) => ({
        criterion,
        score: data.score || 0,
        reasoning: data.justification || data.reasoning || '',
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || []
      }));
    } else {
      throw new Error('criterionScores غير موجود أو بصيغة خاطئة');
    }
    
    // Step 4: Calculate overall score (weighted average)
    const overallScore = calculateOverallScore(criterionScores);
    
    // Step 5: Determine classification
    const classification = determineClassification(overallScore);
    const classificationLevel = CLASSIFICATION_LEVELS.find(l => l.name === classification)!;
    
    // Step 6: Calculate processing time
    const processingTime = Math.round((Date.now() - startTime) / 1000);
    
    // Step 6.5: Determine recommended path based on classification
    const { recommendedPath, pathRecommendations } = determineRecommendedPath(classification, overallScore, aiResult);
    
    // Step 7: Return complete analysis result
    return {
      overallScore,
      classification,
      classificationLabel: classificationLevel.label,
      recommendedPath,
      pathRecommendations,
      criterionScores,
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

كن موضوعيًا ومفصلاً في تحليلك.

**مهم جداً:** يجب أن يكون الرد بصيغة JSON فقط بالبنية التالية:

{
  "criterionScores": [
    {
      "criterion": "technicalNovelty",
      "score": 75,
      "reasoning": "التبرير...",
      "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
      "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"]
    },
    // ... باقي المعايير: socialImpact, technicalFeasibility, commercialValue, scalability, sustainability, technicalRisk, timeToMarket, competitiveAdvantage, organizationalReadiness
  ],
  "aiAnalysis": "تحليل شامل...",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "opportunities": ["فرصة 1", "فرصة 2"],
  "threats": ["تهديد 1", "تهديد 2"],
  "recommendations": ["توصية 1", "توصية 2"],
  "nextSteps": ["خطوة 1", "خطوة 2"],
  "similarInnovations": ["ابتكار 1", "ابتكار 2"],
  "extractedKeywords": ["كلمة 1", "كلمة 2"],
  "sentimentScore": 0.75,
  "complexityLevel": "high",
  "marketSize": "وصف حجم السوق",
  "competitionLevel": "high",
  "marketTrends": ["اتجاه 1", "اتجاه 2"]
}

**ملاحظات:**
- استخدم الأسماء الإنجليزية للمعايير: technicalNovelty, socialImpact, technicalFeasibility, commercialValue, scalability, sustainability, technicalRisk, timeToMarket, competitiveAdvantage, organizationalReadiness
- يجب أن يكون criterionScores array وليس object
- جميع النصوص يجب أن تكون بالعربية ما عدا أسماء المعايير
- لا تضف أي نص خارج JSON`;
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
 * Determine recommended path based on classification and analysis
 */
function determineRecommendedPath(
  classification: "innovation" | "commercial" | "weak",
  overallScore: number,
  aiResult: any
): { recommendedPath: "naqla2" | "naqla3" | "both" | "guidance"; pathRecommendations: any } {
  
  // للأفكار الضعيفة (<60%) - إرشادات فقط
  if (classification === "weak") {
    return {
      recommendedPath: "guidance",
      pathRecommendations: {
        guidance: "فكرتك تحتاج إلى تطوير أكثر قبل الانتقال إلى NAQLA 2 أو 3. نوصي بالتركيز على تحسين الجوانب الضعيفة وإعادة التقديم."
      }
    };
  }
  
  // للابتكارات الحقيقية (80-100%) - خيارات متعددة
  if (classification === "innovation") {
    return {
      recommendedPath: "both",
      pathRecommendations: {
        naqla2: "🎯 NAQLA 2 (المطابقة الذكية): فكرتك ابتكارية وتستحق البحث عن شركاء وتحديات ومسرعات لتطويرها. سنساعدك في إيجاد الفرص المناسبة للتمويل والدعم.",
        naqla3: "💼 NAQLA 3 (السوق والبورصة): إذا كنت جاهزًا للتسويق والتداول، يمكنك عرض فكرتك مباشرة في السوق للمستثمرين والشركات."
      }
    };
  }
  
  // للحلول التجارية (60-79%) - خيارات متعددة مع ترجيح NAQLA 2
  if (classification === "commercial") {
    return {
      recommendedPath: "both",
      pathRecommendations: {
        naqla2: "✅ موصى به: NAQLA 2 (المطابقة الذكية) - فكرتك حل تجاري واعد وتحتاج إلى شركاء استراتيجيين للنجاح. سنساعدك في إيجاد المسرعات والحاضنات والتحديات المناسبة.",
        naqla3: "💼 NAQLA 3 (السوق والبورصة): إذا كنت ترغب في عرض فكرتك مباشرة للبيع أو الترخيص، يمكنك الانتقال مباشرة إلى السوق."
      }
    };
  }
  
  // Default (shouldn't reach here)
  return {
    recommendedPath: "guidance",
    pathRecommendations: {
      guidance: "يرجى مراجعة التقييم واتباع التوصيات."
    }
  };
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

// ============================================
// SAIP RECOMMENDATION ENGINE
// ============================================

export interface SaipRecommendation {
  eligible: boolean;
  protectionType: "patent" | "trademark" | "copyright" | "trade_secret" | "none";
  protectionTypeLabel: string;
  reason: string;
  urgency: "high" | "medium" | "low";
  estimatedCost: string;
  saipPortalUrl: string;
  steps: string[];
}

export function determineSaipRecommendation(
  classification: "innovation" | "commercial" | "weak",
  overallScore: number,
  criterionScores: CriterionScore[]
): SaipRecommendation {
  const noveltyScore = criterionScores.find(c => c.criterion === "technicalNovelty")?.score || 0;

  if (classification === "innovation" && noveltyScore >= 70) {
    return {
      eligible: true,
      protectionType: "patent",
      protectionTypeLabel: "براءة اختراع",
      reason: "فكرتك تحقق معايير الجِدة والابتكار وقابلية التطبيق الصناعي المطلوبة لبراءة الاختراع",
      urgency: "high",
      estimatedCost: "3,000 - 8,000 ريال",
      saipPortalUrl: "https://www.saip.gov.sa/services/patents/",
      steps: [
        "1. سجّل في بوابة SAIP عبر Nafath على saip.gov.sa",
        "2. ابحث عن براءات مشابهة في قاعدة بيانات SAIP",
        "3. أعدّ وصفاً تقنياً مفصلاً للاختراع",
        "4. قدّم طلب براءة الاختراع مع الرسوم والمخططات",
        "5. احفظ رقم الطلب في NAQLA لمتابعة الحالة"
      ]
    };
  }

  if (classification === "commercial" && overallScore >= 60) {
    return {
      eligible: true,
      protectionType: "trademark",
      protectionTypeLabel: "علامة تجارية",
      reason: "فكرتك حل تجاري واعد — حماية العلامة التجارية تضمن حقوقك في السوق",
      urgency: "medium",
      estimatedCost: "1,000 - 3,000 ريال",
      saipPortalUrl: "https://www.saip.gov.sa/services/trademarks/",
      steps: [
        "1. سجّل في بوابة SAIP عبر Nafath",
        "2. ابحث عن علامات تجارية مشابهة",
        "3. صمّم شعارك وحدد فئة النشاط التجاري",
        "4. قدّم طلب تسجيل العلامة التجارية",
        "5. احفظ رقم الطلب في NAQLA لمتابعة الحالة"
      ]
    };
  }

  return {
    eligible: false,
    protectionType: "none",
    protectionTypeLabel: "غير مؤهل حالياً",
    reason: "فكرتك تحتاج إلى تطوير أكثر قبل التقديم على حماية الملكية الفكرية",
    urgency: "low",
    estimatedCost: "—",
    saipPortalUrl: "https://www.saip.gov.sa",
    steps: [
      "1. طوّر فكرتك بناءً على التوصيات",
      "2. أعد التقديم على NAQLA بعد التحسينات",
      "3. عند الحصول على تصنيف أعلى، ستظهر توصية SAIP تلقائياً"
    ]
  };
}

// ============================================
// DEVELOPMENT COURSES ENGINE
// ============================================

export interface DevelopmentCourse {
  title: string;
  provider: string;
  url: string;
  duration: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  category: string;
  relevance: string;
}

export interface MarketingProgram {
  title: string;
  description: string;
  timeline: string;
  actions: string[];
}

export interface DevelopmentPlan {
  overallGuidance: string;
  priorityAreas: string[];
  courses: DevelopmentCourse[];
  marketingProgram?: MarketingProgram;
}

export function generateDevelopmentPlan(
  classification: "innovation" | "commercial" | "weak",
  overallScore: number,
  criterionScores: CriterionScore[],
  category: string = "general"
): DevelopmentPlan {
  const weakAreas = criterionScores
    .filter(c => c.score < 60)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);

  const priorityAreas = weakAreas.map(c => c.criterion);
  const allCourses: DevelopmentCourse[] = [];

  if (priorityAreas.includes("technicalNovelty") || priorityAreas.includes("technicalFeasibility")) {
    allCourses.push(
      { title: "أساسيات الابتكار والتفكير الإبداعي", provider: "Misk Academy", url: "https://misk.org.sa/academy", duration: "6 أسابيع", level: "مبتدئ", category: "الابتكار", relevance: "تطوير مهارات التفكير الإبداعي وتوليد الأفكار الجديدة" },
      { title: "Design Thinking for Innovation", provider: "Coursera (Stanford)", url: "https://www.coursera.org/learn/design-thinking-innovation", duration: "4 أسابيع", level: "متوسط", category: "الابتكار", relevance: "منهجية التفكير التصميمي لحل المشكلات بشكل مبتكر" }
    );
  }

  if (priorityAreas.includes("commercialValue") || priorityAreas.includes("scalability")) {
    allCourses.push(
      { title: "نماذج الأعمال وريادة الأعمال", provider: "منصة رواد الأعمال", url: "https://rowad.monsha.com", duration: "8 أسابيع", level: "مبتدئ", category: "ريادة الأعمال", relevance: "بناء نموذج عمل قابل للتوسع وتحقيق الإيرادات" },
      { title: "Business Model Canvas Masterclass", provider: "Udemy", url: "https://www.udemy.com/course/business-model-canvas", duration: "3 أسابيع", level: "متوسط", category: "ريادة الأعمال", relevance: "رسم خارطة نموذج العمل وتحديد مصادر الإيرادات" }
    );
  }

  if (priorityAreas.includes("socialImpact") || priorityAreas.includes("sustainability")) {
    allCourses.push(
      { title: "الاستدامة وأهداف التنمية المستدامة", provider: "King Abdulaziz University Online", url: "https://online.kau.edu.sa", duration: "5 أسابيع", level: "مبتدئ", category: "الاستدامة", relevance: "ربط الفكرة بأهداف رؤية 2030 وأهداف التنمية المستدامة" }
    );
  }

  if (priorityAreas.includes("technicalRisk") || priorityAreas.includes("timeToMarket")) {
    allCourses.push(
      { title: "إدارة المشاريع الناشئة (Lean Startup)", provider: "edX", url: "https://www.edx.org/learn/lean-startup", duration: "6 أسابيع", level: "متوسط", category: "إدارة المشاريع", relevance: "تقليل المخاطر وتسريع الوصول للسوق بمنهجية Lean" }
    );
  }

  allCourses.push(
    { title: "برنامج تطوير رواد الأعمال", provider: "Monsha'at (منشآت)", url: "https://www.monshaat.gov.sa/programs", duration: "12 أسبوع", level: "مبتدئ", category: "ريادة الأعمال", relevance: "برنامج حكومي شامل لتطوير رواد الأعمال السعوديين" }
  );

  const marketingProgram: MarketingProgram = {
    title: "برنامج تسويق الفكرة للمستثمرين",
    description: "إذا مرّ شهر دون اهتمام من مستثمر، نفعّل هذا البرنامج تلقائياً",
    timeline: "30 يوم",
    actions: [
      "📧 إرسال ملخص الفكرة لـ 50 مستثمراً محلياً وأجنبياً في قاعدة بيانات NAQLA",
      "📢 نشر الفكرة (بدون تفاصيل سرية) في لوحة التحديات العامة",
      "🎯 مطابقة الفكرة مع تحديات الشركات الكبرى المسجلة في NAQLA",
      "📊 إنشاء ملف استثماري (Teaser) وإرساله للصناديق الاستثمارية",
      "🤝 اقتراح شركاء استراتيجيين محتملين من قاعدة بيانات NAQLA",
      "📅 جدولة جلسة عرض افتراضية مع أقرب 3 مستثمرين مناسبين"
    ]
  };

  const overallGuidance = classification === "weak"
    ? `فكرتك حصلت على ${overallScore}% وتحتاج إلى تطوير في ${weakAreas.length} مجالات رئيسية.`
    : classification === "commercial"
    ? `فكرتك حل تجاري واعد بنسبة ${overallScore}%. لتعزيز فرص نجاحها في السوق، ننصح بالتطوير في المجالات التالية.`
    : `فكرتك ابتكار متميز بنسبة ${overallScore}%. لتعظيم أثرها وفرص تمويلها، ننصح بتطوير الجوانب التالية.`;

  return {
    overallGuidance,
    priorityAreas,
    courses: allCourses.slice(0, 6),
    marketingProgram: classification !== "weak" ? marketingProgram : undefined
  };
}

// ============================================
// NAQLA2 TRANSITION CHECKER
// ============================================

export interface Naqla2TransitionStatus {
  canTransition: boolean;
  transitionType: "immediate" | "after_saip" | "after_development" | "not_ready";
  message: string;
  conditions: string[];
  estimatedTimeToReady?: string;
}

export function checkNaqla2Transition(
  classification: "innovation" | "commercial" | "weak",
  overallScore: number,
  hasSaipApplication: boolean = false
): Naqla2TransitionStatus {
  if (hasSaipApplication) {
    return {
      canTransition: true,
      transitionType: "immediate",
      message: "🎉 فكرتك محمية بـ SAIP وجاهزة للانتقال الفوري إلى نقلة TWO للاستثمار",
      conditions: ["✅ تم التحقق من ورقة SAIP", "✅ الفكرة محمية قانونياً", "✅ جاهزة للعرض على المستثمرين"]
    };
  }

  if (classification === "innovation" && overallScore >= 80) {
    return {
      canTransition: true,
      transitionType: "after_saip",
      message: "✅ فكرتك مؤهلة للانتقال إلى نقلة TWO. ننصح بتسجيل براءة الاختراع أولاً لحماية حقوقك",
      conditions: ["✅ النتيجة تتجاوز 80%", "⚠️ ننصح بتسجيل SAIP قبل الانتقال", "✅ يمكن الانتقال الآن مع الاحتفاظ بحقوقك"]
    };
  }

  if (classification === "commercial" && overallScore >= 60) {
    return {
      canTransition: true,
      transitionType: "immediate",
      message: "✅ فكرتك حل تجاري جاهز للانتقال إلى نقلة TWO لإيجاد المستثمرين والشركاء",
      conditions: ["✅ النتيجة تتجاوز 60%", "✅ الفكرة قابلة للتطبيق التجاري", "✅ جاهزة للعرض على المستثمرين"]
    };
  }

  return {
    canTransition: false,
    transitionType: "after_development",
    message: "⏳ فكرتك تحتاج إلى تطوير قبل الانتقال إلى نقلة TWO",
    conditions: ["❌ النتيجة أقل من 60%", "📚 يجب إتمام برامج التطوير الموصى بها", "🔄 أعد التقديم بعد التحسينات"],
    estimatedTimeToReady: "4-8 أسابيع مع الدورات الموصى بها"
  };
}

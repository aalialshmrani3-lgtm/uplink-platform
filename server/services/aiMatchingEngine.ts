/**
 * AI Matching Engine - نظام الربط الذكي الشامل
 * 
 * يربط المشاريع مع:
 * - التحديات (Challenges)
 * - المسرعات (Accelerators)
 * - الحاضنات (Incubators)
 * - الشركاء الاستراتيجيين (Strategic Partners)
 * 
 * باستخدام AI matching algorithm يحسب match score (0-100%)
 */

import { invokeLLM } from "../_core/llm";

export interface Project {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  stage: string;
  teamSize: number;
  fundingRequired: number;
  tags?: string;
  overallScore?: number;
}

export interface Challenge {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  prize: number;
  requirements?: string;
}

export interface Accelerator {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  focusAreas: string;
  supportTypes: string;
  fundingRange?: string;
}

export interface Incubator {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  focusAreas: string;
  supportTypes: string;
  fundingRange?: string;
}

export interface Partner {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  industry: string;
  focusAreas?: string;
  partnershipTypes?: string;
}

export interface MatchResult {
  id: number;
  type: "challenge" | "accelerator" | "incubator" | "partner";
  matchScore: number; // 0-100
  matchReasons: string[];
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category?: string;
  prize?: number;
  fundingRange?: string;
  focusAreas?: string;
  supportTypes?: string;
  industry?: string;
  partnershipTypes?: string;
}

/**
 * حساب match score بين مشروع وتحدي
 */
export async function calculateChallengeMatch(
  project: Project,
  challenge: Challenge
): Promise<{ matchScore: number; matchReasons: string[] }> {
  try {
    const prompt = `أنت خبير في مطابقة المشاريع مع التحديات. قم بتحليل المشروع والتحدي التاليين وحساب match score (0-100%) مع توضيح الأسباب.

**المشروع:**
- العنوان: ${project.title}
- الوصف: ${project.description}
- التصنيف: ${project.category}
- المرحلة: ${project.stage}
- الوسوم: ${project.tags || "لا يوجد"}

**التحدي:**
- العنوان: ${challenge.title}
- الوصف: ${challenge.description}
- التصنيف: ${challenge.category}
- الجائزة: ${challenge.prize} ريال
- المتطلبات: ${challenge.requirements || "لا يوجد"}

قم بتحليل:
1. مدى توافق التصنيفات والمجالات
2. مدى تطابق الوصف والأهداف
3. مدى ملاءمة المرحلة والمتطلبات
4. القيمة المحتملة للمشروع في التحدي

أعط النتيجة بصيغة JSON فقط:
{
  "matchScore": <number 0-100>,
  "matchReasons": ["سبب 1", "سبب 2", "سبب 3"]
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "أنت خبير في تحليل المشاريع والتحديات وحساب التوافق بينها." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "challenge_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: {
                type: "number",
                description: "Match score من 0 إلى 100",
              },
              matchReasons: {
                type: "array",
                items: { type: "string" },
                description: "أسباب المطابقة",
              },
            },
            required: ["matchScore", "matchReasons"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No response from LLM");
    }

    const result = JSON.parse(content);
    return {
      matchScore: Math.round(result.matchScore),
      matchReasons: result.matchReasons,
    };
  } catch (error) {
    console.error("Error in calculateChallengeMatch:", error);
    // Fallback: حساب بسيط بناءً على التصنيف
    const categoryMatch = project.category === challenge.category ? 70 : 30;
    return {
      matchScore: categoryMatch,
      matchReasons: [
        project.category === challenge.category
          ? "تطابق التصنيف"
          : "اختلاف التصنيف",
      ],
    };
  }
}

/**
 * حساب match score بين مشروع ومسرع
 */
export async function calculateAcceleratorMatch(
  project: Project,
  accelerator: Accelerator
): Promise<{ matchScore: number; matchReasons: string[] }> {
  try {
    const prompt = `أنت خبير في مطابقة المشاريع مع المسرعات. قم بتحليل المشروع والمسرع التاليين وحساب match score (0-100%) مع توضيح الأسباب.

**المشروع:**
- العنوان: ${project.title}
- الوصف: ${project.description}
- التصنيف: ${project.category}
- المرحلة: ${project.stage}
- حجم الفريق: ${project.teamSize}
- التمويل المطلوب: ${project.fundingRequired} ريال

**المسرع:**
- الاسم: ${accelerator.name}
- الوصف: ${accelerator.description}
- مجالات التركيز: ${accelerator.focusAreas}
- أنواع الدعم: ${accelerator.supportTypes}
- نطاق التمويل: ${accelerator.fundingRange || "غير محدد"}

قم بتحليل:
1. مدى توافق مجالات التركيز مع تصنيف المشروع
2. مدى ملاءمة أنواع الدعم لاحتياجات المشروع
3. مدى توافق نطاق التمويل مع المطلوب
4. مدى ملاءمة مرحلة المشروع للمسرع

أعط النتيجة بصيغة JSON فقط:
{
  "matchScore": <number 0-100>,
  "matchReasons": ["سبب 1", "سبب 2", "سبب 3"]
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "أنت خبير في تحليل المشاريع والمسرعات وحساب التوافق بينها." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "accelerator_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: {
                type: "number",
                description: "Match score من 0 إلى 100",
              },
              matchReasons: {
                type: "array",
                items: { type: "string" },
                description: "أسباب المطابقة",
              },
            },
            required: ["matchScore", "matchReasons"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No response from LLM");
    }

    const result = JSON.parse(content);
    return {
      matchScore: Math.round(result.matchScore),
      matchReasons: result.matchReasons,
    };
  } catch (error) {
    console.error("Error in calculateAcceleratorMatch:", error);
    // Fallback
    return {
      matchScore: 50,
      matchReasons: ["تحليل تلقائي - يحتاج مراجعة يدوية"],
    };
  }
}

/**
 * حساب match score بين مشروع وحاضنة
 */
export async function calculateIncubatorMatch(
  project: Project,
  incubator: Incubator
): Promise<{ matchScore: number; matchReasons: string[] }> {
  try {
    const prompt = `أنت خبير في مطابقة المشاريع مع الحاضنات. قم بتحليل المشروع والحاضنة التاليين وحساب match score (0-100%) مع توضيح الأسباب.

**المشروع:**
- العنوان: ${project.title}
- الوصف: ${project.description}
- التصنيف: ${project.category}
- المرحلة: ${project.stage}
- حجم الفريق: ${project.teamSize}
- التمويل المطلوب: ${project.fundingRequired} ريال

**الحاضنة:**
- الاسم: ${incubator.name}
- الوصف: ${incubator.description}
- مجالات التركيز: ${incubator.focusAreas}
- أنواع الدعم: ${incubator.supportTypes}
- نطاق التمويل: ${incubator.fundingRange || "غير محدد"}

قم بتحليل:
1. مدى توافق مجالات التركيز مع تصنيف المشروع
2. مدى ملاءمة أنواع الدعم لاحتياجات المشروع
3. مدى توافق نطاق التمويل مع المطلوب
4. مدى ملاءمة مرحلة المشروع للحاضنة (الحاضنات عادة للمراحل المبكرة)

أعط النتيجة بصيغة JSON فقط:
{
  "matchScore": <number 0-100>,
  "matchReasons": ["سبب 1", "سبب 2", "سبب 3"]
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "أنت خبير في تحليل المشاريع والحاضنات وحساب التوافق بينها." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "incubator_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: {
                type: "number",
                description: "Match score من 0 إلى 100",
              },
              matchReasons: {
                type: "array",
                items: { type: "string" },
                description: "أسباب المطابقة",
              },
            },
            required: ["matchScore", "matchReasons"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No response from LLM");
    }

    const result = JSON.parse(content);
    return {
      matchScore: Math.round(result.matchScore),
      matchReasons: result.matchReasons,
    };
  } catch (error) {
    console.error("Error in calculateIncubatorMatch:", error);
    // Fallback
    return {
      matchScore: 50,
      matchReasons: ["تحليل تلقائي - يحتاج مراجعة يدوية"],
    };
  }
}

/**
 * حساب match score بين مشروع وشريك استراتيجي
 */
export async function calculatePartnerMatch(
  project: Project,
  partner: Partner
): Promise<{ matchScore: number; matchReasons: string[] }> {
  try {
    const prompt = `أنت خبير في مطابقة المشاريع مع الشركاء الاستراتيجيين. قم بتحليل المشروع والشريك التاليين وحساب match score (0-100%) مع توضيح الأسباب.

**المشروع:**
- العنوان: ${project.title}
- الوصف: ${project.description}
- التصنيف: ${project.category}
- المرحلة: ${project.stage}
- التمويل المطلوب: ${project.fundingRequired} ريال

**الشريك الاستراتيجي:**
- الاسم: ${partner.name}
- الوصف: ${partner.description}
- الصناعة: ${partner.industry}
- مجالات التركيز: ${partner.focusAreas || "غير محدد"}
- أنواع الشراكة: ${partner.partnershipTypes || "غير محدد"}

قم بتحليل:
1. مدى توافق الصناعة مع تصنيف المشروع
2. مدى ملاءمة مجالات التركيز للمشروع
3. القيمة المحتملة للشراكة للطرفين
4. مدى ملاءمة أنواع الشراكة لاحتياجات المشروع

أعط النتيجة بصيغة JSON فقط:
{
  "matchScore": <number 0-100>,
  "matchReasons": ["سبب 1", "سبب 2", "سبب 3"]
}`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "أنت خبير في تحليل المشاريع والشركاء الاستراتيجيين وحساب التوافق بينها." },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "partner_match",
          strict: true,
          schema: {
            type: "object",
            properties: {
              matchScore: {
                type: "number",
                description: "Match score من 0 إلى 100",
              },
              matchReasons: {
                type: "array",
                items: { type: "string" },
                description: "أسباب المطابقة",
              },
            },
            required: ["matchScore", "matchReasons"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content || typeof content !== "string") {
      throw new Error("No response from LLM");
    }

    const result = JSON.parse(content);
    return {
      matchScore: Math.round(result.matchScore),
      matchReasons: result.matchReasons,
    };
  } catch (error) {
    console.error("Error in calculatePartnerMatch:", error);
    // Fallback
    return {
      matchScore: 50,
      matchReasons: ["تحليل تلقائي - يحتاج مراجعة يدوية"],
    };
  }
}

/**
 * الحصول على جميع الفرص المتاحة لمشروع معين
 */
export async function getAllOpportunitiesForProject(
  project: Project,
  challenges: Challenge[],
  accelerators: Accelerator[],
  incubators: Incubator[],
  partners: Partner[]
): Promise<MatchResult[]> {
  const results: MatchResult[] = [];

  // مطابقة التحديات
  for (const challenge of challenges) {
    const match = await calculateChallengeMatch(project, challenge);
    results.push({
      id: challenge.id,
      type: "challenge",
      matchScore: match.matchScore,
      matchReasons: match.matchReasons,
      title: challenge.title,
      titleEn: challenge.titleEn,
      description: challenge.description,
      descriptionEn: challenge.descriptionEn,
      category: challenge.category,
      prize: challenge.prize,
    });
  }

  // مطابقة المسرعات
  for (const accelerator of accelerators) {
    const match = await calculateAcceleratorMatch(project, accelerator);
    results.push({
      id: accelerator.id,
      type: "accelerator",
      matchScore: match.matchScore,
      matchReasons: match.matchReasons,
      title: accelerator.name,
      titleEn: accelerator.nameEn,
      description: accelerator.description,
      descriptionEn: accelerator.descriptionEn,
      focusAreas: accelerator.focusAreas,
      supportTypes: accelerator.supportTypes,
      fundingRange: accelerator.fundingRange,
    });
  }

  // مطابقة الحاضنات
  for (const incubator of incubators) {
    const match = await calculateIncubatorMatch(project, incubator);
    results.push({
      id: incubator.id,
      type: "incubator",
      matchScore: match.matchScore,
      matchReasons: match.matchReasons,
      title: incubator.name,
      titleEn: incubator.nameEn,
      description: incubator.description,
      descriptionEn: incubator.descriptionEn,
      focusAreas: incubator.focusAreas,
      supportTypes: incubator.supportTypes,
      fundingRange: incubator.fundingRange,
    });
  }

  // مطابقة الشركاء
  for (const partner of partners) {
    const match = await calculatePartnerMatch(project, partner);
    results.push({
      id: partner.id,
      type: "partner",
      matchScore: match.matchScore,
      matchReasons: match.matchReasons,
      title: partner.name,
      titleEn: partner.nameEn,
      description: partner.description,
      descriptionEn: partner.descriptionEn,
      industry: partner.industry,
      focusAreas: partner.focusAreas,
      partnershipTypes: partner.partnershipTypes,
    });
  }

  // ترتيب حسب match score (الأعلى أولاً)
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

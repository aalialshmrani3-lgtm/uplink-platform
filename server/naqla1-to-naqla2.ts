/**
 * NAQLA 1 → NAQLA 2: الانتقال التلقائي إلى المطابقة
 * 
 * عندما تحصل الفكرة على درجة ≥60%، يتم إنشاء project في NAQLA 2
 * والبحث عن الفرص المناسبة (تحديات، هاكاثونات، مستثمرين)
 */

import * as db from './db';

export interface Opportunity {
  type: 'challenge' | 'hackathon' | 'investor';
  id: number;
  title: string;
  matchScore: number;
  description?: string;
}

export interface PromoteToNaqla2Result {
  projectId: number;
  opportunities: Opportunity[];
}

/**
 * إنشاء project في NAQLA 2 والبحث عن الفرص المناسبة
 */
export async function promoteToNaqla2(
  ideaId: number,
  userId: number
): Promise<PromoteToNaqla2Result> {
  // 1. الحصول على الفكرة
  const idea = await db.getIdeaById(ideaId);
  if (!idea) {
    throw new Error('الفكرة غير موجودة');
  }

  // 2. الحصول على التحليل
  const analysis = await db.getIdeaAnalysisByIdeaId(ideaId);
  if (!analysis) {
    throw new Error('لم يتم تحليل الفكرة بعد');
  }

  // 3. إنشاء project في NAQLA 2
  const projectId = await db.createProject({
    userId,
    title: idea.title,
    titleEn: idea.titleEn || undefined,
    description: idea.description,
    descriptionEn: idea.descriptionEn || undefined,
    category: idea.category || 'general',
    status: 'draft',
    engine: 'naqla2',
    tags: idea.keywords ? JSON.stringify(idea.keywords) : undefined,
  });

  // 4. تحديث الفكرة بـ projectId
  await db.updateIdea(ideaId, {
    naqla2ProjectId: projectId,
  });

  // 5. البحث عن الفرص المناسبة
  const opportunities: Opportunity[] = [];

  // البحث عن التحديات المفتوحة
  try {
    const challenges = await db.getAllChallenges('open');
    for (const challenge of challenges.slice(0, 3)) {
      // أخذ أول 3 تحديات
      opportunities.push({
        type: 'challenge',
        id: challenge.id,
        title: challenge.title,
        matchScore: 75, // TODO: حساب match score حقيقي
        description: challenge.description,
      });
    }
  } catch (error) {
    console.error('Error fetching challenges:', error);
  }

  // 6. إنشاء إشعار للمستخدم
  await db.createNotification({
    userId,
    title: 'تم نقل فكرتك إلى NAQLA 2',

    message: `تم إنشاء مشروع لفكرتك "${idea.title}" في NAQLA 2. وجدنا ${opportunities.length} فرصة مناسبة لك!`,

    type: 'success',
    link: `/naqla2/projects/${projectId}`,
  });

  return {
    projectId,
    opportunities,
  };
}

/**
 * NAQLA 1 → NAQLA 3: الانتقال المباشر إلى البورصة
 * 
 * عندما يختار المستخدم الانتقال مباشرة إلى NAQLA 3 (البورصة/البيع)
 * بدون المرور بـ NAQLA 2 (المطابقة)
 */

import * as db from './db';

export interface PromoteToNaqla3Result {
  assetId: number;
  listingUrl: string;
}

/**
 * إنشاء asset في NAQLA 3 marketplace مباشرة
 */
export async function promoteToNaqla3(
  ideaId: number,
  userId: number
): Promise<PromoteToNaqla3Result> {
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

  // 3. إنشاء asset في marketplace
  // TODO: إضافة createMarketplaceAsset في db.ts
  const assetId = 1;

  // 4. تحديث الفكرة بـ assetId
  await db.updateIdea(ideaId, {
    naqla3AssetId: assetId,
  });

  // 5. إنشاء إشعار للمستخدم
  await db.createNotification({
    userId,
    title: 'تم نقل فكرتك إلى NAQLA 3',

    message: `تم إنشاء عرض في البورصة لفكرتك "${idea.title}". يرجى تحديد السعر والتفاصيل.`,

    type: 'success',
    link: `/naqla3/assets/${assetId}`,
  });

  return {
    assetId,
    listingUrl: `/naqla3/assets/${assetId}`,
  };
}

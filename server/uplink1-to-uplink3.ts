/**
 * UPLINK 1 → UPLINK 3: الانتقال المباشر إلى البورصة
 * 
 * عندما يختار المستخدم الانتقال مباشرة إلى UPLINK 3 (البورصة/البيع)
 * بدون المرور بـ UPLINK 2 (المطابقة)
 */

import * as db from './db';

export interface PromoteToUplink3Result {
  assetId: number;
  listingUrl: string;
}

/**
 * إنشاء asset في UPLINK 3 marketplace مباشرة
 */
export async function promoteToUplink3(
  ideaId: number,
  userId: number
): Promise<PromoteToUplink3Result> {
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
    uplink3AssetId: assetId,
  });

  // 5. إنشاء إشعار للمستخدم
  await db.createNotification({
    userId,
    title: 'تم نقل فكرتك إلى UPLINK 3',

    message: `تم إنشاء عرض في البورصة لفكرتك "${idea.title}". يرجى تحديد السعر والتفاصيل.`,

    type: 'success',
    link: `/uplink3/assets/${assetId}`,
  });

  return {
    assetId,
    listingUrl: `/uplink3/assets/${assetId}`,
  };
}

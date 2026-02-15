/**
 * UPLINK 2 → UPLINK 3: الانتقال بعد نجاح المطابقة
 * 
 * عندما يتم الاتفاق بين المبتكر والمستثمر/الشركة في UPLINK 2،
 * يتم إنشاء عقد في UPLINK 3 تلقائياً
 */

import * as db from './db';

export interface PromoteToUplink3FromUplink2Result {
  contractId: number;
  assetId?: number;
  message: string;
}

/**
 * إنشاء عقد في UPLINK 3 بعد نجاح المطابقة
 */
export async function promoteToUplink3FromUplink2(
  projectId: number,
  matchId: number,
  userId: number
): Promise<PromoteToUplink3FromUplink2Result> {
  // 1. الحصول على المشروع
  const project = await db.getProjectById(projectId);
  if (!project) {
    throw new Error('المشروع غير موجود');
  }

  // 2. الحصول على المطابقة
  // TODO: إضافة getMatchById في db.ts
  // const match = await db.getMatchById(matchId);

  // 3. إنشاء عقد في UPLINK 3
  const contractId = await db.createContract({
    projectId,
    partyA: userId, // المبتكر
    partyB: 1, // TODO: الحصول على ID المستثمر من المطابقة
    type: 'license', // TODO: تحديد نوع العقد حسب المطابقة
    title: `عقد ${project.title}`,
    description: `عقد بين المبتكر والمستثمر لمشروع ${project.title}`,
    totalValue: '0', // TODO: تحديد القيمة
    currency: 'SAR',
    startDate: new Date().toISOString(),
    status: 'draft',
  });

  // 4. تحديث المشروع
  await db.updateProject(projectId, {
    status: 'contracted',
  });

  // 5. إنشاء إشعار للطرفين
  await db.createNotification({
    userId,
    title: 'تم إنشاء عقد في UPLINK 3',

    message: `تم إنشاء عقد لمشروعك "${project.title}" في UPLINK 3. يرجى مراجعة التفاصيل والتوقيع.`,

    type: 'success',
    link: `/uplink3/contracts/${contractId}`,
  });

  return {
    contractId,
    message: `تم إنشاء عقد بنجاح (ID: ${contractId})`,
  };
}

/**
 * إنشاء asset في marketplace بعد إكمال العقد
 */
export async function createMarketplaceAssetFromContract(
  contractId: number,
  userId: number
): Promise<number> {
  // 1. الحصول على العقد
  const contract = await db.getContractById(contractId);
  if (!contract) {
    throw new Error('العقد غير موجود');
  }

  // 2. الحصول على المشروع
  const project = await db.getProjectById(contract.projectId);
  if (!project) {
    throw new Error('المشروع غير موجود');
  }

  // 3. إنشاء asset في marketplace
  // TODO: إضافة createMarketplaceAsset في db.ts
  const assetId = 1;

  // 4. إنشاء إشعار
  await db.createNotification({
    userId,
    title: 'تم نشر مشروعك في البورصة',

    message: `تم نشر مشروعك "${project.title}" في بورصة UPLINK 3.`,

    type: 'success',
    link: `/uplink3/assets/${assetId}`,
  });

  return assetId;
}

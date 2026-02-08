/**
 * UPLINK2 → UPLINK3 Auto-transition Logic
 * 
 * This module handles the automatic transition from UPLINK2 (Events/Hackathons)
 * to UPLINK3 (Smart Contracts) when an event is completed.
 */

import { db } from "../db";
import { events, contracts, escrowTransactions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendNotification } from "../notifications/notification-service";

/**
 * Complete an event and create a smart contract in UPLINK3
 */
export async function completeEventAndCreateContract(params: {
  eventId: number;
  userId: number;
  winnerIds: number[];
  contractTerms: string;
  totalAmount: number;
  milestones: Array<{
    title: string;
    description: string;
    amount: number;
    dueDate: Date;
  }>;
}) {
  const { eventId, userId, winnerIds, contractTerms, totalAmount, milestones } = params;

  try {
    // 1. Update event status to 'completed'
    await db
      .update(events)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId));

    // 2. Create smart contract for each winner
    const createdContracts = [];
    
    for (const winnerId of winnerIds) {
      const [contract] = await db
        .insert(contracts)
        .values({
          projectId: eventId, // Link to event
          innovatorId: winnerId,
          sponsorId: userId,
          terms: contractTerms,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      createdContracts.push(contract);

      // 3. Create escrow transaction
      await db.insert(escrowTransactions).values({
        contractId: contract.id,
        amount: totalAmount.toString(),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // 4. Send notification to winner
      await sendNotification({
        userId: winnerId,
        type: "contract_created",
        title: "عقد ذكي جديد",
        message: `تم إنشاء عقد ذكي لك في UPLINK3 بعد انتهاء الفعالية. المبلغ الإجمالي: ${totalAmount} ريال`,
        link: `/uplink3/contracts/${contract.id}`,
      });
    }

    // 5. Send notification to event organizer
    await sendNotification({
      userId,
      type: "event_completed",
      title: "اكتمال الفعالية",
      message: `تم إكمال الفعالية وإنشاء ${createdContracts.length} عقد ذكي في UPLINK3`,
      link: `/uplink3/contracts`,
    });

    return {
      success: true,
      contracts: createdContracts,
      message: `تم إنشاء ${createdContracts.length} عقد ذكي بنجاح`,
    };
  } catch (error) {
    console.error("Error in completeEventAndCreateContract:", error);
    throw new Error("فشل في إنشاء العقود الذكية");
  }
}

/**
 * Auto-transition trigger (called when event status changes to 'completed')
 */
export async function autoTransitionToUPLINK3(eventId: number) {
  try {
    // Get event details
    const [event] = await db.select().from(events).where(eq(events.id, eventId));

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if event is completed
    if (event.status !== "completed") {
      return { success: false, message: "Event is not completed yet" };
    }

    // Get event winners (TODO: implement winner selection logic)
    const winnerIds: number[] = []; // Placeholder

    // Create default contract terms
    const contractTerms = `
عقد ذكي لفعالية: ${event.title}

الشروط والأحكام:
1. يتم تنفيذ المشروع حسب المواصفات المتفق عليها
2. يتم الدفع على مراحل حسب الإنجاز
3. يتم الاحتفاظ بالمبلغ في Escrow حتى إتمام كل مرحلة
4. يحق للطرفين إلغاء العقد في حالة عدم الالتزام

تاريخ الإنشاء: ${new Date().toLocaleDateString("ar-SA")}
    `.trim();

    // Create default milestones
    const milestones = [
      {
        title: "المرحلة الأولى: التخطيط",
        description: "إعداد خطة العمل والجدول الزمني",
        amount: 3000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        title: "المرحلة الثانية: التنفيذ",
        description: "تنفيذ المشروع حسب الخطة",
        amount: 5000,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      {
        title: "المرحلة الثالثة: التسليم",
        description: "تسليم المشروع النهائي",
        amount: 2000,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
    ];

    // Create contracts
    if (winnerIds.length > 0) {
      return await completeEventAndCreateContract({
        eventId,
        userId: event.organizerId,
        winnerIds,
        contractTerms,
        totalAmount: 10000, // Default amount
        milestones,
      });
    }

    return {
      success: false,
      message: "No winners found for this event",
    };
  } catch (error) {
    console.error("Error in autoTransitionToUPLINK3:", error);
    throw error;
  }
}

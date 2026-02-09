import { getDb } from "../db";
import { pipelineIdeas, events, contracts, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { moveToUplink2 } from "../uplink1/idea-workflow";

/**
 * UPLINK Workflow Connector
 * Handles automatic transitions between UPLINK1 → UPLINK2 → UPLINK3
 */

/**
 * UPLINK1 → UPLINK2
 * Automatically triggered when idea scores >= 70%
 */
export async function uplink1ToUplink2(ideaId: number, userId: number) {
  console.log(`[Workflow] Moving idea ${ideaId} from UPLINK1 to UPLINK2`);

  // Move idea to UPLINK2
  await moveToUplink2(ideaId, userId);

  // Notify user
  // TODO: Send notification to user

  return { success: true, message: "Idea moved to UPLINK2 successfully" };
}

/**
 * UPLINK2 → UPLINK3
 * Automatically triggered when event completes or challenge ends
 */
export async function uplink2ToUplink3(
  eventId: number,
  hostUserId: number,
  participantUserIds: number[]
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  console.log(`[Workflow] Moving event ${eventId} from UPLINK2 to UPLINK3`);

  // Get event details
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    throw new Error("Event not found");
  }

  // Create contracts for each participant
  const contractIds: number[] = [];

  for (const participantId of participantUserIds) {
    const [contract] = await db
      .insert(contracts)
      .values({
        projectId: eventId, // Link to event
        type: "partnership",
        title: `Contract for ${event.title}`,
        description: `Automatically generated contract after event completion`,
        partyA: hostUserId,
        partyB: participantId,
        totalValue: "0", // To be negotiated
        currency: "SAR",
        status: "draft",
        terms: `This contract was automatically generated after the completion of the event: ${event.title}`,
      })
      .$returningId();

    contractIds.push(contract.id);
  }

  // Update event status
  await db
    .update(events)
    .set({ status: "completed" })
    .where(eq(events.id, eventId));

  // Notify all parties
  // TODO: Send notifications to host and participants

  return {
    success: true,
    message: "Event completed, contracts created in UPLINK3",
    contractIds,
  };
}

/**
 * Notify all parties involved in a workflow transition
 */
export async function notifyAllParties(
  userIds: number[],
  title: string,
  message: string
) {
  // TODO: Implement notification system
  console.log(`[Workflow] Notifying ${userIds.length} users: ${title}`);

  return { success: true };
}

/**
 * Get workflow status for a user
 */
export async function getUserWorkflowStatus(userId: number) {
  // Get user's ideas in UPLINK1
  const ideas = await db.query.pipelineIdeas.findMany({
    where: eq(pipelineIdeas.userId, userId),
  });

  // Get user's events in UPLINK2
  const userEvents = await db.query.events.findMany({
    where: eq(events.userId, userId),
  });

  // Get user's contracts in UPLINK3
  const userContracts = await db.query.contracts.findMany({
    where: eq(contracts.partyA, userId),
  });

  return {
    uplink1: {
      totalIdeas: ideas.length,
      approvedIdeas: ideas.filter((i: any) => i.status === "approved").length,
      movedToUplink2: ideas.filter((i: any) => i.stage === "challenge_matching")
        .length,
    },
    uplink2: {
      totalEvents: userEvents.length,
      completedEvents: userEvents.filter((e: any) => e.status === "completed")
        .length,
    },
    uplink3: {
      totalContracts: userContracts.length,
      activeContracts: userContracts.filter((c: any) => c.status === "active")
        .length,
    },
  };
}

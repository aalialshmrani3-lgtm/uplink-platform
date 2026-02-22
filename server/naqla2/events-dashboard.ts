import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { events, eventRegistrations } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Get all events created by a specific user
 */
export async function getMyEvents(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const myEvents = await db
    .select()
    .from(events)
    .where(eq(events.organizerId, userId))
    .orderBy(desc(events.createdAt));

  // Get registrations count for each event
  const eventsWithCounts = await Promise.all(
    myEvents.map(async (event) => {
      const registrations = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.eventId, event.id));

      return {
        ...event,
        registrationsCount: registrations.length,
      };
    })
  );

  return eventsWithCounts;
}

/**
 * Delete an event (only if user is the organizer)
 */
export async function deleteEvent(eventId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if event exists and user is the organizer
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  if (event.organizerId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not authorized to delete this event",
    });
  }

  // Delete all registrations first
  await db.delete(eventRegistrations).where(eq(eventRegistrations.eventId, eventId));

  // Delete the event
  await db.delete(events).where(eq(events.id, eventId));

  return true;
}

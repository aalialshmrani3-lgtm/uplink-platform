import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { events, eventRegistrations } from "../../drizzle/schema";
import { eq, and, desc, or } from "drizzle-orm";

/**
 * Get all events
 */
export async function getAllEvents(filters?: {
  type?: "hackathon" | "workshop" | "conference";
  status?: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  isVirtual?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const baseQuery = db
    .select()
    .from(events);

  // Apply filters
  const conditions = [];
  
  if (filters?.type) {
    conditions.push(eq(events.type, filters.type));
  }
  
  if (filters?.status) {
    conditions.push(eq(events.status, filters.status));
  }
  
  if (filters?.isVirtual !== undefined) {
    conditions.push(eq(events.isVirtual, filters.isVirtual));
  }

  let query;
  if (conditions.length > 0) {
    query = baseQuery.where(and(...conditions)).orderBy(desc(events.startDate));
  } else {
    query = baseQuery.orderBy(desc(events.startDate));
  }

  const allEvents = await query;
  return allEvents;
}

/**
 * Get event by ID
 */
export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  // Get registrations
  const registrations = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, id));

  return {
    ...event,
    registrationsCount: registrations.length,
    registrations: registrations,
  };
}

/**
 * Create new event
 */
export async function createEvent(data: {
  userId: number;
  title: string;
  description: string;
  type: "hackathon" | "workshop" | "conference";
  location?: string;
  isVirtual?: boolean;
  startDate: Date;
  endDate: Date;
  capacity?: number;
  budget?: string;
  needSponsors?: boolean;
  needInnovators?: boolean;
  sponsorshipTiers?: any;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const [event] = await db.insert(events).values({
    userId: data.userId,
    title: data.title,
    description: data.description,
    type: data.type,
    location: data.location,
    isVirtual: data.isVirtual || false,
    startDate: data.startDate,
    endDate: data.endDate,
    capacity: data.capacity,
    budget: data.budget,
    needSponsors: data.needSponsors || false,
    needInnovators: data.needInnovators || false,
    sponsorshipTiers: data.sponsorshipTiers,
    status: "draft",
  });

  return event;
}

/**
 * Register for event
 */
export async function registerForEvent(data: {
  eventId: number;
  userId: number;
  attendeeType: "innovator" | "investor" | "sponsor" | "speaker" | "attendee";
  additionalInfo?: string;
  sponsorshipTier?: string;
  sponsorshipAmount?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Check if event exists
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.id, data.eventId))
    .limit(1);

  if (!event) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Event not found",
    });
  }

  // Check if already registered
  const [existing] = await db
    .select()
    .from(eventRegistrations)
    .where(and(
      eq(eventRegistrations.eventId, data.eventId),
      eq(eventRegistrations.userId, data.userId)
    ))
    .limit(1);

  if (existing) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Already registered for this event",
    });
  }

  // Check capacity
  if (event.capacity) {
    const registrationsCount = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, data.eventId));

    if (registrationsCount.length >= event.capacity) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Event is full",
      });
    }
  }

  // Create registration
  const [registration] = await db.insert(eventRegistrations).values({
    eventId: data.eventId,
    userId: data.userId,
    attendeeType: data.attendeeType,
    additionalInfo: data.additionalInfo,
    sponsorshipTier: data.sponsorshipTier,
    sponsorshipAmount: data.sponsorshipAmount,
    status: "pending",
  });

  // Update registrations count
  await db
    .update(events)
    .set({
      registrations: (event.registrations || 0) + 1,
    })
    .where(eq(events.id, data.eventId));

  return registration;
}

/**
 * Update event status
 */
export async function updateEventStatus(id: number, status: "draft" | "published" | "ongoing" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(events)
    .set({ status })
    .where(eq(events.id, id));

  return { success: true };
}

/**
 * Get events by type (workshops only)
 */
export async function getWorkshops(filters?: {
  status?: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  isVirtual?: boolean;
}) {
  return getAllEvents({
    type: "workshop",
    ...filters,
  });
}

/**
 * Get events by type (conferences only)
 */
export async function getConferences(filters?: {
  status?: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  isVirtual?: boolean;
}) {
  return getAllEvents({
    type: "conference",
    ...filters,
  });
}

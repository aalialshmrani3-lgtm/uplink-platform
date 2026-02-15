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
    conditions.push(eq(events.eventType, filters.type));
  }
  
  if (filters?.status) {
    conditions.push(eq(events.status, filters.status));
  }
  
  // isVirtual filter removed - use deliveryMode instead

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
    organizerId: data.userId,
    title: data.title,
    description: data.description,
    eventType: data.type,
    deliveryMode: data.isVirtual ? 'online' : 'in_person',
    location: data.location,
    startDate: data.startDate.toISOString(),
    endDate: data.endDate.toISOString(),
    capacity: data.capacity,
    sponsorPackages: data.sponsorshipTiers ? JSON.stringify(data.sponsorshipTiers) : undefined,
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
    registrationType: data.attendeeType === 'innovator' || data.attendeeType === 'investor' ? 'attendee' : data.attendeeType,
    specialRequirements: data.additionalInfo,
    status: "pending",
  });

  // Note: registrations count is tracked separately in eventRegistrations table

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

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { events, eventRegistrations } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get all hackathons
 */
export async function getAllHackathons(filters?: {
  status?: "draft" | "published" | "ongoing" | "completed" | "cancelled";
  isVirtual?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const conditions = [eq(events.eventType, "hackathon")];
  
  if (filters?.status) {
    conditions.push(eq(events.status, filters.status));
  }
  
  // isVirtual filter removed - use deliveryMode instead

  const hackathons = await db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(desc(events.startDate));
    
  return hackathons;
}

/**
 * Get hackathon by ID
 */
export async function getHackathonById(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [hackathon] = await db
    .select()
    .from(events)
    .where(and(
      eq(events.id, id),
      eq(events.eventType, "hackathon")
    ))
    .limit(1);

  if (!hackathon) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Hackathon not found",
    });
  }

  // Get registrations count
  const registrations = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, id));

  return {
    ...hackathon,
    registrationsCount: registrations.length,
    registrations: registrations,
  };
}

/**
 * Create new hackathon
 */
export async function createHackathon(data: {
  userId: number;
  title: string;
  description: string;
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

  const [hackathon] = await db.insert(events).values({
    organizerId: data.userId,
    title: data.title,
    description: data.description,
    eventType: "hackathon",
    deliveryMode: data.isVirtual ? 'online' : 'in_person',
    location: data.location,
    startDate: typeof data.startDate === 'string' ? data.startDate : data.startDate.toISOString(),
    endDate: typeof data.endDate === 'string' ? data.endDate : data.endDate.toISOString(),
    capacity: data.capacity,
    sponsorPackages: data.sponsorshipTiers ? JSON.stringify(data.sponsorshipTiers) : undefined,
    status: "draft",
  });

  return hackathon;
}

/**
 * Register for hackathon
 */
export async function registerForHackathon(data: {
  eventId: number;
  userId: number;
  attendeeType: "innovator" | "investor" | "sponsor" | "speaker" | "attendee";
  additionalInfo?: string;
  sponsorshipTier?: string;
  sponsorshipAmount?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Check if hackathon exists
  const [hackathon] = await db
    .select()
    .from(events)
    .where(and(
      eq(events.id, data.eventId),
      eq(events.eventType, "hackathon")
    ))
    .limit(1);

  if (!hackathon) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Hackathon not found",
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
      message: "Already registered for this hackathon",
    });
  }

  // Check capacity
  if (hackathon.capacity) {
    const registrationsCount = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, data.eventId));

    if (registrationsCount.length >= hackathon.capacity) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Hackathon is full",
      });
    }
  }

  // Create registration
  // Create registration
  const [registration] = await db.insert(eventRegistrations).values({
    eventId: data.eventId, // Will be mapped to event_id by Drizzle
    userId: data.userId, // Will be mapped to user_id by Drizzle
    registrationType: data.attendeeType === 'innovator' || data.attendeeType === 'investor' ? 'attendee' : data.attendeeType,
    specialRequirements: data.additionalInfo,
    status: "pending",
  });

  // Note: registrations count is tracked separately in eventRegistrations table
  // No need to update events table
  
  return registration;
}

/**
 * Update hackathon status
 */
export async function updateHackathonStatus(id: number, status: "draft" | "published" | "ongoing" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  await db
    .update(events)
    .set({ status })
    .where(and(
      eq(events.id, id),
      eq(events.eventType, "hackathon")
    ));

  return { success: true };
}

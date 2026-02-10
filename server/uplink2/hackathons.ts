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
  
  const conditions = [eq(events.type, "hackathon")];
  
  if (filters?.status) {
    conditions.push(eq(events.status, filters.status));
  }
  
  if (filters?.isVirtual !== undefined) {
    conditions.push(eq(events.isVirtual, filters.isVirtual));
  }

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
      eq(events.type, "hackathon")
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
    userId: data.userId,
    title: data.title,
    description: data.description,
    type: "hackathon",
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
      eq(events.type, "hackathon")
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
      registrations: (hackathon.registrations || 0) + 1,
    })
    .where(eq(events.id, data.eventId));

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
      eq(events.type, "hackathon")
    ));

  return { success: true };
}

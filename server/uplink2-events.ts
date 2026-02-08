// Added for Flowchart Match - UPLINK2 Events Module
import { z } from "zod";
import * as db from "./db";

export const eventInputSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  eventType: z.enum(['conference', 'workshop', 'networking', 'demo_day', 'pitch_event']),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  maxAttendees: z.number().optional(),
  registrationDeadline: z.string().optional(),
  agenda: z.string().optional(),
  speakers: z.array(z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string().optional(),
  })).optional(),
  sponsorshipTiers: z.array(z.object({
    name: z.string(),
    price: z.number(),
    benefits: z.array(z.string()),
  })).optional(),
});

export const eventRegistrationSchema = z.object({
  eventId: z.number(),
  attendeeType: z.enum(['innovator', 'investor', 'sponsor', 'speaker', 'attendee']),
  additionalInfo: z.string().optional(),
});

export const sponsorRequestSchema = z.object({
  eventId: z.number(),
  companyName: z.string(),
  tierName: z.string(),
  contactPerson: z.string(),
  email: z.string().email(),
  phone: z.string(),
  message: z.string().optional(),
});

export type EventInput = z.infer<typeof eventInputSchema>;
export type EventRegistration = z.infer<typeof eventRegistrationSchema>;
export type SponsorRequest = z.infer<typeof sponsorRequestSchema>;

/**
 * Create a new event
 */
export async function createEvent(data: EventInput, organizerId: number) {
  const eventId = await db.createEvent({
    ...data,
    organizerId,
    status: 'upcoming',
    createdAt: new Date(),
  });
  
  return { id: eventId, success: true };
}

/**
 * Get all events with filters
 */
export async function getAllEvents(filters?: {
  status?: 'upcoming' | 'ongoing' | 'completed';
  eventType?: string;
  isOnline?: boolean;
}) {
  return await db.getAllEvents(filters);
}

/**
 * Get event by ID
 */
export async function getEventById(id: number) {
  return await db.getEventById(id);
}

/**
 * Register for an event
 */
export async function registerForEvent(data: EventRegistration, userId: number) {
  // Check if event exists
  const event = await db.getEventById(data.eventId);
  if (!event) {
    throw new Error('Event not found');
  }
  
  // Check if registration is still open
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline);
    if (new Date() > deadline) {
      throw new Error('Registration deadline has passed');
    }
  }
  
  // Check if already registered
  const existingRegistration = await db.getEventRegistration(data.eventId, userId);
  if (existingRegistration) {
    throw new Error('Already registered for this event');
  }
  
  // Check attendee limit
  if (event.maxAttendees) {
    const currentAttendees = await db.getEventAttendees(data.eventId);
    if (currentAttendees.length >= event.maxAttendees) {
      throw new Error('Event has reached maximum capacity');
    }
  }
  
  const registrationId = await db.createEventRegistration({
    ...data,
    userId,
    status: 'confirmed',
    registeredAt: new Date(),
  });
  
  return { id: registrationId, success: true };
}

/**
 * Submit sponsor request
 */
export async function submitSponsorRequest(data: SponsorRequest, userId: number) {
  const requestId = await db.createSponsorRequest({
    ...data,
    userId,
    status: 'pending',
    createdAt: new Date(),
  });
  
  return { id: requestId, success: true };
}

/**
 * Get event attendees
 */
export async function getEventAttendees(eventId: number) {
  return await db.getEventAttendees(eventId);
}

/**
 * Get user's event registrations
 */
export async function getUserEvents(userId: number) {
  return await db.getUserEvents(userId);
}

/**
 * Update event status
 */
export async function updateEventStatus(
  eventId: number,
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
) {
  await db.updateEventStatus(eventId, status);
  return { success: true };
}

/**
 * Search for sponsors (for event organizers)
 */
export async function searchSponsors(filters: {
  industry?: string;
  minBudget?: number;
  location?: string;
}) {
  return await db.searchSponsors(filters);
}

/**
 * Search for innovators (for event organizers)
 */
export async function searchInnovators(filters: {
  category?: string;
  stage?: string;
  location?: string;
}) {
  return await db.searchInnovators(filters);
}

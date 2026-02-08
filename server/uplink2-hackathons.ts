// Added for Flowchart Match - UPLINK2 Hackathons Module
import { z } from "zod";
import * as db from "./db";

export const hackathonInputSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  isOnline: z.boolean().default(false),
  maxTeams: z.number().optional(),
  prizes: z.string().optional(),
  requirements: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const teamInputSchema = z.object({
  hackathonId: z.number(),
  teamName: z.string().min(2),
  members: z.array(z.object({
    userId: z.number(),
    role: z.string(),
  })),
  projectDescription: z.string().optional(),
});

export type HackathonInput = z.infer<typeof hackathonInputSchema>;
export type TeamInput = z.infer<typeof teamInputSchema>;

/**
 * Create a new hackathon
 */
export async function createHackathon(data: HackathonInput, organizerId: number) {
  const hackathonId = await db.createHackathon({
    ...data,
    organizerId,
    status: 'upcoming',
    createdAt: new Date(),
  });
  
  return { id: hackathonId, success: true };
}

/**
 * Get all hackathons with filters
 */
export async function getAllHackathons(filters?: {
  status?: 'upcoming' | 'ongoing' | 'completed';
  isOnline?: boolean;
}) {
  return await db.getAllHackathons(filters);
}

/**
 * Get hackathon by ID
 */
export async function getHackathonById(id: number) {
  return await db.getHackathonById(id);
}

/**
 * Register a team for hackathon
 */
export async function registerTeam(data: TeamInput, leaderId: number) {
  // Check if hackathon exists and is accepting registrations
  const hackathon = await db.getHackathonById(data.hackathonId);
  if (!hackathon) {
    throw new Error('Hackathon not found');
  }
  
  if (hackathon.status !== 'upcoming') {
    throw new Error('Hackathon is not accepting registrations');
  }
  
  // Check team limit
  if (hackathon.maxTeams) {
    const currentTeams = await db.getHackathonTeams(data.hackathonId);
    if (currentTeams.length >= hackathon.maxTeams) {
      throw new Error('Hackathon has reached maximum team capacity');
    }
  }
  
  const teamId = await db.createHackathonTeam({
    ...data,
    leaderId,
    status: 'registered',
    createdAt: new Date(),
  });
  
  return { id: teamId, success: true };
}

/**
 * Get teams for a hackathon
 */
export async function getHackathonTeams(hackathonId: number) {
  return await db.getHackathonTeams(hackathonId);
}

/**
 * Update hackathon status
 */
export async function updateHackathonStatus(
  hackathonId: number,
  status: 'upcoming' | 'ongoing' | 'completed'
) {
  await db.updateHackathonStatus(hackathonId, status);
  return { success: true };
}

/**
 * Submit hackathon project
 */
export async function submitHackathonProject(
  teamId: number,
  projectData: {
    title: string;
    description: string;
    demoUrl?: string;
    repoUrl?: string;
    presentationUrl?: string;
  }
) {
  await db.updateHackathonTeam(teamId, {
    ...projectData,
    status: 'submitted',
    submittedAt: new Date(),
  });
  
  return { success: true };
}

/**
 * Get user's hackathon participations
 */
export async function getUserHackathons(userId: number) {
  return await db.getUserHackathons(userId);
}

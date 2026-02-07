/**
 * UPLINK2: Hackathons & Events Module
 * 
 * This module manages hackathons, workshops, conferences, and competitions.
 * It handles event creation, registration, participant management, and check-ins.
 */

import { db } from "./db";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface HackathonInput {
  organizerId: number;
  organizerName: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  theme?: string;
  type: "hackathon" | "workshop" | "conference" | "competition" | "bootcamp";
  format: "online" | "onsite" | "hybrid";
  country?: string;
  city?: string;
  venue?: string;
  address?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxParticipants?: number;
  totalPrizePool?: number;
  currency?: string;
  prizes?: Record<string, any>[];
  eligibilityCriteria?: Record<string, any>;
  requiredSkills?: string[];
  sponsors?: Record<string, any>[];
  agenda?: Record<string, any>[];
  documents?: string[];
  images?: string[];
}

export interface RegistrationInput {
  hackathonId: number;
  userId: number;
  teamName?: string;
  teamMembers?: Record<string, any>[];
  teamSize?: number;
  motivation?: string;
  skills?: string[];
  experience?: string;
}

// ============================================
// HACKATHON MANAGEMENT FUNCTIONS
// ============================================

/**
 * Create a new hackathon/event
 */
export async function createHackathon(input: HackathonInput) {
  try {
    const hackathon = await db.createHackathon({
      ...input,
      status: "draft",
      currentParticipants: 0,
      views: 0,
    });

    return {
      success: true,
      hackathonId: hackathon.id,
      message: "تم إنشاء الفعالية بنجاح",
    };
  } catch (error) {
    console.error("Error creating hackathon:", error);
    throw new Error("فشل في إنشاء الفعالية");
  }
}

/**
 * Publish a hackathon (open for registration)
 */
export async function publishHackathon(hackathonId: number, organizerId: number) {
  try {
    const hackathon = await db.getHackathonById(hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    if (hackathon.organizerId !== organizerId) {
      throw new Error("غير مصرح لك بنشر هذه الفعالية");
    }

    if (hackathon.status !== "draft") {
      throw new Error("الفعالية منشورة بالفعل");
    }

    await db.updateHackathon(hackathonId, {
      status: "registration_open",
      publishedAt: new Date(),
    });

    return {
      success: true,
      message: "تم نشر الفعالية وفتح باب التسجيل",
    };
  } catch (error) {
    console.error("Error publishing hackathon:", error);
    throw error;
  }
}

/**
 * Get active hackathons (open for registration)
 */
export async function getActiveHackathons(filters?: {
  type?: string;
  format?: string;
  country?: string;
  city?: string;
  theme?: string;
}) {
  try {
    const hackathons = await db.getActiveHackathons(filters);
    return hackathons;
  } catch (error) {
    console.error("Error fetching active hackathons:", error);
    throw new Error("فشل في جلب الفعاليات النشطة");
  }
}

/**
 * Get hackathon details
 */
export async function getHackathonDetails(hackathonId: number) {
  try {
    const hackathon = await db.getHackathonById(hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    // Increment views
    await db.incrementHackathonViews(hackathonId);

    // Get registrations count
    const registrationsCount = await db.getHackathonRegistrationsCount(hackathonId);

    return {
      ...hackathon,
      registrationsCount,
      spotsRemaining: hackathon.maxParticipants 
        ? hackathon.maxParticipants - hackathon.currentParticipants 
        : null,
    };
  } catch (error) {
    console.error("Error fetching hackathon details:", error);
    throw error;
  }
}

// ============================================
// REGISTRATION MANAGEMENT FUNCTIONS
// ============================================

/**
 * Register for a hackathon
 */
export async function registerForHackathon(input: RegistrationInput) {
  try {
    const hackathon = await db.getHackathonById(input.hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    if (hackathon.status !== "registration_open") {
      throw new Error("التسجيل غير مفتوح لهذه الفعالية");
    }

    if (new Date() > new Date(hackathon.registrationDeadline)) {
      throw new Error("انتهى موعد التسجيل لهذه الفعالية");
    }

    // Check if already registered
    const existingRegistration = await db.getUserHackathonRegistration(
      input.userId,
      input.hackathonId
    );

    if (existingRegistration) {
      throw new Error("أنت مسجل بالفعل في هذه الفعالية");
    }

    // Check capacity
    if (hackathon.maxParticipants && 
        hackathon.currentParticipants >= hackathon.maxParticipants) {
      // Add to waitlist
      const registration = await db.createHackathonRegistration({
        ...input,
        status: "waitlisted",
      });

      return {
        success: true,
        registrationId: registration.id,
        status: "waitlisted",
        message: "تم إضافتك إلى قائمة الانتظار",
      };
    }

    // Register successfully
    const registration = await db.createHackathonRegistration({
      ...input,
      status: "approved",
    });

    // Increment participants count
    await db.incrementHackathonParticipants(input.hackathonId);

    return {
      success: true,
      registrationId: registration.id,
      status: "approved",
      message: "تم التسجيل بنجاح",
    };
  } catch (error) {
    console.error("Error registering for hackathon:", error);
    throw error;
  }
}

/**
 * Cancel registration
 */
export async function cancelRegistration(registrationId: number, userId: number) {
  try {
    const registration = await db.getHackathonRegistrationById(registrationId);
    
    if (!registration) {
      throw new Error("التسجيل غير موجود");
    }

    if (registration.userId !== userId) {
      throw new Error("غير مصرح لك بإلغاء هذا التسجيل");
    }

    if (registration.status === "cancelled") {
      throw new Error("التسجيل ملغى بالفعل");
    }

    await db.updateHackathonRegistration(registrationId, {
      status: "cancelled",
    });

    // Decrement participants count if was approved
    if (registration.status === "approved") {
      await db.decrementHackathonParticipants(registration.hackathonId);
      
      // Promote first waitlisted participant
      await promoteFromWaitlist(registration.hackathonId);
    }

    return {
      success: true,
      message: "تم إلغاء التسجيل بنجاح",
    };
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error;
  }
}

/**
 * Promote first waitlisted participant to approved
 */
async function promoteFromWaitlist(hackathonId: number) {
  try {
    const waitlisted = await db.getWaitlistedParticipants(hackathonId, 1);
    
    if (waitlisted.length > 0) {
      await db.updateHackathonRegistration(waitlisted[0].id, {
        status: "approved",
      });

      await db.incrementHackathonParticipants(hackathonId);

      // TODO: Send notification to promoted participant
    }
  } catch (error) {
    console.error("Error promoting from waitlist:", error);
  }
}

/**
 * Get user's registrations
 */
export async function getUserRegistrations(userId: number) {
  try {
    const registrations = await db.getUserHackathonRegistrations(userId);
    return registrations;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    throw new Error("فشل في جلب التسجيلات");
  }
}

/**
 * Get hackathon participants (for organizers)
 */
export async function getHackathonParticipants(
  hackathonId: number,
  organizerId: number,
  filters?: {
    status?: string;
    checkedIn?: boolean;
  }
) {
  try {
    const hackathon = await db.getHackathonById(hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    if (hackathon.organizerId !== organizerId) {
      throw new Error("غير مصرح لك بعرض المشاركين");
    }

    const participants = await db.getHackathonParticipants(hackathonId, filters);
    return participants;
  } catch (error) {
    console.error("Error fetching hackathon participants:", error);
    throw error;
  }
}

// ============================================
// CHECK-IN MANAGEMENT
// ============================================

/**
 * Check in a participant
 */
export async function checkInParticipant(
  registrationId: number,
  organizerId: number
) {
  try {
    const registration = await db.getHackathonRegistrationById(registrationId);
    
    if (!registration) {
      throw new Error("التسجيل غير موجود");
    }

    const hackathon = await db.getHackathonById(registration.hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    if (hackathon.organizerId !== organizerId) {
      throw new Error("غير مصرح لك بتسجيل الحضور");
    }

    if (registration.status !== "approved") {
      throw new Error("التسجيل غير مؤكد");
    }

    if (registration.checkedIn) {
      throw new Error("المشارك مسجل حضوره بالفعل");
    }

    await db.updateHackathonRegistration(registrationId, {
      checkedIn: true,
      checkInTime: new Date(),
    });

    return {
      success: true,
      message: "تم تسجيل الحضور بنجاح",
    };
  } catch (error) {
    console.error("Error checking in participant:", error);
    throw error;
  }
}

/**
 * Get check-in statistics
 */
export async function getCheckInStats(hackathonId: number, organizerId: number) {
  try {
    const hackathon = await db.getHackathonById(hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    if (hackathon.organizerId !== organizerId) {
      throw new Error("غير مصرح لك بعرض الإحصائيات");
    }

    const stats = await db.getHackathonCheckInStats(hackathonId);

    return {
      hackathonId,
      totalRegistrations: stats.totalRegistrations,
      approvedRegistrations: stats.approvedRegistrations,
      checkedIn: stats.checkedIn,
      checkInRate: stats.approvedRegistrations > 0 
        ? (stats.checkedIn / stats.approvedRegistrations * 100).toFixed(2) 
        : 0,
      waitlisted: stats.waitlisted,
    };
  } catch (error) {
    console.error("Error fetching check-in stats:", error);
    throw error;
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get hackathon statistics
 */
export async function getHackathonStatistics(hackathonId: number) {
  try {
    const hackathon = await db.getHackathonById(hackathonId);
    
    if (!hackathon) {
      throw new Error("الفعالية غير موجودة");
    }

    const stats = await db.getHackathonStats(hackathonId);

    return {
      hackathonId,
      totalRegistrations: stats.totalRegistrations,
      approvedParticipants: stats.approvedParticipants,
      waitlistedParticipants: stats.waitlistedParticipants,
      checkedInParticipants: stats.checkedInParticipants,
      teamCount: stats.teamCount,
      soloParticipants: stats.soloParticipants,
      views: hackathon.views,
      registrationsByDay: stats.registrationsByDay,
    };
  } catch (error) {
    console.error("Error fetching hackathon statistics:", error);
    throw new Error("فشل في جلب إحصائيات الفعالية");
  }
}

/**
 * Get upcoming hackathons for a user
 */
export async function getUpcomingHackathons(userId?: number) {
  try {
    const hackathons = await db.getUpcomingHackathons();
    
    if (userId) {
      // Mark which ones the user is registered for
      const userRegistrations = await db.getUserHackathonRegistrations(userId);
      const registeredIds = new Set(userRegistrations.map(r => r.hackathonId));
      
      return hackathons.map(h => ({
        ...h,
        isRegistered: registeredIds.has(h.id),
      }));
    }

    return hackathons;
  } catch (error) {
    console.error("Error fetching upcoming hackathons:", error);
    throw new Error("فشل في جلب الفعاليات القادمة");
  }
}

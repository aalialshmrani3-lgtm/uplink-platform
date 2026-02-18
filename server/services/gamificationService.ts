import { getDb } from "../db";
import { userPoints, userBadges, badges, userLevels } from "../../drizzle/schema";
import { eq, desc, sql } from "drizzle-orm";

// ==================== Points System ====================

export interface ActivityPoints {
  idea_submitted: 50;
  idea_approved: 100;
  comment_added: 10;
  vote_cast: 5;
  challenge_created: 75;
  challenge_completed: 150;
  collaboration: 30;
  badge_earned: 20;
  referral: 40;
}

export const ACTIVITY_POINTS: ActivityPoints = {
  idea_submitted: 50,
  idea_approved: 100,
  comment_added: 10,
  vote_cast: 5,
  challenge_created: 75,
  challenge_completed: 150,
  collaboration: 30,
  badge_earned: 20,
  referral: 40,
};

export const LEVEL_THRESHOLDS = [
  { level: 1, points: 0 },
  { level: 2, points: 100 },
  { level: 3, points: 250 },
  { level: 4, points: 500 },
  { level: 5, points: 1000 },
  { level: 6, points: 2000 },
  { level: 7, points: 4000 },
  { level: 8, points: 7000 },
  { level: 9, points: 12000 },
  { level: 10, points: 20000 },
];

/**
 * Award points to a user for an activity
 */
export async function awardPoints(
  userId: number,
  activityType: keyof ActivityPoints,
  activityId?: number,
  description?: string
) {
  const pointsEarned = ACTIVITY_POINTS[activityType];

  // Insert points record
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userPoints).values({
    userId,
    activityType,
    activityId,
    pointsEarned,
    description,
  });

  // Update user level
  await updateUserLevel(userId);

  // Check for badge eligibility
  await checkBadgeEligibility(userId);

  return pointsEarned;
}

/**
 * Get user's total points
 */
export async function getUserTotalPoints(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db
    .select({ total: sql<number>`SUM(${userPoints.pointsEarned})` })
    .from(userPoints)
    .where(eq(userPoints.userId, userId));

  return result[0]?.total || 0;
}

/**
 * Update user's level based on total points
 */
export async function updateUserLevel(userId: number) {
  const totalPoints = await getUserTotalPoints(userId);

  // Find current level
  let currentLevel = 1;
  let nextLevelPoints = 100;
  let currentLevelPoints = 0;

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].points) {
      currentLevel = LEVEL_THRESHOLDS[i].level;
      currentLevelPoints = totalPoints - LEVEL_THRESHOLDS[i].points;

      if (i < LEVEL_THRESHOLDS.length - 1) {
        nextLevelPoints = LEVEL_THRESHOLDS[i + 1].points - totalPoints;
      } else {
        nextLevelPoints = 0; // Max level
      }
      break;
    }
  }

  // Define perks for each level
  const perks = getLevelPerks(currentLevel);

  // Upsert user level
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db
    .select()
    .from(userLevels)
    .where(eq(userLevels.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userLevels)
      .set({
        level: currentLevel,
        totalPoints,
        currentLevelPoints,
        nextLevelPoints,
        perks,
      })
      .where(eq(userLevels.userId, userId));
  } else {
    await db.insert(userLevels).values({
      userId,
      level: currentLevel,
      totalPoints,
      currentLevelPoints,
      nextLevelPoints,
      perks,
    });
  }

  return { currentLevel, totalPoints, currentLevelPoints, nextLevelPoints, perks };
}

/**
 * Get perks for a specific level
 */
function getLevelPerks(level: number): any {
  const perksMap: Record<number, any> = {
    1: { title: "مبتدئ", titleEn: "Beginner", features: [] },
    2: { title: "متحمس", titleEn: "Enthusiast", features: ["profile_badge"] },
    3: { title: "مساهم", titleEn: "Contributor", features: ["profile_badge", "priority_support"] },
    4: { title: "خبير", titleEn: "Expert", features: ["profile_badge", "priority_support", "early_access"] },
    5: {
      title: "مبتكر",
      titleEn: "Innovator",
      features: ["profile_badge", "priority_support", "early_access", "exclusive_events"],
    },
    6: {
      title: "قائد",
      titleEn: "Leader",
      features: ["profile_badge", "priority_support", "early_access", "exclusive_events", "mentor_access"],
    },
    7: {
      title: "رائد",
      titleEn: "Pioneer",
      features: [
        "profile_badge",
        "priority_support",
        "early_access",
        "exclusive_events",
        "mentor_access",
        "custom_profile",
      ],
    },
    8: {
      title: "أسطورة",
      titleEn: "Legend",
      features: [
        "profile_badge",
        "priority_support",
        "early_access",
        "exclusive_events",
        "mentor_access",
        "custom_profile",
        "vip_lounge",
      ],
    },
    9: {
      title: "بطل",
      titleEn: "Champion",
      features: [
        "profile_badge",
        "priority_support",
        "early_access",
        "exclusive_events",
        "mentor_access",
        "custom_profile",
        "vip_lounge",
        "featured_profile",
      ],
    },
    10: {
      title: "أيقونة",
      titleEn: "Icon",
      features: [
        "profile_badge",
        "priority_support",
        "early_access",
        "exclusive_events",
        "mentor_access",
        "custom_profile",
        "vip_lounge",
        "featured_profile",
        "lifetime_benefits",
      ],
    },
  };

  return perksMap[level] || perksMap[1];
}

// ==================== Badges System ====================

/**
 * Check if user is eligible for any badges
 */
export async function checkBadgeEligibility(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  const allBadges = await db.select().from(badges);
  const userBadgesList = await db.select().from(userBadges).where(eq(userBadges.userId, userId));
  const earnedBadgeIds = userBadgesList.map((ub: any) => ub.badgeId);

  for (const badge of allBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue; // Already earned

    const isEligible = await checkBadgeRequirement(userId, badge);
    if (isEligible) {
      await awardBadge(userId, badge.id);
    }
  }
}

/**
 * Check if user meets badge requirements
 */
async function checkBadgeRequirement(userId: number, badge: any): Promise<boolean> {
  const requirement = badge.requirement as any;

  if (!requirement) return false;

  // Check points requirement
  if (requirement.minPoints) {
    const totalPoints = await getUserTotalPoints(userId);
    if (totalPoints < requirement.minPoints) return false;
  }

  // Check activity count requirement
  if (requirement.activityType && requirement.activityCount) {
    const db = await getDb();
    if (!db) return false;
    
    const activityCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(userPoints)
      .where(sql`${userPoints.userId} = ${userId} AND ${userPoints.activityType} = ${requirement.activityType}`);

    if ((activityCount[0]?.count || 0) < requirement.activityCount) return false;
  }

  return true;
}

/**
 * Award a badge to a user
 */
export async function awardBadge(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(userBadges).values({
    userId,
    badgeId,
  });

  // Award points for earning a badge
  await awardPoints(userId, "badge_earned", badgeId, `Earned badge #${badgeId}`);
}

/**
 * Get user's badges
 */
export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: userBadges.id,
      badgeId: userBadges.badgeId,
      earnedAt: userBadges.earnedAt,
      name: badges.name,
      nameAr: badges.nameAr,
      description: badges.description,
      descriptionAr: badges.descriptionAr,
      icon: badges.icon,
      category: badges.category,
      rarity: badges.rarity,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId))
    .orderBy(desc(userBadges.earnedAt));
}

// ==================== Leaderboard ====================

/**
 * Get leaderboard (top users by points)
 */
export async function getLeaderboard(period: "weekly" | "monthly" | "all_time" = "all_time", limit: number = 10) {
  // Calculate date filter
  let dateFilter = sql`1=1`;
  if (period === "weekly") {
    dateFilter = sql`${userPoints.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
  } else if (period === "monthly") {
    dateFilter = sql`${userPoints.createdAt} >= DATE_SUB(NOW(), INTERVAL 30 DAY)`;
  }

  const db = await getDb();
  if (!db) return [];
  
  const leaderboard = await db
    .select({
      userId: userPoints.userId,
      totalPoints: sql<number>`SUM(${userPoints.pointsEarned})`,
    })
    .from(userPoints)
    .where(dateFilter)
    .groupBy(userPoints.userId)
    .orderBy(desc(sql`SUM(${userPoints.pointsEarned})`))
    .limit(limit);

  return leaderboard;
}

/**
 * Get user's rank
 */
export async function getUserRank(userId: number, period: "weekly" | "monthly" | "all_time" = "all_time") {
  const leaderboard = await getLeaderboard(period, 1000); // Get top 1000
  const rank = leaderboard.findIndex((entry: any) => entry.userId === userId);
  return rank === -1 ? null : rank + 1;
}

import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  projects, InsertProject, Project,
  ipRegistrations, InsertIPRegistration, IPRegistration,
  evaluations, InsertEvaluation, Evaluation,
  contracts, InsertContract, Contract,
  escrowAccounts, InsertEscrowAccount, EscrowAccount,
  escrowTransactions, InsertEscrowTransaction,
  courses, InsertCourse, Course,
  enrollments, InsertEnrollment, Enrollment,
  eliteMemberships, InsertEliteMembership, EliteMembership,
  apiKeys, InsertApiKey, ApiKey,
  apiUsage, InsertApiUsage,
  challenges, InsertChallenge, Challenge,
  ambassadors, InsertAmbassador, Ambassador,
  innovationHubs, InsertInnovationHub, InnovationHub,
  notifications, InsertNotification, Notification,
  analytics, InsertAnalytics
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================
// USER OPERATIONS
// ============================================
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "phone", "avatar", "organizationName", "organizationType", "country", "city", "bio", "website", "linkedIn"] as const;
    
    textFields.forEach(field => {
      const value = user[field];
      if (value !== undefined) { values[field] = value ?? null; updateSet[field] = value ?? null; }
    });

    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getAllUsers(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit);
}

// ============================================
// PROJECT OPERATIONS
// ============================================
export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result[0].insertId;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProjectsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
}

export async function getAllProjects(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).orderBy(desc(projects.createdAt)).limit(limit);
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) return;
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
}

export async function getProjectsByEngine(engine: 'uplink1' | 'uplink2' | 'uplink3') {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projects).where(eq(projects.engine, engine)).orderBy(desc(projects.createdAt));
}

// ============================================
// IP REGISTRATION OPERATIONS
// ============================================
export async function createIPRegistration(data: InsertIPRegistration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ipRegistrations).values(data);
  return result[0].insertId;
}

export async function getIPRegistrationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ipRegistrations).where(eq(ipRegistrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIPRegistrationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ipRegistrations).where(eq(ipRegistrations.userId, userId)).orderBy(desc(ipRegistrations.createdAt));
}

export async function updateIPRegistration(id: number, data: Partial<InsertIPRegistration>) {
  const db = await getDb();
  if (!db) return;
  await db.update(ipRegistrations).set({ ...data, updatedAt: new Date() }).where(eq(ipRegistrations.id, id));
}

// ============================================
// EVALUATION OPERATIONS
// ============================================
export async function createEvaluation(data: InsertEvaluation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(evaluations).values(data);
  return result[0].insertId;
}

export async function getEvaluationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(evaluations).where(eq(evaluations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEvaluationByProjectId(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(evaluations).where(eq(evaluations.projectId, projectId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateEvaluation(id: number, data: Partial<InsertEvaluation>) {
  const db = await getDb();
  if (!db) return;
  await db.update(evaluations).set({ ...data, updatedAt: new Date() }).where(eq(evaluations.id, id));
}

// ============================================
// CONTRACT OPERATIONS
// ============================================
export async function createContract(data: InsertContract) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contracts).values(data);
  return result[0].insertId;
}

export async function getContractById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getContractsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contracts).where(
    sql`${contracts.partyA} = ${userId} OR ${contracts.partyB} = ${userId}`
  ).orderBy(desc(contracts.createdAt));
}

export async function updateContract(id: number, data: Partial<InsertContract>) {
  const db = await getDb();
  if (!db) return;
  await db.update(contracts).set({ ...data, updatedAt: new Date() }).where(eq(contracts.id, id));
}

// ============================================
// ESCROW OPERATIONS
// ============================================
export async function createEscrowAccount(data: InsertEscrowAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(escrowAccounts).values(data);
  return result[0].insertId;
}

export async function getEscrowByContractId(contractId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(escrowAccounts).where(eq(escrowAccounts.contractId, contractId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEscrowTransaction(data: InsertEscrowTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(escrowTransactions).values(data);
}

// ============================================
// COURSE & ENROLLMENT OPERATIONS
// ============================================
export async function getAllCourses(published = true) {
  const db = await getDb();
  if (!db) return [];
  if (published) {
    return db.select().from(courses).where(eq(courses.isPublished, true)).orderBy(desc(courses.createdAt));
  }
  return db.select().from(courses).orderBy(desc(courses.createdAt));
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(data);
  return result[0].insertId;
}

export async function enrollInCourse(data: InsertEnrollment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(enrollments).values(data);
}

export async function getEnrollmentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enrollments).where(eq(enrollments.userId, userId));
}

// ============================================
// ELITE MEMBERSHIP OPERATIONS
// ============================================
export async function createEliteMembership(data: InsertEliteMembership) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(eliteMemberships).values(data);
  return result[0].insertId;
}

export async function getEliteMembershipByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(eliteMemberships).where(eq(eliteMemberships.userId, userId)).orderBy(desc(eliteMemberships.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// API KEY OPERATIONS
// ============================================
export async function createApiKey(data: InsertApiKey) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(apiKeys).values(data);
  return result[0].insertId;
}

export async function getApiKeysByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(apiKeys).where(eq(apiKeys.userId, userId)).orderBy(desc(apiKeys.createdAt));
}

export async function revokeApiKey(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(apiKeys).set({ status: 'revoked', updatedAt: new Date() }).where(eq(apiKeys.id, id));
}

// ============================================
// CHALLENGE OPERATIONS
// ============================================
export async function getAllChallenges(status?: 'open' | 'closed' | 'completed') {
  const db = await getDb();
  if (!db) return [];
  if (status) {
    return db.select().from(challenges).where(eq(challenges.status, status)).orderBy(desc(challenges.createdAt));
  }
  return db.select().from(challenges).orderBy(desc(challenges.createdAt));
}

export async function getChallengeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createChallenge(data: InsertChallenge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(challenges).values(data);
  return result[0].insertId;
}

// ============================================
// AMBASSADOR & HUB OPERATIONS
// ============================================
export async function getAllAmbassadors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ambassadors).where(eq(ambassadors.status, 'active')).orderBy(desc(ambassadors.createdAt));
}

export async function getAllInnovationHubs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(innovationHubs).where(eq(innovationHubs.status, 'active')).orderBy(desc(innovationHubs.createdAt));
}

export async function createAmbassador(data: InsertAmbassador) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ambassadors).values(data);
  return result[0].insertId;
}

export async function createInnovationHub(data: InsertInnovationHub) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(innovationHubs).values(data);
  return result[0].insertId;
}

// ============================================
// NOTIFICATION OPERATIONS
// ============================================
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(data);
}

export async function getNotificationsByUserId(userId: number, unreadOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (unreadOnly) {
    return db.select().from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false))).orderBy(desc(notifications.createdAt));
  }
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ============================================
// ANALYTICS OPERATIONS
// ============================================
export async function recordAnalytics(data: InsertAnalytics) {
  const db = await getDb();
  if (!db) return;
  await db.insert(analytics).values(data);
}

export async function getAnalytics(metric: string, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(analytics).where(
    and(eq(analytics.metric, metric), gte(analytics.date, startDate), lte(analytics.date, endDate))
  ).orderBy(analytics.date);
}

// ============================================
// DASHBOARD STATISTICS
// ============================================
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalProjects: 0, totalUsers: 0, totalContracts: 0, totalRevenue: 0, totalIP: 0, totalChallenges: 0 };
  
  const [projectCount] = await db.select({ count: sql<number>`count(*)` }).from(projects);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [contractCount] = await db.select({ count: sql<number>`count(*)` }).from(contracts);
  const [ipCount] = await db.select({ count: sql<number>`count(*)` }).from(ipRegistrations);
  const [challengeCount] = await db.select({ count: sql<number>`count(*)` }).from(challenges);
  const [revenueSum] = await db.select({ sum: sql<number>`COALESCE(SUM(totalValue), 0)` }).from(contracts).where(eq(contracts.status, 'completed'));
  
  return {
    totalProjects: projectCount?.count || 0,
    totalUsers: userCount?.count || 0,
    totalContracts: contractCount?.count || 0,
    totalRevenue: revenueSum?.sum || 0,
    totalIP: ipCount?.count || 0,
    totalChallenges: challengeCount?.count || 0
  };
}

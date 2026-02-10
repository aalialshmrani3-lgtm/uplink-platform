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
  analytics, InsertAnalytics,
  pipelineInitiatives, InsertPipelineInitiative, PipelineInitiative,
  pipelineChallenges, InsertPipelineChallenge, PipelineChallenge,
  pipelineIdeas, InsertPipelineIdea, PipelineIdea,
  pipelineClusters, InsertPipelineCluster, PipelineCluster,
  pipelineHypotheses, InsertPipelineHypothesis, PipelineHypothesis,
  pipelineExperiments, InsertPipelineExperiment, PipelineExperiment,
  pipelineVotes, InsertPipelineVote,
  pipelineTrends, InsertPipelineTrend, PipelineTrend,
  pipelineGamification, InsertPipelineGamification,
  strategicAnalyses, InsertStrategicAnalysis, StrategicAnalysis,
  userFeedback, InsertUserFeedback, UserFeedback,
  whatIfScenarios, InsertWhatIfScenario, WhatIfScenario,
  predictionAccuracy, InsertPredictionAccuracy, PredictionAccuracy,
  ideas, ideaAnalysis, classificationHistory
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

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
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


// ============================================
// PIPELINE INITIATIVE OPERATIONS
// ============================================
export async function createPipelineInitiative(data: InsertPipelineInitiative) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineInitiatives).values(data);
  return result[0].insertId;
}

export async function getPipelineInitiatives(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (userId) {
    return db.select().from(pipelineInitiatives).where(eq(pipelineInitiatives.userId, userId)).orderBy(desc(pipelineInitiatives.createdAt));
  }
  return db.select().from(pipelineInitiatives).orderBy(desc(pipelineInitiatives.createdAt));
}

export async function getPipelineInitiativeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pipelineInitiatives).where(eq(pipelineInitiatives.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePipelineInitiative(id: number, data: Partial<InsertPipelineInitiative>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineInitiatives).set({ ...data, updatedAt: new Date() }).where(eq(pipelineInitiatives.id, id));
}

export async function deletePipelineInitiative(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(pipelineInitiatives).where(eq(pipelineInitiatives.id, id));
}

// ============================================
// PIPELINE CHALLENGE OPERATIONS
// ============================================
export async function createPipelineChallenge(data: InsertPipelineChallenge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineChallenges).values(data);
  return result[0].insertId;
}

export async function getPipelineChallengesByInitiative(initiativeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineChallenges).where(eq(pipelineChallenges.initiativeId, initiativeId)).orderBy(desc(pipelineChallenges.createdAt));
}

export async function getPipelineChallengeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pipelineChallenges).where(eq(pipelineChallenges.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePipelineChallenge(id: number, data: Partial<InsertPipelineChallenge>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineChallenges).set({ ...data, updatedAt: new Date() }).where(eq(pipelineChallenges.id, id));
}

// ============================================
// PIPELINE IDEA OPERATIONS
// ============================================
export async function createPipelineIdea(data: InsertPipelineIdea) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineIdeas).values(data);
  // Update challenge ideas count
  await db.update(pipelineChallenges).set({ 
    ideasCount: sql`${pipelineChallenges.ideasCount} + 1`,
    updatedAt: new Date() 
  }).where(eq(pipelineChallenges.id, data.challengeId));
  return result[0].insertId;
}

export async function getPipelineIdeasByChallenge(challengeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineIdeas).where(eq(pipelineIdeas.challengeId, challengeId)).orderBy(desc(pipelineIdeas.votes));
}

export async function getPipelineIdeaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pipelineIdeas).where(eq(pipelineIdeas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePipelineIdea(id: number, data: Partial<InsertPipelineIdea>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineIdeas).set({ ...data, updatedAt: new Date() }).where(eq(pipelineIdeas.id, id));
}

export async function voteOnIdea(ideaId: number, userId: number, voteType: 'upvote' | 'downvote') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if user already voted
  const existing = await db.select().from(pipelineVotes).where(and(eq(pipelineVotes.ideaId, ideaId), eq(pipelineVotes.userId, userId))).limit(1);
  
  if (existing.length > 0) {
    // Update existing vote
    await db.update(pipelineVotes).set({ voteType }).where(eq(pipelineVotes.id, existing[0].id));
  } else {
    // Create new vote
    await db.insert(pipelineVotes).values({ ideaId, userId, voteType });
  }
  
  // Recalculate votes
  const [upvotes] = await db.select({ count: sql<number>`count(*)` }).from(pipelineVotes).where(and(eq(pipelineVotes.ideaId, ideaId), eq(pipelineVotes.voteType, 'upvote')));
  const [downvotes] = await db.select({ count: sql<number>`count(*)` }).from(pipelineVotes).where(and(eq(pipelineVotes.ideaId, ideaId), eq(pipelineVotes.voteType, 'downvote')));
  
  const totalVotes = (upvotes?.count || 0) - (downvotes?.count || 0);
  await db.update(pipelineIdeas).set({ votes: totalVotes, updatedAt: new Date() }).where(eq(pipelineIdeas.id, ideaId));
  
  return totalVotes;
}

// ============================================
// PIPELINE CLUSTER OPERATIONS
// ============================================
export async function createPipelineCluster(data: InsertPipelineCluster) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineClusters).values(data);
  return result[0].insertId;
}

export async function getPipelineClustersByInitiative(initiativeId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineClusters).where(eq(pipelineClusters.initiativeId, initiativeId)).orderBy(desc(pipelineClusters.createdAt));
}

export async function assignIdeaToCluster(ideaId: number, clusterId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineIdeas).set({ clusterId, updatedAt: new Date() }).where(eq(pipelineIdeas.id, ideaId));
  // Update cluster ideas count
  const [count] = await db.select({ count: sql<number>`count(*)` }).from(pipelineIdeas).where(eq(pipelineIdeas.clusterId, clusterId));
  await db.update(pipelineClusters).set({ ideasCount: count?.count || 0, updatedAt: new Date() }).where(eq(pipelineClusters.id, clusterId));
}

// ============================================
// PIPELINE HYPOTHESIS OPERATIONS
// ============================================
export async function createPipelineHypothesis(data: InsertPipelineHypothesis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineHypotheses).values(data);
  return result[0].insertId;
}

export async function getPipelineHypothesesByIdea(ideaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineHypotheses).where(eq(pipelineHypotheses.ideaId, ideaId)).orderBy(desc(pipelineHypotheses.createdAt));
}

export async function updatePipelineHypothesis(id: number, data: Partial<InsertPipelineHypothesis>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineHypotheses).set({ ...data, updatedAt: new Date() }).where(eq(pipelineHypotheses.id, id));
}

// ============================================
// PIPELINE EXPERIMENT OPERATIONS
// ============================================
export async function createPipelineExperiment(data: InsertPipelineExperiment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineExperiments).values(data);
  return result[0].insertId;
}

export async function getPipelineExperimentsByHypothesis(hypothesisId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineExperiments).where(eq(pipelineExperiments.hypothesisId, hypothesisId)).orderBy(desc(pipelineExperiments.createdAt));
}

export async function updatePipelineExperiment(id: number, data: Partial<InsertPipelineExperiment>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineExperiments).set({ ...data, updatedAt: new Date() }).where(eq(pipelineExperiments.id, id));
}

// ============================================
// PIPELINE TRENDS OPERATIONS
// ============================================
export async function createPipelineTrend(data: InsertPipelineTrend) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pipelineTrends).values(data);
  return result[0].insertId;
}

export async function getPipelineTrends() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineTrends).orderBy(desc(pipelineTrends.relevanceScore));
}

export async function updatePipelineTrend(id: number, data: Partial<InsertPipelineTrend>) {
  const db = await getDb();
  if (!db) return;
  await db.update(pipelineTrends).set({ ...data, updatedAt: new Date() }).where(eq(pipelineTrends.id, id));
}

// ============================================
// PIPELINE GAMIFICATION OPERATIONS
// ============================================
export async function getOrCreateGamification(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(pipelineGamification).where(eq(pipelineGamification.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  
  await db.insert(pipelineGamification).values({ userId });
  const result = await db.select().from(pipelineGamification).where(eq(pipelineGamification.userId, userId)).limit(1);
  return result[0];
}

export async function addGamificationPoints(userId: number, points: number, action: string) {
  const db = await getDb();
  if (!db) return;
  
  const gamification = await getOrCreateGamification(userId);
  const newPoints = (gamification.totalPoints || 0) + points;
  const newLevel = Math.floor(newPoints / 100) + 1;
  
  const updateData: Partial<InsertPipelineGamification> = {
    totalPoints: newPoints,
    level: newLevel,
    lastActivityAt: new Date()
  };
  
  // Update specific counters based on action
  if (action === 'idea_submitted') updateData.ideasSubmitted = (gamification.ideasSubmitted || 0) + 1;
  if (action === 'idea_approved') updateData.ideasApproved = (gamification.ideasApproved || 0) + 1;
  if (action === 'experiment_run') updateData.experimentsRun = (gamification.experimentsRun || 0) + 1;
  if (action === 'hypothesis_validated') updateData.hypothesesValidated = (gamification.hypothesesValidated || 0) + 1;
  if (action === 'vote_given') updateData.votesGiven = (gamification.votesGiven || 0) + 1;
  
  await db.update(pipelineGamification).set({ ...updateData, updatedAt: new Date() }).where(eq(pipelineGamification.userId, userId));
}

export async function getLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pipelineGamification).orderBy(desc(pipelineGamification.totalPoints)).limit(limit);
}

// ============================================
// PIPELINE STATISTICS
// ============================================
export async function getPipelineStats(userId?: number) {
  const db = await getDb();
  if (!db) return { initiatives: 0, challenges: 0, ideas: 0, experiments: 0, trends: 0 };
  
  const whereClause = userId ? eq(pipelineInitiatives.userId, userId) : undefined;
  
  const [initiativeCount] = await db.select({ count: sql<number>`count(*)` }).from(pipelineInitiatives).where(whereClause);
  const [challengeCount] = await db.select({ count: sql<number>`count(*)` }).from(pipelineChallenges);
  const [ideaCount] = await db.select({ count: sql<number>`count(*)` }).from(pipelineIdeas);
  const [experimentCount] = await db.select({ count: sql<number>`count(*)` }).from(pipelineExperiments);
  const [trendCount] = await db.select({ count: sql<number>`count(*)` }).from(pipelineTrends);
  
  return {
    initiatives: initiativeCount?.count || 0,
    challenges: challengeCount?.count || 0,
    ideas: ideaCount?.count || 0,
    experiments: experimentCount?.count || 0,
    trends: trendCount?.count || 0
  };
}


// ============================================
// STRATEGIC ANALYSIS & FEEDBACK OPERATIONS
// ============================================
export async function createStrategicAnalysis(data: InsertStrategicAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(strategicAnalyses).values(data);
  return result[0].insertId;
}

export async function getStrategicAnalysisByUserId(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(strategicAnalyses).where(eq(strategicAnalyses.userId, userId)).orderBy(desc(strategicAnalyses.createdAt)).limit(limit);
}

export async function getStrategicAnalysisById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(strategicAnalyses).where(eq(strategicAnalyses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserFeedback(data: InsertUserFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(userFeedback).values(data);
  return result[0].insertId;
}

export async function getUserFeedbackByAnalysisId(analysisId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFeedback).where(eq(userFeedback.analysisId, analysisId)).orderBy(desc(userFeedback.createdAt));
}

export async function getAllUserFeedback(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt)).limit(limit);
}

export async function createWhatIfScenario(data: InsertWhatIfScenario) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(whatIfScenarios).values(data);
  return result[0].insertId;
}

export async function getWhatIfScenariosByAnalysisId(analysisId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(whatIfScenarios).where(eq(whatIfScenarios.analysisId, analysisId)).orderBy(desc(whatIfScenarios.createdAt));
}

export async function createPredictionAccuracy(data: InsertPredictionAccuracy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(predictionAccuracy).values(data);
  return result[0].insertId;
}

export async function updatePredictionAccuracy(id: number, data: Partial<InsertPredictionAccuracy>) {
  const db = await getDb();
  if (!db) return;
  await db.update(predictionAccuracy).set({ ...data, updatedAt: new Date() }).where(eq(predictionAccuracy.id, id));
}

export async function getPredictionAccuracyStats() {
  const db = await getDb();
  if (!db) return { total: 0, correct: 0, accuracy: 0 };
  
  const results = await db.select().from(predictionAccuracy).where(eq(predictionAccuracy.correct, true));
  const total = results.length;
  const correct = results.filter(r => r.correct).length;
  
  return {
    total,
    correct,
    accuracy: total > 0 ? correct / total : 0
  };
}

// Analytics aggregation functions
export async function getFeedbackStats() {
  const db = await getDb();
  if (!db) return { total: 0, byType: {}, byRating: {} };
  
  const allFeedback = await db.select().from(userFeedback);
  const byType: Record<string, number> = {};
  const byRating: Record<string, number> = {};
  
  allFeedback.forEach(f => {
    byType[f.feedbackType] = (byType[f.feedbackType] || 0) + 1;
    if (f.rating) {
      byRating[f.rating] = (byRating[f.rating] || 0) + 1;
    }
  });
  
  return {
    total: allFeedback.length,
    byType,
    byRating
  };
}

export async function getAnalysisStats() {
  const db = await getDb();
  if (!db) return { total: 0, avgIci: 0, avgIrl: 0, avgSuccessProbability: 0 };
  
  const allAnalyses = await db.select().from(strategicAnalyses);
  const total = allAnalyses.length;
  
  if (total === 0) return { total: 0, avgIci: 0, avgIrl: 0, avgSuccessProbability: 0 };
  
  const avgIci = allAnalyses.reduce((sum, a) => sum + (Number(a.iciScore) || 0), 0) / total;
  const avgIrl = allAnalyses.reduce((sum, a) => sum + (Number(a.irlScore) || 0), 0) / total;
  const avgSuccessProbability = allAnalyses.reduce((sum, a) => sum + (Number(a.successProbability) || 0), 0) / total;
  
  return {
    total,
    avgIci,
    avgIrl,
    avgSuccessProbability
  };
}

// ============================================
// UPLINK1: IDEAS OPERATIONS
// ============================================
export async function createIdea(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ideas).values(data);
  return result[0].insertId;
}

export async function getIdeaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ideas).where(eq(ideas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIdeasByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ideas).where(eq(ideas.userId, userId)).orderBy(desc(ideas.submittedAt));
}

export async function getAllIdeas(filters?: {
  search?: string;
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(ideas);
  
  // Apply filters
  if (filters?.category) {
    query = query.where(eq(ideas.category, filters.category)) as any;
  }
  if (filters?.status) {
    query = query.where(eq(ideas.status, filters.status)) as any;
  }
  
  // Apply ordering, limit, and offset
  query = query.orderBy(desc(ideas.submittedAt)) as any;
  if (filters?.limit) {
    query = query.limit(filters.limit) as any;
  }
  if (filters?.offset) {
    query = query.offset(filters.offset) as any;
  }
  
  return query;
}

export async function updateIdea(id: number, data: any) {
  const db = await getDb();
  if (!db) return;
  await db.update(ideas).set({ ...data, updatedAt: new Date() }).where(eq(ideas.id, id));
}

// ============================================
// UPLINK1: IDEA ANALYSIS OPERATIONS
// ============================================
export async function createIdeaAnalysis(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(ideaAnalysis).values(data);
  return result[0].insertId;
}

export async function getIdeaAnalysisByIdeaId(ideaId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ideaAnalysis).where(eq(ideaAnalysis.ideaId, ideaId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIdeaAnalysisById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(ideaAnalysis).where(eq(ideaAnalysis.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// UPLINK1: CLASSIFICATION HISTORY OPERATIONS
// ============================================
export async function createClassificationHistory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(classificationHistory).values(data);
  return result[0].insertId;
}

export async function getClassificationHistoryByIdeaId(ideaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(classificationHistory).where(eq(classificationHistory.ideaId, ideaId)).orderBy(desc(classificationHistory.createdAt));
}

// ============================================
// UPLINK1: STATISTICS OPERATIONS
// ============================================
export async function getClassificationStats() {
  const db = await getDb();
  if (!db) return { total: 0, innovation: 0, commercial: 0, weak: 0 };
  
  const allAnalyses = await db.select().from(ideaAnalysis);
  const total = allAnalyses.length;
  const innovation = allAnalyses.filter(a => a.classification === "innovation").length;
  const commercial = allAnalyses.filter(a => a.classification === "commercial").length;
  const weak = allAnalyses.filter(a => a.classification === "weak").length;
  
  return { total, innovation, commercial, weak };
}

// ============================================
// UPLINK1: USER IDEAS OPERATIONS
// ============================================
export async function getUserIdeas(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ideas).where(eq(ideas.userId, userId)).orderBy(desc(ideas.createdAt));
}

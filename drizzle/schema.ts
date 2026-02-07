import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// ============================================
// USERS & AUTHENTICATION
// ============================================
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "innovator", "investor", "company", "government"]).default("user").notNull(),
  organizationName: text("organizationName"),
  organizationType: varchar("organizationType", { length: 100 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  bio: text("bio"),
  website: text("website"),
  linkedIn: text("linkedIn"),
  isVerified: boolean("isVerified").default(false),
  verificationDate: timestamp("verificationDate"),
  eliteMembership: mysqlEnum("eliteMembership", ["none", "gold", "platinum", "diamond"]).default("none"),
  membershipExpiry: timestamp("membershipExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// INTELLECTUAL PROPERTY (IP) REGISTRATION
// ============================================
export const ipRegistrations = mysqlTable("ip_registrations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["patent", "trademark", "copyright", "trade_secret", "industrial_design"]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  category: varchar("category", { length: 100 }),
  subCategory: varchar("subCategory", { length: 100 }),
  keywords: json("keywords"),
  inventors: json("inventors"),
  applicantType: mysqlEnum("applicantType", ["individual", "company", "university", "government"]),
  priorityDate: timestamp("priorityDate"),
  filingDate: timestamp("filingDate"),
  status: mysqlEnum("status", ["draft", "submitted", "under_review", "approved", "rejected", "registered", "expired"]).default("draft"),
  saipApplicationNumber: varchar("saipApplicationNumber", { length: 100 }),
  wipoApplicationNumber: varchar("wipoApplicationNumber", { length: 100 }),
  blockchainHash: varchar("blockchainHash", { length: 256 }),
  blockchainTimestamp: timestamp("blockchainTimestamp"),
  documents: json("documents"),
  fees: decimal("fees", { precision: 12, scale: 2 }),
  feesPaid: boolean("feesPaid").default(false),
  expiryDate: timestamp("expiryDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IPRegistration = typeof ipRegistrations.$inferSelect;
export type InsertIPRegistration = typeof ipRegistrations.$inferInsert;

// ============================================
// PROJECTS & INNOVATIONS
// ============================================
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  category: varchar("category", { length: 100 }),
  subCategory: varchar("subCategory", { length: 100 }),
  stage: mysqlEnum("stage", ["idea", "prototype", "mvp", "growth", "scale"]).default("idea"),
  engine: mysqlEnum("engine", ["uplink1", "uplink2", "uplink3"]).default("uplink1"),
  status: mysqlEnum("status", ["draft", "submitted", "evaluating", "approved", "matched", "contracted", "completed", "rejected"]).default("draft"),
  teamSize: int("teamSize"),
  fundingNeeded: decimal("fundingNeeded", { precision: 15, scale: 2 }),
  fundingReceived: decimal("fundingReceived", { precision: 15, scale: 2 }),
  targetMarket: text("targetMarket"),
  competitiveAdvantage: text("competitiveAdvantage"),
  businessModel: text("businessModel"),
  documents: json("documents"),
  images: json("images"),
  video: text("video"),
  website: text("website"),
  ipRegistrationId: int("ipRegistrationId"),
  evaluationId: int("evaluationId"),
  contractId: int("contractId"),
  pipelineIdeaId: int("pipelineIdeaId"),
  tags: json("tags"),
  views: int("views").default(0),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ============================================
// AI EVALUATIONS
// ============================================
export const evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  evaluatorId: int("evaluatorId"),
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }).notNull(),
  classification: mysqlEnum("classification", ["innovation", "commercial", "guidance"]).notNull(),
  innovationScore: decimal("innovationScore", { precision: 5, scale: 2 }),
  marketPotentialScore: decimal("marketPotentialScore", { precision: 5, scale: 2 }),
  technicalFeasibilityScore: decimal("technicalFeasibilityScore", { precision: 5, scale: 2 }),
  teamCapabilityScore: decimal("teamCapabilityScore", { precision: 5, scale: 2 }),
  ipStrengthScore: decimal("ipStrengthScore", { precision: 5, scale: 2 }),
  scalabilityScore: decimal("scalabilityScore", { precision: 5, scale: 2 }),
  aiAnalysis: text("aiAnalysis"),
  strengths: json("strengths"),
  weaknesses: json("weaknesses"),
  recommendations: json("recommendations"),
  nextSteps: json("nextSteps"),
  marketAnalysis: text("marketAnalysis"),
  competitorAnalysis: text("competitorAnalysis"),
  riskAssessment: text("riskAssessment"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "appealed"]).default("pending"),
  appealNotes: text("appealNotes"),
  appealStatus: mysqlEnum("appealStatus", ["none", "pending", "approved", "rejected"]).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

// ============================================
// SMART CONTRACTS & ESCROW
// ============================================
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  type: mysqlEnum("type", ["license", "acquisition", "partnership", "investment", "service", "nda"]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  partyA: int("partyA").notNull(),
  partyB: int("partyB").notNull(),
  totalValue: decimal("totalValue", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  status: mysqlEnum("status", ["draft", "pending_signatures", "active", "completed", "disputed", "terminated", "expired"]).default("draft"),
  terms: text("terms"),
  milestones: json("milestones"),
  documents: json("documents"),
  partyASignature: text("partyASignature"),
  partyASignedAt: timestamp("partyASignedAt"),
  partyBSignature: text("partyBSignature"),
  partyBSignedAt: timestamp("partyBSignedAt"),
  blockchainHash: varchar("blockchainHash", { length: 256 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

export const escrowAccounts = mysqlTable("escrow_accounts", {
  id: int("id").autoincrement().primaryKey(),
  contractId: int("contractId").notNull(),
  totalAmount: decimal("totalAmount", { precision: 15, scale: 2 }).notNull(),
  releasedAmount: decimal("releasedAmount", { precision: 15, scale: 2 }).default("0"),
  pendingAmount: decimal("pendingAmount", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  status: mysqlEnum("status", ["pending_deposit", "funded", "partially_released", "fully_released", "refunded", "disputed"]).default("pending_deposit"),
  depositedAt: timestamp("depositedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EscrowAccount = typeof escrowAccounts.$inferSelect;
export type InsertEscrowAccount = typeof escrowAccounts.$inferInsert;

export const escrowTransactions = mysqlTable("escrow_transactions", {
  id: int("id").autoincrement().primaryKey(),
  escrowId: int("escrowId").notNull(),
  type: mysqlEnum("type", ["deposit", "release", "refund", "fee"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  milestoneId: varchar("milestoneId", { length: 100 }),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "reversed"]).default("pending"),
  transactionHash: varchar("transactionHash", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EscrowTransaction = typeof escrowTransactions.$inferSelect;
export type InsertEscrowTransaction = typeof escrowTransactions.$inferInsert;

// ============================================
// ACADEMY & COURSES
// ============================================
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  category: mysqlEnum("category", ["innovation", "entrepreneurship", "ip", "investment", "technology", "leadership"]).notNull(),
  level: mysqlEnum("level", ["beginner", "intermediate", "advanced", "expert"]).default("beginner"),
  duration: int("duration"),
  modules: json("modules"),
  instructor: varchar("instructor", { length: 200 }),
  instructorBio: text("instructorBio"),
  partner: varchar("partner", { length: 200 }),
  thumbnail: text("thumbnail"),
  video: text("video"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  isFree: boolean("isFree").default(true),
  certificateEnabled: boolean("certificateEnabled").default(true),
  enrollmentCount: int("enrollmentCount").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  progress: int("progress").default(0),
  completedModules: json("completedModules"),
  status: mysqlEnum("status", ["enrolled", "in_progress", "completed", "dropped"]).default("enrolled"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  certificateId: varchar("certificateId", { length: 100 }),
  certificateIssuedAt: timestamp("certificateIssuedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

// ============================================
// ELITE CLUB MEMBERSHIPS
// ============================================
export const eliteMemberships = mysqlTable("elite_memberships", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["gold", "platinum", "diamond"]).notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled", "pending"]).default("pending"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  price: decimal("price", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending"),
  benefits: json("benefits"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EliteMembership = typeof eliteMemberships.$inferSelect;
export type InsertEliteMembership = typeof eliteMemberships.$inferInsert;

// ============================================
// API KEYS & DEVELOPER PORTAL
// ============================================
export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  keyHash: varchar("keyHash", { length: 256 }).notNull(),
  keyPrefix: varchar("keyPrefix", { length: 20 }).notNull(),
  permissions: json("permissions"),
  rateLimit: int("rateLimit").default(1000),
  status: mysqlEnum("status", ["active", "revoked", "expired"]).default("active"),
  lastUsedAt: timestamp("lastUsedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;

export const apiUsage = mysqlTable("api_usage", {
  id: int("id").autoincrement().primaryKey(),
  apiKeyId: int("apiKeyId").notNull(),
  endpoint: varchar("endpoint", { length: 500 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  statusCode: int("statusCode"),
  responseTime: int("responseTime"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = typeof apiUsage.$inferInsert;

export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  url: text("url").notNull(),
  secret: varchar("secret", { length: 64 }), // Optional HMAC secret for verification
  
  // Events to listen to
  events: json("events"), // Array of event types: ["idea.created", "idea.status_changed", "rat.alert"]
  
  // Status
  isActive: boolean("isActive").default(true).notNull(),
  
  // Stats
  totalCalls: int("totalCalls").default(0).notNull(),
  successfulCalls: int("successfulCalls").default(0).notNull(),
  failedCalls: int("failedCalls").default(0).notNull(),
  lastTriggeredAt: timestamp("lastTriggeredAt"),
  lastError: text("lastError"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

export const webhookLogs = mysqlTable("webhook_logs", {
  id: int("id").autoincrement().primaryKey(),
  webhookId: int("webhookId").notNull(),
  event: varchar("event", { length: 100 }).notNull(),
  payload: json("payload"),
  statusCode: int("statusCode"),
  responseTime: int("responseTime"),
  success: boolean("success").notNull(),
  errorMessage: text("errorMessage"),
  retryCount: int("retryCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

// ============================================
// CHALLENGES & MATCHING (UPLINK2) - OLD TABLE (DEPRECATED)
// This table is deprecated and replaced by the new challenges table in UPLINK2 section below
// Keeping for backward compatibility, will be removed after data migration

// ============================================
// GLOBAL NETWORK & AMBASSADORS
// ============================================
export const ambassadors = mysqlTable("ambassadors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  title: varchar("title", { length: 200 }),
  organization: varchar("organization", { length: 200 }),
  bio: text("bio"),
  expertise: json("expertise"),
  languages: json("languages"),
  status: mysqlEnum("status", ["pending", "active", "inactive", "suspended"]).default("pending"),
  appointedAt: timestamp("appointedAt"),
  achievements: json("achievements"),
  connections: int("connections").default(0),
  dealsIntroduced: int("dealsIntroduced").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Ambassador = typeof ambassadors.$inferSelect;
export type InsertAmbassador = typeof ambassadors.$inferInsert;

export const innovationHubs = mysqlTable("innovation_hubs", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }),
  country: varchar("country", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  address: text("address"),
  type: mysqlEnum("type", ["hub", "accelerator", "incubator", "university", "research_center", "corporate"]).notNull(),
  description: text("description"),
  website: text("website"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  partnerSince: timestamp("partnerSince"),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending"),
  logo: text("logo"),
  coordinates: json("coordinates"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InnovationHub = typeof innovationHubs.$inferSelect;
export type InsertInnovationHub = typeof innovationHubs.$inferInsert;

// ============================================
// NOTIFICATIONS
// ============================================
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["info", "success", "warning", "error", "action"]).default("info"),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================
// ANALYTICS & STATISTICS
// ============================================
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  metric: varchar("metric", { length: 100 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  dimension: varchar("dimension", { length: 100 }),
  dimensionValue: varchar("dimensionValue", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;


// ============================================
// INNOVATION PIPELINE SYSTEM
// ============================================

// Strategic Initiatives
export const pipelineInitiatives = mysqlTable("pipeline_initiatives", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  businessStrategy: text("businessStrategy"),
  innovationStrategy: text("innovationStrategy"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  status: mysqlEnum("status", ["draft", "active", "paused", "completed", "cancelled"]).default("draft"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  budgetSpent: decimal("budgetSpent", { precision: 15, scale: 2 }).default("0"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  owner: int("owner"),
  team: json("team"),
  kpis: json("kpis"),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineInitiative = typeof pipelineInitiatives.$inferSelect;
export type InsertPipelineInitiative = typeof pipelineInitiatives.$inferInsert;

// Pipeline Challenges (linked to initiatives)
export const pipelineChallenges = mysqlTable("pipeline_challenges", {
  id: int("id").autoincrement().primaryKey(),
  initiativeId: int("initiativeId").notNull(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  problemStatement: text("problemStatement"),
  desiredOutcome: text("desiredOutcome"),
  constraints: json("constraints"),
  status: mysqlEnum("status", ["open", "ideation", "evaluation", "closed"]).default("open"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  deadline: timestamp("deadline"),
  ideasCount: int("ideasCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineChallenge = typeof pipelineChallenges.$inferSelect;
export type InsertPipelineChallenge = typeof pipelineChallenges.$inferInsert;

// Pipeline Ideas
export const pipelineIdeas = mysqlTable("pipeline_ideas", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challengeId").notNull(),
  userId: int("userId").notNull(),
  clusterId: int("clusterId"),
  projectId: int("projectId"),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  solution: text("solution"),
  expectedImpact: text("expectedImpact"),
  estimatedCost: decimal("estimatedCost", { precision: 15, scale: 2 }),
  estimatedROI: decimal("estimatedROI", { precision: 5, scale: 2 }),
  implementationTime: varchar("implementationTime", { length: 100 }),
  status: mysqlEnum("status", ["submitted", "under_review", "approved", "parked", "killed", "in_experiment"]).default("submitted"),
  votes: int("votes").default(0),
  aiScore: decimal("aiScore", { precision: 5, scale: 2 }),
  aiAnalysis: text("aiAnalysis"),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high"]).default("medium"),
  innovationLevel: mysqlEnum("innovationLevel", ["incremental", "adjacent", "transformational"]).default("incremental"),
  tags: json("tags"),
  attachments: json("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineIdea = typeof pipelineIdeas.$inferSelect;
export type InsertPipelineIdea = typeof pipelineIdeas.$inferInsert;

// Idea Clusters
export const pipelineClusters = mysqlTable("pipeline_clusters", {
  id: int("id").autoincrement().primaryKey(),
  initiativeId: int("initiativeId").notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  nameEn: varchar("nameEn", { length: 200 }),
  description: text("description"),
  theme: varchar("theme", { length: 200 }),
  color: varchar("color", { length: 20 }),
  status: mysqlEnum("status", ["active", "parked", "killed", "merged"]).default("active"),
  ideasCount: int("ideasCount").default(0),
  avgScore: decimal("avgScore", { precision: 5, scale: 2 }),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineCluster = typeof pipelineClusters.$inferSelect;
export type InsertPipelineCluster = typeof pipelineClusters.$inferInsert;

// Hypotheses
export const pipelineHypotheses = mysqlTable("pipeline_hypotheses", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull(),
  userId: int("userId").notNull(),
  statement: text("statement").notNull(),
  statementEn: text("statementEn"),
  type: mysqlEnum("type", ["desirability", "feasibility", "viability"]).default("desirability"),
  assumption: text("assumption"),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).default("medium"),
  status: mysqlEnum("status", ["untested", "testing", "validated", "invalidated", "refined"]).default("untested"),
  validationMethod: text("validationMethod"),
  successCriteria: text("successCriteria"),
  evidence: text("evidence"),
  confidence: int("confidence").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineHypothesis = typeof pipelineHypotheses.$inferSelect;
export type InsertPipelineHypothesis = typeof pipelineHypotheses.$inferInsert;

// Experiments (RATs - Riskiest Assumptions Tests)
export const pipelineExperiments = mysqlTable("pipeline_experiments", {
  id: int("id").autoincrement().primaryKey(),
  hypothesisId: int("hypothesisId").notNull(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  nameEn: varchar("nameEn", { length: 300 }),
  description: text("description"),
  experimentType: mysqlEnum("experimentType", ["survey", "interview", "prototype", "mvp", "ab_test", "landing_page", "concierge", "wizard_of_oz"]).default("prototype"),
  status: mysqlEnum("status", ["planned", "in_progress", "completed", "cancelled"]).default("planned"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  sampleSize: int("sampleSize"),
  methodology: text("methodology"),
  metrics: json("metrics"),
  results: text("results"),
  learnings: text("learnings"),
  outcome: mysqlEnum("outcome", ["pending", "supports", "rejects", "inconclusive"]).default("pending"),
  nextSteps: text("nextSteps"),
  attachments: json("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineExperiment = typeof pipelineExperiments.$inferSelect;
export type InsertPipelineExperiment = typeof pipelineExperiments.$inferInsert;

// Idea Votes
export const pipelineVotes = mysqlTable("pipeline_votes", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull(),
  userId: int("userId").notNull(),
  voteType: mysqlEnum("voteType", ["upvote", "downvote"]).default("upvote"),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PipelineVote = typeof pipelineVotes.$inferSelect;
export type InsertPipelineVote = typeof pipelineVotes.$inferInsert;

// Trend Scouting
export const pipelineTrends = mysqlTable("pipeline_trends", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  nameEn: varchar("nameEn", { length: 300 }),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  maturityLevel: mysqlEnum("maturityLevel", ["emerging", "growing", "mature", "declining"]).default("emerging"),
  relevanceScore: int("relevanceScore").default(50),
  impactScore: int("impactScore").default(50),
  timeToMainstream: varchar("timeToMainstream", { length: 100 }),
  sources: json("sources"),
  relatedInitiatives: json("relatedInitiatives"),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineTrend = typeof pipelineTrends.$inferSelect;
export type InsertPipelineTrend = typeof pipelineTrends.$inferInsert;

// Gamification - User Points & Badges
export const pipelineGamification = mysqlTable("pipeline_gamification", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  totalPoints: int("totalPoints").default(0),
  level: int("level").default(1),
  ideasSubmitted: int("ideasSubmitted").default(0),
  ideasApproved: int("ideasApproved").default(0),
  experimentsRun: int("experimentsRun").default(0),
  hypothesesValidated: int("hypothesesValidated").default(0),
  votesGiven: int("votesGiven").default(0),
  commentsGiven: int("commentsGiven").default(0),
  badges: json("badges"),
  achievements: json("achievements"),
  streak: int("streak").default(0),
  lastActivityAt: timestamp("lastActivityAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PipelineGamification = typeof pipelineGamification.$inferSelect;
export type InsertPipelineGamification = typeof pipelineGamification.$inferInsert;

// ============================================
// INNOVATION 360 INTEGRATION
// ============================================

// Strategic Challenges
export const strategicChallenges = mysqlTable("strategic_challenges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  businessImpact: text("businessImpact"),
  stakeholders: json("stakeholders"),
  constraints: text("constraints"),
  successCriteria: text("successCriteria"),
  priority: mysqlEnum("priority", ["high", "medium", "low"]).default("medium"),
  status: mysqlEnum("status", ["active", "in_progress", "solved", "archived"]).default("active"),
  linkedInnovations: json("linkedInnovations"),
  tags: json("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StrategicChallenge = typeof strategicChallenges.$inferSelect;
export type InsertStrategicChallenge = typeof strategicChallenges.$inferInsert;

// Innovation Hypotheses (Enhanced)
export const innovationHypotheses = mysqlTable("innovation_hypotheses", {
  id: int("id").autoincrement().primaryKey(),
  innovationId: int("innovationId").notNull(),
  userId: int("userId").notNull(),
  statement: text("statement").notNull(),
  statementEn: text("statementEn"),
  assumption: text("assumption"),
  metric: varchar("metric", { length: 255 }),
  successCriterion: text("successCriterion"),
  testMethod: text("testMethod"),
  riskLevel: mysqlEnum("riskLevel", ["high", "medium", "low"]).default("medium"),
  uncertaintyLevel: mysqlEnum("uncertaintyLevel", ["high", "medium", "low"]).default("medium"),
  impactIfWrong: mysqlEnum("impactIfWrong", ["critical", "major", "minor"]).default("major"),
  ratScore: decimal("ratScore", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["pending", "testing", "validated", "invalidated"]).default("pending"),
  testResult: text("testResult"),
  evidence: text("evidence"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InnovationHypothesis = typeof innovationHypotheses.$inferSelect;
export type InsertInnovationHypothesis = typeof innovationHypotheses.$inferInsert;

// RAT Tests (Riskiest Assumptions Tests)
export const ratTests = mysqlTable("rat_tests", {
  id: int("id").autoincrement().primaryKey(),
  hypothesisId: int("hypothesisId").notNull(),
  userId: int("userId").notNull(),
  testName: varchar("testName", { length: 255 }).notNull(),
  testDescription: text("testDescription"),
  plannedDate: timestamp("plannedDate"),
  completedDate: timestamp("completedDate"),
  result: text("result"),
  status: mysqlEnum("status", ["planned", "in_progress", "completed"]).default("planned"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  resources: json("resources"),
  learnings: text("learnings"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RATTest = typeof ratTests.$inferSelect;
export type InsertRATTest = typeof ratTests.$inferInsert;

// Gate Decisions (Park/Kill)
export const gateDecisions = mysqlTable("gate_decisions", {
  id: int("id").autoincrement().primaryKey(),
  innovationId: int("innovationId").notNull(),
  stage: varchar("stage", { length: 100 }).notNull(),
  decisionType: mysqlEnum("decisionType", ["continue", "park", "kill"]).notNull(),
  rationale: text("rationale").notNull(),
  decisionDate: timestamp("decisionDate").defaultNow().notNull(),
  deciderId: int("deciderId").notNull(),
  validationResults: json("validationResults"),
  remainingRATs: json("remainingRATs"),
  resourcesConsumed: decimal("resourcesConsumed", { precision: 15, scale: 2 }),
  keyLearnings: text("keyLearnings"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GateDecision = typeof gateDecisions.$inferSelect;
export type InsertGateDecision = typeof gateDecisions.$inferInsert;

// Learning Logs
export const learningLogs = mysqlTable("learning_logs", {
  id: int("id").autoincrement().primaryKey(),
  innovationId: int("innovationId").notNull(),
  userId: int("userId").notNull(),
  stage: varchar("stage", { length: 100 }),
  lessonLearned: text("lessonLearned").notNull(),
  lessonLearnedEn: text("lessonLearnedEn"),
  impact: mysqlEnum("impact", ["high", "medium", "low"]).default("medium"),
  recommendation: text("recommendation"),
  tags: json("tags"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LearningLog = typeof learningLogs.$inferSelect;
export type InsertLearningLog = typeof learningLogs.$inferInsert;

// Knowledge Base
export const knowledgeBaseItems = mysqlTable("knowledge_base_items", {
  id: int("id").autoincrement().primaryKey(),
  sourceType: mysqlEnum("sourceType", ["learning", "decision", "experiment", "retrospective"]).notNull(),
  sourceId: int("sourceId"),
  content: text("content").notNull(),
  contentEn: text("contentEn"),
  category: varchar("category", { length: 100 }),
  tags: json("tags"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  viewCount: int("viewCount").default(0),
  helpfulCount: int("helpfulCount").default(0),
  notHelpfulCount: int("notHelpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeBaseItem = typeof knowledgeBaseItems.$inferSelect;
export type InsertKnowledgeBaseItem = typeof knowledgeBaseItems.$inferInsert;

// Knowledge Ratings
export const knowledgeRatings = mysqlTable("knowledge_ratings", {
  id: int("id").autoincrement().primaryKey(),
  itemId: int("itemId").notNull(),
  userId: int("userId").notNull(),
  isHelpful: boolean("isHelpful").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KnowledgeRating = typeof knowledgeRatings.$inferSelect;
export type InsertKnowledgeRating = typeof knowledgeRatings.$inferInsert;

// ============================================
// IDEA OUTCOMES (Real Data Collection for ML)
// ============================================
export const ideaOutcomes = mysqlTable("idea_outcomes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Idea details
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }),
  
  // Features used for ML prediction (matching training data)
  budget: decimal("budget", { precision: 15, scale: 2 }),
  teamSize: int("teamSize"),
  timelineMonths: int("timelineMonths"),
  marketDemand: decimal("marketDemand", { precision: 5, scale: 2 }), // 0-1 scale
  technicalFeasibility: decimal("technicalFeasibility", { precision: 5, scale: 2 }), // 0-1 scale
  competitiveAdvantage: decimal("competitiveAdvantage", { precision: 5, scale: 2 }), // 0-1 scale
  userEngagement: decimal("userEngagement", { precision: 5, scale: 2 }), // 0-1 scale
  tagsCount: int("tagsCount"),
  hypothesisValidationRate: decimal("hypothesisValidationRate", { precision: 5, scale: 2 }), // 0-1 scale
  ratCompletionRate: decimal("ratCompletionRate", { precision: 5, scale: 2 }), // 0-1 scale
  
  // Outcome (ground truth for training)
  outcome: mysqlEnum("outcome", ["success", "failure", "pending"]).default("pending").notNull(),
  outcomeDate: timestamp("outcomeDate"),
  outcomeNotes: text("outcomeNotes"),
  
  // Metadata
  classifiedBy: int("classifiedBy"), // Admin/reviewer who classified the outcome
  classifiedAt: timestamp("classifiedAt"),
  
  // AI prediction at submission time (for comparison)
  predictedSuccessRate: decimal("predictedSuccessRate", { precision: 5, scale: 2 }),
  predictionModel: varchar("predictionModel", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IdeaOutcome = typeof ideaOutcomes.$inferSelect;
export type InsertIdeaOutcome = typeof ideaOutcomes.$inferInsert;

// ============================================
// RBAC (Role-Based Access Control)
// ============================================

export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("displayName", { length: 200 }).notNull(),
  description: text("description"),
  isSystem: boolean("isSystem").default(false), // System roles cannot be deleted
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  resource: varchar("resource", { length: 100 }).notNull(), // e.g., "ideas", "projects", "users"
  action: varchar("action", { length: 50 }).notNull(), // e.g., "read", "create", "update", "delete"
  displayName: varchar("displayName", { length: 200 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

export const rolePermissions = mysqlTable("role_permissions", {
  id: int("id").autoincrement().primaryKey(),
  roleId: int("roleId").notNull(),
  permissionId: int("permissionId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

export const userRoles = mysqlTable("user_roles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  roleId: int("roleId").notNull(),
  assignedBy: int("assignedBy"), // User ID who assigned this role
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Optional: for temporary role assignments
});

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

// Data visibility controls
export const dataVisibilityRules = mysqlTable("data_visibility_rules", {
  id: int("id").autoincrement().primaryKey(),
  roleId: int("roleId").notNull(),
  resourceType: varchar("resourceType", { length: 100 }).notNull(), // "ideas", "projects", etc.
  visibilityScope: mysqlEnum("visibilityScope", ["all", "own", "department", "team", "custom"]).notNull(),
  customFilter: json("customFilter"), // For complex visibility rules
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DataVisibilityRule = typeof dataVisibilityRules.$inferSelect;
export type InsertDataVisibilityRule = typeof dataVisibilityRules.$inferInsert;

// ============================================
// AUDIT LOGGING
// ============================================

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // null for system actions
  action: varchar("action", { length: 100 }).notNull(), // e.g., "create", "update", "delete"
  resource: varchar("resource", { length: 100 }).notNull(), // e.g., "ideas", "users", "roles"
  resourceId: varchar("resourceId", { length: 100 }), // ID of the affected resource
  details: json("details"), // Additional context (old values, new values, etc.)
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  status: mysqlEnum("status", ["success", "failure"]).default("success"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============================================
// SAVED DASHBOARD VIEWS
// ============================================
export const savedViews = mysqlTable("saved_views", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  viewType: varchar("viewType", { length: 50 }).notNull(), // 'admin_dashboard', 'analytics', etc.
  filters: json("filters").notNull(), // Stores filter configuration
  isPublic: boolean("isPublic").default(false),
  sharedWith: json("sharedWith"), // Array of user IDs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedView = typeof savedViews.$inferSelect;
export type InsertSavedView = typeof savedViews.$inferInsert;


// ============================================
// ORGANIZATIONS/ENTITIES MANAGEMENT
// ============================================
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  nameAr: varchar("nameAr", { length: 500 }).notNull(),
  nameEn: varchar("nameEn", { length: 500 }),
  type: mysqlEnum("type", ["government", "academic", "private", "supporting"]).notNull(),
  scope: mysqlEnum("scope", ["local", "global"]).default("local").notNull(),
  description: text("description"),
  website: text("website"),
  logo: text("logo"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  address: text("address"),
  country: varchar("country", { length: 100 }).default("Saudi Arabia"),
  city: varchar("city", { length: 100 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

// ============================================
// IDEA-ORGANIZATION RELATIONSHIPS
// ============================================
export const ideaOrganizations = mysqlTable("idea_organizations", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull(),
  organizationId: int("organizationId").notNull(),
  role: varchar("role", { length: 100 }), // e.g., "sponsor", "partner", "implementer"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================
// PROJECT-ORGANIZATION RELATIONSHIPS
// ============================================
export const projectOrganizations = mysqlTable("project_organizations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  organizationId: int("organizationId").notNull(),
  role: varchar("role", { length: 100 }), // e.g., "sponsor", "partner", "implementer"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ============================================
// AI STRATEGIC ANALYSIS & FEEDBACK
// ============================================
export const strategicAnalyses = mysqlTable("strategic_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectTitle: varchar("projectTitle", { length: 500 }).notNull(),
  projectDescription: text("projectDescription").notNull(),
  
  // Input Features
  budget: decimal("budget", { precision: 15, scale: 2 }),
  teamSize: int("teamSize"),
  timelineMonths: int("timelineMonths"),
  marketDemand: int("marketDemand"),
  technicalFeasibility: int("technicalFeasibility"),
  userEngagement: int("userEngagement"),
  hypothesisValidationRate: decimal("hypothesisValidationRate", { precision: 5, scale: 2 }),
  ratCompletionRate: decimal("ratCompletionRate", { precision: 5, scale: 2 }),
  userCount: int("userCount"),
  revenueGrowth: decimal("revenueGrowth", { precision: 5, scale: 2 }),
  
  // Analysis Results
  iciScore: decimal("iciScore", { precision: 5, scale: 2 }),
  irlScore: decimal("irlScore", { precision: 5, scale: 2 }),
  successProbability: decimal("successProbability", { precision: 5, scale: 4 }),
  riskLevel: mysqlEnum("riskLevel", ["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  investorAppeal: mysqlEnum("investorAppeal", ["VERY_LOW", "LOW", "MEDIUM", "HIGH", "VERY_HIGH"]),
  
  // Full Analysis JSON
  ceoInsights: json("ceoInsights"),
  roadmap: json("roadmap"),
  investment: json("investment"),
  criticalPath: json("criticalPath"),
  dashboard: json("dashboard"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StrategicAnalysis = typeof strategicAnalyses.$inferSelect;
export type InsertStrategicAnalysis = typeof strategicAnalyses.$inferInsert;

export const userFeedback = mysqlTable("user_feedback", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId"),
  userId: int("userId"),
  projectId: varchar("projectId", { length: 500 }),
  
  // Feedback Details
  feedbackType: mysqlEnum("feedbackType", ["ceo_insight", "roadmap", "investment", "general", "whatif"]).notNull(),
  itemId: int("itemId"),
  rating: varchar("rating", { length: 50 }),
  comment: text("comment"),
  
  // Context
  userRole: varchar("userRole", { length: 50 }),
  sessionId: varchar("sessionId", { length: 100 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = typeof userFeedback.$inferInsert;

export const whatIfScenarios = mysqlTable("whatif_scenarios", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  userId: int("userId"),
  
  // Scenario Details
  scenarioName: varchar("scenarioName", { length: 200 }),
  modifications: json("modifications"),
  
  // Results
  baselineIci: decimal("baselineIci", { precision: 5, scale: 2 }),
  modifiedIci: decimal("modifiedIci", { precision: 5, scale: 2 }),
  baselineIrl: decimal("baselineIrl", { precision: 5, scale: 2 }),
  modifiedIrl: decimal("modifiedIrl", { precision: 5, scale: 2 }),
  baselineSuccessProbability: decimal("baselineSuccessProbability", { precision: 5, scale: 4 }),
  modifiedSuccessProbability: decimal("modifiedSuccessProbability", { precision: 5, scale: 4 }),
  
  // Impact Analysis
  impact: json("impact"),
  recommendation: text("recommendation"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WhatIfScenario = typeof whatIfScenarios.$inferSelect;
export type InsertWhatIfScenario = typeof whatIfScenarios.$inferInsert;

export const predictionAccuracy = mysqlTable("prediction_accuracy", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  
  // Prediction
  predictedOutcome: mysqlEnum("predictedOutcome", ["success", "failure"]).notNull(),
  predictedProbability: decimal("predictedProbability", { precision: 5, scale: 4 }),
  
  // Actual Outcome (filled later)
  actualOutcome: mysqlEnum("actualOutcome", ["success", "failure", "unknown"]).default("unknown"),
  actualOutcomeDate: timestamp("actualOutcomeDate"),
  
  // Accuracy Metrics
  correct: boolean("correct"),
  errorMargin: decimal("errorMargin", { precision: 5, scale: 4 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PredictionAccuracy = typeof predictionAccuracy.$inferSelect;
export type InsertPredictionAccuracy = typeof predictionAccuracy.$inferInsert;

// ============================================
// UPLINK1: AI-POWERED IDEA ANALYSIS ENGINE
// ============================================

// Ideas submitted for AI analysis
export const ideas = mysqlTable("ideas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Idea Details
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  problem: text("problem"), // What problem does it solve?
  solution: text("solution"), // How does it solve it?
  targetMarket: text("targetMarket"),
  uniqueValue: text("uniqueValue"), // What makes it unique?
  
  // Metadata
  category: varchar("category", { length: 100 }),
  subCategory: varchar("subCategory", { length: 100 }),
  keywords: json("keywords"),
  documents: json("documents"),
  images: json("images"),
  
  // Status
  status: mysqlEnum("status", [
    "draft",           // User is still editing
    "submitted",       // Submitted for AI analysis
    "analyzing",       // AI is analyzing
    "analyzed",        // Analysis complete
    "revision_needed", // Needs revision (weak idea)
    "approved",        // Approved as innovation
    "commercial"       // Classified as commercial project
  ]).default("draft"),
  
  // Analysis Reference
  analysisId: int("analysisId"),
  
  // Timestamps
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;

// AI Analysis Results
export const ideaAnalysis = mysqlTable("idea_analysis", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull().unique(),
  
  // Overall Results
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }).notNull(), // 0-100
  classification: mysqlEnum("classification", [
    "innovation",  // True Innovation (≥70)
    "commercial",  // Commercial Project (50-70)
    "weak"         // Weak Idea (<50)
  ]).notNull(),
  
  // 10 Evaluation Criteria Scores (0-100 each) - Enhanced from Innovation 360 best practices
  technicalNoveltyScore: decimal("technicalNoveltyScore", { precision: 5, scale: 2 }).notNull(),     // Weight: 15%
  socialImpactScore: decimal("socialImpactScore", { precision: 5, scale: 2 }).notNull(),             // Weight: 15%
  technicalFeasibilityScore: decimal("technicalFeasibilityScore", { precision: 5, scale: 2 }).notNull(), // Weight: 12%
  commercialValueScore: decimal("commercialValueScore", { precision: 5, scale: 2 }).notNull(),       // Weight: 12%
  scalabilityScore: decimal("scalabilityScore", { precision: 5, scale: 2 }).notNull(),               // Weight: 10%
  sustainabilityScore: decimal("sustainabilityScore", { precision: 5, scale: 2 }).notNull(),         // Weight: 10%
  technicalRiskScore: decimal("technicalRiskScore", { precision: 5, scale: 2 }).notNull(),           // Weight: 8%
  timeToMarketScore: decimal("timeToMarketScore", { precision: 5, scale: 2 }).notNull(),             // Weight: 8%
  competitiveAdvantageScore: decimal("competitiveAdvantageScore", { precision: 5, scale: 2 }).notNull(), // Weight: 5%
  organizationalReadinessScore: decimal("organizationalReadinessScore", { precision: 5, scale: 2 }).notNull(), // Weight: 5%
  
  // Technology Readiness Level (TRL) Assessment - 9 levels from Innovation 360
  trlLevel: int("trlLevel"), // 1-9 (1: Basic principles, 9: Actual system proven)
  trlDescription: text("trlDescription"),
  
  // Stage Gate Assessment
  currentStageGate: mysqlEnum("currentStageGate", [
    "ideation",        // Stage 0: Ideation
    "scoping",         // Stage 1: Scoping
    "business_case",   // Stage 2: Build Business Case
    "development",     // Stage 3: Development
    "testing",         // Stage 4: Testing & Validation
    "launch"           // Stage 5: Launch
  ]),
  stageGateRecommendation: text("stageGateRecommendation"),
  
  // Detailed Analysis
  aiAnalysis: text("aiAnalysis"), // Full AI analysis text
  strengths: json("strengths"),   // Array of strengths
  weaknesses: json("weaknesses"), // Array of weaknesses
  opportunities: json("opportunities"), // Array of opportunities
  threats: json("threats"),       // Array of threats
  
  // Recommendations
  recommendations: json("recommendations"), // Array of recommendations
  nextSteps: json("nextSteps"),             // Array of next steps
  similarInnovations: json("similarInnovations"), // Array of similar innovations found
  
  // NLP Analysis
  extractedKeywords: json("extractedKeywords"),
  sentimentScore: decimal("sentimentScore", { precision: 5, scale: 2 }), // -1 to 1
  complexityLevel: mysqlEnum("complexityLevel", ["low", "medium", "high", "very_high"]),
  
  // Market Analysis
  marketSize: varchar("marketSize", { length: 100 }),
  competitionLevel: mysqlEnum("competitionLevel", ["low", "medium", "high", "very_high"]),
  marketTrends: json("marketTrends"),
  
  // Status
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
  processingTime: int("processingTime"), // in seconds
  
  // Timestamps
  analyzedAt: timestamp("analyzedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IdeaAnalysis = typeof ideaAnalysis.$inferSelect;
export type InsertIdeaAnalysis = typeof ideaAnalysis.$inferInsert;

// Evaluation Criteria with Weights
export const evaluationCriteria = mysqlTable("evaluation_criteria", {
  id: int("id").autoincrement().primaryKey(),
  
  // Criterion Details
  name: varchar("name", { length: 100 }).notNull().unique(),
  nameEn: varchar("nameEn", { length: 100 }),
  description: text("description"),
  descriptionEn: text("descriptionEn"),
  
  // Weight (0-100, total should be 100)
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  
  // Evaluation Guidelines
  guidelines: json("guidelines"), // Array of evaluation guidelines
  examples: json("examples"),     // Array of examples
  
  // Status
  isActive: boolean("isActive").default(true),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationCriterion = typeof evaluationCriteria.$inferSelect;
export type InsertEvaluationCriterion = typeof evaluationCriteria.$inferInsert;

// Classification History & Feedback
export const classificationHistory = mysqlTable("classification_history", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull(),
  analysisId: int("analysisId").notNull(),
  
  // Classification
  classification: mysqlEnum("classification", ["innovation", "commercial", "weak"]).notNull(),
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }).notNull(),
  
  // User Feedback
  userFeedback: mysqlEnum("userFeedback", ["accepted", "appealed", "revised", "abandoned"]),
  feedbackNotes: text("feedbackNotes"),
  appealReason: text("appealReason"),
  
  // Appeal Status
  appealStatus: mysqlEnum("appealStatus", ["none", "pending", "approved", "rejected"]).default("none"),
  appealReviewedBy: int("appealReviewedBy"),
  appealReviewedAt: timestamp("appealReviewedAt"),
  appealNotes: text("appealNotes"),
  
  // Revision Tracking
  revisionNumber: int("revisionNumber").default(1),
  previousClassification: mysqlEnum("previousClassification", ["innovation", "commercial", "weak"]),
  
  // Timestamps
  classifiedAt: timestamp("classifiedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassificationHistory = typeof classificationHistory.$inferSelect;
export type InsertClassificationHistory = typeof classificationHistory.$inferInsert;

// ============================================
// UPLINK2: CHALLENGES & MATCHING PLATFORM
// ============================================

// Challenges from Ministries and Companies
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  
  // Challenge Owner
  ownerId: int("ownerId").notNull(), // Ministry or Company user ID
  ownerType: mysqlEnum("ownerType", ["ministry", "company", "government", "ngo"]).notNull(),
  ownerName: varchar("ownerName", { length: 300 }).notNull(),
  
  // Challenge Details
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  problemStatement: text("problemStatement").notNull(),
  desiredOutcome: text("desiredOutcome"),
  
  // Challenge Specifications
  category: varchar("category", { length: 100 }),
  subCategory: varchar("subCategory", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  keywords: json("keywords"),
  
  // Requirements
  eligibilityCriteria: json("eligibilityCriteria"),
  technicalRequirements: json("technicalRequirements"),
  constraints: json("constraints"),
  
  // Rewards & Budget
  totalPrizePool: decimal("totalPrizePool", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  prizeDistribution: json("prizeDistribution"), // Array of prizes
  fundingAvailable: decimal("fundingAvailable", { precision: 15, scale: 2 }),
  
  // Timeline
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  submissionDeadline: timestamp("submissionDeadline").notNull(),
  evaluationDeadline: timestamp("evaluationDeadline"),
  announcementDate: timestamp("announcementDate"),
  
  // Status
  status: mysqlEnum("status", [
    "draft",
    "open",
    "submission_closed",
    "evaluating",
    "completed",
    "cancelled"
  ]).default("draft"),
  
  // Metrics
  submissionsCount: int("submissionsCount").default(0),
  participantsCount: int("participantsCount").default(0),
  views: int("views").default(0),
  
  // Documents
  documents: json("documents"),
  images: json("images"),
  
  // Timestamps
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

// Challenge Submissions
export const challengeSubmissions = mysqlTable("challenge_submissions", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challengeId").notNull(),
  userId: int("userId").notNull(),
  ideaId: int("ideaId"), // Link to UPLINK1 idea
  
  // Submission Details
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  solution: text("solution").notNull(),
  expectedImpact: text("expectedImpact"),
  
  // Team
  teamName: varchar("teamName", { length: 200 }),
  teamMembers: json("teamMembers"),
  teamSize: int("teamSize").default(1),
  
  // Documents
  documents: json("documents"),
  images: json("images"),
  video: text("video"),
  prototype: text("prototype"),
  
  // Evaluation
  evaluationScore: decimal("evaluationScore", { precision: 5, scale: 2 }),
  evaluationNotes: text("evaluationNotes"),
  rank: int("rank"),
  
  // Status
  status: mysqlEnum("status", [
    "draft",
    "submitted",
    "under_review",
    "shortlisted",
    "winner",
    "rejected"
  ]).default("draft"),
  
  // Timestamps
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChallengeSubmission = typeof challengeSubmissions.$inferSelect;
export type InsertChallengeSubmission = typeof challengeSubmissions.$inferInsert;

// Hackathons & Events
export const hackathons = mysqlTable("hackathons", {
  id: int("id").autoincrement().primaryKey(),
  
  // Organizer
  organizerId: int("organizerId").notNull(),
  organizerName: varchar("organizerName", { length: 300 }).notNull(),
  
  // Event Details
  name: varchar("name", { length: 500 }).notNull(),
  nameEn: varchar("nameEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  theme: varchar("theme", { length: 200 }),
  
  // Type & Format
  type: mysqlEnum("type", ["hackathon", "workshop", "conference", "competition", "bootcamp"]).notNull(),
  format: mysqlEnum("format", ["online", "onsite", "hybrid"]).notNull(),
  
  // Location (for onsite/hybrid)
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  venue: varchar("venue", { length: 300 }),
  address: text("address"),
  
  // Timeline
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  registrationDeadline: timestamp("registrationDeadline").notNull(),
  
  // Capacity
  maxParticipants: int("maxParticipants"),
  currentParticipants: int("currentParticipants").default(0),
  
  // Rewards
  totalPrizePool: decimal("totalPrizePool", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  prizes: json("prizes"),
  
  // Requirements
  eligibilityCriteria: json("eligibilityCriteria"),
  requiredSkills: json("requiredSkills"),
  
  // Sponsors
  sponsors: json("sponsors"),
  
  // Status
  status: mysqlEnum("status", [
    "draft",
    "registration_open",
    "registration_closed",
    "ongoing",
    "completed",
    "cancelled"
  ]).default("draft"),
  
  // Documents
  agenda: json("agenda"),
  documents: json("documents"),
  images: json("images"),
  
  // Metrics
  views: int("views").default(0),
  
  // Timestamps
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Hackathon = typeof hackathons.$inferSelect;
export type InsertHackathon = typeof hackathons.$inferInsert;

// Hackathon Registrations
export const hackathonRegistrations = mysqlTable("hackathon_registrations", {
  id: int("id").autoincrement().primaryKey(),
  hackathonId: int("hackathonId").notNull(),
  userId: int("userId").notNull(),
  
  // Team Details
  teamName: varchar("teamName", { length: 200 }),
  teamMembers: json("teamMembers"),
  teamSize: int("teamSize").default(1),
  
  // Registration Details
  motivation: text("motivation"),
  skills: json("skills"),
  experience: text("experience"),
  
  // Status
  status: mysqlEnum("status", [
    "pending",
    "approved",
    "rejected",
    "waitlisted",
    "cancelled"
  ]).default("pending"),
  
  // Check-in (for onsite events)
  checkedIn: boolean("checkedIn").default(false),
  checkInTime: timestamp("checkInTime"),
  
  // Timestamps
  registeredAt: timestamp("registeredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HackathonRegistration = typeof hackathonRegistrations.$inferSelect;
export type InsertHackathonRegistration = typeof hackathonRegistrations.$inferInsert;

// Smart Matching Requests (Innovators ↔ Investors)
export const matchingRequests = mysqlTable("matching_requests", {
  id: int("id").autoincrement().primaryKey(),
  
  // Requester
  userId: int("userId").notNull(),
  userType: mysqlEnum("userType", ["innovator", "investor", "company", "government"]).notNull(),
  
  // Request Details
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  
  // What they're looking for
  lookingFor: mysqlEnum("lookingFor", [
    "investor",
    "co_founder",
    "technical_partner",
    "business_partner",
    "mentor",
    "innovation",
    "startup",
    "technology"
  ]).notNull(),
  
  // Preferences
  industry: json("industry"),
  stage: json("stage"), // Array of stages
  location: json("location"),
  fundingRange: json("fundingRange"), // {min, max}
  
  // Matching Criteria
  keywords: json("keywords"),
  requiredSkills: json("requiredSkills"),
  preferredAttributes: json("preferredAttributes"),
  
  // Status
  status: mysqlEnum("status", [
    "active",
    "matched",
    "paused",
    "closed"
  ]).default("active"),
  
  // Matches
  matchesCount: int("matchesCount").default(0),
  
  // Timestamps
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchingRequest = typeof matchingRequests.$inferSelect;
export type InsertMatchingRequest = typeof matchingRequests.$inferInsert;

// Matching Results (AI-powered matching)
export const matchingResults = mysqlTable("matching_results", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  
  // Matched User/Entity
  matchedUserId: int("matchedUserId"),
  matchedProjectId: int("matchedProjectId"),
  matchedIdeaId: int("matchedIdeaId"),
  
  // Matching Score
  matchScore: decimal("matchScore", { precision: 5, scale: 2 }).notNull(), // 0-100
  
  // Matching Reasons
  matchingFactors: json("matchingFactors"), // Array of reasons
  aiAnalysis: text("aiAnalysis"),
  
  // Status
  status: mysqlEnum("status", [
    "suggested",
    "viewed",
    "contacted",
    "accepted",
    "rejected",
    "expired"
  ]).default("suggested"),
  
  // Interaction
  viewedAt: timestamp("viewedAt"),
  contactedAt: timestamp("contactedAt"),
  respondedAt: timestamp("respondedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchingResult = typeof matchingResults.$inferSelect;
export type InsertMatchingResult = typeof matchingResults.$inferInsert;

// Networking Connections
export const networkingConnections = mysqlTable("networking_connections", {
  id: int("id").autoincrement().primaryKey(),
  
  // Connection Parties
  userAId: int("userAId").notNull(),
  userBId: int("userBId").notNull(),
  
  // Connection Context
  connectionType: mysqlEnum("connectionType", [
    "match",
    "challenge",
    "hackathon",
    "direct",
    "referral"
  ]).notNull(),
  contextId: int("contextId"), // ID of challenge, hackathon, or matching request
  
  // Status
  status: mysqlEnum("status", [
    "pending",
    "accepted",
    "rejected",
    "blocked"
  ]).default("pending"),
  
  // Interaction
  message: text("message"),
  notes: text("notes"),
  
  // Timestamps
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NetworkingConnection = typeof networkingConnections.$inferSelect;
export type InsertNetworkingConnection = typeof networkingConnections.$inferInsert;

// ============================================
// UPLINK3: MARKETPLACE & EXCHANGE
// ============================================

// Marketplace Assets (3 Types: Licenses, Products, Acquisitions)
export const marketplaceAssets = mysqlTable("marketplace_assets", {
  id: int("id").autoincrement().primaryKey(),
  
  // Owner
  ownerId: int("ownerId").notNull(),
  
  // Asset Type
  assetType: mysqlEnum("assetType", [
    "license",      // IP Licensing
    "product",      // Products/Goods
    "acquisition"   // Company Acquisition
  ]).notNull(),
  
  // Asset Details
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  
  // Pricing
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  pricingModel: mysqlEnum("pricingModel", [
    "fixed",
    "negotiable",
    "royalty",
    "subscription",
    "revenue_share"
  ]).default("fixed"),
  
  // License-specific fields
  licenseType: mysqlEnum("licenseType", [
    "exclusive",
    "non_exclusive",
    "sole",
    "sublicensable"
  ]),
  licenseDuration: varchar("licenseDuration", { length: 100 }), // e.g., "5 years"
  royaltyRate: decimal("royaltyRate", { precision: 5, scale: 2 }), // Percentage
  
  // Product-specific fields
  productCategory: varchar("productCategory", { length: 100 }),
  productCondition: mysqlEnum("productCondition", ["new", "used", "refurbished"]),
  inventory: int("inventory"),
  
  // Acquisition-specific fields
  companyName: varchar("companyName", { length: 300 }),
  companyValuation: decimal("companyValuation", { precision: 15, scale: 2 }),
  revenue: decimal("revenue", { precision: 15, scale: 2 }),
  employees: int("employees"),
  foundedYear: int("foundedYear"),
  
  // Common Fields
  category: varchar("category", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  keywords: json("keywords"),
  
  // IP Protection
  ipRegistrationId: int("ipRegistrationId"),
  patentNumber: varchar("patentNumber", { length: 100 }),
  trademarkNumber: varchar("trademarkNumber", { length: 100 }),
  
  // Due Diligence
  dueDiligenceReport: text("dueDiligenceReport"),
  financialStatements: json("financialStatements"),
  legalDocuments: json("legalDocuments"),
  
  // Media
  images: json("images"),
  videos: json("videos"),
  documents: json("documents"),
  
  // Status
  status: mysqlEnum("status", [
    "draft",
    "pending_review",
    "active",
    "sold",
    "delisted",
    "expired"
  ]).default("draft"),
  
  // Metrics
  views: int("views").default(0),
  inquiries: int("inquiries").default(0),
  
  // Timestamps
  listedAt: timestamp("listedAt"),
  soldAt: timestamp("soldAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketplaceAsset = typeof marketplaceAssets.$inferSelect;
export type InsertMarketplaceAsset = typeof marketplaceAssets.$inferInsert;

// Asset Inquiries
export const assetInquiries = mysqlTable("asset_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  buyerId: int("buyerId").notNull(),
  
  // Inquiry Details
  message: text("message").notNull(),
  offerPrice: decimal("offerPrice", { precision: 15, scale: 2 }),
  proposedTerms: text("proposedTerms"),
  
  // Status
  status: mysqlEnum("status", [
    "pending",
    "responded",
    "negotiating",
    "accepted",
    "rejected",
    "expired"
  ]).default("pending"),
  
  // Response
  sellerResponse: text("sellerResponse"),
  respondedAt: timestamp("respondedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssetInquiry = typeof assetInquiries.$inferSelect;
export type InsertAssetInquiry = typeof assetInquiries.$inferInsert;

// Asset Transactions
export const assetTransactions = mysqlTable("asset_transactions", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  sellerId: int("sellerId").notNull(),
  buyerId: int("buyerId").notNull(),
  
  // Transaction Details
  finalPrice: decimal("finalPrice", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  
  // Smart Contract
  contractId: int("contractId"),
  escrowId: int("escrowId"),
  
  // Status
  status: mysqlEnum("status", [
    "pending",
    "escrow_funded",
    "in_progress",
    "completed",
    "disputed",
    "cancelled",
    "refunded"
  ]).default("pending"),
  
  // Timestamps
  initiatedAt: timestamp("initiatedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssetTransaction = typeof assetTransactions.$inferSelect;
export type InsertAssetTransaction = typeof assetTransactions.$inferInsert;

// ============================================
// ANALYTICS & REPORTING LAYER
// ============================================

// Analytics Events Tracking
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Event Details
  eventType: mysqlEnum("eventType", [
    "page_view",
    "idea_submitted",
    "idea_analyzed",
    "challenge_created",
    "challenge_submitted",
    "hackathon_registered",
    "match_suggested",
    "match_accepted",
    "asset_listed",
    "asset_viewed",
    "asset_sold",
    "contract_created",
    "contract_signed",
    "escrow_funded",
    "user_registered",
    "user_login"
  ]).notNull(),
  
  // User & Context
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 100 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  
  // Event Data
  entityType: varchar("entityType", { length: 50 }), // e.g., "idea", "challenge", "asset"
  entityId: int("entityId"),
  metadata: json("metadata"), // Additional event data
  
  // Location
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  // Timestamps
  eventTimestamp: timestamp("eventTimestamp").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;

// System Metrics (Daily Aggregates)
export const systemMetrics = mysqlTable("system_metrics", {
  id: int("id").autoincrement().primaryKey(),
  
  // Date
  date: timestamp("date").notNull().unique(),
  
  // User Metrics
  totalUsers: int("totalUsers").default(0),
  newUsers: int("newUsers").default(0),
  activeUsers: int("activeUsers").default(0),
  
  // UPLINK1 Metrics
  ideasSubmitted: int("ideasSubmitted").default(0),
  ideasAnalyzed: int("ideasAnalyzed").default(0),
  innovationsCount: int("innovationsCount").default(0),
  commercialCount: int("commercialCount").default(0),
  weakCount: int("weakCount").default(0),
  
  // UPLINK2 Metrics
  challengesActive: int("challengesActive").default(0),
  challengeSubmissions: int("challengeSubmissions").default(0),
  hackathonsActive: int("hackathonsActive").default(0),
  hackathonRegistrations: int("hackathonRegistrations").default(0),
  matchesMade: int("matchesMade").default(0),
  connectionsCreated: int("connectionsCreated").default(0),
  
  // UPLINK3 Metrics
  assetsListed: int("assetsListed").default(0),
  assetsActive: int("assetsActive").default(0),
  assetsSold: int("assetsSold").default(0),
  totalTransactionValue: decimal("totalTransactionValue", { precision: 15, scale: 2 }).default("0"),
  contractsCreated: int("contractsCreated").default(0),
  contractsSigned: int("contractsSigned").default(0),
  
  // Engagement Metrics
  pageViews: int("pageViews").default(0),
  avgSessionDuration: int("avgSessionDuration").default(0), // in seconds
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;

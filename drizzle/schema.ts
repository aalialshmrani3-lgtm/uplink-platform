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
  role: mysqlEnum("role", ["user", "admin", "innovator", "investor", "company", "government", "private_sector"]).default("user").notNull(),
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
// CHALLENGES & MATCHING (UPLINK2)
// ============================================
export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }),
  description: text("description").notNull(),
  descriptionEn: text("descriptionEn"),
  type: mysqlEnum("type", ["challenge", "hackathon", "competition", "open_problem", "conference"]).notNull(),
  category: varchar("category", { length: 100 }),
  prize: decimal("prize", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  status: mysqlEnum("status", ["draft", "open", "closed", "judging", "completed", "cancelled"]).default("draft"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  requirements: json("requirements"),
  judges: json("judges"),
  sponsors: json("sponsors"),
  participants: int("participants").default(0),
  submissions: int("submissions").default(0),
  winnerId: int("winnerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

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
    "commercial",      // Classified as commercial project
    "transferred_to_uplink2" // Transferred to UPLINK 2
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
// USER PROFILES (5 TYPES)
// ============================================

// Innovator Profile
export const innovatorProfiles = mysqlTable("innovator_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Skills & Expertise
  skills: json("skills"), // Array of skills
  expertise: json("expertise"), // Array of expertise areas
  education: json("education"), // Array of education records
  experience: json("experience"), // Array of work experience
  
  // Portfolio
  portfolio: json("portfolio"), // Array of projects/achievements
  certifications: json("certifications"),
  publications: json("publications"),
  
  // Preferences
  interestedIndustries: json("interestedIndustries"),
  lookingForFunding: boolean("lookingForFunding").default(false),
  fundingAmount: decimal("fundingAmount", { precision: 15, scale: 2 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InnovatorProfile = typeof innovatorProfiles.$inferSelect;
export type InsertInnovatorProfile = typeof innovatorProfiles.$inferInsert;

// Investor Profile
export const investorProfiles = mysqlTable("investor_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Investment Preferences
  investmentRange: json("investmentRange"), // {min, max, currency}
  industries: json("industries"), // Array of interested industries
  stagePreference: json("stagePreference"), // Array: idea, prototype, mvp, growth, scale
  geographicFocus: json("geographicFocus"), // Array of countries/regions
  
  // Investment History
  totalInvestments: int("totalInvestments").default(0),
  successfulExits: int("successfulExits").default(0),
  portfolio: json("portfolio"), // Array of invested projects
  
  // Profile
  investorType: mysqlEnum("investorType", ["angel", "vc", "corporate", "family_office", "government"]),
  fundSize: decimal("fundSize", { precision: 15, scale: 2 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InvestorProfile = typeof investorProfiles.$inferSelect;
export type InsertInvestorProfile = typeof investorProfiles.$inferInsert;

// Company Profile
export const companyProfiles = mysqlTable("company_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Company Info
  companySize: mysqlEnum("companySize", ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  industry: varchar("industry", { length: 200 }),
  revenue: decimal("revenue", { precision: 15, scale: 2 }),
  headquarters: varchar("headquarters", { length: 200 }),
  foundedYear: int("foundedYear"),
  
  // Business
  businessModel: text("businessModel"),
  products: json("products"),
  services: json("services"),
  clients: json("clients"),
  
  // Innovation Needs
  lookingForInnovation: boolean("lookingForInnovation").default(false),
  innovationAreas: json("innovationAreas"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type InsertCompanyProfile = typeof companyProfiles.$inferInsert;

// Government Profile
export const governmentProfiles = mysqlTable("government_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Government Entity
  department: varchar("department", { length: 200 }),
  ministry: varchar("ministry", { length: 200 }),
  level: mysqlEnum("level", ["federal", "state", "local"]),
  
  // Budget & Focus
  annualBudget: decimal("annualBudget", { precision: 15, scale: 2 }),
  focusAreas: json("focusAreas"), // Array of focus areas
  priorities: json("priorities"),
  
  // Programs
  programs: json("programs"), // Array of government programs
  grants: json("grants"), // Array of available grants
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GovernmentProfile = typeof governmentProfiles.$inferSelect;
export type InsertGovernmentProfile = typeof governmentProfiles.$inferInsert;

// Private Sector Profile
export const privateSectorProfiles = mysqlTable("private_sector_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // Organization Info
  sector: varchar("sector", { length: 200 }),
  organizationType: mysqlEnum("organizationType", ["ngo", "foundation", "association", "chamber", "incubator", "accelerator"]),
  
  // Services & Programs
  services: json("services"),
  programs: json("programs"),
  partnerships: json("partnerships"),
  
  // Support Offered
  supportTypes: json("supportTypes"), // Array: funding, mentorship, networking, training
  targetGroups: json("targetGroups"), // Array: startups, students, researchers, etc.
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PrivateSectorProfile = typeof privateSectorProfiles.$inferSelect;
export type InsertPrivateSectorProfile = typeof privateSectorProfiles.$inferInsert;

// ============================================
// UPLINK2: EVENTS
// ============================================

// Events (Hackathons, Workshops, Conferences)
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Event host
  
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  type: mysqlEnum("type", ["hackathon", "workshop", "conference"]).notNull(),
  
  // Location & Time
  location: varchar("location", { length: 500 }),
  isVirtual: boolean("isVirtual").default(false),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  
  // Capacity & Budget
  capacity: int("capacity"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  
  // Needs
  needSponsors: boolean("needSponsors").default(false),
  needInnovators: boolean("needInnovators").default(false),
  sponsorshipTiers: json("sponsorshipTiers"),
  
  // Status
  status: mysqlEnum("status", ["draft", "published", "ongoing", "completed", "cancelled"]).default("draft"),
  
  // Stats
  registrations: int("registrations").default(0),
  sponsors: int("sponsors").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Event Registrations
export const eventRegistrations = mysqlTable("event_registrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  userId: int("userId").notNull(),
  
  attendeeType: mysqlEnum("attendeeType", ["innovator", "investor", "sponsor", "speaker", "attendee"]).notNull(),
  additionalInfo: text("additionalInfo"),
  
  // Sponsorship (if sponsor)
  sponsorshipTier: varchar("sponsorshipTier", { length: 100 }),
  sponsorshipAmount: decimal("sponsorshipAmount", { precision: 15, scale: 2 }),
  
  status: mysqlEnum("status", ["pending", "approved", "rejected", "attended"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

// Matching Requests
export const matchingRequests = mysqlTable("matching_requests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  seekingType: mysqlEnum("seekingType", ["investor", "innovator", "partner", "mentor", "sponsor"]).notNull(),
  industry: varchar("industry", { length: 200 }),
  stage: varchar("stage", { length: 100 }),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  location: varchar("location", { length: 200 }),
  requirements: text("requirements").notNull(),
  preferences: text("preferences"),
  
  status: mysqlEnum("status", ["active", "matched", "closed"]).default("active"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MatchingRequest = typeof matchingRequests.$inferSelect;
export type InsertMatchingRequest = typeof matchingRequests.$inferInsert;

// Matches
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  matchedUserId: int("matchedUserId").notNull(),
  
  score: decimal("score", { precision: 5, scale: 2 }).notNull(), // 0-100
  reasons: json("reasons"), // Array of matching reasons
  
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "expired"]).default("pending"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// ============================================
// IDEA TRANSITIONS (UPLINK 1 → 2 → 3)
// ============================================
export const ideaTransitions = mysqlTable("idea_transitions", {
  id: int("id").autoincrement().primaryKey(),
  ideaId: int("ideaId").notNull(),
  userId: int("userId").notNull(),
  
  fromEngine: mysqlEnum("fromEngine", ["uplink1", "uplink2", "uplink3"]).notNull(),
  toEngine: mysqlEnum("toEngine", ["uplink1", "uplink2", "uplink3"]).notNull(),
  
  reason: text("reason"), // Why was it transferred?
  score: decimal("score", { precision: 5, scale: 2 }), // Analysis score if applicable
  
  // Metadata
  metadata: json("metadata"), // Additional transition data
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IdeaTransition = typeof ideaTransitions.$inferSelect;
export type InsertIdeaTransition = typeof ideaTransitions.$inferInsert;

// Note: organizations table already exists above (line 975)
// Using existing table for UPLINK 2 matching

// ============================================
// UPLINK2: IP VETTING & MARKETPLACE
// ============================================

// Vetting Reviews (مراجعات الخبراء)
export const vettingReviews = mysqlTable("vetting_reviews", {
  id: int("id").autoincrement().primaryKey(),
  ipRegistrationId: int("ipRegistrationId").notNull(),
  expertId: int("expertId").notNull(),
  
  expertType: mysqlEnum("expertType", ["legal", "technical", "commercial"]).notNull(),
  
  // Review scores (0-100)
  score: int("score").notNull(),
  
  // Detailed evaluation
  noveltyScore: int("noveltyScore"), // 0-100
  feasibilityScore: int("feasibilityScore"), // 0-100
  marketPotentialScore: int("marketPotentialScore"), // 0-100
  
  comments: text("comments"),
  recommendation: mysqlEnum("recommendation", ["approve", "reject", "needs_revision"]).notNull(),
  
  // Revision suggestions (if needs_revision)
  revisionSuggestions: text("revisionSuggestions"),
  
  reviewedAt: timestamp("reviewedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VettingReview = typeof vettingReviews.$inferSelect;
export type InsertVettingReview = typeof vettingReviews.$inferInsert;

// Vetting Decisions (Diamond Decision Point)
export const vettingDecisions = mysqlTable("vetting_decisions", {
  id: int("id").autoincrement().primaryKey(),
  ipRegistrationId: int("ipRegistrationId").notNull().unique(),
  
  // Final decision based on 3 expert reviews
  finalDecision: mysqlEnum("finalDecision", ["approved", "rejected", "needs_revision"]).notNull(),
  
  // Average scores
  averageScore: int("averageScore").notNull(), // 0-100
  legalScore: int("legalScore"),
  technicalScore: int("technicalScore"),
  commercialScore: int("commercialScore"),
  
  // Feedback for innovator
  feedback: text("feedback"),
  
  // Decision maker
  decidedBy: int("decidedBy"),
  decidedAt: timestamp("decidedAt").defaultNow().notNull(),
  
  // If approved, move to UPLINK3
  movedToUPLINK3: boolean("movedToUPLINK3").default(false),
  movedToUPLINK3At: timestamp("movedToUPLINK3At"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VettingDecision = typeof vettingDecisions.$inferSelect;
export type InsertVettingDecision = typeof vettingDecisions.$inferInsert;

// IP Marketplace Listings
export const ipMarketplaceListings = mysqlTable("ip_marketplace_listings", {
  id: int("id").autoincrement().primaryKey(),
  ipRegistrationId: int("ipRegistrationId").notNull(),
  userId: int("userId").notNull(), // IP owner
  
  // Listing details
  listingType: mysqlEnum("listingType", ["license", "sale", "partnership", "joint_venture"]).notNull(),
  
  // Pricing
  price: decimal("price", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("SAR"),
  priceType: mysqlEnum("priceType", ["fixed", "negotiable", "royalty", "equity"]).default("negotiable"),
  
  // Royalty details (if applicable)
  royaltyPercentage: decimal("royaltyPercentage", { precision: 5, scale: 2 }),
  royaltyDuration: int("royaltyDuration"), // in months
  
  // Equity details (if applicable)
  equityPercentage: decimal("equityPercentage", { precision: 5, scale: 2 }),
  
  // Listing content
  description: text("description"),
  terms: text("terms"),
  exclusivity: mysqlEnum("exclusivity", ["exclusive", "non_exclusive"]).default("non_exclusive"),
  
  // Territory
  territory: json("territory"), // Array of countries/regions
  
  // Status
  status: mysqlEnum("status", ["active", "pending", "sold", "licensed", "withdrawn", "expired"]).default("active"),
  
  // Visibility
  visibility: mysqlEnum("visibility", ["public", "private", "verified_only"]).default("public"),
  
  // Stats
  views: int("views").default(0),
  inquiries: int("inquiries").default(0),
  
  // Dates
  listedAt: timestamp("listedAt").defaultNow().notNull(),
  soldAt: timestamp("soldAt"),
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IPMarketplaceListing = typeof ipMarketplaceListings.$inferSelect;
export type InsertIPMarketplaceListing = typeof ipMarketplaceListings.$inferInsert;

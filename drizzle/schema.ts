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

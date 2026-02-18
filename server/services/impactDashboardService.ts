import { getDb } from "../db";
import { ideas, ideaFinancialImpact, innovationMetrics, projects } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

// ==================== Impact Dashboard Service (ROI²) ====================

export interface ROICalculation {
  totalInvestment: number;
  totalRevenue: number;
  roi: number; // Return on Investment (%)
  roi2: number; // Return on Innovation Investment (%)
  breakEvenMonths: number;
  netProfit: number;
}

export interface InnovationImpact {
  ideasSubmitted: number;
  ideasApproved: number;
  projectsLaunched: number;
  totalRevenue: number;
  totalJobs: number;
  averageROI: number;
  successRate: number;
}

/**
 * Calculate ROI for an idea/project
 */
export async function calculateROI(ideaId: number): Promise<ROICalculation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get financial impact data
  const financialData = await db
    .select()
    .from(ideaFinancialImpact)
    .where(eq(ideaFinancialImpact.ideaId, ideaId))
    .limit(1);

  if (!financialData.length) {
    return {
      totalInvestment: 0,
      totalRevenue: 0,
      roi: 0,
      roi2: 0,
      breakEvenMonths: 0,
      netProfit: 0,
    };
  }

  const data = financialData[0];

  const totalInvestment = parseFloat(data.totalCost || "0");
  const totalRevenue = parseFloat(data.revenueGenerated || "0");
  const netProfit = totalRevenue - totalInvestment;
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // ROI² = (Revenue - Cost) / (Cost + Innovation Investment) * 100
  // Innovation Investment = time + resources + opportunity cost
  const innovationInvestment = totalInvestment * 0.2; // 20% overhead
  const roi2 = totalInvestment > 0 ? (netProfit / (totalInvestment + innovationInvestment)) * 100 : 0;

  // Break-even calculation
  const monthlyRevenue = totalRevenue / 12; // Assume 12 months
  const breakEvenMonths = monthlyRevenue > 0 ? totalInvestment / monthlyRevenue : 0;

  return {
    totalInvestment,
    totalRevenue,
    roi: Math.round(roi * 100) / 100,
    roi2: Math.round(roi2 * 100) / 100,
    breakEvenMonths: Math.round(breakEvenMonths),
    netProfit,
  };
}

/**
 * Calculate overall innovation impact
 */
export async function calculateInnovationImpact(): Promise<InnovationImpact> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get ideas count
  const ideasCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ideas);

  const ideasSubmitted = ideasCount[0]?.count || 0;

  // Get approved ideas count (score >= 60)
  const approvedCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ideas)
    .where(sql`CAST(${ideas.overallScore} AS DECIMAL) >= 60`);

  const ideasApproved = approvedCount[0]?.count || 0;

  // Get projects count
  const projectsCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(projects);

  const projectsLaunched = projectsCount[0]?.count || 0;

  // Calculate total revenue
  const revenueSum = await db
    .select({ total: sql<number>`SUM(CAST(${ideaFinancialImpact.revenueGenerated} AS DECIMAL))` })
    .from(ideaFinancialImpact);

  const totalRevenue = revenueSum[0]?.total || 0;

  // Total jobs (not available in schema, set to 0)
  const totalJobs = 0;

  // Calculate average ROI
  const allFinancialData = await db.select().from(ideaFinancialImpact);
  let totalROI = 0;
  let roiCount = 0;

  for (const data of allFinancialData) {
    const investment = parseFloat(data.totalCost || "0");
    const revenue = parseFloat(data.revenueGenerated || "0");
    if (investment > 0) {
      const roi = ((revenue - investment) / investment) * 100;
      totalROI += roi;
      roiCount++;
    }
  }

  const averageROI = roiCount > 0 ? totalROI / roiCount : 0;

  // Calculate success rate
  const successRate = ideasSubmitted > 0 ? (ideasApproved / ideasSubmitted) * 100 : 0;

  return {
    ideasSubmitted,
    ideasApproved,
    projectsLaunched,
    totalRevenue,
    totalJobs,
    averageROI: Math.round(averageROI * 100) / 100,
    successRate: Math.round(successRate * 100) / 100,
  };
}

/**
 * Get innovation metrics
 */
export async function getInnovationMetrics(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(innovationMetrics).orderBy(sql`${innovationMetrics.createdAt} DESC`).limit(10);
}

/**
 * Save innovation metric
 */
export async function saveInnovationMetric(metricData: {
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  periodStart: string;
  periodEnd: string;
  totalIdeas?: number;
  approvedIdeas?: number;
  rejectedIdeas?: number;
  successRate?: string;
  totalInvestment?: string;
  totalReturn?: string;
  averageROI?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(innovationMetrics).values(metricData);
}

/**
 * Calculate innovation velocity (ideas per month)
 */
export async function calculateInnovationVelocity(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ideas)
    .where(sql`${ideas.createdAt} >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);

  return result[0]?.count || 0;
}

/**
 * Calculate innovation efficiency (approved / submitted)
 */
export async function calculateInnovationEfficiency(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const totalCount = await db.select({ count: sql<number>`COUNT(*)` }).from(ideas);
  const approvedCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ideas)
    .where(sql`CAST(${ideas.overallScore} AS DECIMAL) >= 60`);

  const total = totalCount[0]?.count || 0;
  const approved = approvedCount[0]?.count || 0;

  return total > 0 ? (approved / total) * 100 : 0;
}

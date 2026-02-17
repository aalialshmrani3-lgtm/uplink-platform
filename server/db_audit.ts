/**
 * Database helpers for Audit Logging
 */

import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { getDb } from './db';
import { auditLogs, type AuditLog, type InsertAuditLog } from '../drizzle/schema';

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: InsertAuditLog): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(auditLogs).values(data);
  return Number((result as any).insertId || 0);
}

/**
 * Get all audit logs with pagination
 */
export async function getAllAuditLogs(params: {
  limit?: number;
  offset?: number;
  userId?: number;
  resource?: string;
  action?: string;
  status?: 'success' | 'failure';
  startDate?: Date;
  endDate?: Date;
}): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];
  
  const { limit = 100, offset = 0, userId, resource, action, status, startDate, endDate } = params;
  
  const conditions = [];
  if (userId) conditions.push(eq(auditLogs.userId, userId));
  if (resource) conditions.push(eq(auditLogs.resource, resource));
  if (action) conditions.push(eq(auditLogs.action, action));
  if (status) conditions.push(eq(auditLogs.status, status));
  if (startDate) conditions.push(gte(auditLogs.createdAt, startDate.toISOString()));
  if (endDate) conditions.push(lte(auditLogs.createdAt, endDate.toISOString()));
  
  let query = db.select().from(auditLogs);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const logs = await query
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset);
  
  return logs;
}

/**
 * Get audit log by ID
 */
export async function getAuditLogById(id: number): Promise<AuditLog | null> {
  const db = await getDb();
  if (!db) return null;
  
  const logs = await db.select().from(auditLogs).where(eq(auditLogs.id, id)).limit(1);
  return logs[0] || null;
}

/**
 * Get audit logs count
 */
export async function getAuditLogsCount(params: {
  userId?: number;
  resource?: string;
  action?: string;
  status?: 'success' | 'failure';
  startDate?: Date;
  endDate?: Date;
}): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const { userId, resource, action, status, startDate, endDate } = params;
  
  const conditions = [];
  if (userId) conditions.push(eq(auditLogs.userId, userId));
  if (resource) conditions.push(eq(auditLogs.resource, resource));
  if (action) conditions.push(eq(auditLogs.action, action));
  if (status) conditions.push(eq(auditLogs.status, status));
  if (startDate) conditions.push(gte(auditLogs.createdAt, startDate.toISOString()));
  if (endDate) conditions.push(lte(auditLogs.createdAt, endDate.toISOString()));
  
  let query = db.select({ count: sql<number>`count(*)` }).from(auditLogs);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  const result = await query;
  return Number(result[0]?.count || 0);
}

/**
 * Get audit logs grouped by resource
 */
export async function getAuditLogsByResource(): Promise<Array<{ resource: string; count: number }>> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      resource: auditLogs.resource,
      count: sql<number>`count(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.resource);
  
  return results.map(r => ({ resource: r.resource, count: Number(r.count) }));
}

/**
 * Get audit logs grouped by action
 */
export async function getAuditLogsByAction(): Promise<Array<{ action: string; count: number }>> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({
      action: auditLogs.action,
      count: sql<number>`count(*)`,
    })
    .from(auditLogs)
    .groupBy(auditLogs.action);
  
  return results.map(r => ({ action: r.action, count: Number(r.count) }));
}

/**
 * Get recent audit logs for a user
 */
export async function getRecentAuditLogsForUser(userId: number, limit: number = 20): Promise<AuditLog[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
}

/**
 * Delete old audit logs (for cleanup)
 */
export async function deleteOldAuditLogs(daysToKeep: number = 90): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  const result = await db
    .delete(auditLogs)
    .where(lte(auditLogs.createdAt, cutoffDate.toISOString()));
  
  return Number((result as any).rowsAffected || 0);
}

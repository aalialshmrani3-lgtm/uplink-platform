/**
 * Database helpers for Webhooks management
 */

import { eq, and, desc } from "drizzle-orm";
import { webhooks, webhookLogs } from "../drizzle/schema";
import { getDb } from "./db";
import crypto from "crypto";

/**
 * Create a new webhook
 */
export async function createWebhook(data: {
  userId: number;
  name: string;
  url: string;
  events: string[];
  secret?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const [newWebhook] = await db.insert(webhooks).values({
    userId: data.userId,
    name: data.name,
    url: data.url,
    events: data.events,
    secret: data.secret || crypto.randomBytes(32).toString('hex'),
    isActive: true,
  });
  
  return {
    id: newWebhook.insertId,
    name: data.name,
    url: data.url,
    events: data.events,
  };
}

/**
 * Get all webhooks for a user
 */
export async function getUserWebhooks(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  return await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.userId, userId))
    .orderBy(desc(webhooks.createdAt));
}

/**
 * Get active webhooks for a specific event
 */
export async function getActiveWebhooksForEvent(event: string) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const allWebhooks = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.isActive, true));
  
  // Filter webhooks that listen to this event
  return allWebhooks.filter((webhook: any) => {
    const events = webhook.events as string[] || [];
    return events.includes(event) || events.includes('*');
  });
}

/**
 * Update webhook
 */
export async function updateWebhook(
  webhookId: number,
  userId: number,
  data: {
    name?: string;
    url?: string;
    events?: string[];
    isActive?: boolean;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db
    .update(webhooks)
    .set(data)
    .where(
      and(
        eq(webhooks.id, webhookId),
        eq(webhooks.userId, userId)
      )
    );
}

/**
 * Delete webhook
 */
export async function deleteWebhook(webhookId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db
    .delete(webhooks)
    .where(
      and(
        eq(webhooks.id, webhookId),
        eq(webhooks.userId, userId)
      )
    );
}

/**
 * Log webhook call
 */
export async function logWebhookCall(data: {
  webhookId: number;
  event: string;
  payload: any;
  statusCode?: number;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
  retryCount?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db.insert(webhookLogs).values({
    webhookId: data.webhookId,
    event: data.event,
    payload: data.payload,
    statusCode: data.statusCode,
    responseTime: data.responseTime,
    success: data.success,
    errorMessage: data.errorMessage,
    retryCount: data.retryCount || 0,
  });
  
  // Update webhook stats
  const [currentWebhook] = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.id, data.webhookId))
    .limit(1);
  
  if (currentWebhook) {
    await db
      .update(webhooks)
      .set({
        totalCalls: currentWebhook.totalCalls + 1,
        successfulCalls: data.success ? currentWebhook.successfulCalls + 1 : currentWebhook.successfulCalls,
        failedCalls: !data.success ? currentWebhook.failedCalls + 1 : currentWebhook.failedCalls,
        lastTriggeredAt: new Date(),
        lastError: data.errorMessage || currentWebhook.lastError,
      })
      .where(eq(webhooks.id, data.webhookId));
  }
}

/**
 * Get webhook logs
 */
export async function getWebhookLogs(webhookId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  return await db
    .select()
    .from(webhookLogs)
    .where(eq(webhookLogs.webhookId, webhookId))
    .orderBy(desc(webhookLogs.createdAt))
    .limit(limit);
}

/**
 * Get webhook statistics
 */
export async function getWebhookStats(webhookId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const [webhook] = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.id, webhookId))
    .limit(1);
  
  if (!webhook) {
    throw new Error('Webhook not found');
  }
  
  return {
    totalCalls: webhook.totalCalls,
    successfulCalls: webhook.successfulCalls,
    failedCalls: webhook.failedCalls,
    successRate: webhook.totalCalls > 0 
      ? ((webhook.successfulCalls / webhook.totalCalls) * 100).toFixed(2)
      : '0.00',
    lastTriggeredAt: webhook.lastTriggeredAt,
    lastError: webhook.lastError,
  };
}

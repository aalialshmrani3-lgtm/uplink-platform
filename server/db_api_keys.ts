/**
 * Database helpers for API Keys management
 */

import { eq, and, desc } from "drizzle-orm";
import { apiKeys, apiUsage } from "../drizzle/schema";
import { getDb } from "./db";
import crypto from "crypto";

/**
 * Generate a new API key
 * Format: uplink_<random_32_chars>
 */
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const randomPart = crypto.randomBytes(24).toString('base64url'); // URL-safe base64
  const key = `uplink_${randomPart}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const prefix = key.substring(0, 12); // "uplink_abc12"
  
  return { key, hash, prefix };
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(data: {
  userId: number;
  name: string;
  rateLimit?: number;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  const { key, hash, prefix } = generateApiKey();
  
  const [newKey] = await db.insert(apiKeys).values({
    userId: data.userId,
    name: data.name,
    keyHash: hash,
    keyPrefix: prefix,
    rateLimit: data.rateLimit || 1000,
    expiresAt: data.expiresAt,
    status: 'active',
  }).returning();
  
  // Return the plain key ONLY once (user must save it)
  return {
    id: newKey.insertId,
    key, // Plain key - shown only once!
    prefix,
    name: data.name,
    rateLimit: data.rateLimit || 1000,
  };
}

/**
 * Get all API keys for a user (without revealing the actual keys)
 */
export async function getUserApiKeys(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  return await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      rateLimit: apiKeys.rateLimit,
      status: apiKeys.status,
      lastUsedAt: apiKeys.lastUsedAt,
      expiresAt: apiKeys.expiresAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
}

/**
 * Validate an API key and return user info
 */
export async function validateApiKey(key: string) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  
  const [apiKey] = await db
    .select()
    .from(apiKeys)
    .where(
      and(
        eq(apiKeys.keyHash, hash),
        eq(apiKeys.status, 'active')
      )
    )
    .limit(1);
  
  if (!apiKey) {
    return null;
  }
  
  // Check expiration
  if (apiKey.expiresAt && new Date() > new Date(apiKey.expiresAt)) {
    return null;
  }
  
  return apiKey;
}

/**
 * Update API key last used timestamp
 */
export async function updateApiKeyUsage(keyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date().toISOString() })
    .where(eq(apiKeys.id, keyId));
}

/**
 * Record API usage
 */
export async function recordApiUsage(data: {
  apiKeyId: number;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  await db.insert(apiUsage).values({
    apiKeyId: data.apiKeyId,
    endpoint: data.endpoint,
    method: data.method,
    statusCode: data.statusCode,
    responseTime: data.responseTime,
  });
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(keyId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  await db
    .update(apiKeys)
    .set({ status: 'revoked' })
    .where(
      and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      )
    );
}

/**
 * Get API usage statistics for a key
 */
export async function getApiKeyUsageStats(keyId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  // Get total requests
  const usage = await db
    .select()
    .from(apiUsage)
    .where(eq(apiUsage.apiKeyId, keyId));
  
  const totalRequests = usage.length;
  const avgResponseTime = usage.length > 0
    ? usage.reduce((sum: number, u: any) => sum + (u.responseTime || 0), 0) / usage.length
    : 0;
  
  return {
    totalRequests,
    avgResponseTime: Math.round(avgResponseTime),
    lastHourRequests: usage.filter(
      (u: any) => u.timestamp && new Date().getTime() - u.timestamp.getTime() < 3600000
    ).length,
  };
}

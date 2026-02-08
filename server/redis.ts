// Added for Flowchart Match - Redis Cache Layer
import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis client
 */
export async function initRedis() {
  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Redis: Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis: Connected successfully');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis: Failed to initialize:', error);
    return null;
  }
}

/**
 * Get Redis client
 */
export function getRedisClient() {
  return redisClient;
}

/**
 * Cache user activity log
 */
export async function cacheUserActivity(userId: number, activity: any) {
  const client = await initRedis();
  if (!client) return false;

  try {
    const key = `user_activity:${userId}`;
    const value = JSON.stringify({
      ...activity,
      timestamp: new Date().toISOString(),
    });

    await client.lPush(key, value);
    await client.lTrim(key, 0, 99); // Keep last 100 activities
    await client.expire(key, 86400 * 7); // 7 days TTL

    return true;
  } catch (error) {
    console.error('Redis: Failed to cache user activity:', error);
    return false;
  }
}

/**
 * Get user activity logs from cache
 */
export async function getUserActivityLogs(userId: number, limit: number = 50) {
  const client = await initRedis();
  if (!client) return [];

  try {
    const key = `user_activity:${userId}`;
    const logs = await client.lRange(key, 0, limit - 1);
    return logs.map(log => JSON.parse(log));
  } catch (error) {
    console.error('Redis: Failed to get user activity logs:', error);
    return [];
  }
}

/**
 * Cache project data
 */
export async function cacheProject(projectId: number, data: any) {
  const client = await initRedis();
  if (!client) return false;

  try {
    const key = `project:${projectId}`;
    await client.set(key, JSON.stringify(data), {
      EX: 3600 // 1 hour TTL
    });
    return true;
  } catch (error) {
    console.error('Redis: Failed to cache project:', error);
    return false;
  }
}

/**
 * Get cached project
 */
export async function getCachedProject(projectId: number) {
  const client = await initRedis();
  if (!client) return null;

  try {
    const key = `project:${projectId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis: Failed to get cached project:', error);
    return null;
  }
}

/**
 * Invalidate project cache
 */
export async function invalidateProjectCache(projectId: number) {
  const client = await initRedis();
  if (!client) return false;

  try {
    const key = `project:${projectId}`;
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis: Failed to invalidate project cache:', error);
    return false;
  }
}

/**
 * Cache matching results
 */
export async function cacheMatchingResults(userId: number, results: any[]) {
  const client = await initRedis();
  if (!client) return false;

  try {
    const key = `matching:${userId}`;
    await client.set(key, JSON.stringify(results), {
      EX: 1800 // 30 minutes TTL
    });
    return true;
  } catch (error) {
    console.error('Redis: Failed to cache matching results:', error);
    return false;
  }
}

/**
 * Get cached matching results
 */
export async function getCachedMatchingResults(userId: number) {
  const client = await initRedis();
  if (!client) return null;

  try {
    const key = `matching:${userId}`;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis: Failed to get cached matching results:', error);
    return null;
  }
}

/**
 * Close Redis connection
 */
export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

/**
 * Audit Logging Middleware for tRPC
 * Automatically logs sensitive operations
 */

import { createAuditLog } from './db_audit';
import type { InsertAuditLog } from '../drizzle/schema';

export interface AuditOptions {
  resource: string;
  action: string;
  captureInput?: boolean;
  captureOutput?: boolean;
}

/**
 * Middleware factory for automatic audit logging
 * Usage: .use(auditLog({ resource: 'ideas', action: 'delete' }))
 */
export function auditLog(options: AuditOptions) {
  return async ({ ctx, next, input }: any) => {
    const startTime = Date.now();
    let status: 'success' | 'failure' = 'success';
    let errorMessage: string | undefined;
    let output: any;

    try {
      output = await next({ ctx });
      return output;
    } catch (error: any) {
      status = 'failure';
      errorMessage = error.message || 'Unknown error';
      throw error;
    } finally {
      // Log the audit entry asynchronously (don't block the response)
      setImmediate(async () => {
        try {
          const details: any = {
            duration: Date.now() - startTime,
          };

          if (options.captureInput && input) {
            details.input = input;
          }

          if (options.captureOutput && output && status === 'success') {
            details.output = output;
          }

          const auditData: InsertAuditLog = {
            userId: ctx.user?.id || null,
            action: options.action,
            resource: options.resource,
            resourceId: input?.id?.toString() || null,
            details,
            ipAddress: ctx.req?.ip || ctx.req?.headers['x-forwarded-for'] || null,
            userAgent: ctx.req?.headers['user-agent'] || null,
            status,
            errorMessage,
          };

          await createAuditLog(auditData);
        } catch (auditError) {
          // Log audit errors but don't throw (to avoid breaking the main request)
          console.error('[Audit] Failed to log:', auditError);
        }
      });
    }
  };
}

/**
 * Helper to manually log audit events
 */
export async function logAudit(
  userId: number | null,
  resource: string,
  action: string,
  details?: any,
  req?: any
): Promise<void> {
  try {
    const auditData: InsertAuditLog = {
      userId,
      action,
      resource,
      resourceId: details?.resourceId?.toString() || null,
      details,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
      userAgent: req?.headers?.['user-agent'] || null,
      status: 'success',
    };

    await createAuditLog(auditData);
  } catch (error) {
    console.error('[Audit] Failed to log:', error);
  }
}

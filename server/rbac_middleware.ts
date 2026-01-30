/**
 * RBAC Middleware for tRPC
 * Checks user permissions before executing procedures
 */

import { TRPCError } from '@trpc/server';
import { hasPermission, getUserRoles } from './db_rbac';

export interface RBACOptions {
  resource: string;
  action: string;
  requireAll?: boolean; // If true, user must have ALL specified permissions
}

/**
 * Check if user has required permission
 */
export async function checkPermission(
  userId: number,
  resource: string,
  action: string
): Promise<void> {
  const allowed = await hasPermission(userId, resource, action);
  
  if (!allowed) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You don't have permission to ${action} ${resource}`,
    });
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function checkRole(
  userId: number,
  allowedRoles: string[]
): Promise<void> {
  const userRoles = await getUserRoles(userId);
  const userRoleNames = userRoles.map(r => r.name);
  
  const hasRole = allowedRoles.some(role => userRoleNames.includes(role));
  
  if (!hasRole) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
    });
  }
}

/**
 * Check multiple permissions
 */
export async function checkPermissions(
  userId: number,
  permissions: Array<{ resource: string; action: string }>,
  requireAll: boolean = false
): Promise<void> {
  const checks = await Promise.all(
    permissions.map(p => hasPermission(userId, p.resource, p.action))
  );
  
  const allowed = requireAll ? checks.every(c => c) : checks.some(c => c);
  
  if (!allowed) {
    const permStr = permissions.map(p => `${p.action} ${p.resource}`).join(', ');
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You don't have required permissions: ${permStr}`,
    });
  }
}

/**
 * Middleware factory for tRPC procedures
 * Usage: .use(requirePermission({ resource: 'ideas', action: 'create' }))
 */
export function requirePermission(options: RBACOptions) {
  return async ({ ctx, next }: any) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in',
      });
    }
    
    await checkPermission(ctx.user.id, options.resource, options.action);
    
    return next({ ctx });
  };
}

/**
 * Middleware factory for role-based access
 * Usage: .use(requireRole(['admin', 'super_admin']))
 */
export function requireRole(allowedRoles: string[]) {
  return async ({ ctx, next }: any) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in',
      });
    }
    
    await checkRole(ctx.user.id, allowedRoles);
    
    return next({ ctx });
  };
}

/**
 * Middleware for super admin only
 */
export const requireSuperAdmin = requireRole(['super_admin']);

/**
 * Middleware for admin or super admin
 */
export const requireAdmin = requireRole(['admin', 'super_admin']);

import { eq, and, inArray } from 'drizzle-orm';
import { getDb } from './db';
import {
  roles,
  permissions,
  rolePermissions,
  userRoles,
  dataVisibilityRules,
  type Role,
  type Permission,
  type RolePermission,
  type UserRole,
  type DataVisibilityRule,
  type InsertRole,
  type InsertPermission,
  type InsertRolePermission,
  type InsertUserRole,
  type InsertDataVisibilityRule,
} from '../drizzle/schema';

// ============================================
// ROLES
// ============================================

export async function getAllRoles(): Promise<Role[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(roles);
}

export async function getRoleById(id: number): Promise<Role | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(roles).where(eq(roles.id, id));
  return result[0];
}

export async function getRoleByName(name: string): Promise<Role | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(roles).where(eq(roles.name, name));
  return result[0];
}

export async function createRole(role: InsertRole): Promise<Role> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(roles).values(role);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  if (!insertId) throw new Error('Failed to get insertId');
  return await getRoleById(Number(insertId)) as Role;
}

export async function updateRole(id: number, updates: Partial<InsertRole>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(roles).set(updates).where(eq(roles.id, id));
}

export async function deleteRole(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Check if it's a system role
  const role = await getRoleById(id);
  if (role?.isSystem) {
    throw new Error('Cannot delete system role');
  }
  
  // Delete associated records first
  await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
  await db.delete(userRoles).where(eq(userRoles.roleId, id));
  await db.delete(dataVisibilityRules).where(eq(dataVisibilityRules.roleId, id));
  
  // Delete the role
  await db.delete(roles).where(eq(roles.id, id));
}

// ============================================
// PERMISSIONS
// ============================================

export async function getAllPermissions(): Promise<Permission[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(permissions);
}

export async function getPermissionById(id: number): Promise<Permission | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(permissions).where(eq(permissions.id, id));
  return result[0];
}

export async function createPermission(permission: InsertPermission): Promise<Permission> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(permissions).values(permission);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  if (!insertId) throw new Error('Failed to get insertId');
  return await getPermissionById(Number(insertId)) as Permission;
}

// ============================================
// ROLE PERMISSIONS
// ============================================

export async function getPermissionsForRole(roleId: number): Promise<Permission[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ permission: permissions })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, roleId));
  
  return result.map((r: any) => r.permission);
}

export async function assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.insert(rolePermissions).values({
    roleId,
    permissionId,
  });
}

export async function removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(rolePermissions).where(
    and(
      eq(rolePermissions.roleId, roleId),
      eq(rolePermissions.permissionId, permissionId)
    )
  );
}

// ============================================
// USER ROLES
// ============================================

export async function getUserRoles(userId: number): Promise<Role[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({ role: roles })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));
  
  return result.map((r: any) => r.role);
}

export async function getUserPermissions(userId: number): Promise<Permission[]> {
  const db = await getDb();
  if (!db) return [];
  
  const userRolesList = await getUserRoles(userId);
  const roleIds = userRolesList.map(r => r.id);
  
  if (roleIds.length === 0) return [];
  
  const result = await db
    .select({ permission: permissions })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(inArray(rolePermissions.roleId, roleIds));
  
  // Remove duplicates
  const uniquePermissions = new Map<number, Permission>();
  result.forEach((r: any) => {
    uniquePermissions.set(r.permission.id, r.permission);
  });
  
  return Array.from(uniquePermissions.values());
}

export async function assignRoleToUser(userId: number, roleId: number, assignedBy?: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.insert(userRoles).values({
    userId,
    roleId,
    assignedBy,
  });
}

export async function removeRoleFromUser(userId: number, roleId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db.delete(userRoles).where(
    and(
      eq(userRoles.userId, userId),
      eq(userRoles.roleId, roleId)
    )
  );
}

export async function hasPermission(userId: number, resource: string, action: string): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId);
  return userPermissions.some(p => p.resource === resource && p.action === action);
}

// ============================================
// DATA VISIBILITY RULES
// ============================================

export async function getDataVisibilityRulesForRole(roleId: number): Promise<DataVisibilityRule[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(dataVisibilityRules).where(eq(dataVisibilityRules.roleId, roleId));
}

export async function createDataVisibilityRule(rule: InsertDataVisibilityRule): Promise<DataVisibilityRule> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db.insert(dataVisibilityRules).values(rule);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  if (!insertId) throw new Error('Failed to get insertId');
  const inserted = await db.select().from(dataVisibilityRules).where(eq(dataVisibilityRules.id, Number(insertId)));
  return inserted[0];
}

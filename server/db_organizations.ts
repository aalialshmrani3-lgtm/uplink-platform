import { getDb } from './db.js';
import { organizations, ideaOrganizations, projectOrganizations } from '../drizzle/schema.js';
import { eq, and, desc, sql } from 'drizzle-orm';

// ==================== Organizations ====================

/**
 * Get all organizations with optional filtering
 */
export async function getAllOrganizations(filters?: {
  type?: 'government' | 'academic' | 'private' | 'supporting';
  scope?: 'local' | 'global';
  country?: string;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters) {
    if (filters.type) conditions.push(eq(organizations.type, filters.type));
    if (filters.scope) conditions.push(eq(organizations.scope, filters.scope));
    if (filters.country) conditions.push(eq(organizations.country, filters.country));
    if (filters.isActive !== undefined) conditions.push(eq(organizations.isActive, filters.isActive ? 1 : 0));
  }

  if (conditions.length > 0) {
    return db.select().from(organizations).where(and(...conditions)).orderBy(organizations.nameAr);
  }

  return db.select().from(organizations).orderBy(organizations.nameAr);
}

/**
 * Get organization by ID
 */
export async function getOrganizationById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
  return result[0] || null;
}

/**
 * Create new organization
 */
export async function createOrganization(data: {
  nameAr: string;
  nameEn: string;
  type: 'government' | 'academic' | 'private' | 'supporting';
  scope: 'local' | 'global';
  country: string;
  logo?: string;
  description?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(organizations).values({
    ...data,
    isActive: (data.isActive ?? true) ? 1 : 0,
  });

  // Get the last inserted ID
  const lastInsert = await db.select({ id: organizations.id }).from(organizations).orderBy(desc(organizations.id)).limit(1);
  return lastInsert[0] ? await getOrganizationById(lastInsert[0].id) : null;
}

/**
 * Update organization
 */
export async function updateOrganization(
  id: number,
  data: Partial<{
    nameAr: string;
    nameEn: string;
    type: 'government' | 'academic' | 'private' | 'supporting';
    scope: 'local' | 'global';
    country: string;
    logo: string;
    description: string;
    website: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) return null;

  const updateData: any = {};
  if (data.nameAr) updateData.nameAr = data.nameAr;
  if (data.nameEn) updateData.nameEn = data.nameEn;
  if (data.type) updateData.type = data.type;
  if (data.scope) updateData.scope = data.scope;
  if (data.country) updateData.country = data.country;
  if (data.logo) updateData.logo = data.logo;
  if (data.description) updateData.description = data.description;
  if (data.website) updateData.website = data.website;
  if (data.contactEmail) updateData.contactEmail = data.contactEmail;
  if (data.contactPhone) updateData.contactPhone = data.contactPhone;
  if (data.isActive !== undefined) updateData.isActive = data.isActive ? 1 : 0;
  
  await db.update(organizations).set(updateData).where(eq(organizations.id, id));
  return await getOrganizationById(id);
}

/**
 * Delete organization (soft delete by setting isActive = false)
 */
export async function deleteOrganization(id: number) {
  const db = await getDb();
  if (!db) return false;

  await db.update(organizations).set({ isActive: 0 }).where(eq(organizations.id, id));
  return true;
}

// ==================== Idea Organizations ====================

/**
 * Link idea to organizations
 */
export async function linkIdeaToOrganizations(ideaId: number, organizationIds: number[]) {
  const db = await getDb();
  if (!db) return [];

  // Remove existing links
  await db.delete(ideaOrganizations).where(eq(ideaOrganizations.ideaId, ideaId));

  // Add new links
  if (organizationIds.length === 0) return [];

  const values = organizationIds.map(orgId => ({
    ideaId,
    organizationId: orgId,
  }));

  await db.insert(ideaOrganizations).values(values);
  return await getIdeaOrganizations(ideaId);
}

/**
 * Get organizations linked to an idea
 */
export async function getIdeaOrganizations(ideaId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: organizations.id,
      nameAr: organizations.nameAr,
      nameEn: organizations.nameEn,
      type: organizations.type,
      scope: organizations.scope,
      country: organizations.country,
      logo: organizations.logo,
    })
    .from(ideaOrganizations)
    .innerJoin(organizations, eq(ideaOrganizations.organizationId, organizations.id))
    .where(eq(ideaOrganizations.ideaId, ideaId));

  return result;
}

/**
 * Get ideas linked to an organization
 */
export async function getOrganizationIdeas(organizationId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      ideaId: ideaOrganizations.ideaId,
    })
    .from(ideaOrganizations)
    .where(eq(ideaOrganizations.organizationId, organizationId));

  return result.map(r => r.ideaId);
}

// ==================== Project Organizations ====================

/**
 * Link project to organizations
 */
export async function linkProjectToOrganizations(projectId: number, organizationIds: number[]) {
  const db = await getDb();
  if (!db) return [];

  // Remove existing links
  await db.delete(projectOrganizations).where(eq(projectOrganizations.projectId, projectId));

  // Add new links
  if (organizationIds.length === 0) return [];

  const values = organizationIds.map(orgId => ({
    projectId,
    organizationId: orgId,
  }));

  await db.insert(projectOrganizations).values(values);
  return await getProjectOrganizations(projectId);
}

/**
 * Get organizations linked to a project
 */
export async function getProjectOrganizations(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: organizations.id,
      nameAr: organizations.nameAr,
      nameEn: organizations.nameEn,
      type: organizations.type,
      scope: organizations.scope,
      country: organizations.country,
      logo: organizations.logo,
    })
    .from(projectOrganizations)
    .innerJoin(organizations, eq(projectOrganizations.organizationId, organizations.id))
    .where(eq(projectOrganizations.projectId, projectId));

  return result;
}

/**
 * Get projects linked to an organization
 */
export async function getOrganizationProjects(organizationId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      projectId: projectOrganizations.projectId,
    })
    .from(projectOrganizations)
    .where(eq(projectOrganizations.organizationId, organizationId));

  return result.map(r => r.projectId);
}

// ==================== Statistics ====================

/**
 * Get organization statistics (ideas count, projects count)
 */
export async function getOrganizationStats(organizationId: number) {
  const db = await getDb();
  if (!db) return null;

  const ideasCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(ideaOrganizations)
    .where(eq(ideaOrganizations.organizationId, organizationId));

  const projectsCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectOrganizations)
    .where(eq(projectOrganizations.organizationId, organizationId));

  return {
    ideasCount: Number(ideasCount[0]?.count || 0),
    projectsCount: Number(projectsCount[0]?.count || 0),
  };
}

/**
 * Get all organizations with their statistics
 */
export async function getAllOrganizationsWithStats() {
  const db = await getDb();
  if (!db) return [];

  const orgs = await getAllOrganizations({ isActive: true });

  const orgsWithStats = await Promise.all(
    orgs.map(async (org) => {
      const stats = await getOrganizationStats(org.id);
      return {
        ...org,
        ...stats,
      };
    })
  );

  return orgsWithStats;
}

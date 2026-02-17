/**
 * RBAC Seed Script
 * Seeds the database with default roles and permissions
 */

import {
  createRole,
  createPermission,
  assignPermissionToRole,
  getRoleByName,
  getAllPermissions,
  createDataVisibilityRule,
} from './db_rbac';

// Define default permissions
const defaultPermissions = [
  // Ideas
  { resource: 'ideas', action: 'read', displayName: 'View Ideas', description: 'View all ideas in the system' },
  { resource: 'ideas', action: 'create', displayName: 'Create Ideas', description: 'Submit new ideas' },
  { resource: 'ideas', action: 'update', displayName: 'Edit Ideas', description: 'Edit existing ideas' },
  { resource: 'ideas', action: 'delete', displayName: 'Delete Ideas', description: 'Delete ideas' },
  { resource: 'ideas', action: 'evaluate', displayName: 'Evaluate Ideas', description: 'Evaluate and score ideas' },
  
  // Projects
  { resource: 'projects', action: 'read', displayName: 'View Projects', description: 'View all projects' },
  { resource: 'projects', action: 'create', displayName: 'Create Projects', description: 'Create new projects' },
  { resource: 'projects', action: 'update', displayName: 'Edit Projects', description: 'Edit existing projects' },
  { resource: 'projects', action: 'delete', displayName: 'Delete Projects', description: 'Delete projects' },
  
  // Users
  { resource: 'users', action: 'read', displayName: 'View Users', description: 'View user profiles' },
  { resource: 'users', action: 'update', displayName: 'Edit Users', description: 'Edit user profiles' },
  { resource: 'users', action: 'delete', displayName: 'Delete Users', description: 'Delete user accounts' },
  { resource: 'users', action: 'manage_roles', displayName: 'Manage User Roles', description: 'Assign/remove roles from users' },
  
  // Analytics
  { resource: 'analytics', action: 'read', displayName: 'View Analytics', description: 'View platform analytics' },
  { resource: 'analytics', action: 'export', displayName: 'Export Analytics', description: 'Export analytics data' },
  
  // ML Models
  { resource: 'models', action: 'read', displayName: 'View Models', description: 'View ML model information' },
  { resource: 'models', action: 'train', displayName: 'Train Models', description: 'Train and retrain ML models' },
  { resource: 'models', action: 'deploy', displayName: 'Deploy Models', description: 'Deploy ML models to production' },
  
  // API Keys
  { resource: 'api_keys', action: 'read', displayName: 'View API Keys', description: 'View API keys' },
  { resource: 'api_keys', action: 'create', displayName: 'Create API Keys', description: 'Generate new API keys' },
  { resource: 'api_keys', action: 'delete', displayName: 'Delete API Keys', description: 'Revoke API keys' },
  
  // Webhooks
  { resource: 'webhooks', action: 'read', displayName: 'View Webhooks', description: 'View webhook configurations' },
  { resource: 'webhooks', action: 'create', displayName: 'Create Webhooks', description: 'Create new webhooks' },
  { resource: 'webhooks', action: 'update', displayName: 'Edit Webhooks', description: 'Edit webhook configurations' },
  { resource: 'webhooks', action: 'delete', displayName: 'Delete Webhooks', description: 'Delete webhooks' },
  
  // System
  { resource: 'system', action: 'admin', displayName: 'System Administration', description: 'Full system administration access' },
  { resource: 'system', action: 'audit', displayName: 'View Audit Logs', description: 'View system audit logs' },
];

// Define default roles
const defaultRoles = [
  {
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    isSystem: 1,
    permissions: ['*'], // All permissions
  },
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Platform administrator with most permissions',
    isSystem: 1,
    permissions: [
      'ideas:read', 'ideas:create', 'ideas:update', 'ideas:delete', 'ideas:evaluate',
      'projects:read', 'projects:create', 'projects:update', 'projects:delete',
      'users:read', 'users:update', 'users:manage_roles',
      'analytics:read', 'analytics:export',
      'models:read', 'models:train',
      'webhooks:read', 'webhooks:create', 'webhooks:update', 'webhooks:delete',
      'system:audit',
    ],
  },
  {
    name: 'data_scientist',
    displayName: 'Data Scientist',
    description: 'ML model management and analytics access',
    isSystem: 1,
    permissions: [
      'ideas:read', 'ideas:evaluate',
      'projects:read',
      'analytics:read', 'analytics:export',
      'models:read', 'models:train', 'models:deploy',
    ],
  },
  {
    name: 'reviewer',
    displayName: 'Reviewer',
    description: 'Can review and evaluate ideas',
    isSystem: 1,
    permissions: [
      'ideas:read', 'ideas:evaluate',
      'projects:read',
      'analytics:read',
    ],
  },
  {
    name: 'innovator',
    displayName: 'Innovator',
    description: 'Can submit and manage own ideas',
    isSystem: 1,
    permissions: [
      'ideas:read', 'ideas:create', 'ideas:update',
      'projects:read', 'projects:create', 'projects:update',
    ],
  },
  {
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to public information',
    isSystem: 1,
    permissions: [
      'ideas:read',
      'projects:read',
    ],
  },
];

export async function seedRBAC() {
  console.log('[RBAC Seed] Starting...');
  
  try {
    // Create permissions
    console.log('[RBAC Seed] Creating permissions...');
    const createdPermissions = [];
    for (const perm of defaultPermissions) {
      const created = await createPermission(perm);
      createdPermissions.push(created);
      console.log(`  ✓ Created permission: ${perm.resource}:${perm.action}`);
    }
    
    // Create roles and assign permissions
    console.log('[RBAC Seed] Creating roles...');
    for (const roleData of defaultRoles) {
      const { permissions: permList, ...roleInfo } = roleData;
      
      // Check if role already exists
      const existing = await getRoleByName(roleInfo.name);
      if (existing) {
        console.log(`  ⊘ Role already exists: ${roleInfo.name}`);
        continue;
      }
      
      const role = await createRole(roleInfo);
      console.log(`  ✓ Created role: ${roleInfo.name}`);
      
      // Assign permissions
      if (permList.includes('*')) {
        // Assign all permissions
        for (const perm of createdPermissions) {
          await assignPermissionToRole(role.id, perm.id);
        }
        console.log(`    → Assigned ALL permissions to ${roleInfo.name}`);
      } else {
        // Assign specific permissions
        for (const permStr of permList) {
          const [resource, action] = permStr.split(':');
          const permission = createdPermissions.find(
            p => p.resource === resource && p.action === action
          );
          if (permission) {
            await assignPermissionToRole(role.id, permission.id);
          }
        }
        console.log(`    → Assigned ${permList.length} permissions to ${roleInfo.name}`);
      }
      
      // Create data visibility rules
      if (roleInfo.name === 'super_admin' || roleInfo.name === 'admin') {
        await createDataVisibilityRule({
          roleId: role.id,
          resourceType: 'ideas',
          visibilityScope: 'all',
          customFilter: null,
        });
        await createDataVisibilityRule({
          roleId: role.id,
          resourceType: 'projects',
          visibilityScope: 'all',
          customFilter: null,
        });
      } else if (roleInfo.name === 'innovator') {
        await createDataVisibilityRule({
          roleId: role.id,
          resourceType: 'ideas',
          visibilityScope: 'own',
          customFilter: null,
        });
        await createDataVisibilityRule({
          roleId: role.id,
          resourceType: 'projects',
          visibilityScope: 'own',
          customFilter: null,
        });
      }
    }
    
    console.log('[RBAC Seed] ✅ Completed successfully!');
  } catch (error) {
    console.error('[RBAC Seed] ❌ Error:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRBAC()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
// Toast notifications would be added here
import { Shield, Plus, Edit, Trash2, Users, Key } from 'lucide-react';

export default function RoleManagement() {
  const toast = (opts: any) => console.log(opts.title);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: roles, refetch: refetchRoles } = trpc.rbac.getAllRoles.useQuery();
  const { data: permissions } = trpc.rbac.getAllPermissions.useQuery();
  const { data: rolePermissions, refetch: refetchRolePermissions } = trpc.rbac.getPermissionsForRole.useQuery(
    { roleId: selectedRole! },
    { enabled: !!selectedRole }
  );

  const createRoleMutation = trpc.rbac.createRole.useMutation({
    onSuccess: () => {
      toast({ title: '✅ Role created successfully' });
      refetchRoles();
      setIsCreateDialogOpen(false);
    },
  });

  const updateRoleMutation = trpc.rbac.updateRole.useMutation({
    onSuccess: () => {
      toast({ title: '✅ Role updated successfully' });
      refetchRoles();
      setIsEditDialogOpen(false);
    },
  });

  const deleteRoleMutation = trpc.rbac.deleteRole.useMutation({
    onSuccess: () => {
      toast({ title: '✅ Role deleted successfully' });
      refetchRoles();
    },
    onError: (error) => {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive' });
    },
  });

  const assignPermissionMutation = trpc.rbac.assignPermissionToRole.useMutation({
    onSuccess: () => {
      refetchRolePermissions();
      toast({ title: '✅ Permission assigned' });
    },
  });

  const removePermissionMutation = trpc.rbac.removePermissionFromRole.useMutation({
    onSuccess: () => {
      refetchRolePermissions();
      toast({ title: '✅ Permission removed' });
    },
  });

  const handleCreateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createRoleMutation.mutate({
      name: formData.get('name') as string,
      displayName: formData.get('displayName') as string,
      description: formData.get('description') as string,
    });
  };

  const handleUpdateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;
    const formData = new FormData(e.currentTarget);
    updateRoleMutation.mutate({
      id: selectedRole,
      displayName: formData.get('displayName') as string,
      description: formData.get('description') as string,
    });
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      deleteRoleMutation.mutate({ id });
    }
  };

  const handleTogglePermission = (permissionId: number, isAssigned: boolean) => {
    if (!selectedRole) return;
    
    if (isAssigned) {
      removePermissionMutation.mutate({ roleId: selectedRole, permissionId });
    } else {
      assignPermissionMutation.mutate({ roleId: selectedRole, permissionId });
    }
  };

  const selectedRoleData = roles?.find(r => r.id === selectedRole);
  const rolePermissionIds = new Set(rolePermissions?.map(p => p.id) || []);

  // Group permissions by resource
  const permissionsByResource = permissions?.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Role Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and permissions for access control
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name (system)</Label>
                <Input id="name" name="name" placeholder="e.g., content_manager" required />
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" name="displayName" placeholder="e.g., Content Manager" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Role description..." />
              </div>
              <Button type="submit" className="w-full" disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card className="p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Roles ({roles?.length || 0})
          </h2>
          <div className="space-y-2">
            {roles?.map(role => (
              <div
                key={role.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === role.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{role.displayName}</div>
                    <div className="text-xs text-muted-foreground">{role.name}</div>
                  </div>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">System</Badge>
                  )}
                </div>
                {!role.isSystem && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRole(role.id);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Permissions Management */}
        <Card className="p-4 lg:col-span-2">
          {selectedRole ? (
            <>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permissions for {selectedRoleData?.displayName}
              </h2>
              {selectedRoleData?.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedRoleData.description}
                </p>
              )}
              <div className="space-y-6">
                {Object.entries(permissionsByResource || {}).map(([resource, perms]) => (
                  <div key={resource} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3 capitalize">{resource}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {perms.map(perm => {
                        const isAssigned = rolePermissionIds.has(perm.id);
                        return (
                          <div key={perm.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`perm-${perm.id}`}
                              checked={isAssigned}
                              onCheckedChange={() => handleTogglePermission(perm.id, isAssigned)}
                              disabled={!!selectedRoleData?.isSystem}
                            />
                            <label
                              htmlFor={`perm-${perm.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {perm.displayName}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Select a role to manage permissions
            </div>
          )}
        </Card>
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateRole} className="space-y-4">
            <div>
              <Label htmlFor="edit-displayName">Display Name</Label>
              <Input
                id="edit-displayName"
                name="displayName"
                defaultValue={selectedRoleData?.displayName}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={selectedRoleData?.description || ''}
              />
            </div>
            <Button type="submit" className="w-full" disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

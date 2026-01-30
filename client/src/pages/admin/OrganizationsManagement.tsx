import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Plus, Building2, GraduationCap, Briefcase, HeartHandshake, Globe, MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const translations = {
  ar: {
    title: 'إدارة الجهات',
    pageDescription: 'إدارة الجهات المحلية والعالمية المشاركة في المنصة',
    addOrganization: 'إضافة جهة جديدة',
    filterByType: 'تصفية حسب النوع',
    filterByScope: 'تصفية حسب النطاق',
    allTypes: 'جميع الأنواع',
    allScopes: 'جميع النطاقات',
    government: 'حكومية',
    academic: 'أكاديمية',
    private: 'قطاع خاص',
    supporting: 'داعمة',
    local: 'محلية',
    global: 'عالمية',
    ideas: 'فكرة',
    projects: 'مشروع',
    nameAr: 'الاسم بالعربية',
    nameEn: 'الاسم بالإنجليزية',
    type: 'النوع',
    scope: 'النطاق',
    country: 'الدولة',
    description: 'الوصف',
    website: 'الموقع الإلكتروني',
    contactEmail: 'البريد الإلكتروني',
    contactPhone: 'رقم الهاتف',
    logo: 'الشعار (URL)',
    create: 'إنشاء',
    update: 'تحديث',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    confirmDelete: 'هل أنت متأكد من حذف هذه الجهة؟',
    createSuccess: 'تم إنشاء الجهة بنجاح',
    updateSuccess: 'تم تحديث الجهة بنجاح',
    deleteSuccess: 'تم حذف الجهة بنجاح',
    error: 'حدث خطأ',
    loading: 'جاري التحميل...',
    noOrganizations: 'لا توجد جهات',
    visitWebsite: 'زيارة الموقع',
  },
  en: {
    title: 'Organizations Management',
    pageDescription: 'Manage local and global organizations participating in the platform',
    addOrganization: 'Add New Organization',
    filterByType: 'Filter by Type',
    filterByScope: 'Filter by Scope',
    allTypes: 'All Types',
    allScopes: 'All Scopes',
    government: 'Government',
    academic: 'Academic',
    private: 'Private',
    supporting: 'Supporting',
    local: 'Local',
    global: 'Global',
    ideas: 'Ideas',
    projects: 'Projects',
    nameAr: 'Arabic Name',
    nameEn: 'English Name',
    type: 'Type',
    scope: 'Scope',
    country: 'Country',
    description: 'Description',
    website: 'Website',
    contactEmail: 'Contact Email',
    contactPhone: 'Contact Phone',
    logo: 'Logo (URL)',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this organization?',
    createSuccess: 'Organization created successfully',
    updateSuccess: 'Organization updated successfully',
    deleteSuccess: 'Organization deleted successfully',
    error: 'An error occurred',
    loading: 'Loading...',
    noOrganizations: 'No organizations found',
    visitWebsite: 'Visit Website',
  },
};

const typeIcons = {
  government: Building2,
  academic: GraduationCap,
  private: Briefcase,
  supporting: HeartHandshake,
};

const typeColors = {
  government: 'bg-blue-500',
  academic: 'bg-purple-500',
  private: 'bg-orange-500',
  supporting: 'bg-red-500',
};

export default function OrganizationsManagement() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.ar;

  const utils = trpc.useUtils();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    type: 'government' as 'government' | 'academic' | 'private' | 'supporting',
    scope: 'local' as 'local' | 'global',
    country: 'Saudi Arabia',
    description: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    logo: '',
  });

  // Fetch organizations with stats
  const { data: organizations = [], isLoading } = trpc.organizations.getAllWithStats.useQuery();

  // Create mutation
  const createMutation = trpc.organizations.create.useMutation({
    onSuccess: () => {
      alert(t.createSuccess);
      setIsCreateDialogOpen(false);
      resetForm();
      utils.organizations.getAllWithStats.invalidate();
    },
    onError: (error) => {
      alert(`${t.error}: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = trpc.organizations.update.useMutation({
    onSuccess: () => {
      alert(t.updateSuccess);
      setEditingOrg(null);
      resetForm();
      utils.organizations.getAllWithStats.invalidate();
    },
    onError: (error) => {
      alert(`${t.error}: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = trpc.organizations.delete.useMutation({
    onSuccess: () => {
      alert(t.deleteSuccess);
      utils.organizations.getAllWithStats.invalidate();
    },
    onError: (error) => {
      alert(`${t.error}: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      type: 'government',
      scope: 'local',
      country: 'Saudi Arabia',
      description: '',
      website: '',
      contactEmail: '',
      contactPhone: '',
      logo: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrg) {
      updateMutation.mutate({ id: editingOrg.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (org: any) => {
    setEditingOrg(org);
    setFormData({
      nameAr: org.nameAr,
      nameEn: org.nameEn,
      type: org.type,
      scope: org.scope,
      country: org.country,
      description: org.description || '',
      website: org.website || '',
      contactEmail: org.contactEmail || '',
      contactPhone: org.contactPhone || '',
      logo: org.logo || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t.confirmDelete)) {
      deleteMutation.mutate({ id });
    }
  };

  // Filter organizations
  const filteredOrganizations = organizations.filter((org) => {
    if (typeFilter !== 'all' && org.type !== typeFilter) return false;
    if (scopeFilter !== 'all' && org.scope !== scopeFilter) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.pageDescription}</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t.filterByType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allTypes}</SelectItem>
            <SelectItem value="government">{t.government}</SelectItem>
            <SelectItem value="academic">{t.academic}</SelectItem>
            <SelectItem value="private">{t.private}</SelectItem>
            <SelectItem value="supporting">{t.supporting}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={scopeFilter} onValueChange={setScopeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t.filterByScope} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allScopes}</SelectItem>
            <SelectItem value="local">{t.local}</SelectItem>
            <SelectItem value="global">{t.global}</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingOrg(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              {t.addOrganization}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrg ? t.edit : t.addOrganization}</DialogTitle>
              <DialogDescription>
                {editingOrg ? t.update : t.create}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameAr">{t.nameAr}</Label>
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">{t.nameEn}</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">{t.type}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">{t.government}</SelectItem>
                      <SelectItem value="academic">{t.academic}</SelectItem>
                      <SelectItem value="private">{t.private}</SelectItem>
                      <SelectItem value="supporting">{t.supporting}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scope">{t.scope}</Label>
                  <Select
                    value={formData.scope}
                    onValueChange={(value: any) => setFormData({ ...formData, scope: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">{t.local}</SelectItem>
                      <SelectItem value="global">{t.global}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="country">{t.country}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">{t.website}</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo">{t.logo}</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">{t.contactEmail}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">{t.contactPhone}</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t.cancel}
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingOrg ? t.update : t.create}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations Grid */}
      {filteredOrganizations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t.noOrganizations}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrganizations.map((org) => {
            const Icon = typeIcons[org.type as keyof typeof typeIcons];
            const colorClass = typeColors[org.type as keyof typeof typeColors];

            return (
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{language === 'ar' ? org.nameAr : org.nameEn}</CardTitle>
                  <CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{t[org.type as keyof typeof t]}</Badge>
                      <Badge variant="outline">
                        {org.scope === 'local' ? <MapPin className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
                        {t[org.scope as keyof typeof t]}
                      </Badge>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.ideas}:</span>
                      <span className="font-semibold">{org.ideasCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.projects}:</span>
                      <span className="font-semibold">{org.projectsCount || 0}</span>
                    </div>
                    {org.website && (
                      <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                        <a href={org.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {t.visitWebsite}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

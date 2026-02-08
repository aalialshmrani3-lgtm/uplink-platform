// Added for Flowchart Match - UPLINK2 Hackathons Page
import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trophy, Calendar, MapPin, Users, Globe, Plus, Search } from 'lucide-react';

export default function Uplink2Hackathons() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: hackathons, isLoading } = trpc.uplink2.hackathons.getAll.useQuery({});

  const createMutation = trpc.uplink2.hackathons.create.useMutation({
    onSuccess: () => {
      toast.success('تم إنشاء الهاكاثون بنجاح');
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error('فشل إنشاء الهاكاثون: ' + error.message);
    }
  });

  const registerMutation = trpc.uplink2.hackathons.register.useMutation({
    onSuccess: () => {
      toast.success('تم التسجيل بنجاح');
    },
    onError: (error) => {
      toast.error('فشل التسجيل: ' + error.message);
    }
  });

  const handleCreateHackathon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      isOnline: formData.get('isOnline') === 'on',
      maxTeams: parseInt(formData.get('maxTeams') as string) || undefined,
      prizes: formData.get('prizes') as string,
      requirements: formData.get('requirements') as string,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-400" />
                الهاكاثونات
              </h1>
              <p className="text-slate-400 text-lg">
                شارك في الهاكاثونات وتحديات الابتكار
              </p>
            </div>
            {user && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                إنشاء هاكاثون
              </Button>
            )}
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-900/50 backdrop-blur-xl border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">إنشاء هاكاثون جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateHackathon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">عنوان الهاكاثون</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">الموقع</Label>
                    <Input
                      id="location"
                      name="location"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">الوصف</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-white">تاريخ البداية</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-white">تاريخ النهاية</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      required
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTeams" className="text-white">الحد الأقصى للفرق</Label>
                    <Input
                      id="maxTeams"
                      name="maxTeams"
                      type="number"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prizes" className="text-white">الجوائز</Label>
                    <Input
                      id="prizes"
                      name="prizes"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-white">المتطلبات</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={3}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOnline"
                    name="isOnline"
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isOnline" className="text-white">هاكاثون أونلاين</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>
                    إنشاء الهاكاثون
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="search"
              placeholder="ابحث عن هاكاثون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="upcoming">قادمة</TabsTrigger>
            <TabsTrigger value="ongoing">جارية</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12 text-slate-400">جاري التحميل...</div>
            ) : hackathons && hackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hackathon: any) => (
                  <Card key={hackathon.id} className="bg-slate-900/50 backdrop-blur-xl border-slate-800 hover:border-blue-500/50 transition-all">
                    <CardHeader>
                      <CardTitle className="text-white">{hackathon.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {hackathon.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{hackathon.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        {hackathon.isOnline ? (
                          <>
                            <Globe className="w-4 h-4" />
                            <span className="text-sm">أونلاين</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{hackathon.location}</span>
                          </>
                        )}
                      </div>
                      {hackathon.maxTeams && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">حتى {hackathon.maxTeams} فريق</span>
                        </div>
                      )}
                      {user && (
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            // Open registration modal
                            toast.info('سيتم فتح نموذج التسجيل قريباً');
                          }}
                        >
                          سجل الآن
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                لا توجد هاكاثونات حالياً
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="text-center py-12 text-slate-400">
              لا توجد هاكاثونات قادمة
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <div className="text-center py-12 text-slate-400">
              لا توجد هاكاثونات جارية
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

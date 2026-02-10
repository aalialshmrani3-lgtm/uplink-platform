import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Trophy, Users, Search, TrendingUp } from "lucide-react";

/**
 * UPLINK1 Opportunities Page
 * 
 * Challenges and Hackathons are SUPPORT TOOLS in UPLINK1 to help innovators develop their ideas.
 * They are NOT UPLINK2 itself.
 * 
 * This page shows:
 * - Challenges from ministries/companies to inspire innovators
 * - Hackathons to help innovators prototype and test ideas
 */

export default function Uplink1Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: challenges = [], isLoading: loadingChallenges } = trpc.uplink2.getChallenges.useQuery();
  const { data: hackathons = [], isLoading: loadingHackathons } = trpc.uplink2.hackathons.getAll.useQuery();

  const filteredChallenges = challenges.filter((challenge: any) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredHackathons = hackathons.filter((hackathon: any) => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hackathon.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              UPLINK1 - أدوات التطوير
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              التحديات والهاكاثونات
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              فرص لتطوير أفكارك واختبارها في بيئة تنافسية مع دعم من الخبراء والمستثمرين
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{challenges.length}</div>
                <div className="text-sm text-blue-100">تحديات نشطة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{hackathons.length}</div>
                <div className="text-sm text-blue-100">هاكاثونات قادمة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-sm text-blue-100">جهة شريكة</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="ابحث عن تحديات أو هاكاثونات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="technology">التقنية</SelectItem>
              <SelectItem value="health">الصحة</SelectItem>
              <SelectItem value="environment">البيئة</SelectItem>
              <SelectItem value="education">التعليم</SelectItem>
              <SelectItem value="finance">المالية</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="challenges">التحديات ({filteredChallenges.length})</TabsTrigger>
            <TabsTrigger value="hackathons">الهاكاثونات ({filteredHackathons.length})</TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            {loadingChallenges ? (
              <div className="text-center py-12">جاري التحميل...</div>
            ) : filteredChallenges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  لا توجد تحديات متاحة حالياً
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge: any) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {challenge.category || "عام"}
                        </Badge>
                        {challenge.prize && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-semibold">{challenge.prize}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>الموعد النهائي: {new Date(challenge.deadline).toLocaleDateString('ar-SA')}</span>
                        </div>
                        {challenge.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{challenge.organizer}</span>
                          </div>
                        )}
                        <Button className="w-full mt-4">
                          تقديم الحل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="mt-6">
            {loadingHackathons ? (
              <div className="text-center py-12">جاري التحميل...</div>
            ) : filteredHackathons.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  لا توجد هاكاثونات متاحة حالياً
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons.map((hackathon: any) => (
                  <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {hackathon.eventType === "virtual" ? "افتراضي" : "حضوري"}
                        </Badge>
                        {hackathon.prize && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-semibold">{hackathon.prize}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {hackathon.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(hackathon.startDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                        {hackathon.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{hackathon.location}</span>
                          </div>
                        )}
                        {hackathon.maxParticipants && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>السعة: {hackathon.maxParticipants} مشارك</span>
                          </div>
                        )}
                        <Button className="w-full mt-4">
                          التسجيل الآن
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

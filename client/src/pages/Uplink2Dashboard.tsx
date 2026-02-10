import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Calendar,
  Users,
  Trophy,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Award,
  TrendingUp,
} from "lucide-react";

export default function Uplink2Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch challenges and hackathons
  const { data: challenges, isLoading: loadingChallenges } =
    trpc.uplink2.challenges.getAll.useQuery();
  const { data: hackathons, isLoading: loadingHackathons } =
    trpc.uplink2.hackathons.getAll.useQuery();
  const { data: matches, isLoading: loadingMatches } =
    trpc.uplink2.matching.getMatches.useQuery();

  const categories = [
    "الكل",
    "الصحة",
    "التعليم",
    "الطاقة",
    "النقل",
    "الزراعة",
    "التقنية",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="container relative py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              UPLINK2 - محرك التحديات والمطابقة
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent">
              حوّل ابتكارك إلى واقع
            </h1>
            <p className="mb-8 text-xl text-gray-300">
              شارك في التحديات، انضم للهاكاثونات، واحصل على مطابقة ذكية مع المستثمرين
              والشركاء المناسبين
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-cyan-500/20 bg-gray-900/50 p-6 backdrop-blur">
                <Target className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
                <div className="text-3xl font-bold text-white">
                  {challenges?.length || 0}
                </div>
                <div className="text-sm text-gray-400">تحدي نشط</div>
              </Card>
              <Card className="border-blue-500/20 bg-gray-900/50 p-6 backdrop-blur">
                <Trophy className="mx-auto mb-3 h-10 w-10 text-blue-400" />
                <div className="text-3xl font-bold text-white">
                  {hackathons?.length || 0}
                </div>
                <div className="text-sm text-gray-400">هاكاثون قادم</div>
              </Card>
              <Card className="border-purple-500/20 bg-gray-900/50 p-6 backdrop-blur">
                <TrendingUp className="mx-auto mb-3 h-10 w-10 text-purple-400" />
                <div className="text-3xl font-bold text-white">
                  {matches?.length || 0}
                </div>
                <div className="text-sm text-gray-400">فرصة مطابقة</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <Tabs defaultValue="challenges" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 bg-gray-900/50">
            <TabsTrigger value="challenges">
              <Target className="ml-2 h-4 w-4" />
              التحديات
            </TabsTrigger>
            <TabsTrigger value="hackathons">
              <Trophy className="ml-2 h-4 w-4" />
              الهاكاثونات
            </TabsTrigger>
            <TabsTrigger value="matching">
              <Sparkles className="ml-2 h-4 w-4" />
              المطابقة الذكية
            </TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="ابحث عن تحدي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-700 bg-gray-900/50 pr-10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedCategory(cat === "الكل" ? null : cat)
                    }
                    className={
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                        : "border-gray-700 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Challenges Grid */}
            {loadingChallenges ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="h-64 animate-pulse border-gray-700 bg-gray-900/50"
                  />
                ))}
              </div>
            ) : challenges && challenges.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map((challenge) => (
                  <Card
                    key={challenge.id}
                    className="group overflow-hidden border-gray-700 bg-gradient-to-br from-gray-900/90 to-gray-900/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400">
                          {challenge.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-green-500/50 text-green-400"
                        >
                          {challenge.prize}
                        </Badge>
                      </div>

                      <h3 className="mb-3 text-xl font-bold text-white group-hover:text-cyan-400">
                        {challenge.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                        {challenge.description}
                      </p>

                      <div className="mb-4 space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants || 0} مشارك</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            ينتهي في{" "}
                            {new Date(challenge.deadline).toLocaleDateString(
                              "ar-SA"
                            )}
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        تقديم الحل
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-gray-700 bg-gray-900/50 p-12 text-center">
                <Target className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                <h3 className="mb-2 text-xl font-bold text-gray-400">
                  لا توجد تحديات متاحة حالياً
                </h3>
                <p className="text-gray-500">
                  تحقق لاحقاً للحصول على تحديات جديدة
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Hackathons Tab */}
          <TabsContent value="hackathons" className="space-y-6">
            {loadingHackathons ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card
                    key={i}
                    className="h-80 animate-pulse border-gray-700 bg-gray-900/50"
                  />
                ))}
              </div>
            ) : hackathons && hackathons.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {hackathons.map((hackathon) => (
                  <Card
                    key={hackathon.id}
                    className="group overflow-hidden border-gray-700 bg-gradient-to-br from-blue-900/20 to-purple-900/20 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400">
                          {hackathon.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-yellow-500/50 text-yellow-400"
                        >
                          <Award className="ml-1 h-3 w-3" />
                          {hackathon.prize}
                        </Badge>
                      </div>

                      <h3 className="mb-3 text-2xl font-bold text-white group-hover:text-blue-400">
                        {hackathon.title}
                      </h3>
                      <p className="mb-4 text-gray-400">
                        {hackathon.description}
                      </p>

                      <div className="mb-6 space-y-3 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span>
                            {new Date(hackathon.startDate).toLocaleDateString(
                              "ar-SA"
                            )}{" "}
                            -{" "}
                            {new Date(hackathon.endDate).toLocaleDateString(
                              "ar-SA"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{hackathon.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span>
                            {hackathon.registrations || 0} /{" "}
                            {hackathon.maxParticipants} مسجل
                          </span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        سجّل الآن
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-gray-700 bg-gray-900/50 p-12 text-center">
                <Trophy className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                <h3 className="mb-2 text-xl font-bold text-gray-400">
                  لا توجد هاكاثونات قادمة حالياً
                </h3>
                <p className="text-gray-500">
                  تحقق لاحقاً للحصول على فعاليات جديدة
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Smart Matching Tab */}
          <TabsContent value="matching" className="space-y-6">
            {loadingMatches ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card
                    key={i}
                    className="h-64 animate-pulse border-gray-700 bg-gray-900/50"
                  />
                ))}
              </div>
            ) : matches && matches.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <Card
                    key={match.id}
                    className="group overflow-hidden border-gray-700 bg-gradient-to-br from-purple-900/20 to-pink-900/20 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400">
                          مطابقة {match.score}%
                        </Badge>
                        <Sparkles className="h-5 w-5 text-purple-400" />
                      </div>

                      <h3 className="mb-2 text-lg font-bold text-white group-hover:text-purple-400">
                        {match.investorName}
                      </h3>
                      <p className="mb-4 text-sm text-gray-400">
                        {match.industry}
                      </p>

                      <div className="mb-4 space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>نطاق الاستثمار: {match.fundingRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>التركيز: {match.focus}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        طلب اتصال
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-gray-700 bg-gray-900/50 p-12 text-center">
                <Sparkles className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                <h3 className="mb-2 text-xl font-bold text-gray-400">
                  لا توجد مطابقات متاحة حالياً
                </h3>
                <p className="text-gray-500">
                  قم بتحسين ملفك الشخصي للحصول على مطابقات أفضل
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

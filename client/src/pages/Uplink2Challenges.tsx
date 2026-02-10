import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Target, TrendingUp, Clock, Award, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Uplink2Challenges() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: challenges, isLoading } = trpc.uplink2.getChallenges.useQuery();

  const filteredChallenges = challenges?.filter((challenge: any) =>
    challenge.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">التحديات</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl">
            اكتشف التحديات الحقيقية من الشركات والمؤسسات الرائدة وقدم حلولك المبتكرة
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="ابحث عن تحدٍ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 h-14 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{challenges?.length || 0}</p>
                  <p className="text-sm text-slate-400">تحدٍ نشط</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500K+</p>
                  <p className="text-sm text-slate-400">إجمالي الجوائز</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">30+</p>
                  <p className="text-sm text-slate-400">يوم متوسط</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1,200+</p>
                  <p className="text-sm text-slate-400">مشارك</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 bg-slate-700" />
                  <Skeleton className="h-4 w-full bg-slate-700" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredChallenges && filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge: any) => (
              <Card
                key={challenge.id}
                className="bg-slate-900/50 border-slate-700 hover:border-cyan-500/50 transition-all group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                      {challenge.title}
                    </CardTitle>
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      {challenge.category || "عام"}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400 line-clamp-2">
                    {challenge.description || "لا يوجد وصف"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {challenge.prize && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-slate-300">{challenge.prize} ريال</span>
                      </div>
                    )}
                    
                    {challenge.deadline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {new Date(challenge.deadline).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/uplink2/challenges/${challenge.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      عرض التفاصيل
                      <ArrowRight className="w-4 h-4 mr-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد تحديات</h3>
              <p className="text-slate-400">لم يتم العثور على تحديات مطابقة لبحثك</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

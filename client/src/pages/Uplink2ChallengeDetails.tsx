import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Users, Trophy, Clock, Target, Lightbulb, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
// Auth via tRPC
import { toast } from "sonner";
import { useState } from "react";

export default function Uplink2ChallengeDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const challengeId = parseInt(id || "0");

  const { data: user } = trpc.auth.me.useQuery();
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const { data: challenge, isLoading } = trpc.uplink2.challenges.getById.useQuery({ id: challengeId });
  const { data: relatedIdeas } = trpc.uplink1.ideas.browse.useQuery({ challengeId });
  // const relatedIdeas = [];
  const { data: registration } = trpc.uplink2.challenges.getRegistration.useQuery(
    { challengeId },
    { enabled: !!user }
  );
  const { data: submissions } = trpc.uplink2.challenges.getSubmissions.useQuery({ challengeId });

  const registerMutation = trpc.uplink2.challenges.register.useMutation({
    onSuccess: () => {
      toast.success("تم التسجيل بنجاح! يمكنك الآن تقديم حلك للتحدي");
    },
    onError: (error) => {
      toast.error(`خطأ في التسجيل: ${error.message}`);
    },
  });

  const handleRegister = () => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً للتسجيل في التحدي");
      return;
    }
    registerMutation.mutate({ challengeId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل التحدي...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>التحدي غير موجود</CardTitle>
            <CardDescription>لم يتم العثور على التحدي المطلوب</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/uplink2/challenges">
              <Button>
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى التحديات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-950/50 via-background to-indigo-950/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <Link href="/uplink2/challenges">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى التحديات
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                  {challenge.status === 'active' ? 'نشط' : challenge.status === 'upcoming' ? 'قريباً' : 'منتهي'}
                </Badge>
                <Badge variant="outline">{challenge.category}</Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{challenge.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{challenge.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">{challenge.reward?.toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>ينتهي: {new Date(challenge.deadline).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>{challenge.participants || 0} مشارك</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {!user ? (
                <Link href="/login">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    سجل الدخول للمشاركة
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
              ) : registration ? (
                <div className="flex flex-col gap-2">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                    disabled
                  >
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                    مسجل في التحدي
                  </Button>
                  <Link href={`/uplink2/challenges/${challengeId}/submit`}>
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      قدم حلك
                      <Send className="w-5 h-5 mr-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "جاري التسجيل..." : "سجل الآن"}
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  تفاصيل التحدي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">الوصف الكامل:</h3>
                  <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
                </div>

                {challenge.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">المتطلبات:</h3>
                    <p className="text-muted-foreground leading-relaxed">{challenge.requirements}</p>
                  </div>
                )}

                {challenge.criteria && (
                  <div>
                    <h3 className="font-semibold mb-2">معايير التقييم:</h3>
                    <p className="text-muted-foreground leading-relaxed">{challenge.criteria}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Ideas */}
            {relatedIdeas && relatedIdeas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    الأفكار المشاركة ({relatedIdeas.length})
                  </CardTitle>
                  <CardDescription>الأفكار التي تم تقديمها لهذا التحدي</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedIdeas.map((idea: any) => (
                      <Link key={idea.id} href={`/uplink1/ideas/${idea.id}`}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{idea.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                  {idea.description}
                                </CardDescription>
                              </div>
                              {idea.overallScore && (
                                <Badge variant="secondary">
                                  {idea.overallScore.toFixed(1)}%
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Challenge Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات التحدي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الفئة</p>
                  <Badge variant="outline">{challenge.category}</Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                  <Badge variant={challenge.status === 'active' ? 'default' : 'secondary'}>
                    {challenge.status === 'active' ? 'نشط' : challenge.status === 'upcoming' ? 'قريباً' : 'منتهي'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">الجائزة</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {challenge.reward?.toLocaleString()} ريال
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">الموعد النهائي</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(challenge.deadline).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">المشاركون</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{challenge.participants || 0} مشارك</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-blue-950/50 to-indigo-950/30 border-blue-500/30">
              <CardHeader>
                <CardTitle>جاهز للمشاركة؟</CardTitle>
                <CardDescription className="text-muted-foreground">
                  قدّم فكرتك الآن واحصل على فرصة للفوز بالجائزة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/uplink1/submit?challengeId=${challenge.id}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    شارك في التحدي
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

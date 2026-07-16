import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Upload, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
// Auth via tRPC
import { toast } from "sonner";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Naqla2SubmitSolution() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const challengeId = parseInt(id || "0");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    solution: "",
    expectedImpact: "",
    teamName: "",
    video: "",
    prototype: "",
  });

  const { data: challenge, isLoading: challengeLoading } = trpc.naqla2.challenges.getById.useQuery({ id: challengeId });
  const { data: registration } = trpc.naqla2.challenges.getRegistration.useQuery(
    { challengeId },
    { enabled: !!user }
  );

  const submitMutation = trpc.naqla2.challenges.submitSolution.useMutation({
    onSuccess: () => {
      toast.success(isAr ? "تم تقديم الحل بنجاح! سيتم مراجعة حلك من قبل لجنة التحكيم" : "Solution submitted successfully! It will be reviewed by the judging panel.");
      setLocation(`/naqla2/challenges/${challengeId}`);
    },
    onError: (error) => {
      toast.error(`خطأ في تقديم الحل: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(isAr ? "يجب تسجيل الدخول أولاً لتقديم الحل" : "You must log in first to submit a solution.");
      return;
    }

    if (!registration) {
      toast.error(isAr ? "يجب التسجيل في التحدي أولاً" : "You must register for the challenge first.");
      return;
    }

    submitMutation.mutate({
      challengeId,
      ...formData,
    });
  };

  if (challengeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{isAr ? isAr ? "جاري التحميل..." : "Loading..." : "Downloading..."}</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{isAr ? isAr ? "التحدي غير موجود" : "Challenge not found." : "Challenge not found."}</CardTitle>
            <CardDescription>{isAr ? isAr ? "لم يتم العثور على التحدي المطلوب" : "Requested challenge not found." : "Requested challenge not found."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/naqla2/challenges">
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{isAr ? isAr ? "تسجيل الدخول مطلوب" : "Login required." : "Login required."}</CardTitle>
            <CardDescription>{isAr ? isAr ? "يجب تسجيل الدخول أولاً لتقديم حلك" : "You must log in first to submit your solution." : "You must log in first to submit your solution."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">{isAr ? "تسجيل الدخول" : "Login"}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{isAr ? isAr ? "التسجيل مطلوب" : "Registration required." : "Registration required."}</CardTitle>
            <CardDescription>{isAr ? isAr ? "يجب التسجيل في التحدي أولاً قبل تقديم الحل" : "You must register for the challenge before submitting a solution." : "You must register for the challenge before submitting a solution."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/naqla2/challenges/${challengeId}`}>
              <Button className="w-full">{isAr ? isAr ? "العودة إلى التحدي" : "Back to challenge" : "Back to challenge"}</Button>
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
        <div className="container mx-auto px-4 py-8">
          <Link href={`/naqla2/challenges/${challengeId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى التحدي
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mb-2">{isAr ? isAr ? "قدم حلك" : "Submit your solution" : "Submit your solution"}</h1>
          <p className="text-muted-foreground">{challenge.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? isAr ? "المعلومات الأساسية" : "Basic Information" : "Basic Information"}</CardTitle>
                <CardDescription>{isAr ? isAr ? "أدخل تفاصيل حلك المقترح" : "Enter details of your proposed solution" : "Enter details of your proposed solution"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{isAr ? isAr ? "عنوان الحل *" : "Solution Title *" : "Solution Title *"}</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={isAr ? "عنوان واضح ومختصر لحلك" : "A clear and concise title for your solution"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{isAr ? isAr ? "وصف الحل *" : "Solution Description *" : "Solution Overview *"}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={isAr ? "وصف شامل للحل المقترح" : "Comprehensive description of the proposed solution"}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="solution">{isAr ? isAr ? "التفاصيل التقنية *" : "Technical Details *" : "Technology Details *"}</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder={isAr ? "اشرح كيف يعمل الحل، التقنيات المستخدمة، والمنهجية المتبعة" : "Explain how the solution works, technologies used, and methodology"}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expectedImpact">{isAr ? isAr ? "التأثير المتوقع" : "Expected Impact" : "Expected Effect"}</Label>
                  <Textarea
                    id="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                    placeholder={isAr ? "ما هو التأثير المتوقع لهذا الحل؟ كيف سيحل المشكلة؟" : "What is the expected impact of this solution? How will it solve the problem?"}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? isAr ? "معلومات الفريق (اختياري)" : "Team Information (optional)" : "Team Information (optional)"}</CardTitle>
                <CardDescription>{isAr ? isAr ? "إذا كنت تعمل ضمن فريق، أدخل اسم الفريق" : "If you are working as part of a team, enter the team name" : "If you are working as part of a team, enter the team name"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="teamName">{isAr ? isAr ? "اسم الفريق" : "Team Name" : "Team Name"}</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder={isAr ? "اسم الفريق (اختياري)" : "Team Name (optional)"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links & Resources */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? isAr ? "الروابط والموارد (اختياري)" : "Links & Resources (optional)" : "Links & Resources (optional)"}</CardTitle>
                <CardDescription>{isAr ? isAr ? "أضف روابط للعرض التوضيحي، الكود، أو الفيديو" : "Add links to demo, code, or video" : "Add links to demo, code, or video"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video">{isAr ? isAr ? "رابط الفيديو التوضيحي" : "Demo Video Link" : "[Demo Video Link]"}</Label>
                  <Input
                    id="video"
                    type="url"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="prototype">{isAr ? isAr ? "رابط النموذج الأولي / Demo" : "Prototype / Demo Link" : "Prototype / Demo Link"}</Label>
                  <Input
                    id="prototype"
                    type="url"
                    value={formData.prototype}
                    onChange={(e) => setFormData({ ...formData, prototype: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link href={`/naqla2/challenges/${challengeId}`}>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التقديم...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    تقديم الحل
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

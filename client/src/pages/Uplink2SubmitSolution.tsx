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

export default function Uplink2SubmitSolution() {
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

  const { data: challenge, isLoading: challengeLoading } = trpc.uplink2.challenges.getById.useQuery({ id: challengeId });
  const { data: registration } = trpc.uplink2.challenges.getRegistration.useQuery(
    { challengeId },
    { enabled: !!user }
  );

  const submitMutation = trpc.uplink2.challenges.submitSolution.useMutation({
    onSuccess: () => {
      toast.success("تم تقديم الحل بنجاح! سيتم مراجعة حلك من قبل لجنة التحكيم");
      setLocation(`/uplink2/challenges/${challengeId}`);
    },
    onError: (error) => {
      toast.error(`خطأ في تقديم الحل: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً لتقديم الحل");
      return;
    }

    if (!registration) {
      toast.error("يجب التسجيل في التحدي أولاً");
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
          <p className="text-muted-foreground">جاري التحميل...</p>
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>تسجيل الدخول مطلوب</CardTitle>
            <CardDescription>يجب تسجيل الدخول أولاً لتقديم حلك</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">تسجيل الدخول</Button>
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
            <CardTitle>التسجيل مطلوب</CardTitle>
            <CardDescription>يجب التسجيل في التحدي أولاً قبل تقديم الحل</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/uplink2/challenges/${challengeId}`}>
              <Button className="w-full">العودة إلى التحدي</Button>
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
          <Link href={`/uplink2/challenges/${challengeId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى التحدي
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mb-2">قدم حلك</h1>
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
                <CardTitle>المعلومات الأساسية</CardTitle>
                <CardDescription>أدخل تفاصيل حلك المقترح</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">عنوان الحل *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="عنوان واضح ومختصر لحلك"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف الحل *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="وصف شامل للحل المقترح"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="solution">التفاصيل التقنية *</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="اشرح كيف يعمل الحل، التقنيات المستخدمة، والمنهجية المتبعة"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expectedImpact">التأثير المتوقع</Label>
                  <Textarea
                    id="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={(e) => setFormData({ ...formData, expectedImpact: e.target.value })}
                    placeholder="ما هو التأثير المتوقع لهذا الحل؟ كيف سيحل المشكلة؟"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الفريق (اختياري)</CardTitle>
                <CardDescription>إذا كنت تعمل ضمن فريق، أدخل اسم الفريق</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="teamName">اسم الفريق</Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    placeholder="اسم الفريق (اختياري)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links & Resources */}
            <Card>
              <CardHeader>
                <CardTitle>الروابط والموارد (اختياري)</CardTitle>
                <CardDescription>أضف روابط للعرض التوضيحي، الكود، أو الفيديو</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video">رابط الفيديو التوضيحي</Label>
                  <Input
                    id="video"
                    type="url"
                    value={formData.video}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="prototype">رابط النموذج الأولي / Demo</Label>
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
              <Link href={`/uplink2/challenges/${challengeId}`}>
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

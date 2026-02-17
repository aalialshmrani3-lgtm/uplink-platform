import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Star, CheckCircle2, XCircle, FileText, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function Uplink2AdminSubmissions() {
  const { id } = useParams<{ id: string }>();
  const challengeId = parseInt(id || "0");
  
  const { data: user } = trpc.auth.me.useQuery();
  const { data: challenge } = trpc.uplink2.challenges.getById.useQuery({ id: challengeId });
  const { data: submissions, refetch } = trpc.uplink2.challenges.getSubmissions.useQuery({ challengeId });

  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [reviewData, setReviewData] = useState({
    score: 0,
    feedback: "",
    status: "shortlist" as "shortlist" | "finalist" | "winner" | "reject",
  });

  const submitReviewMutation = trpc.uplink2.challenges.submitReview.useMutation({
    onSuccess: () => {
      toast.success("تم تقديم المراجعة بنجاح!");
      setSelectedSubmission(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`خطأ في تقديم المراجعة: ${error.message}`);
    },
  });

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;
    
    submitReviewMutation.mutate({
      submissionId: selectedSubmission,
      criteriaScores: {},
      overallScore: reviewData.score || 0,
      strengths: reviewData.feedback,
      decision: reviewData.status as "shortlist" | "finalist" | "winner" | "reject",
    });
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">غير مصرح</CardTitle>
            <CardDescription>ليس لديك صلاحية الوصول إلى هذه الصفحة</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">جاري تحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/challenges">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى لوحة التحكم
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">مراجعة الحلول</h1>
          <p className="text-gray-400">{challenge.title}</p>
        </div>

        {/* Submissions List */}
        <div className="grid gap-6">
          {submissions && submissions.length > 0 ? (
            submissions.map((submission: any) => (
              <Card key={submission.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {submission.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={
                        submission.status === "approved" ? "default" : 
                        submission.status === "rejected" ? "destructive" : 
                        "secondary"
                      }
                      className={
                        submission.status === "approved" ? "bg-green-500" : 
                        submission.status === "rejected" ? "bg-red-500" : 
                        "bg-gray-500"
                      }
                    >
                      {submission.status === "approved" ? "مقبول" : 
                       submission.status === "rejected" ? "مرفوض" : 
                       "قيد المراجعة"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Solution Details */}
                    <div>
                      <h3 className="font-semibold mb-2">الحل المقترح:</h3>
                      <p className="text-gray-400 text-sm">{submission.solution}</p>
                    </div>

                    {/* Impact */}
                    {submission.expectedImpact && (
                      <div>
                        <h3 className="font-semibold mb-2">التأثير المتوقع:</h3>
                        <p className="text-gray-400 text-sm">{submission.expectedImpact}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4">
                      {submission.demoUrl && (
                        <a href={submission.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Demo
                          </Button>
                        </a>
                      )}
                      {submission.githubUrl && (
                        <a href={submission.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </a>
                      )}
                    </div>

                    {/* Review Form */}
                    {selectedSubmission === submission.id ? (
                      <div className="mt-6 p-6 bg-gray-900/50 rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg">تقديم مراجعة</h3>
                        
                        <div>
                          <Label>الدرجة (من 100)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={reviewData.score}
                            onChange={(e) => setReviewData({ ...reviewData, score: parseInt(e.target.value) })}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>

                        <div>
                          <Label>التعليقات</Label>
                          <Textarea
                            value={reviewData.feedback}
                            onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                            placeholder="أضف تعليقاتك هنا..."
                            className="bg-gray-800 border-gray-700 min-h-[100px]"
                          />
                        </div>

                        <div>
                          <Label>الحالة</Label>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant={reviewData.status === "winner" ? "default" : "outline"}
                              onClick={() => setReviewData({ ...reviewData, status: "winner" })}
                              className={reviewData.status === "winner" ? "bg-green-500" : ""}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              قبول
                            </Button>
                            <Button
                              size="sm"
                              variant={reviewData.status === "reject" ? "destructive" : "outline"}
                              onClick={() => setReviewData({ ...reviewData, status: "reject" })}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              رفض
                            </Button>
                            <Button
                              size="sm"
                              variant={reviewData.status === "shortlist" ? "secondary" : "outline"}
                              onClick={() => setReviewData({ ...reviewData, status: "shortlist" })}
                            >
                              قيد المراجعة
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleSubmitReview} disabled={submitReviewMutation.isPending}>
                            {submitReviewMutation.isPending ? "جاري الحفظ..." : "حفظ المراجعة"}
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setSelectedSubmission(submission.id)}>
                        <Star className="h-4 w-4 mr-2" />
                        مراجعة الحل
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">لا توجد حلول مقدمة لهذا التحدي بعد</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

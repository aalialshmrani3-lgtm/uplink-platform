import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Calendar,
  Award,
  TrendingUp,
  Eye
} from 'lucide-react';

export default function MySubmissions() {
  const [, setLocation] = useLocation();
  const { data: submissions, isLoading } = trpc.uplink2.challenges.getMySubmissionsWithDetails.useQuery();
  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review' | 'shortlisted' | 'finalist' | 'winner' | 'rejected'>('all');

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل حلولك...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredSubmissions = submissions?.filter(s => 
    filter === 'all' || s.status === filter
  ) || [];

  const stats = {
    total: submissions?.length || 0,
    submitted: submissions?.filter(s => s.status === 'submitted').length || 0,
    underReview: submissions?.filter(s => s.status === 'under_review').length || 0,
    shortlisted: submissions?.filter(s => s.status === 'shortlisted').length || 0,
    finalist: submissions?.filter(s => s.status === 'finalist').length || 0,
    winner: submissions?.filter(s => s.status === 'winner').length || 0,
    rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      submitted: { label: 'مقدم', variant: 'secondary', icon: FileText },
      under_review: { label: 'قيد المراجعة', variant: 'default', icon: Clock },
      shortlisted: { label: 'مرشح', variant: 'outline', icon: TrendingUp },
      finalist: { label: 'متأهل للنهائي', variant: 'default', icon: Award },
      winner: { label: 'فائز', variant: 'default', icon: Trophy },
      rejected: { label: 'مرفوض', variant: 'destructive', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">حلولي المقدمة</h1>
        <p className="text-muted-foreground">
          تتبع جميع مشاركاتك في التحديات وحالتها
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحلول</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview + stats.submitted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متأهل/مرشح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shortlisted + stats.finalist}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فائز</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.winner}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">الكل ({stats.total})</TabsTrigger>
          <TabsTrigger value="submitted">مقدم ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="under_review">قيد المراجعة ({stats.underReview})</TabsTrigger>
          <TabsTrigger value="shortlisted">مرشح ({stats.shortlisted})</TabsTrigger>
          <TabsTrigger value="shortlisted">متأهل ({stats.finalist})</TabsTrigger>
          <TabsTrigger value="winner">فائز ({stats.winner})</TabsTrigger>
          <TabsTrigger value="rejected">مرفوض ({stats.rejected})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">لا توجد حلول مقدمة</p>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? 'لم تقدم أي حلول بعد. ابدأ بالمشاركة في التحديات!'
                : `لا توجد حلول بحالة "${filter}"`
              }
            </p>
            <Button onClick={() => setLocation('/uplink2/challenges')}>
              تصفح التحديات
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(submission.status || 'submitted')}
                      {submission.score && (
                        <Badge variant="outline" className="gap-1">
                          <Award className="h-3 w-3" />
                          الدرجة: {submission.score}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{submission.title}</CardTitle>
                    <CardDescription className="text-base">
                      التحدي: <span className="font-medium text-foreground">{submission.challengeTitle}</span>
                    </CardDescription>
                  </div>
                  <div className="text-left">
                    {submission.challengePrize && (
                      <div className="text-sm text-muted-foreground mb-1">
                        الجائزة: <span className="font-bold text-primary">{submission.challengePrize}</span>
                      </div>
                    )}
                    {submission.challengeCategory && (
                      <Badge variant="outline">{submission.challengeCategory}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {submission.description}
                </p>

                {/* Reviewer Comments */}
                {submission.reviewerComments && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      تعليقات المراجعين
                    </h4>
                    <p className="text-sm text-muted-foreground">{submission.reviewerComments}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    تاريخ التقديم: {new Date(submission.submittedAt || '').toLocaleDateString('ar-SA')}
                  </div>
                  {submission.challengeDeadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      موعد نهائي: {new Date(submission.challengeDeadline).toLocaleDateString('ar-SA')}
                    </div>
                  )}
                  {(submission.publicVotes || submission.judgeVotes) && (
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      التصويتات: {(submission.publicVotes || 0) + (submission.judgeVotes || 0)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/uplink2/challenges/${submission.challengeId}`)}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    عرض التحدي
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/uplink2/submissions/${submission.id}`)}
                  >
                    <FileText className="h-4 w-4 ml-2" />
                    عرض الحل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

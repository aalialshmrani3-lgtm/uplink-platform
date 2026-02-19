/**
 * My Journey - Dashboard موحد لتتبع التقدم
 * 
 * يعرض رحلة المستخدم الكاملة من NAQLA 1 → 2 → 3
 */

import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";

export default function MyJourney() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: ideas, isLoading: ideasLoading } = trpc.naqla1.myIdeas.useQuery();
  const { data: matches, isLoading: matchesLoading } = trpc.naqla2.matching.getMyMatches.useQuery();
  const { data: contracts, isLoading: contractsLoading } = trpc.naqla3.contracts.getMyContracts.useQuery();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">يرجى تسجيل الدخول لعرض رحلتك</p>
      </div>
    );
  }

  const isLoading = ideasLoading || matchesLoading || contractsLoading;

  // Determine current stage
  const getCurrentStage = () => {
    if (contracts && contracts.length > 0) return 3;
    if (matches && matches.length > 0) return 2;
    if (ideas && ideas.length > 0) return 1;
    return 0;
  };

  const currentStage = getCurrentStage();

  const stages = [
    {
      id: 1,
      title: "NAQLA 1",
      titleAr: "أبلينك 1",
      description: "تقديم الأفكار وتحليلها",
      status: currentStage >= 1 ? "completed" : "pending",
      count: ideas?.length || 0,
      items: ideas || []
    },
    {
      id: 2,
      title: "NAQLA 2",
      titleAr: "أبلينك 2",
      description: "المطابقة مع الجهات المناسبة",
      status: currentStage >= 2 ? "completed" : currentStage === 1 ? "in-progress" : "pending",
      count: matches?.length || 0,
      items: matches || []
    },
    {
      id: 3,
      title: "NAQLA 3",
      titleAr: "أبلينك 3",
      description: "العقود الذكية والتنفيذ",
      status: currentStage >= 3 ? "completed" : currentStage === 2 ? "in-progress" : "pending",
      count: contracts?.length || 0,
      items: contracts || []
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            رحلتي في NAQLA
          </h1>
          <p className="text-lg text-muted-foreground">
            تتبع تقدمك من الفكرة إلى التنفيذ
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(currentStage / 3) * 100}%` }}
              />
            </div>

            {/* Stage Nodes */}
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex flex-col items-center flex-1">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all
                  ${stage.status === "completed" 
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg" 
                    : stage.status === "in-progress"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg animate-pulse"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  }
                `}>
                  {stage.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : stage.status === "in-progress" ? (
                    <Clock className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1">{stage.titleAr}</h3>
                <p className="text-sm text-muted-foreground text-center">{stage.description}</p>
                <span className={`
                  mt-2 px-3 py-1 rounded-full text-xs font-medium
                  ${stage.status === "completed" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : stage.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }
                `}>
                  {stage.count} {stage.status === "completed" ? "مكتمل" : stage.status === "in-progress" ? "قيد التنفيذ" : "معلق"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Details */}
        <div className="grid gap-6">
          {stages.map((stage) => (
            <Card key={stage.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{stage.titleAr}</h2>
                  <p className="text-muted-foreground">{stage.description}</p>
                </div>
                <div className={`
                  px-4 py-2 rounded-lg font-medium
                  ${stage.status === "completed" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : stage.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }
                `}>
                  {stage.status === "completed" ? "مكتمل ✓" : stage.status === "in-progress" ? "قيد التنفيذ..." : "معلق"}
                </div>
              </div>

              {/* Items */}
              {stage.items.length > 0 ? (
                <div className="space-y-3">
                  {stage.items.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title || item.name || `Item ${idx + 1}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          {stage.id === 1 && `التقييم: ${item.innovationLevel || "N/A"}`}
                          {stage.id === 2 && `نسبة المطابقة: ${item.score || "N/A"}%`}
                          {stage.id === 3 && `المبلغ: $${item.totalAmount || "N/A"}`}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                  {stage.items.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center">
                      +{stage.items.length - 3} المزيد
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد عناصر في هذه المرحلة بعد
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        {currentStage === 0 && (
          <Card className="mt-8 p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-2xl font-bold mb-4">ابدأ رحلتك الآن!</h3>
            <p className="text-muted-foreground mb-6">
              قدّم فكرتك الأولى وابدأ رحلتك في عالم الابتكار
            </p>
            <a
              href="/naqla1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              قدّم فكرتك الآن
              <ArrowRight className="w-5 h-5" />
            </a>
          </Card>
        )}
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, FileText, CheckCircle, Clock, AlertCircle,
  Shield, Users, DollarSign, Calendar, ArrowLeft
} from "lucide-react";

export default function Contracts() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: contracts, isLoading } = trpc.contract.getMyContracts.useQuery(undefined, { enabled: !!user });

  // Demo contracts
  const demoContracts = [
    {
      id: 1,
      title: "عقد ترخيص براءة اختراع",
      type: "license",
      status: "active",
      partyA: "شركة TechVision",
      partyB: "المبتكر أحمد",
      value: "500000",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
      milestones: 4,
      completedMilestones: 2,
    },
    {
      id: 2,
      title: "عقد شراكة استثمارية",
      type: "investment",
      status: "pending",
      partyA: "صندوق الابتكار",
      partyB: "شركة GreenEnergy",
      value: "2000000",
      startDate: null,
      endDate: null,
      milestones: 6,
      completedMilestones: 0,
    },
    {
      id: 3,
      title: "عقد تطوير مشترك",
      type: "development",
      status: "completed",
      partyA: "جامعة الملك سعود",
      partyB: "شركة HealthAI",
      value: "750000",
      startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      milestones: 5,
      completedMilestones: 5,
    },
  ];

  const displayContracts = contracts && contracts.length > 0 ? contracts : demoContracts;

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "pending": return <Clock className="w-5 h-5 text-amber-400" />;
      case "completed": return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case "disputed": return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft": return "مسودة";
      case "pending": return "قيد الانتظار";
      case "active": return "نشط";
      case "completed": return "مكتمل";
      case "disputed": return "متنازع عليه";
      case "terminated": return "منتهي";
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "license": return "ترخيص";
      case "investment": return "استثمار";
      case "development": return "تطوير";
      case "acquisition": return "استحواذ";
      case "partnership": return "شراكة";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                UPLINK 5.0
              </span>
            </div>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 text-slate-300">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-4">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400 text-sm">UPLINK4 - العقود الذكية</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">عقودي</h1>
          <p className="text-slate-400">إدارة العقود الذكية والاتفاقيات</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{displayContracts.length}</div>
              <div className="text-slate-400 text-sm">إجمالي العقود</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {displayContracts.filter((c: any) => c.status === "active").length}
              </div>
              <div className="text-slate-400 text-sm">عقود نشطة</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {(displayContracts.reduce((sum: number, c: any) => sum + Number(c.value || 0), 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-slate-400 text-sm">إجمالي القيمة</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-slate-400 text-sm">محمية بالبلوكتشين</div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayContracts.length > 0 ? (
          <div className="space-y-4">
            {displayContracts.map((contract: any) => (
              <Card key={contract.id} className="bg-slate-800/50 border-slate-700 hover:border-indigo-600/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        contract.status === "active" ? "bg-emerald-500/20" :
                        contract.status === "pending" ? "bg-amber-500/20" :
                        contract.status === "completed" ? "bg-blue-500/20" :
                        "bg-slate-700"
                      }`}>
                        <FileText className={`w-7 h-7 ${
                          contract.status === "active" ? "text-emerald-400" :
                          contract.status === "pending" ? "text-amber-400" :
                          contract.status === "completed" ? "text-blue-400" :
                          "text-slate-400"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{contract.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                          <span className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                            {getTypeText(contract.type)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{contract.partyA} ↔ {contract.partyB}</span>
                          </div>
                        </div>
                        
                        {/* Progress */}
                        {contract.milestones > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-slate-400">التقدم</span>
                              <span className="text-white">
                                {contract.completedMilestones}/{contract.milestones} مراحل
                              </span>
                            </div>
                            <div className="w-64 h-2 bg-slate-700 rounded-full">
                              <div 
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${(contract.completedMilestones / contract.milestones) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Dates */}
                        {contract.startDate && (
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>من {new Date(contract.startDate).toLocaleDateString("ar-SA")}</span>
                            </div>
                            {contract.endDate && (
                              <span>إلى {new Date(contract.endDate).toLocaleDateString("ar-SA")}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        contract.status === "active" ? "bg-emerald-500/20" :
                        contract.status === "pending" ? "bg-amber-500/20" :
                        contract.status === "completed" ? "bg-blue-500/20" :
                        "bg-slate-500/20"
                      }`}>
                        {getStatusIcon(contract.status)}
                        <span className={`text-sm ${
                          contract.status === "active" ? "text-emerald-400" :
                          contract.status === "pending" ? "text-amber-400" :
                          contract.status === "completed" ? "text-blue-400" :
                          "text-slate-400"
                        }`}>
                          {getStatusText(contract.status)}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-xl font-bold text-white">
                          {Number(contract.value).toLocaleString()}
                        </div>
                        <div className="text-slate-400 text-xs">ريال</div>
                      </div>
                      <Button variant="outline" className="border-slate-700 text-slate-300">
                        عرض التفاصيل
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد عقود</h3>
              <p className="text-slate-400 mb-6">ستظهر عقودك هنا عند إنشائها</p>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-950/50 to-slate-900 border-indigo-800/50">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Shield className="w-16 h-16 text-indigo-400" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">عقود ذكية آمنة</h3>
                <p className="text-slate-300 mb-4">
                  جميع العقود في UPLINK مؤمنة بتقنية البلوكتشين مع نظام ضمان (Escrow) لحماية جميع الأطراف.
                  يتم تنفيذ المدفوعات تلقائياً عند إتمام كل مرحلة.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="border-indigo-700 text-indigo-400">
                    تعرف على المزيد
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

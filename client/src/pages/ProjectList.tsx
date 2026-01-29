import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { 
  Rocket, Lightbulb, Plus, Clock, CheckCircle, 
  XCircle, AlertCircle, Brain, Target
} from "lucide-react";

export default function ProjectList() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const { data: projects, isLoading } = trpc.project.getMyProjects.useQuery(undefined, { enabled: !!user });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "approved": case "completed": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "submitted": case "evaluating": case "matched": return <Clock className="w-5 h-5 text-blue-400" />;
      case "rejected": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "draft": return "مسودة";
      case "submitted": return "مُقدّم";
      case "evaluating": return "قيد التقييم";
      case "approved": return "مُعتمد";
      case "matched": return "تم المطابقة";
      case "contracted": return "متعاقد";
      case "completed": return "مكتمل";
      case "rejected": return "مرفوض";
      default: return "مسودة";
    }
  };

  const getStageText = (stage: string | null) => {
    switch (stage) {
      case "idea": return "فكرة";
      case "prototype": return "نموذج أولي";
      case "mvp": return "MVP";
      case "growth": return "نمو";
      case "scale": return "توسع";
      default: return "فكرة";
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
          <div className="flex items-center gap-4">
            <Link href="/projects/new">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                <Plus className="w-4 h-4 ml-2" />
                مشروع جديد
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                لوحة التحكم
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مشاريعي</h1>
          <p className="text-slate-400">إدارة وتتبع مشاريعك الابتكارية</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-cyan-600/50 transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-7 h-7 text-cyan-400" />
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        project.status === "approved" || project.status === "completed" ? "bg-emerald-500/20" :
                        project.status === "submitted" || project.status === "evaluating" ? "bg-blue-500/20" :
                        project.status === "rejected" ? "bg-red-500/20" :
                        "bg-slate-500/20"
                      }`}>
                        {getStatusIcon(project.status)}
                        <span className={`text-sm ${
                          project.status === "approved" || project.status === "completed" ? "text-emerald-400" :
                          project.status === "submitted" || project.status === "evaluating" ? "text-blue-400" :
                          project.status === "rejected" ? "text-red-400" :
                          "text-slate-400"
                        }`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Target className="w-4 h-4" />
                        <span>{getStageText(project.stage)}</span>
                      </div>
                      {project.engine && (
                        <div className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                          {project.engine.toUpperCase()}
                        </div>
                      )}
                      {project.category && (
                        <div className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">
                          {project.category}
                        </div>
                      )}
                    </div>

                    {project.evaluationId && (
                      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-2 text-emerald-400">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm">تم التقييم</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-16 text-center">
              <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">لا توجد مشاريع</h3>
              <p className="text-slate-400 mb-6">ابدأ بتسجيل مشروعك الأول</p>
              <Link href="/projects/new">
                <Button className="bg-cyan-500 hover:bg-cyan-600">
                  <Plus className="w-4 h-4 ml-2" />
                  سجّل مشروعك الأول
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

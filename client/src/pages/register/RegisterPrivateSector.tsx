import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterPrivateSector() {
  const [, setLocation] = useLocation();

  const handleRegister = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة للرئيسية
        </Button>

        <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">تسجيل قطاع خاص</h1>
          </div>

          <div className="space-y-6 text-white/90">
            <p className="text-lg">
              انضم إلى منصة NAQLA كمؤسسة قطاع خاص واحصل على:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💼 فرص الأعمال</h3>
                <p className="text-sm text-white/70">
                  اكتشف فرص أعمال جديدة ومبتكرة
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 شراكات استراتيجية</h3>
                <p className="text-sm text-white/70">
                  بناء شراكات مع المبتكرين والشركات
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💡 الوصول للابتكارات</h3>
                <p className="text-sm text-white/70">
                  احصل على حلول مبتكرة لتحديات العمل
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 نشر التحديات</h3>
                <p className="text-sm text-white/70">
                  انشر تحديات شركتك للمجتمع
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🏆 رعاية الفعاليات</h3>
                <p className="text-sm text-white/70">
                  رعاية الهاكاثونات والمسابقات
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📊 تحليلات السوق</h3>
                <p className="text-sm text-white/70">
                  احصل على رؤى عن سوق الابتكار
                </p>
              </div>
            </div>

            <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">📋 متطلبات التسجيل:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                <li>حساب Manus (سيتم إنشاؤه تلقائياً)</li>
                <li>معلومات المؤسسة</li>
                <li>بيانات المسؤول المعتمد</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleRegister}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                size="lg"
              >
                سجل الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-white/60 text-center mt-4">
              بالتسجيل، أنت توافق على{" "}
              <a href="/terms" className="text-cyan-400 hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/privacy" className="text-cyan-400 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

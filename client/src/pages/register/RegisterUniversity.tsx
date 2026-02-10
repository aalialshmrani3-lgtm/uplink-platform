import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { GraduationCap, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterUniversity() {
  const [, setLocation] = useLocation();

  const handleRegister = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4">
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
            <GraduationCap className="h-8 w-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">تسجيل جامعة/مؤسسة بحثية</h1>
          </div>

          <div className="space-y-6 text-white/90">
            <p className="text-lg">
              انضم إلى منصة UPLINK كجامعة أو مؤسسة بحثية واحصل على:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔬 نشر الأبحاث</h3>
                <p className="text-sm text-white/70">
                  شارك الأبحاث والابتكارات الأكاديمية
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">👥 ربط الطلاب</h3>
                <p className="text-sm text-white/70">
                  اربط طلابك بفرص حقيقية في السوق
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 شراكات صناعية</h3>
                <p className="text-sm text-white/70">
                  بناء شراكات مع القطاع الخاص
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💡 تسويق الابتكارات</h3>
                <p className="text-sm text-white/70">
                  سوّق ابتكارات الجامعة للمستثمرين
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🏆 استضافة الفعاليات</h3>
                <p className="text-sm text-white/70">
                  نظم هاكاثونات ومسابقات أكاديمية
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📊 تقارير وإحصائيات</h3>
                <p className="text-sm text-white/70">
                  احصل على تقارير عن الابتكار الأكاديمي
                </p>
              </div>
            </div>

            <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">📋 متطلبات التسجيل:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                <li>حساب Manus (سيتم إنشاؤه تلقائياً)</li>
                <li>معلومات الجامعة/المؤسسة البحثية</li>
                <li>بيانات المسؤول المعتمد</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleRegister}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                size="lg"
              >
                سجل الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-white/60 text-center mt-4">
              بالتسجيل، أنت توافق على{" "}
              <a href="/terms" className="text-indigo-400 hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/privacy" className="text-indigo-400 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

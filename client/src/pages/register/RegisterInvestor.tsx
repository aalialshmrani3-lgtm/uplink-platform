import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { TrendingUp, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterInvestor() {
  const [, setLocation] = useLocation();

  const handleRegister = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 py-12 px-4">
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
            <TrendingUp className="h-8 w-8 text-green-400" />
            <h1 className="text-3xl font-bold text-white">تسجيل مستثمر</h1>
          </div>

          <div className="space-y-6 text-white/90">
            <p className="text-lg">
              انضم إلى منصة UPLINK كمستثمر واحصل على:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💰 فرص استثمارية</h3>
                <p className="text-sm text-white/70">
                  اكتشف أفضل الأفكار والمشاريع المبتكرة
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📊 تحليلات متقدمة</h3>
                <p className="text-sm text-white/70">
                  احصل على تحليلات شاملة للأفكار والمشاريع
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 التواصل المباشر</h3>
                <p className="text-sm text-white/70">
                  تواصل مباشرة مع المبتكرين ورواد الأعمال
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔒 عقود ذكية آمنة</h3>
                <p className="text-sm text-white/70">
                  استثمر بأمان باستخدام العقود الذكية
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📈 تتبع الاستثمارات</h3>
                <p className="text-sm text-white/70">
                  تابع أداء استثماراتك من لوحة التحكم
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 فرص حصرية</h3>
                <p className="text-sm text-white/70">
                  احصل على فرص استثمارية حصرية
                </p>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">📋 متطلبات التسجيل:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                <li>حساب Manus (سيتم إنشاؤه تلقائياً)</li>
                <li>معلومات الملف الشخصي</li>
                <li>مجالات الاستثمار المفضلة</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleRegister}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="lg"
              >
                سجل الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-white/60 text-center mt-4">
              بالتسجيل، أنت توافق على{" "}
              <a href="/terms" className="text-green-400 hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/privacy" className="text-green-400 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

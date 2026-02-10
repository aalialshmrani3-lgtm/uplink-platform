import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Lightbulb, ArrowRight, ArrowLeft } from "lucide-react";

export default function RegisterInnovator() {
  const [, setLocation] = useLocation();

  const handleRegister = () => {
    // Redirect to Manus OAuth for registration/login
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
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
            <Lightbulb className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">تسجيل مبتكر فردي</h1>
          </div>

          <div className="space-y-6 text-white/90">
            <p className="text-lg">
              انضم إلى منصة UPLINK كمبتكر فردي واحصل على:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">💡 تحليل الأفكار بالذكاء الاصطناعي</h3>
                <p className="text-sm text-white/70">
                  احصل على تحليل شامل لفكرتك باستخدام الذكاء الاصطناعي المتقدم
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🚀 فرص التمويل</h3>
                <p className="text-sm text-white/70">
                  اعرض فكرتك على المستثمرين والجهات الحكومية المهتمة
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🏆 الهاكاثونات والتحديات</h3>
                <p className="text-sm text-white/70">
                  شارك في الهاكاثونات والتحديات واربح جوائز قيمة
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 التعاون مع الخبراء</h3>
                <p className="text-sm text-white/70">
                  تواصل مع خبراء ومستشارين لتطوير فكرتك
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">📊 تتبع التقدم</h3>
                <p className="text-sm text-white/70">
                  تابع تقدم أفكارك ومشاريعك من خلال لوحة التحكم
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">🔒 العقود الذكية</h3>
                <p className="text-sm text-white/70">
                  احمِ حقوقك الفكرية باستخدام تقنية البلوكتشين
                </p>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mt-6">
              <h3 className="font-semibold mb-2">📋 متطلبات التسجيل:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                <li>حساب Manus (سيتم إنشاؤه تلقائياً)</li>
                <li>معلومات الملف الشخصي الأساسية</li>
                <li>وصف موجز عن خبراتك ومهاراتك</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleRegister}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                size="lg"
              >
                سجل الآن
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-white/60 text-center mt-4">
              بالتسجيل، أنت توافق على{" "}
              <a href="/terms" className="text-blue-400 hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/privacy" className="text-blue-400 hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

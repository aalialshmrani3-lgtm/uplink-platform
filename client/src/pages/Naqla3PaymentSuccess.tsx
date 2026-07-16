import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Download, Mail } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Naqla3PaymentSuccess() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // يمكن إضافة logic هنا لجلب تفاصيل الدفع من backend
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl">{isAr ? isAr ? "تم الدفع بنجاح!" : "Payment Successful!" : "Payment Successful!"}</CardTitle>
          <CardDescription className="text-lg">
            شكراً لك على شرائك. تم إتمام العملية بنجاح.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg mb-4">{isAr ? isAr ? "تفاصيل الطلب" : "Order Details" : "Order Details"}</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isAr ? isAr ? "رقم الجلسة:" : "Session ID:" : "Session ID:"}</span>
              <span className="font-mono text-sm">{sessionId?.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isAr ? "التاريخ:" : "Date:"}</span>
              <span>{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isAr ? "الحالة:" : "Status:"}</span>
              <span className="text-green-600 font-semibold">{isAr ? "مكتمل" : "Completed"}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{isAr ? "الخطوات التالية" : "Next Steps"}</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{isAr ? isAr ? "سيتم إرسال تفاصيل الشراء والفاتورة إلى بريدك الإلكتروني" : "Purchase details and invoice will be sent to your email." : "Purchase details and invoice will be sent to your email."}</span>
              </li>
              <li className="flex items-start gap-2">
                <Download className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{isAr ? isAr ? "يمكنك تحميل الملفات والمستندات من لوحة التحكم" : "You can download files and documents from the control panel." : "You can download files and documents from the Dashboard."}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{isAr ? isAr ? "سيتم التواصل معك من قبل المالك خلال 24 ساعة" : "The owner will contact you within 24 hours." : "The owner will contact you within 24 hours."}</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full" variant="default">
                الذهاب إلى لوحة التحكم
              </Button>
            </Link>
            <Link href="/naqla3/marketplace" className="flex-1">
              <Button className="w-full" variant="outline">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة إلى البورصة
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>{isAr ? isAr ? "هل تحتاج مساعدة؟ " : "Need help?" : "Need help?"}< Link href="/support"><span className="text-primary hover:underline">{isAr ? isAr ? "تواصل مع الدعم الفني" : "Contact Support" : "Contact Support"}</span></Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

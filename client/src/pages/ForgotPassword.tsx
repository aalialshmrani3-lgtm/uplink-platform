import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ForgotPassword() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(isAr ? "يرجى إدخال البريد الإلكتروني" : "Please enter your email");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Call backend API to check if email exists and send reset link
      // Generate time-limited reset token (expires in 1 hour)
      // Send reset link via SendGrid or AWS SES
      
      setResetSent(true);
      toast.success(isAr ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" : "Password reset link sent to your email");
      
    } catch (error) {
      toast.error(isAr ? "حدث خطأ. يرجى المحاولة مرة أخرى." : "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{isAr ? isAr ? "تم إرسال الرابط" : "Link sent" : "Link submitted"}</CardTitle>
            <CardDescription>
              تحقق من بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              الرابط صالح لمدة ساعة واحدة فقط.
            </p>
            <p className="text-sm text-muted-foreground">
              إذا لم تستلم الرسالة، تحقق من مجلد الرسائل غير المرغوب فيها.
            </p>
            <Button 
              className="w-full"
              onClick={() => setLocation("/")}
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{isAr ? isAr ? "استعادة كلمة المرور" : "Recover Password" : "Recover Password"}</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{isAr ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
              <p className="text-xs text-muted-foreground">
                سنرسل لك رابطاً لإعادة تعيين كلمة المرور
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? isAr ? "جارٍ الإرسال..." : "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm">
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => setLocation("/")}
              >
                العودة إلى تسجيل الدخول
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

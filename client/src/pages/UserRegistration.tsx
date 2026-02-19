import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

export default function UserRegistration() {
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
  });
  
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUppercase && hasNumber && hasSymbol;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaValue) {
      toast.error("يرجى إكمال التحقق من reCAPTCHA");
      return;
    }
    
    if (!validatePassword(formData.password)) {
      toast.error("يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بما في ذلك حرف كبير، رقم، ورمز");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    
    const birthDate = new Date(formData.dateOfBirth);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      toast.error("يجب أن يكون عمرك 18 عاماً على الأقل للتسجيل");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: Call backend API for registration
      toast.success("تم إرسال رابط التحقق - يرجى التحقق من بريدك الإلكتروني");
      
      setTimeout(() => {
        setLocation("/");
      }, 2000);
      
    } catch (error) {
      toast.error("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">تسجيل مستخدم جديد</CardTitle>
          <CardDescription>
            أنشئ حساباً جديداً للانضمام إلى منصة NAQLA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم الكامل *</Label>
              <Input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="8 أحرف على الأقل"
              />
              <p className="text-xs text-muted-foreground">
                يجب أن تحتوي على حرف كبير، رقم، ورمز
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+966 5X XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                يجب أن يكون عمرك 18 عاماً على الأقل
              </p>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                onChange={(value: string | null) => setCaptchaValue(value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ التسجيل..." : "تسجيل حساب جديد"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
              <Button
                type="button"
                variant="link"
                className="p-0"
                onClick={() => setLocation("/")}
              >
                تسجيل الدخول
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

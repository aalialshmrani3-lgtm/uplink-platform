import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MFASetup() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");

  const { data: mfaStatus, refetch: refetchStatus } = trpc.auth.getMFAStatus.useQuery();
  const setupMutation = trpc.auth.setupMFA.useMutation();
  const enableMutation = trpc.auth.enableMFA.useMutation();
  const disableMutation = trpc.auth.disableMFA.useMutation();

  const handleSetup = async () => {
    try {
      const result = await setupMutation.mutateAsync();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      toast.success(isAr ? "تم إنشاء رمز QR بنجاح" : "QR code generated successfully");
    } catch (error: any) {
      toast.error(error.message || isAr ? "فشل في إنشاء رمز QR" : "Failed to generate QR code");
    }
  };

  const handleEnable = async () => {
    if (!secret || !verificationCode) {
      toast.error(isAr ? "يرجى إدخال رمز التحقق" : "Please enter verification code");
      return;
    }

    try {
      await enableMutation.mutateAsync({
        secret,
        token: verificationCode
      });
      toast.success(isAr ? "تم تفعيل MFA بنجاح!" : "MFA enabled successfully!");
      setQrCode(null);
      setSecret(null);
      setVerificationCode("");
      refetchStatus();
    } catch (error: any) {
      toast.error(error.message || isAr ? "رمز التحقق غير صحيح" : "Incorrect verification code");
    }
  };

  const handleDisable = async () => {
    if (!disableCode) {
      toast.error(isAr ? "يرجى إدخال رمز التحقق" : "Please enter verification code");
      return;
    }

    try {
      await disableMutation.mutateAsync({
        token: disableCode
      });
      toast.success(isAr ? "تم تعطيل MFA بنجاح" : "MFA disabled successfully");
      setDisableCode("");
      refetchStatus();
    } catch (error: any) {
      toast.error(error.message || isAr ? "رمز التحقق غير صحيح" : "Incorrect verification code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            المصادقة الثنائية (MFA)
          </h1>
          <p className="text-slate-300">
            قم بتأمين حسابك باستخدام Google Authenticator
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card className="bg-card/95 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                {mfaStatus?.mfaEnabled ? (
                  <ShieldCheck className="w-8 h-8 text-green-500" />
                ) : (
                  <ShieldOff className="w-8 h-8 text-slate-400" />
                )}
                <div>
                  <CardTitle>
                    {mfaStatus?.mfaEnabled ? isAr ? "MFA مفعّل" : "MFA Enabled" : "MFA Disabled"}
                  </CardTitle>
                  <CardDescription>
                    {mfaStatus?.mfaEnabled
                      ? isAr ? "حسابك محمي بالمصادقة الثنائية" : "Your account is protected with 2FA"
                      : "Enable 2FA for better protection"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Enable MFA Card */}
          {!mfaStatus?.mfaEnabled && (
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  تفعيل المصادقة الثنائية
                </CardTitle>
                <CardDescription>
                  اتبع الخطوات التالية لتفعيل MFA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!qrCode ? (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-400 mb-2">{isAr ? isAr ? "الخطوة 1: تحميل التطبيق" : "Step 1: Download App" : "Step 1: Download App"}</h3>
                      <p className="text-sm text-slate-300">
                        قم بتحميل تطبيق Google Authenticator من متجر التطبيقات
                      </p>
                    </div>
                    <Button
                      onClick={handleSetup}
                      disabled={setupMutation.isPending}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      size="lg"
                    >
                      {setupMutation.isPending ? isAr ? "جاري الإنشاء..." : "Generating..." : "Generate QR Code"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-400 mb-2">{isAr ? isAr ? "الخطوة 2: مسح رمز QR" : "Step 2: Scan QR Code" : "Step 2: Scan QR Code"}</h3>
                      <p className="text-sm text-slate-300 mb-4">
                        افتح تطبيق Google Authenticator وامسح الرمز التالي:
                      </p>
                      <div className="flex justify-center bg-white p-4 rounded-lg">
                        <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-400 mb-2">{isAr ? isAr ? "الخطوة 3: التحقق" : "Step 3: Verify" : "Step 3: Verify"}</h3>
                      <p className="text-sm text-slate-300 mb-4">
                        أدخل الرمز المكون من 6 أرقام من التطبيق:
                      </p>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="verificationCode">{isAr ? isAr ? "رمز التحقق" : "Verification Code" : "Verification Code"}</Label>
                          <Input
                            id="verificationCode"
                            type="text"
                            placeholder="123456"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="text-center text-2xl tracking-widest"
                          />
                        </div>
                        <Button
                          onClick={handleEnable}
                          disabled={enableMutation.isPending || !verificationCode}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
                          size="lg"
                        >
                          {enableMutation.isPending ? isAr ? "جاري التحقق..." : "Verifying..." : "Enable MFA"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Disable MFA Card */}
          {mfaStatus?.mfaEnabled && (
            <Card className="bg-card/95 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <ShieldOff className="w-5 h-5" />
                  تعطيل المصادقة الثنائية
                </CardTitle>
                <CardDescription>
                  سيؤدي هذا إلى تقليل أمان حسابك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="disableCode">{isAr ? isAr ? "رمز التحقق" : "Verification Code" : "Verification Code"}</Label>
                  <Input
                    id="disableCode"
                    type="text"
                    placeholder="123456"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
                <Button
                  onClick={handleDisable}
                  disabled={disableMutation.isPending || !disableCode}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  {disableMutation.isPending ? isAr ? "جاري التعطيل..." : "Disabling..." : "Disable MFA"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

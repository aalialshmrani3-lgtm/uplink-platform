import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, ShoppingCart, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface UserChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ideaId: number;
  overallScore: number;
}

export default function UserChoiceDialog({
  open,
  onOpenChange,
  ideaId,
  overallScore,
}: UserChoiceDialogProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedChoice, setSelectedChoice] = useState<"uplink2" | "uplink3" | null>(null);

  const setUserChoiceMutation = trpc.uplink1.setUserChoice.useMutation({
    onSuccess: (data) => {
      toast({
        title: "تم بنجاح!",
        description:
          data.choice === "uplink2"
            ? "تم نقل فكرتك إلى UPLINK 2 للمطابقة"
            : "تم نقل فكرتك إلى UPLINK 3 للبيع",
      });

      // الانتقال إلى الصفحة المناسبة
      if (data.choice === "uplink2" && data.projectId) {
        setLocation(`/uplink2/projects/${data.projectId}`);
      } else if (data.choice === "uplink3" && data.assetId) {
        setLocation(`/uplink3/assets/${data.assetId}`);
      }

      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChoice = (choice: "uplink2" | "uplink3") => {
    setSelectedChoice(choice);
    setUserChoiceMutation.mutate({
      ideaId,
      choice,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            🎉 تهانينا! فكرتك حصلت على {overallScore}%
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-base">
            فكرتك مؤهلة للانتقال إلى المرحلة التالية. اختر المسار المناسب لك:
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {/* UPLINK 2 Option */}
          <Card
            className={`glass-card p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
              selectedChoice === "uplink2"
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-700 hover:border-blue-500/50"
            }`}
            onClick={() => !setUserChoiceMutation.isPending && handleChoice("uplink2")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">UPLINK 2</h3>
                <p className="text-sm text-gray-300 mb-4">
                  البحث عن تحديات، مستثمرين، وشركاء استراتيجيين
                </p>
                <ul className="text-xs text-gray-400 space-y-2 text-right">
                  <li>• المطابقة الذكية مع التحديات</li>
                  <li>• التواصل مع المستثمرين</li>
                  <li>• بناء شراكات استراتيجية</li>
                  <li>• الحصول على دعم وتمويل</li>
                </ul>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={setUserChoiceMutation.isPending}
              >
                {setUserChoiceMutation.isPending && selectedChoice === "uplink2" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري النقل...
                  </>
                ) : (
                  <>
                    اختر UPLINK 2
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* UPLINK 3 Option */}
          <Card
            className={`glass-card p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
              selectedChoice === "uplink3"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 hover:border-purple-500/50"
            }`}
            onClick={() => !setUserChoiceMutation.isPending && handleChoice("uplink3")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">UPLINK 3</h3>
                <p className="text-sm text-gray-300 mb-4">
                  الانتقال مباشرة إلى البورصة للبيع أو الاستحواذ
                </p>
                <ul className="text-xs text-gray-400 space-y-2 text-right">
                  <li>• عرض فكرتك في البورصة</li>
                  <li>• تحديد السعر والشروط</li>
                  <li>• البيع أو الاستحواذ المباشر</li>
                  <li>• عقود ذكية آمنة</li>
                </ul>
              </div>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={setUserChoiceMutation.isPending}
              >
                {setUserChoiceMutation.isPending && selectedChoice === "uplink3" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري النقل...
                  </>
                ) : (
                  <>
                    اختر UPLINK 3
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-gray-300 text-center">
            💡 <strong>نصيحة:</strong> إذا كنت تبحث عن دعم وتمويل، اختر UPLINK 2. إذا كنت
            جاهزاً للبيع مباشرة، اختر UPLINK 3.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

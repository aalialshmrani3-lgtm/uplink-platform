// @ts-nocheck
import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import SignatureCanvas from "@/components/SignatureCanvas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContractSignature() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { id } = useParams<{ id: string }>();

  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const contractId = parseInt(id || "0");
  
  // Fetch contract details
  const { data: contract, isLoading, refetch } = trpc.naqla3.contracts.getById.useQuery(
    { id: contractId },
    { enabled: !!contractId }
  );

  const uploadSignatureMutation = trpc.naqla3.contracts.uploadSignature.useMutation({
    onSuccess: () => {
      toast({
        title: "✅ تم حفظ التوقيع بنجاح",
        description: "تم رفع توقيعك الإلكتروني",
      });
      refetch();
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ فشل حفظ التوقيع",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const generatePdfMutation = trpc.naqla3.contracts.generateSignedPDF.useMutation({
    onSuccess: (data: any) => {
      toast({
        title: "✅ تم توليد PDF",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ فشل توليد PDF",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveSignature = async (signatureDataUrl: string) => {
    if (!contract) return;

    setIsUploading(true);

    // Determine role (seller or buyer)
    const role = contract.partyA === contract.id ? "seller" : "buyer";

    uploadSignatureMutation.mutate({
      contractId: contract.id,
      signatureDataUrl,
      role,
    });
  };

  const handleGeneratePDF = () => {
    if (!contract) return;

    generatePdfMutation.mutate({
      contractId: contract.id,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{isAr ? "جاري التحميل..." : "جاري الDownload..."}</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">{isAr ? "العقد غير موجود" : "[العقد غير موجود]"}</div>
      </div>
    );
  }

  const isSeller = contract.partyA === contract.id;
  const isBuyer = contract.partyB === contract.id;
  const sellerSigned = !!contract.sellerSignatureUrl;
  const buyerSigned = !!contract.buyerSignatureUrl;
  const bothSigned = sellerSigned && buyerSigned;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{isAr ? "التوقيع الإلكتروني للعقد" : "[التوقيع الإلكتروني للعقد]"}</h1>
        <p className="text-muted-foreground">{contract.title}</p>
      </div>

      {/* Contract Details */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          تفاصيل العقد
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{isAr ? "نوع العقد" : "[نوع العقد]"}</p>
            <p className="font-medium">{contract.type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{isAr ? "القيمة الإجمالية" : "الValuesة الإجمالية"}</p>
            <p className="font-medium">{contract.totalValue} {contract.currency}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{isAr ? "الحالة" : "Status"}</p>
            <p className="font-medium">{contract.status}</p>
          </div>
        </div>
        {contract.description && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">{isAr ? "الوصف" : "Description"}</p>
            <p className="mt-1">{contract.description}</p>
          </div>
        )}
      </Card>

      {/* Signature Status */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{isAr ? "حالة التوقيعات" : "[حالة التوقيعات]"}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span>{isAr ? "البائع (الطرف الأول)" : "[البائع (الطرف الأول)]"}</span>
            {sellerSigned ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                موقّع
              </span>
            ) : (
              <span className="text-muted-foreground">{isAr ? "لم يوقع بعد" : "[لم يوقع بعد]"}</span>
            )}
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span>{isAr ? "المشتري (الطرف الثاني)" : "[المشتري (الطرف الثاني)]"}</span>
            {buyerSigned ? (
              <span className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                موقّع
              </span>
            ) : (
              <span className="text-muted-foreground">{isAr ? "لم يوقع بعد" : "[لم يوقع بعد]"}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Signature Canvas */}
      {((isSeller && !sellerSigned) || (isBuyer && !buyerSigned)) && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{isAr ? "توقيعك الإلكتروني" : "[توقيعك الإلكتروني]"}</h2>
          <SignatureCanvas
            onSave={handleSaveSignature}
            disabled={isUploading}
          />
        </Card>
      )}

      {/* Download PDF */}
      {bothSigned && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{isAr ? "تحميل العقد الموقع" : "Download العقد الموقع"}</h2>
          <p className="text-muted-foreground mb-4">
            تم توقيع العقد من قبل الطرفين. يمكنك الآن تحميل نسخة PDF موقعة.
          </p>
          <Button
            onClick={handleGeneratePDF}
            disabled={generatePdfMutation.isPending}
            size="lg"
          >
            <Download className="w-5 h-5 ml-2" />
            {generatePdfMutation.isPending ? "جاري التوليد..." : "تحميل PDF الموقع"}
          </Button>
        </Card>
      )}
    </div>
  );
}

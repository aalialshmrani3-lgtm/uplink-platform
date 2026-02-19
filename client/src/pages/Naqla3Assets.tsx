import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function Naqla3Assets() {
  const params = useParams<{ id: string }>();
  const assetId = Number(params.id);
  const [, setLocation] = useLocation();

  const { data: asset, isLoading } = trpc.naqla3.getAssetById.useQuery(
    { assetId },
    { enabled: !!assetId }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto py-12">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">الأصل غير موجود</h2>
          <Button onClick={() => setLocation("/")}>العودة للرئيسية</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Asset Header */}
        <Card className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{asset.title}</h1>
              <p className="text-gray-400">{asset.description}</p>
            </div>
            <div className="px-4 py-2 bg-purple-500/20 rounded-lg">
              <span className="text-purple-400 font-semibold">{asset.status}</span>
            </div>
          </div>

          {/* Asset Details */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-sm text-gray-400">السعر</p>
              <p className="text-2xl font-bold text-white">
                {asset.price ? `${asset.price} ر.س` : "غير محدد"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">الفئة</p>
              <p className="text-white font-semibold">{asset.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">تاريخ الإنشاء</p>
              <p className="text-white font-semibold">
                {new Date(asset.createdAt).toLocaleDateString("ar-SA")}
              </p>
            </div>
          </div>
        </Card>

        {/* Listing Information */}
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">معلومات العرض</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-gray-300 text-sm">
                تم إدراج أصلك في بورصة NAQLA 3. يمكن للمستثمرين والشركات الآن الاطلاع على
                العرض والتواصل معك.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4">الإجراءات</h2>
          <div className="space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              عرض التفاصيل الكاملة
            </Button>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              تحميل المستندات
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

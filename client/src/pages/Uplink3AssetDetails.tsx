import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Star, Eye, Heart, Building2, Package, Briefcase,
  CheckCircle2, Shield, TrendingUp, Users, Calendar, Mail, Phone
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

// Mock data - في المستقبل سيتم استبدالها بـ tRPC query
const mockAsset = {
  id: 1,
  type: "license",
  title: "ترخيص تقنية الذكاء الاصطناعي للطاقة",
  description: "تقنية متقدمة لتحسين كفاءة استهلاك الطاقة باستخدام الذكاء الاصطناعي. تعتمد هذه التقنية على خوارزميات تعلم آلي متقدمة لتحليل أنماط استهلاك الطاقة وتقديم توصيات ذكية لتحسين الكفاءة وتقليل التكاليف.",
  owner: "شركة تقنية الابتكار",
  ownerLogo: "https://via.placeholder.com/100",
  price: 50000,
  priceType: "yearly",
  rating: 4.9,
  reviews: 45,
  views: 1250,
  likes: 89,
  category: "AI & ML",
  status: "available",
  contactEmail: "sales@techinnov.sa",
  contactPhone: "+966 50 123 4567",
  features: [
    "خوارزميات تعلم آلي متقدمة",
    "تحليل بيانات في الوقت الفعلي",
    "تقارير تفصيلية وتوصيات ذكية",
    "دعم فني على مدار الساعة",
    "تحديثات مجانية لمدة سنة"
  ],
  specifications: {
    "نوع الترخيص": "سنوي قابل للتجديد",
    "عدد المستخدمين": "غير محدود",
    "الدعم الفني": "24/7",
    "التحديثات": "مجانية لمدة سنة",
    "التدريب": "متضمن",
    "فترة التجربة": "30 يوم"
  },
  documents: [
    { name: "عرض تقديمي للتقنية", size: "2.5 MB", type: "PDF" },
    { name: "دليل المستخدم", size: "1.8 MB", type: "PDF" },
    { name: "شهادة براءة الاختراع", size: "0.5 MB", type: "PDF" }
  ],
  reviews_list: [
    {
      id: 1,
      author: "محمد العتيبي",
      company: "شركة الطاقة المتجددة",
      rating: 5,
      date: "2025-01-15",
      comment: "تقنية رائعة ساعدتنا في تقليل استهلاك الطاقة بنسبة 30%"
    },
    {
      id: 2,
      author: "سارة الغامدي",
      company: "مجموعة الصناعات الذكية",
      rating: 4.8,
      date: "2025-01-10",
      comment: "خدمة ممتازة ودعم فني سريع الاستجابة"
    }
  ]
};

export default function Uplink3AssetDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  
  const createCheckoutMutation = trpc.uplink3.assets.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        toast.success('جاري تحويلك إلى صفحة الدفع...');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'حدث خطأ أثناء إنشاء جلسة الدفع');
    },
  });

  const handleContact = () => {
    toast.success("تم إرسال طلب التواصل", {
      description: "سيتم التواصل معك قريباً من قبل المالك",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "license": return "ترخيص";
      case "product": return "منتج";
      case "acquisition": return "استحواذ";
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "license": return <Building2 className="w-5 h-5" />;
      case "product": return <Package className="w-5 h-5" />;
      case "acquisition": return <Briefcase className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-950/50 via-background to-pink-950/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <Link href="/uplink3/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة إلى البورصة
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTypeIcon(mockAsset.type)}
                  {getTypeLabel(mockAsset.type)}
                </Badge>
                <Badge variant={mockAsset.status === "available" ? "default" : "secondary"}>
                  {mockAsset.status === "available" ? "متاح" : "قيد التفاوض"}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{mockAsset.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{mockAsset.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{mockAsset.rating}</span>
                  <span className="text-muted-foreground">({mockAsset.reviews} تقييم)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span>{mockAsset.views} مشاهدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  <span>{mockAsset.likes + (isLiked ? 1 : 0)} إعجاب</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">
                    {mockAsset.price.toLocaleString()} ريال
                  </CardTitle>
                  <CardDescription>
                    {mockAsset.priceType === "yearly" ? "سنوياً" : "دفعة واحدة"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => {
                      if (!user) {
                        window.location.href = getLoginUrl();
                        return;
                      }
                      createCheckoutMutation.mutate({ assetId: parseInt(id || '1') });
                    }}
                    disabled={createCheckoutMutation.isPending}
                  >
                    {createCheckoutMutation.isPending ? 'جاري التحميل...' : 'شراء الآن'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleContact}>
                    تواصل مع المالك
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLike}>
                    <Heart className={`w-4 h-4 ml-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {isLiked ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  </Button>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>معاملة آمنة 100%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <span>مالك موثوق</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-yellow-500" />
                      <span>عائد استثمار مضمون</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="features">المميزات</TabsTrigger>
                <TabsTrigger value="specs">المواصفات</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>نظرة عامة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {mockAsset.description}
                    </p>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">المستندات المرفقة:</h3>
                      <div className="space-y-2">
                        {mockAsset.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">{doc.type}</span>
                              </div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">تحميل</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>المميزات الرئيسية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {mockAsset.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs">
                <Card>
                  <CardHeader>
                    <CardTitle>المواصفات التفصيلية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(mockAsset.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-3 border-b last:border-0">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>التقييمات ({mockAsset.reviews_list.length})</CardTitle>
                    <CardDescription>آراء العملاء السابقين</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockAsset.reviews_list.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-sm text-muted-foreground">{review.company}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات المالك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{mockAsset.owner}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>موثوق</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockAsset.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{mockAsset.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المشاهدات</span>
                  <span className="font-semibold">{mockAsset.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الإعجابات</span>
                  <span className="font-semibold">{mockAsset.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">التقييم</span>
                  <span className="font-semibold">{mockAsset.rating} / 5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">الفئة</span>
                  <Badge variant="secondary">{mockAsset.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

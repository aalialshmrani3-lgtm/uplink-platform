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
import { useLanguage } from "@/contexts/LanguageContext";

export default function Naqla3AssetDetails() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  // Mock data - in the future will be replaced by tRPC query
  const mockAsset = {
    id: 1,
    type: "license",
    title: isAr ? "ترخيص تقنية الذكاء الاصطناعي للطاقة" : "AI Energy Tech License",
    description: isAr
      ? "تقنية ذكاء اصطناعي متقدمة لكفاءة الطاقة. تستخدم التعلم الآلي لتحليل أنماط الاستهلاك وتقديم توصيات ذكية لتحسين الكفاءة وخفض التكاليف."
      : "Advanced AI tech for energy efficiency. Uses machine learning to analyze consumption patterns, providing smart recommendations to optimize efficiency and reduce costs.",
    owner: isAr ? "شركة تقنية الابتكار" : "Innovation Tech Co.",
    ownerLogo: "https://via.placeholder.com/100",
    price: 50000,
    priceType: "yearly",
    rating: 4.9,
    reviews: 45,
    views: 1250,
    likes: 89,
    category: isAr ? "الذكاء الاصطناعي والتعلم الآلي" : "AI & ML",
    status: "available",
    contactEmail: "sales@techinnov.sa",
    contactPhone: "+966 50 123 4567",
    features: [
      isAr ? "خوارزميات تعلم آلي متقدمة" : "Advanced ML Algorithms",
      isAr ? "تحليل بيانات في الوقت الفعلي" : "Real-time Data Analysis",
      isAr ? "تقارير تفصيلية وتوصيات ذكية" : "Detailed Reports & Smart Recommendations",
      isAr ? "دعم فني على مدار الساعة" : "24/7 Technical Support",
      isAr ? "تحديثات مجانية لمدة سنة" : "1 Year Free Updates"
    ],
    specifications: {
      [isAr ? "نوع الترخيص" : "License Type"]: isAr ? "سنوي، قابل للتجديد" : "Annual, Renewable",
      [isAr ? "عدد المستخدمين" : "Users"]: isAr ? "غير محدود" : "Unlimited",
      [isAr ? "الدعم الفني" : "Technical Support"]: "24/7",
      [isAr ? "التحديثات" : "Updates"]: isAr ? "مجانية لمدة سنة" : "Free for 1 Year",
      [isAr ? "التدريب" : "Training"]: isAr ? "مشمول" : "Included",
      [isAr ? "فترة التجربة" : "Trial Period"]: isAr ? "30 يوماً" : "30 Days"
    },
    documents: [
      { name: isAr ? "عرض تقديمي للتقنية" : "Tech Presentation", size: "2.5 MB", type: "PDF" },
      { name: isAr ? "دليل المستخدم" : "User Manual", size: "1.8 MB", type: "PDF" },
      { name: isAr ? "شهادة البراءة" : "Patent Certificate", size: "0.5 MB", type: "PDF" }
    ],
    reviews_list: [
      {
        id: 1,
        author: isAr ? "محمد العتيبي" : "Mohammed Al-Otaibi",
        company: isAr ? "شركة الطاقة المتجددة" : "Renewable Energy Co.",
        rating: 5,
        date: "2025-01-15",
        comment: isAr ? "تقنية رائعة، ساعدتنا في خفض استهلاك الطاقة بنسبة 30%." : "Great tech, helped us cut energy consumption by 30%."
      },
      {
        id: 2,
        author: isAr ? "سارة الغامدي" : "Sara Al-Ghamdi",
        company: isAr ? "مجموعة الصناعات الذكية" : "Smart Industries Group",
        rating: 4.8,
        date: "2025-01-10",
        comment: isAr ? "خدمة ممتازة ودعم فني متجاوب." : "Excellent service and responsive technical support."
      }
    ]
  };

  const createCheckoutMutation = trpc.naqla3.assets.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        toast.success(isAr ? 'جاري تحويلك إلى صفحة الدفع...' : 'Redirecting to payment page...');
      }
    },
    onError: (error) => {
      toast.error(error.message || (isAr ? 'حدث خطأ أثناء إنشاء جلسة الدفع' : 'Error creating checkout session'));
    },
  });

  const handleContact = () => {
    toast.success(isAr ? "تم إرسال طلب التواصل" : "Contact request sent.", {
      description: isAr ? "سيتواصل معك المالك قريباً." : "The owner will contact you shortly.",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked
      ? (isAr ? "تمت الإزالة من المفضلة" : "Removed from Favorites")
      : (isAr ? "تمت الإضافة إلى المفضلة" : "Added to Favorites")
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "license": return isAr ? "ترخيص" : "License";
      case "product": return isAr ? "منتج" : "Product";
      case "acquisition": return isAr ? "استحواذ" : "Acquisition";
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
          <Link href="/naqla3/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 ml-2" />
              {isAr ? "العودة إلى البورصة" : "Back to Marketplace"}
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
                  {mockAsset.status === "available" ? (isAr ? "متاح" : "Available") : (isAr ? "قيد التفاوض" : "Under Negotiation")}
                </Badge>
              </div>

              <h1 className="text-4xl font-bold mb-4">{mockAsset.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{mockAsset.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{mockAsset.rating}</span>
                  <span className="text-muted-foreground">({mockAsset.reviews} {isAr ? "تقييم" : "reviews"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  <span>{mockAsset.views} {isAr ? "مشاهدة" : "views"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  <span>{mockAsset.likes + (isLiked ? 1 : 0)} {isAr ? "إعجاب" : "likes"}</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">
                    {mockAsset.price.toLocaleString()} {isAr ? "ريال" : "SAR"}
                  </CardTitle>
                  <CardDescription>
                    {mockAsset.priceType === "yearly" ? (isAr ? "سنوياً" : "Annually") : (isAr ? "دفعة واحدة" : "One-time Payment")}
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
                    {createCheckoutMutation.isPending
                      ? (isAr ? 'جاري التحميل...' : 'Loading...')
                      : (isAr ? 'شراء الآن' : 'Buy Now')}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleContact}>
                    {isAr ? "تواصل مع المالك" : "Contact Owner"}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLike}>
                    <Heart className={`w-4 h-4 ml-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {isLiked
                      ? (isAr ? "إزالة من المفضلة" : "Remove from Favorites")
                      : (isAr ? "إضافة إلى المفضلة" : "Add to Favorites")}
                  </Button>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>{isAr ? "معاملة آمنة 100%" : "100% Secure Transaction"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <span>{isAr ? "مالك موثوق" : "Trusted Owner"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-yellow-500" />
                      <span>{isAr ? "عائد استثمار مضمون" : "Guaranteed ROI"}</span>
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
                <TabsTrigger value="overview">{isAr ? "نظرة عامة" : "Overview"}</TabsTrigger>
                <TabsTrigger value="features">{isAr ? "المميزات" : "Features"}</TabsTrigger>
                <TabsTrigger value="specs">{isAr ? "المواصفات" : "Specifications"}</TabsTrigger>
                <TabsTrigger value="reviews">{isAr ? "التقييمات" : "Reviews"}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>{isAr ? "نظرة عامة" : "Overview"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {mockAsset.description}
                    </p>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-3">{isAr ? "المستندات المرفقة:" : "Attached Documents:"}</h3>
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
                            <Button variant="ghost" size="sm">{isAr ? "تحميل" : "Download"}</Button>
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
                    <CardTitle>{isAr ? "المميزات الرئيسية" : "Key Features"}</CardTitle>
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
                    <CardTitle>{isAr ? "المواصفات التفصيلية" : "Detailed Specifications"}</CardTitle>
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
                    <CardTitle>{isAr ? `التقييمات (${mockAsset.reviews_list.length})` : `Reviews (${mockAsset.reviews_list.length})`}</CardTitle>
                    <CardDescription>{isAr ? "آراء العملاء السابقين" : "Customer Reviews"}</CardDescription>
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
                        <p className="text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "معلومات المالك" : "Owner Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{mockAsset.owner}</p>
                    <p className="text-sm text-muted-foreground">{isAr ? "شركة موثوقة" : "Verified Company"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{mockAsset.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{mockAsset.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "إحصائيات الأصل" : "Asset Statistics"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isAr ? "التصنيف" : "Category"}</span>
                  <Badge variant="outline">{mockAsset.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isAr ? "المشاهدات" : "Views"}</span>
                  <span className="font-medium">{mockAsset.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isAr ? "الإعجابات" : "Likes"}</span>
                  <span className="font-medium">{mockAsset.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{isAr ? "التقييم" : "Rating"}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{mockAsset.rating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

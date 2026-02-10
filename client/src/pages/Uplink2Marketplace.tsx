import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Globe, 
  Award,
  Eye,
  MessageCircle,
  ShoppingCart
} from "lucide-react";

export default function Uplink2Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);

  // Fetch approved IPs from marketplace
  const { data: listings, isLoading } = trpc.uplink2.marketplace.getApprovedIPs.useQuery();

  // Request purchase mutation
  const requestPurchase = trpc.uplink2.marketplace.requestPurchase.useMutation({
    onSuccess: () => {
      alert("تم إرسال طلب الشراء/الترخيص بنجاح!");
    },
  });

  const handleRequestPurchase = (listingId: number) => {
    requestPurchase.mutate({
      listingId,
      offerPrice: 100000,
      message: "أنا مهتم بهذه الملكية الفكرية",
    });
  };

  // Filter listings
  const filteredListings = listings?.filter((listing: any) => {
    const matchesSearch = !searchQuery || 
      listing.ip_registrations?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = !selectedType || listing.listingType === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            UPLINK 2: سوق الملكية الفكرية
          </h1>
          <p className="text-xl text-purple-200">
            اكتشف واستثمر في الملكيات الفكرية المعتمدة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <Award className="w-10 h-10 text-yellow-400" />
              <div>
                <div className="text-3xl font-bold text-white">{listings?.length || 0}</div>
                <div className="text-sm text-purple-200">ملكية معتمدة</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <ShoppingCart className="w-10 h-10 text-green-400" />
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">صفقة نشطة</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="w-10 h-10 text-blue-400" />
              <div>
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-purple-200">مليون ريال</div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              <div>
                <div className="text-3xl font-bold text-white">+25%</div>
                <div className="text-sm text-purple-200">نمو شهري</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن ملكية فكرية..."
              className="bg-white/10 backdrop-blur-lg border-white/20 text-white pr-12 h-12"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              className={selectedType === null 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              <Filter className="w-4 h-4 mr-2" />
              الكل
            </Button>

            <Button
              variant={selectedType === "license" ? "default" : "outline"}
              onClick={() => setSelectedType("license")}
              className={selectedType === "license" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              ترخيص
            </Button>

            <Button
              variant={selectedType === "sale" ? "default" : "outline"}
              onClick={() => setSelectedType("sale")}
              className={selectedType === "sale" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              بيع
            </Button>

            <Button
              variant={selectedType === "partnership" ? "default" : "outline"}
              onClick={() => setSelectedType("partnership")}
              className={selectedType === "partnership" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20"}
            >
              شراكة
            </Button>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings && filteredListings.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-12 text-center">
            <Award className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <p className="text-white text-xl mb-2">لا توجد ملكيات فكرية متاحة حالياً</p>
            <p className="text-purple-200">تحقق مرة أخرى قريباً للحصول على فرص جديدة</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings?.map((listing: any) => (
              <Card
                key={listing.id}
                className="bg-white/10 backdrop-blur-lg border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => setSelectedListing(listing.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-purple-600 text-white">
                    {listing.ip_registrations?.type === "patent" ? "براءة اختراع" :
                     listing.ip_registrations?.type === "trademark" ? "علامة تجارية" :
                     listing.ip_registrations?.type === "copyright" ? "حقوق نشر" :
                     listing.ip_registrations?.type === "trade_secret" ? "سر تجاري" : "تصميم صناعي"}
                  </Badge>

                  <Badge variant="outline" className="text-green-400 border-green-400">
                    {listing.listingType === "license" ? "ترخيص" :
                     listing.listingType === "sale" ? "بيع" :
                     listing.listingType === "partnership" ? "شراكة" : "مشروع مشترك"}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {listing.ip_registrations?.title || "ملكية فكرية"}
                </h3>

                {/* Description */}
                <p className="text-purple-100 text-sm mb-4 line-clamp-3">
                  {listing.description || listing.ip_registrations?.description || "لا يوجد وصف"}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">
                    {listing.price ? `${Number(listing.price).toLocaleString()} ${listing.currency}` : "قابل للتفاوض"}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-purple-200 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{listing.views || 0} مشاهدة</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{listing.inquiries || 0} استفسار</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{listing.exclusivity === "exclusive" ? "حصري" : "غير حصري"}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestPurchase(listing.id);
                  }}
                  disabled={requestPurchase.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {listing.listingType === "license" ? "طلب ترخيص" :
                   listing.listingType === "sale" ? "طلب شراء" : "طلب شراكة"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, Search, Filter, TrendingUp, Package, Building2, FileText, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Uplink3Marketplace() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [filters, setFilters] = useState({
    assetType: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  const { data: assets, isLoading } = trpc.uplink3.getMarketplaceAssets.useQuery(filters);

  const assetTypes = [
    { value: "", label: "جميع الأنواع", icon: ShoppingBag },
    { value: "license", label: "تراخيص", icon: FileText },
    { value: "product", label: "منتجات", icon: Package },
    { value: "acquisition", label: "استحواذات", icon: Building2 },
  ];

  const categories = [
    { value: "", label: "جميع الفئات" },
    { value: "software", label: "برمجيات" },
    { value: "hardware", label: "أجهزة" },
    { value: "patent", label: "براءات اختراع" },
    { value: "trademark", label: "علامات تجارية" },
    { value: "startup", label: "شركات ناشئة" },
    { value: "service", label: "خدمات" },
  ];

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      license: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      product: "bg-green-500/20 text-green-400 border-green-500/30",
      acquisition: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getAssetTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      license: FileText,
      product: Package,
      acquisition: Building2,
    };
    return icons[type] || ShoppingBag;
  };

  const formatPrice = (price: number, pricingModel?: string) => {
    if (pricingModel === "negotiable") return "قابل للتفاوض";
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}م ريال`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}ك ريال`;
    }
    return `${price} ريال`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            بورصة الابتكار
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            منصة لتداول التراخيص والمنتجات والاستحواذات بين المبتكرين والمستثمرين
          </p>
        </div>

        {/* Asset Types Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {assetTypes.map((type) => {
            const Icon = type.icon;
            const isActive = filters.assetType === type.value;
            return (
              <Card
                key={type.value}
                className={`p-6 cursor-pointer transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/50"
                    : "bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10"
                }`}
                onClick={() => setFilters({ ...filters, assetType: type.value })}
              >
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? "text-purple-400" : "text-gray-400"}`} />
                  <div className={`text-lg font-bold ${isActive ? "text-white" : "text-gray-300"}`}>
                    {type.label}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <ShoppingBag className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {assets?.length || 0}
              </div>
              <div className="text-sm text-gray-400">أصل متاح</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">100M+</div>
              <div className="text-sm text-gray-400">قيمة الأصول</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">صفقة مكتملة</div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
            <div className="text-center">
              <Building2 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">200+</div>
              <div className="text-sm text-gray-400">مستثمر نشط</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="ابحث عن أصل..."
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full pr-10 bg-white/10 border border-white/20 text-white rounded-md px-4 py-3 h-12"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex gap-2">
              <Input
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="من"
                type="number"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
              <Input
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="إلى"
                type="number"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
              />
            </div>
          </div>
        </Card>

        {/* Assets List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          </div>
        ) : assets && assets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset: any) => {
              const Icon = getAssetTypeIcon(asset.assetType);
              return (
                <Card
                  key={asset.id}
                  className="group p-6 bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => setLocation(`/uplink3/marketplace/${asset.id}`)}
                >
                  {/* Asset Header */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={`${getAssetTypeColor(asset.assetType)} border`}>
                      <Icon className="w-3 h-3 ml-1" />
                      {assetTypes.find(t => t.value === asset.assetType)?.label || asset.assetType}
                    </Badge>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-bold">{formatPrice(asset.price, asset.pricingModel)}</span>
                    </div>
                  </div>

                  {/* Asset Image/Icon */}
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center mb-4">
                    <Icon className="w-16 h-16 text-purple-400" />
                  </div>

                  {/* Asset Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {asset.title}
                  </h3>

                  {/* Asset Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {asset.description}
                  </p>

                  {/* Asset Owner */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                      {asset.ownerName?.charAt(0) || "?"}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {asset.ownerName || "مالك"}
                    </span>
                  </div>

                  {/* Asset Category */}
                  {asset.category && (
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-white/5 border-white/20 text-gray-300">
                        {categories.find(c => c.value === asset.category)?.label || asset.category}
                      </Badge>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 group-hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        window.location.href = getLoginUrl();
                      } else {
                        setLocation(`/uplink3/marketplace/${asset.id}`);
                      }
                    }}
                  >
                    عرض التفاصيل
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 bg-white/5 backdrop-blur-xl border-white/10 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد أصول</h3>
            <p className="text-gray-400">
              لم يتم العثور على أصول تطابق معايير البحث
            </p>
          </Card>
        )}

        {/* CTA Section */}
        {user && (
          <Card className="mt-12 p-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border-purple-500/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                هل لديك أصل تريد عرضه؟
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                سواء كان ترخيصاً، منتجاً، أو شركة ناشئة، يمكنك عرضه في البورصة والوصول إلى آلاف المستثمرين
              </p>
              <Button
                onClick={() => setLocation("/uplink3/marketplace/create")}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                عرض أصل جديد
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

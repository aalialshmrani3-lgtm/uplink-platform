import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Naqla3SellAsset() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [, setLocation] = useLocation();
  // Using toast from sonner (imported above)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: "license",
    title: "",
    description: "",
    category: "",
    price: "",
    priceType: "one-time",
    contactEmail: "",
    contactPhone: "",
    documents: null as File[] | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    toast.success(isAr ? "تم إرسال الطلب بنجاح!" : "Request Sent Successfully!", {
      description: "Your request will be reviewed and we'll contact you soon.",
    });

    // Redirect after 3 seconds
    setTimeout(() => {
      setLocation("/naqla3/marketplace");
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">{isAr ? "تم إرسال الطلب بنجاح!" : "Request Sent Successfully!"}</CardTitle>
            <CardDescription>
              {isAr ? "سيتم مراجعة طلبك من قبل فريقنا والتواصل معك قريباً" : "Our team will review your request and contact you soon."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/naqla3/marketplace">
              <Button className="w-full">
                {isAr ? "العودة إلى البورصة" : "Back to Exchange"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-950/50 via-background to-pink-950/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <Link href="/naqla3/marketplace">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 ml-2" />
              {isAr ? "العودة إلى البورصة" : "Back to Exchange"}
            </Button>
          </Link>

          <div>
            <h1 className="text-4xl font-bold mb-4">{isAr ? "عرض أصل للبيع" : "List an Asset for Sale"}</h1>
            <p className="text-xl text-muted-foreground">
              {isAr ? "قم بعرض ترخيصك، منتجك، أو شركتك للبيع في بورصة الابتكار" : "List your license, product, or company for sale on the Innovation Exchange."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Asset Type */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "نوع الأصل" : "Asset Type"}</CardTitle>
                <CardDescription>{isAr ? "اختر نوع الأصل الذي تريد عرضه للبيع" : "Select the asset type you want to list for sale."}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Label
                    htmlFor="license"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="license" id="license" className="sr-only" />
                    <div className="text-center">
                      <div className="text-3xl mb-2">📜</div>
                      <div className="font-semibold">{isAr ? "ترخيص" : "License"}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {isAr ? "ترخيص تقنية أو براءة اختراع" : "Technology or Patent License"}
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="product"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="product" id="product" className="sr-only" />
                    <div className="text-center">
                      <div className="text-3xl mb-2">📦</div>
                      <div className="font-semibold">{isAr ? "منتج" : "Product"}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {isAr ? "منتج تقني أو برمجي" : "Tech or Software Product"}
                      </div>
                    </div>
                  </Label>

                  <Label
                    htmlFor="acquisition"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="acquisition" id="acquisition" className="sr-only" />
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏢</div>
                      <div className="font-semibold">{isAr ? "استحواذ" : "Acquisition"}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {isAr ? "شركة ناشئة أو مشروع" : "Startup or Project"}
                      </div>
                    </div>
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "المعلومات الأساسية" : "Basic Information"}</CardTitle>
                <CardDescription>{isAr ? "أدخل تفاصيل الأصل الذي تريد عرضه" : "Enter details for the asset you want to list."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{isAr ? "العنوان *" : "Title *"}</Label>
                  <Input
                    id="title"
                    placeholder={isAr ? "مثال: ترخيص تقنية الذكاء الاصطناعي للطاقة" : "Example: AI Energy Technology License"}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">{isAr ? "الوصف *" : "Description *"}</Label>
                  <Textarea
                    id="description"
                    placeholder={isAr ? "اكتب وصفاً تفصيلياً للأصل..." : "Write a detailed description of the asset..."}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">{isAr ? "الفئة *" : "Category *"}</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر الفئة" : "Select Category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-ml">AI & ML</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="fintech">Fintech</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="iot">IoT</SelectItem>
                      <SelectItem value="blockchain">Blockchain</SelectItem>
                      <SelectItem value="other">{isAr ? "أخرى" : "Other"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "التسعير" : "Pricing"}</CardTitle>
                <CardDescription>{isAr ? "حدد سعر الأصل ونوع الدفع" : "Set asset price and payment type."}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">{isAr ? "السعر (ريال سعودي) *" : "Price (SAR) *"}</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder={isAr ? "مثال: 50000" : "Example: 50000"}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priceType">{isAr ? "نوع الدفع *" : "Payment Type *"}</Label>
                  <Select value={formData.priceType} onValueChange={(value) => setFormData({ ...formData, priceType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={isAr ? "اختر نوع الدفع" : "Select Payment Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">{isAr ? "دفعة واحدة" : "One-time Payment"}</SelectItem>
                      <SelectItem value="monthly">{isAr ? "شهري" : "Monthly"}</SelectItem>
                      <SelectItem value="yearly">{isAr ? "سنوي" : "Annually"}</SelectItem>
                      <SelectItem value="negotiable">{isAr ? "قابل للتفاوض" : "Negotiable"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "معلومات التواصل" : "Contact Info"}</CardTitle>
                <CardDescription>{isAr ? "كيف يمكن للمشترين المحتملين التواصل معك؟" : "How can potential buyers contact you?"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">{isAr ? "البريد الإلكتروني *" : "Email *"}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="example@domain.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">{isAr ? "رقم الهاتف" : "Phone Number"}</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+966 5X XXX XXXX"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>{isAr ? "المستندات (اختياري)" : "Documents (Optional)"}</CardTitle>
                <CardDescription>
                  {isAr ? "قم بإرفاق أي مستندات داعمة (عقود، شهادات، براءات اختراع، إلخ)" : "Attach any supporting documents (contracts, certificates, patents, etc.)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {isAr ? "اسحب وأفلت الملفات هنا، أو انقر للاختيار" : "Drag & drop files here, or click to browse"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAr ? "PDF, DOC, DOCX (حتى 10 MB)" : "PDF, DOC, DOCX (up to 10 MB)"}
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, documents: e.target.files ? Array.from(e.target.files) : null })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Link href="/naqla3/marketplace" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "عرض للبيع" : "Offer for Sale")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Sparkles } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function AddEvent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "" as any,
    startDate: "",
    endDate: "",
    location: "",
    isVirtual: false,
    capacity: "",
    budget: "",
    needSponsors: false,
    needInnovators: false,
  });

  const createEventMutation = trpc.naqla2.events.create.useMutation({
    onSuccess: () => {
      toast({
        title: "✅ تم إنشاء الفعالية بنجاح",
        description: "سيتم مراجعة فعاليتك ونشرها قريباً",
      });
      setLocation("/naqla2");
    },
    onError: (error) => {
      toast({
        title: "❌ حدث خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      location: formData.location,
      isVirtual: formData.isVirtual,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      budget: formData.budget,
      needSponsors: formData.needSponsors,
      needInnovators: formData.needInnovators,
    });
  };

  const eventTypes = [
    { value: "hackathon", label: "هاكاثون", icon: "💻" },
    { value: "workshop", label: "ورشة عمل", icon: "🛠️" },
    { value: "conference", label: "مؤتمر", icon: "🎤" },
    { value: "seminar", label: "ندوة", icon: "📢" },
    { value: "webinar", label: "ويبينار", icon: "🌐" },
    { value: "networking", label: "لقاء علمي / تجمع علمي", icon: "🤝" },
    { value: "exhibition", label: "معرض", icon: "🏛️" },
    { value: "competition", label: "مسابقة", icon: "🏆" },
    { value: "training", label: "تدريب", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>نقلة 2 - إضافة فعالية</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            أضف فعاليتك الآن
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            سجل فعاليتك واحصل على رعاة ومشاركين ومتحدثين من منصة نقلة
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">تفاصيل الفعالية</CardTitle>
            <CardDescription className="text-blue-50">
              املأ جميع الحقول لإنشاء فعاليتك
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-semibold">
                  عنوان الفعالية *
                </Label>
                <Input
                  id="title"
                  placeholder="مثال: هاكاثون الابتكار الوطني 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="text-lg"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-lg font-semibold">
                  نوع الفعالية *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  required
                >
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="اختر نوع الفعالية" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  وصف الفعالية *
                </Label>
                <Textarea
                  id="description"
                  placeholder="اشرح تفاصيل فعاليتك، الأهداف، والجمهور المستهدف..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="text-lg"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    تاريخ البداية *
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    تاريخ النهاية *
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Location & Virtual */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    checked={formData.isVirtual}
                    onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <Label htmlFor="isVirtual" className="text-lg font-semibold cursor-pointer">
                    فعالية افتراضية (أونلاين)
                  </Label>
                </div>

                {!formData.isVirtual && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      الموقع
                    </Label>
                    <Input
                      id="location"
                      placeholder="مثال: الرياض، مركز الملك عبدالله المالي"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Capacity & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    السعة (عدد المشاركين)
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="مثال: 500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    الميزانية المقدرة (ريال سعودي)
                  </Label>
                  <Input
                    id="budget"
                    placeholder="مثال: 500000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              {/* Needs */}
              <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  ما الذي تحتاجه لفعاليتك؟
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="needSponsors"
                      checked={formData.needSponsors}
                      onChange={(e) => setFormData({ ...formData, needSponsors: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <Label htmlFor="needSponsors" className="text-lg cursor-pointer">
                      🤝 أبحث عن رعاة (حاضنات، شركات، مسرعات، جمعيات)
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="needInnovators"
                      checked={formData.needInnovators}
                      onChange={(e) => setFormData({ ...formData, needInnovators: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <Label htmlFor="needInnovators" className="text-lg cursor-pointer">
                      💡 أبحث عن مبتكرين وموهوبين ومتحدثين
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white text-lg py-6"
                >
                  {createEventMutation.isPending ? "جارٍ الإنشاء..." : "إنشاء الفعالية"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/naqla2")}
                  className="px-8 text-lg py-6"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-blue-900 mb-2">رعاة مؤهلين</h3>
              <p className="text-sm text-blue-700">
                احصل على رعاة من حاضنات وشركات مسجلة في المنصة
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-green-900 mb-2">مبتكرون موهوبون</h3>
              <p className="text-sm text-green-700">
                اجذب أفضل المبتكرين والموهوبين في مجالك
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-purple-900 mb-2">عقود آمنة</h3>
              <p className="text-sm text-purple-700">
                انتقل مباشرة لنقلة 3 لإبرام عقود الرعاية بأمان
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

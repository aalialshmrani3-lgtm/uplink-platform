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
import { useLanguage } from "@/contexts/LanguageContext";

export default function AddEvent() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
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
        title: "✅ Event created successfully",
        description: "Your event will be reviewed and published soon",
      });
      setLocation("/naqla2");
    },
    onError: (error) => {
      toast({
        title: "❌ An error occurred",
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
    { value: "hackathon", label: "Hackathon", icon: "💻" },
    { value: "workshop", label: "Workshop", icon: "🛠️" },
    { value: "conference", label: "Conference", icon: "🎤" },
    { value: "seminar", label: "Seminar", icon: "📢" },
    { value: "webinar", label: "Webinar", icon: "🌐" },
    { value: "networking", label: "Scientific Meeting / Gathering", icon: "🤝" },
    { value: "exhibition", label: "Exhibition", icon: "🏛️" },
    { value: "competition", label: "Competition", icon: "🏆" },
    { value: "training", label: "Training", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? isAr ? "نقلة 2 - إضافة فعالية" : "Naqla 2 - Add Event" : "Naqla 2 - Add Event"}</span>
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
            <CardTitle className="text-2xl">{isAr ? "تفاصيل الفعالية" : "Event Details"}</CardTitle>
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
                  placeholder={isAr ? "مثال: هاكاثون الابتكار الوطني 2026" : "Example: National Innovation Hackathon 2026"}
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
                    <SelectValue placeholder={isAr ? "اختر نوع الفعالية" : "Select Event Type"} />
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
                  placeholder={isAr ? "اشرح تفاصيل فعاليتك، الأهداف، والجمهور المستهدف..." : "Describe your event details, objectives, and target audience..."}
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
                      placeholder={isAr ? "مثال: الرياض، مركز الملك عبدالله المالي" : "Example: Riyadh, King Abdullah Financial District"}
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
                    placeholder={isAr ? "مثال: 500" : "Example: 500"}
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
                    placeholder={isAr ? "مثال: 500000" : "Example: 500,000"}
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
                  {createEventMutation.isPending ? isAr ? "جارٍ الإنشاء..." : "Creating..." : "Create Event"}
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
              <h3 className="font-semibold text-blue-900 mb-2">{isAr ? isAr ? "رعاة مؤهلين" : "Qualified Sponsors" : "[Qualified Sponsors]"}</h3>
              <p className="text-sm text-blue-700">
                احصل على رعاة من حاضنات وشركات مسجلة في المنصة
              </p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="font-semibold text-green-900 mb-2">{isAr ? isAr ? "مبتكرون موهوبون" : "Talented Innovators" : "Talented Innovators"}</h3>
              <p className="text-sm text-green-700">
                اجذب أفضل المبتكرين والموهوبين في مجالك
              </p>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-purple-900 mb-2">{isAr ? isAr ? "عقود آمنة" : "Secure Contracts" : "[Secure Contracts]"}</h3>
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

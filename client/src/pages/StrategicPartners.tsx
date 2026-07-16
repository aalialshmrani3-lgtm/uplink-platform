/**
 * Strategic Partners Page
 * عرض الشركاء الاستراتيجيون والمشاريع المدعومة
 */

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StrategicPartners() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  // جلب جميع الشركاء
  const { data: partners, isLoading } = trpc.strategicPartners.getAll.useQuery({
    activeOnly: true,
  });

  const partnerTypeLabels: Record<string, string> = {
    university: "University",
    government: "Government Entity",
    incubator: "Business Incubator",
    accelerator: "Business Accelerator",
    investor: "Investor",
    corporate: "Company",
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{isAr ? "الشركاء الاستراتيجيون" : "Strategic Partners"}</h1>
        <p className="text-muted-foreground">
          شركاؤنا في دعم الابتكار والريادة في المملكة العربية السعودية
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : partners && partners.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.nameAr || partner.name}
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                  )}
                  <Badge>{partnerTypeLabels[partner.type] || partner.type}</Badge>
                </div>
                <CardTitle className="text-xl">
                  {partner.nameAr || partner.name}
                </CardTitle>
                {partner.descriptionAr && (
                  <CardDescription className="line-clamp-2">
                    {partner.descriptionAr}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(() => {
                    const areas = partner.focusAreas;
                    return areas && Array.isArray(areas) && areas.length > 0 && (
                      <div>
                        <strong className="text-sm">{isAr ? isAr ? "مجالات التركيز:" : "Focus Areas:" : "Focus Areas:"}</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(areas as any[]).slice(0, 3).map((area: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {String(area)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })() as any}

                  {(() => {
                    const types = partner.supportTypes;
                    return types && Array.isArray(types) && types.length > 0 && (
                      <div>
                        <strong className="text-sm">{isAr ? isAr ? "أنواع الدعم:" : "Support Types:" : "Support Types:"}</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(types as any[]).slice(0, 3).map((type: any, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {String(type)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })() as any}

                  {/* Contact Info */}
                  <div className="pt-3 border-t space-y-2">
                    {partner.contactEmail && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${partner.contactEmail}`} className="hover:underline">
                          {partner.contactEmail}
                        </a>
                      </div>
                    )}
                    {partner.contactPhone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${partner.contactPhone}`} className="hover:underline">
                          {partner.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Website Link */}
                  {partner.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={partner.website} target="_blank" rel="noopener noreferrer">
                        زيارة الموقع
                        <ExternalLink className="w-4 h-4 mr-2" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              لا توجد شركاء استراتيجيون حالياً
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

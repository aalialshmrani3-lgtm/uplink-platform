import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface IdeaJourneyTimelineProps {
  ideaId: number;
}

export default function IdeaJourneyTimeline({ ideaId }: IdeaJourneyTimelineProps) {
  const { data: journeyData, isLoading } = trpc.naqla1.getIdeaJourney.useQuery({ ideaId });
  const events = journeyData?.timeline || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>رحلة الفكرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Clock className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!journeyData || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>رحلة الفكرة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            لا توجد أحداث مسجلة بعد
          </p>
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'submitted':
        return <Circle className="w-5 h-5 text-blue-500" />;
      case 'analyzed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'promoted_naqla2':
      case 'promoted_naqla3':
        return <ArrowRight className="w-5 h-5 text-purple-500" />;
      case 'matched':
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
      case 'funded':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getEventTitle = (eventType: string) => {
    switch (eventType) {
      case 'submitted':
        return 'تم تقديم الفكرة';
      case 'analyzed':
        return 'تم تحليل الفكرة';
      case 'promoted_naqla2':
        return 'تم الانتقال إلى NAQLA 2';
      case 'promoted_naqla3':
        return 'تم الانتقال إلى NAQLA 3';
      case 'matched':
        return 'تم المطابقة مع تحدي';
      case 'funded':
        return 'تم التمويل';
      case 'completed':
        return 'تم الإنجاز';
      default:
        return eventType;
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50">NAQLA 1</Badge>;
      case 'analyzed':
        return <Badge variant="outline" className="bg-green-50">NAQLA 1</Badge>;
      case 'promoted_naqla2':
      case 'matched':
        return <Badge variant="outline" className="bg-purple-50">NAQLA 2</Badge>;
      case 'promoted_naqla3':
      case 'funded':
        return <Badge variant="outline" className="bg-orange-50">NAQLA 3</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-50">مكتمل</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>رحلة الفكرة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Vertical Line */}
          <div className="absolute right-2.5 top-2 bottom-2 w-px bg-border" />

          {events.map((event: any, index: number) => (
            <div key={index} className="relative flex gap-4 items-start">
              {/* Icon */}
              <div className="relative z-10 bg-background">
                {getEventIcon(event.eventType)}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-sm">
                    {getEventTitle(event.eventType)}
                  </h4>
                  {getEventBadge(event.eventType)}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.timestamp), "PPpp", { locale: ar })}
                </p>

                {/* Event Data */}
                {event.eventData && event.eventData.notes && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">ملاحظات:</p>
                    <p className="text-sm">{event.eventData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { Check, Circle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProgressTrackerProps {
  currentStage: "naqla1" | "naqla2" | "naqla3";
  naqla1Status?: "completed" | "current" | "pending";
  naqla2Status?: "completed" | "current" | "pending";
  naqla3Status?: "completed" | "current" | "pending";
  naqla1Score?: number;
  naqla2ProjectId?: number;
  naqla3AssetId?: number;
}

export default function ProgressTracker({
  currentStage,
  naqla1Status = "pending",
  naqla2Status = "pending",
  naqla3Status = "pending",
  naqla1Score,
  naqla2ProjectId,
  naqla3AssetId,
}: ProgressTrackerProps) {
  const stages = [
    {
      id: "naqla1",
      title: "NAQLA 1",
      subtitle: "التقييم والتصنيف",
      status: naqla1Status,
      score: naqla1Score,
      link: naqla1Score ? `/naqla1/ideas` : null,
    },
    {
      id: "naqla2",
      title: "NAQLA 2",
      subtitle: "المطابقة والتوافق",
      status: naqla2Status,
      projectId: naqla2ProjectId,
      link: naqla2ProjectId ? `/naqla2/projects/${naqla2ProjectId}` : null,
    },
    {
      id: "naqla3",
      title: "NAQLA 3",
      subtitle: "البورصة والاستحواذ",
      status: naqla3Status,
      assetId: naqla3AssetId,
      link: naqla3AssetId ? `/naqla3/assets/${naqla3AssetId}` : null,
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: Check,
          bgColor: "bg-green-500",
          textColor: "text-green-400",
          borderColor: "border-green-500",
        };
      case "current":
        return {
          icon: Circle,
          bgColor: "bg-blue-500 animate-pulse",
          textColor: "text-blue-400",
          borderColor: "border-blue-500",
        };
      default:
        return {
          icon: Circle,
          bgColor: "bg-gray-600",
          textColor: "text-gray-500",
          borderColor: "border-gray-600",
        };
    }
  };

  return (
    <Card className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">رحلة الفكرة</h3>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const config = getStatusConfig(stage.status);
          const StatusIcon = config.icon;
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="flex items-center flex-1">
              {/* Stage Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center mb-2`}
                >
                  <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
                </div>
                <div className="text-center">
                  <div className={`text-sm font-semibold ${config.textColor}`}>
                    {stage.title}
                  </div>
                  <div className="text-xs text-gray-400">{stage.subtitle}</div>
                  {stage.score && (
                    <div className="text-xs text-green-400 mt-1">
                      {stage.score}%
                    </div>
                  )}
                  {stage.link && (
                    <a
                      href={stage.link}
                      className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                    >
                      عرض التفاصيل
                    </a>
                  )}
                </div>
              </div>

              {/* Arrow */}
              {!isLast && (
                <div className="flex-1 flex items-center justify-center px-4">
                  <ArrowRight
                    className={`w-6 h-6 ${
                      stage.status === "completed"
                        ? "text-green-400"
                        : "text-gray-600"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Stage Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-gray-300 text-center">
          {currentStage === "naqla1" && (
            <>
              <strong>المرحلة الحالية:</strong> NAQLA 1 - انتظار التقييم أو اختيار
              المسار
            </>
          )}
          {currentStage === "naqla2" && (
            <>
              <strong>المرحلة الحالية:</strong> NAQLA 2 - البحث عن التحديات
              والمستثمرين
            </>
          )}
          {currentStage === "naqla3" && (
            <>
              <strong>المرحلة الحالية:</strong> NAQLA 3 - متاح للبيع أو الاستحواذ
            </>
          )}
        </p>
      </div>
    </Card>
  );
}

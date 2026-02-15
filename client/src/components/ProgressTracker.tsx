import { Check, Circle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProgressTrackerProps {
  currentStage: "uplink1" | "uplink2" | "uplink3";
  uplink1Status?: "completed" | "current" | "pending";
  uplink2Status?: "completed" | "current" | "pending";
  uplink3Status?: "completed" | "current" | "pending";
  uplink1Score?: number;
  uplink2ProjectId?: number;
  uplink3AssetId?: number;
}

export default function ProgressTracker({
  currentStage,
  uplink1Status = "pending",
  uplink2Status = "pending",
  uplink3Status = "pending",
  uplink1Score,
  uplink2ProjectId,
  uplink3AssetId,
}: ProgressTrackerProps) {
  const stages = [
    {
      id: "uplink1",
      title: "UPLINK 1",
      subtitle: "التقييم والتصنيف",
      status: uplink1Status,
      score: uplink1Score,
      link: uplink1Score ? `/uplink1/ideas` : null,
    },
    {
      id: "uplink2",
      title: "UPLINK 2",
      subtitle: "المطابقة والتوافق",
      status: uplink2Status,
      projectId: uplink2ProjectId,
      link: uplink2ProjectId ? `/uplink2/projects/${uplink2ProjectId}` : null,
    },
    {
      id: "uplink3",
      title: "UPLINK 3",
      subtitle: "البورصة والاستحواذ",
      status: uplink3Status,
      assetId: uplink3AssetId,
      link: uplink3AssetId ? `/uplink3/assets/${uplink3AssetId}` : null,
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
          {currentStage === "uplink1" && (
            <>
              <strong>المرحلة الحالية:</strong> UPLINK 1 - انتظار التقييم أو اختيار
              المسار
            </>
          )}
          {currentStage === "uplink2" && (
            <>
              <strong>المرحلة الحالية:</strong> UPLINK 2 - البحث عن التحديات
              والمستثمرين
            </>
          )}
          {currentStage === "uplink3" && (
            <>
              <strong>المرحلة الحالية:</strong> UPLINK 3 - متاح للبيع أو الاستحواذ
            </>
          )}
        </p>
      </div>
    </Card>
  );
}

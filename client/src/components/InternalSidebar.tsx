import { Link, useLocation } from "wouter";
import { 
  Home, BarChart3, Lightbulb, MessageSquare, PenTool, 
  Calendar, Users, Settings, Award, Briefcase,
  Rocket, Globe, Shield, GraduationCap, Code
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/projects", label: "مشاريعي", icon: Briefcase },
  { href: "/challenges", label: "التحديات", icon: Award },
  { href: "/marketplace", label: "السوق", icon: Globe },
  { href: "/ip/register", label: "الملكية الفكرية", icon: Shield },
  { href: "/messages", label: "الرسائل", icon: MessageSquare },
  { href: "/whiteboard", label: "لوحة الأفكار", icon: PenTool },
  { href: "/calendar", label: "التقويم", icon: Calendar },
  { href: "/academy", label: "الأكاديمية", icon: GraduationCap },
  { href: "/developers", label: "المطورين", icon: Code },
  { href: "/profile", label: "الملف الشخصي", icon: Users },
  { href: "/settings", label: "الإعدادات", icon: Settings },
];

interface InternalSidebarProps {
  className?: string;
}

export default function InternalSidebar({ className }: InternalSidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "w-64 h-screen sticky top-0 bg-card/30 backdrop-blur-sm border-l border-border/50 overflow-y-auto",
      className
    )}>
      <div className="p-6">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 mb-8 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient-cyan">NAQLA 5.0</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border-r-2 border-cyan-500"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "text-cyan-400")} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20">
          <h4 className="text-sm font-semibold text-foreground mb-3">إحصائياتك</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">المشاريع</span>
              <span className="font-semibold text-cyan-400">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">التحديات</span>
              <span className="font-semibold text-cyan-400">5</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">الرسائل</span>
              <span className="font-semibold text-cyan-400">23</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

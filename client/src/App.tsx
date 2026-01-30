import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import { lazy, Suspense, useState, useEffect } from "react";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const IPRegister = lazy(() => import("./pages/IPRegister"));
const IPList = lazy(() => import("./pages/IPList"));
const ProjectNew = lazy(() => import("./pages/ProjectNew"));
const ProjectList = lazy(() => import("./pages/ProjectList"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Academy = lazy(() => import("./pages/Academy"));
const Elite = lazy(() => import("./pages/Elite"));
const Developers = lazy(() => import("./pages/Developers"));
const Profile = lazy(() => import("./pages/Profile"));
const Contracts = lazy(() => import("./pages/Contracts"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Messages = lazy(() => import("./pages/Messages"));
const Whiteboard = lazy(() => import("./pages/Whiteboard"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Admin = lazy(() => import("./pages/Admin"));
const InnovationPipeline = lazy(() => import("./pages/InnovationPipeline"));
const WhyUplink = lazy(() => import("./pages/WhyUplink"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Integrations = lazy(() => import("./pages/Integrations"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const ThreeEngines = lazy(() => import("./pages/ThreeEngines"));
const PredictiveInnovation = lazy(() => import("./pages/PredictiveInnovation"));
const GlobalInnovationNetworks = lazy(() => import("./pages/GlobalInnovationNetworks"));
const SustainabilityAIEthics = lazy(() => import("./pages/SustainabilityAIEthics"));
const BetaPrograms = lazy(() => import("./pages/BetaPrograms"));
const UnifiedDashboard = lazy(() => import("./pages/UnifiedDashboard"));
const ChallengeLibrary = lazy(() => import("./pages/ChallengeLibrary"));
const HypothesisManagement = lazy(() => import("./pages/HypothesisManagement"));
const RATTesting = lazy(() => import("./pages/RATTesting"));
const GateReview = lazy(() => import("./pages/GateReview"));
const LearningKnowledgeBase = lazy(() => import("./pages/LearningKnowledgeBase"));
const AIInsightsDashboard = lazy(() => import("./pages/AIInsightsDashboard"));
const IdeaClassification = lazy(() => import("./pages/IdeaClassification"));
const ModelPerformance = lazy(() => import("./pages/ModelPerformance"));
const DataExport = lazy(() => import("./pages/DataExport"));
const ABTesting = lazy(() => import("./pages/ABTesting"));
const APIManagement = lazy(() => import("./pages/APIManagement"));
const WebhookManagement = lazy(() => import("./pages/WebhookManagement"));
const ModelHistory = lazy(() => import("./pages/ModelHistory"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RoleManagement = lazy(() => import("./pages/RoleManagement"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const SystemHealth = lazy(() => import("./pages/SystemHealth"));
const OrganizationsManagement = lazy(() => import("./pages/admin/OrganizationsManagement"));

// Splash Screen Component
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-20 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Logo Animation */}
      <div className="relative z-10 mb-8">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-50 animate-pulse" />
          
          {/* Logo Container */}
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-2xl transform transition-transform hover:scale-105">
            <svg 
              className="w-20 h-20 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path 
                d="M12 2L2 7l10 5 10-5-10-5z" 
                className="animate-draw"
                strokeDasharray="100"
                strokeDashoffset="100"
                style={{ animation: 'draw 1s ease-out forwards' }}
              />
              <path 
                d="M2 17l10 5 10-5" 
                className="animate-draw"
                strokeDasharray="100"
                strokeDashoffset="100"
                style={{ animation: 'draw 1s ease-out 0.3s forwards' }}
              />
              <path 
                d="M2 12l10 5 10-5" 
                className="animate-draw"
                strokeDasharray="100"
                strokeDashoffset="100"
                style={{ animation: 'draw 1s ease-out 0.6s forwards' }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="relative z-10 text-5xl font-bold mb-2">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          UPLINK
        </span>
        <span className="text-white/80 text-2xl mr-2">5.0</span>
      </h1>
      
      <p className="relative z-10 text-white/50 text-lg mb-12">Global Innovation Platform</p>

      {/* Progress Bar */}
      <div className="relative z-10 w-64">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-white/40 text-sm mt-3">
          {progress < 100 ? 'جاري التحميل...' : 'مرحباً بك'}
        </p>
      </div>

      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/ip/register" component={IPRegister} />
        <Route path="/ip/list" component={IPList} />
        <Route path="/projects/new" component={ProjectNew} />
        <Route path="/projects" component={ProjectList} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/challenges" component={Challenges} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/academy" component={Academy} />
        <Route path="/elite" component={Elite} />
        <Route path="/developers" component={Developers} />
        <Route path="/profile" component={Profile} />
        <Route path="/contracts" component={Contracts} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/messages" component={Messages} />
        <Route path="/whiteboard" component={Whiteboard} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/admin" component={Admin} />
        <Route path="/pipeline" component={InnovationPipeline} />
        <Route path="/why-uplink" component={WhyUplink} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/roi-calculator" component={ROICalculator} />
        <Route path="/help" component={HelpCenter} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/three-engines" component={ThreeEngines} />
        <Route path="/predictive-innovation" component={PredictiveInnovation} />
        <Route path="/global-networks" component={GlobalInnovationNetworks} />
        <Route path="/sustainability-ai-ethics" component={SustainabilityAIEthics} />
        <Route path="/beta-programs" component={BetaPrograms} />
        <Route path="/unified-dashboard" component={UnifiedDashboard} />
        <Route path="/challenge-library" component={ChallengeLibrary} />
        <Route path="/hypothesis-management" component={HypothesisManagement} />
        <Route path="/rat-testing" component={RATTesting} />
        <Route path="/gate-review" component={GateReview} />
        <Route path="/learning-knowledge" component={LearningKnowledgeBase} />
        <Route path="/ai-insights" component={AIInsightsDashboard} />
        <Route path="/admin/idea-classification" component={IdeaClassification} />
        <Route path="/admin/model-performance" component={ModelPerformance} />
        <Route path="/admin/data-export" component={DataExport} />
        <Route path="/admin/ab-testing" component={ABTesting} />
        <Route path="/api-management" component={APIManagement} />
        <Route path="/webhook-management" component={WebhookManagement} />
        <Route path="/admin/model-history" component={ModelHistory} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/roles" component={RoleManagement} />
        <Route path="/admin/audit-logs" component={AuditLogs} />
        <Route path="/admin/system-health" component={SystemHealth} />
        <Route path="/admin/organizations" component={OrganizationsManagement} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  useEffect(() => {
    // Check if user has seen splash in this session
    const seen = sessionStorage.getItem('splash_seen');
    if (seen) {
      setShowSplash(false);
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
    sessionStorage.setItem('splash_seen', 'true');
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
        <TooltipProvider>
          {showSplash && !hasSeenSplash && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          <Toaster />
          <Router />
        </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

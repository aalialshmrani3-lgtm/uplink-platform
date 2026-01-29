import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

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

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">جاري التحميل...</p>
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
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

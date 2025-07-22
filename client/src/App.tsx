import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Breadcrumb, useBreadcrumbs } from "@/components/ui/breadcrumb";
import { SearchBar } from "@/components/ui/search-bar";
import { useUserPreferences } from "@/hooks/use-local-storage";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import AnimatedBackground from "@/components/ui/animated-background";
import Dashboard from "@/pages/dashboard";
import Database from "@/pages/database";
import GraphQL from "@/pages/graphql";
import Auth from "@/pages/auth";
import Storage from "@/pages/storage";
import Functions from "@/pages/functions";
import AI from "@/pages/ai";
import Playground from "@/pages/playground";
import NotFound from "@/pages/not-found";

// Enhanced Pages
import SpecializedAssistants from "@/pages/ai/specialized-assistants";
import DatabaseManager from "@/pages/tools/database-manager";
import TestingSuite from "@/pages/tools/testing-suite";
import TeamManagement from "@/pages/enterprise/team-management";
import ProjectScaffolding from "@/pages/templates/project-scaffolding";
import BusinessPricing from "@/pages/business/pricing";
import EnhancedFeatures from "@/pages/EnhancedFeatures";
import { Database as DatabaseIcon, Code, Shield, Cloud, Zap, Brain, Terminal } from "lucide-react";

// Search results data
const searchResults = [
  { id: '1', title: 'Database', description: 'Manage your PostgreSQL database', category: 'Pages', href: '/database', icon: DatabaseIcon },
  { id: '2', title: 'GraphQL', description: 'GraphQL API playground', category: 'Pages', href: '/graphql', icon: Code },
  { id: '3', title: 'Authentication', description: 'Manage auth providers', category: 'Pages', href: '/auth', icon: Shield },
  { id: '4', title: 'Storage', description: 'File storage management', category: 'Pages', href: '/storage', icon: Cloud },
  { id: '5', title: 'Functions', description: 'Serverless functions', category: 'Pages', href: '/functions', icon: Zap },
  { id: '6', title: 'AI Assistant', description: 'AI-powered development help', category: 'Pages', href: '/ai', icon: Brain },
  { id: '7', title: 'Playground', description: 'API testing playground', category: 'Pages', href: '/playground', icon: Terminal },
  { id: '8', title: 'Specialized AI', description: 'Expert AI assistants', category: 'Pages', href: '/ai/specialized', icon: Brain },
  { id: '9', title: 'Database Manager', description: 'Advanced database tools', category: 'Tools', href: '/tools/database-manager', icon: DatabaseIcon },
  { id: '10', title: 'Testing Suite', description: 'Comprehensive testing tools', category: 'Tools', href: '/tools/testing', icon: Code },
  { id: '11', title: 'Team Management', description: 'Enterprise collaboration', category: 'Enterprise', href: '/enterprise/teams', icon: Shield },
  { id: '12', title: 'Project Templates', description: 'Scaffold new projects', category: 'Templates', href: '/templates', icon: Cloud },
  { id: '13', title: 'Pricing', description: 'Business plans and pricing', category: 'Business', href: '/business/pricing', icon: Zap },
];

function Router() {
  const [location, navigate] = useLocation();
  const { preferences } = useUserPreferences();
  
  // Generate breadcrumbs based on current path
  const breadcrumbItems = useBreadcrumbs(location);
  
  // Filter search results based on query
  const [filteredResults, setFilteredResults] = React.useState(searchResults);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredResults(searchResults);
      return;
    }
    
    const filtered = searchResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(filtered);
  };
  
  const handleSearchSelect = (result: typeof searchResults[0]) => {
    navigate(result.href);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {preferences.animationsEnabled && <AnimatedBackground />}
        <Header>
          <SearchBar 
            onSearch={handleSearch}
            results={filteredResults}
            onSelect={handleSearchSelect}
            className="w-96"
          />
        </Header>
        <div className="flex">
          <Sidebar collapsed={preferences.sidebarCollapsed} />
          <main className={`flex-1 p-6 transition-all duration-300 ${preferences.sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            {/* Breadcrumb navigation */}
            {breadcrumbItems.length > 0 && (
              <Breadcrumb items={breadcrumbItems} className="mb-6" />
            )}
            
            <ErrorBoundary>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/database" component={Database} />
                <Route path="/graphql" component={GraphQL} />
                <Route path="/auth" component={Auth} />
                <Route path="/storage" component={Storage} />
                <Route path="/functions" component={Functions} />
                <Route path="/ai" component={AI} />
                <Route path="/ai/specialized" component={SpecializedAssistants} />
                <Route path="/playground" component={Playground} />
                <Route path="/tools/database-manager" component={DatabaseManager} />
                <Route path="/tools/testing" component={TestingSuite} />
                <Route path="/enterprise/teams" component={TeamManagement} />
                <Route path="/templates" component={ProjectScaffolding} />
                <Route path="/business/pricing" component={BusinessPricing} />
                <Route path="/enhanced" component={EnhancedFeatures} />
                <Route component={NotFound} />
              </Switch>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
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

function Router() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/database" component={Database} />
            <Route path="/graphql" component={GraphQL} />
            <Route path="/auth" component={Auth} />
            <Route path="/storage" component={Storage} />
            <Route path="/functions" component={Functions} />
            <Route path="/ai" component={AI} />
            <Route path="/playground" component={Playground} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

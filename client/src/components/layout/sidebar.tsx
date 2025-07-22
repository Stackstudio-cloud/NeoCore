import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Database, 
  Code, 
  Shield, 
  Cloud, 
  Zap, 
  Brain,
  Home,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Menu,
  BarChart3,
  TestTube,
  Users,
  Layers,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/use-local-storage";
import { LogoWithTagline } from "@/components/ui/logo";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Database", href: "/database", icon: Database },
  { name: "GraphQL", href: "/graphql", icon: Code },
  { name: "Auth", href: "/auth", icon: Shield },
  { name: "Storage", href: "/storage", icon: Cloud },
  { name: "Functions", href: "/functions", icon: Zap },
  { name: "AI", href: "/ai", icon: Brain },
  { name: "Playground", href: "/playground", icon: Terminal },
];

const enhancedSections = [
  {
    title: "AI & Assistants",
    items: [
      { name: "Specialized AI", href: "/ai/specialized", icon: Brain },
    ]
  },
  {
    title: "Developer Tools", 
    items: [
      { name: "DB Manager", href: "/tools/database-manager", icon: Database },
      { name: "Testing", href: "/tools/testing", icon: TestTube },
    ]
  },
  {
    title: "Enterprise",
    items: [
      { name: "Teams", href: "/enterprise/teams", icon: Users },
    ]
  },
  {
    title: "Templates & Business",
    items: [
      { name: "Templates", href: "/templates", icon: Layers },
      { name: "Pricing", href: "/business/pricing", icon: CreditCard },
    ]
  }
];

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed: propCollapsed }: SidebarProps) {
  const [location] = useLocation();
  const { preferences, updatePreference } = useUserPreferences();
  
  const collapsed = propCollapsed ?? preferences.sidebarCollapsed;

  const toggleSidebar = () => {
    updatePreference('sidebarCollapsed', !collapsed);
  };

  return (
    <div className={cn(
      "fixed left-0 top-16 h-[calc(100vh-4rem)] glass-card border-r border-blue-400/20 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 w-6 h-6 rounded-full border border-blue-400/20 bg-background hover:bg-blue-400/10 z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Logo section */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-700/50 mb-4">
          <LogoWithTagline size="md" />
        </div>
      )}
      
      <nav className={cn("p-3", collapsed ? "pt-16" : "pt-4")}>
        {/* Main Navigation */}
        <div className="space-y-2 mb-6">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center rounded-lg transition-all duration-200 group relative",
                collapsed ? "justify-center p-3" : "justify-between px-4 py-3",
                isActive 
                  ? "bg-blue-400/20 text-blue-400 neon-glow" 
                  : "text-gray-300 hover:text-blue-400 hover:bg-blue-400/10"
              )}>
                <div className={cn(
                  "flex items-center",
                  collapsed ? "justify-center" : "space-x-3"
                )}>
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="font-medium">{item.name}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isActive ? "rotate-90" : "group-hover:translate-x-1"
                  )} />
                )}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Enhanced Sections */}
        {!collapsed && enhancedSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.name} href={item.href} className={cn(
                    "flex items-center rounded-lg transition-all duration-200 group px-4 py-2",
                    isActive 
                      ? "bg-purple-400/20 text-purple-400 neon-glow" 
                      : "text-gray-400 hover:text-purple-400 hover:bg-purple-400/10"
                  )}>
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className={cn(
                      "w-3 h-3 ml-auto transition-transform duration-200",
                      isActive ? "rotate-90" : "group-hover:translate-x-1"
                    )} />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

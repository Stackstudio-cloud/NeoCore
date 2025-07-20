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
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserPreferences } from "@/hooks/use-local-storage";
import { LogoWithTagline } from "@/components/ui/logo";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Database", href: "/database", icon: Database },
  { name: "GraphQL", href: "/graphql", icon: Code },
  { name: "Auth", href: "/auth", icon: Shield },
  { name: "Storage", href: "/storage", icon: Cloud },
  { name: "Functions", href: "/functions", icon: Zap },
  { name: "AI", href: "/ai", icon: Brain },
  { name: "Playground", href: "/playground", icon: Terminal },
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
        <div className="space-y-2">
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
      </nav>
    </div>
  );
}

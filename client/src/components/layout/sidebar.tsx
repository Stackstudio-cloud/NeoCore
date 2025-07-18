import { Link, useLocation } from "wouter";
import { 
  Database, 
  Code, 
  Shield, 
  Cloud, 
  Zap, 
  Brain,
  Home,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Database", href: "/database", icon: Database },
  { name: "GraphQL", href: "/graphql", icon: Code },
  { name: "Auth", href: "/auth", icon: Shield },
  { name: "Storage", href: "/storage", icon: Cloud },
  { name: "Functions", href: "/functions", icon: Zap },
  { name: "AI", href: "/ai", icon: Brain },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-card border-r border-blue-400/20 z-40">
      <nav className="p-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-400/20 text-blue-400 neon-glow" 
                    : "text-gray-300 hover:text-blue-400 hover:bg-blue-400/10"
                )}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isActive ? "rotate-90" : "group-hover:translate-x-1"
                  )} />
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

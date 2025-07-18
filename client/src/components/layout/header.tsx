import { Database, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/ui/status-indicator";

export default function Header() {
  return (
    <header className="relative z-50 border-b border-blue-400/20 bg-charcoal/90 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-400 animate-pulse-neon flex items-center">
              <Database className="w-8 h-8 mr-2" />
              NeoCore
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-400">
              <span>v2.0.1</span>
              <StatusIndicator status="online" label="Online" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="glass-card border-blue-400/30">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-green-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

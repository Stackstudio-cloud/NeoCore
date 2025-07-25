import React from "react";
import { Database, Bell, User, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/ui/status-indicator";
import SoundToggle from "@/components/ui/sound-toggle";
import DataStream from "@/components/effects/data-stream";
import Logo from "@/components/ui/logo";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <header className="relative z-50 border-b border-blue-400/20 bg-charcoal/90 backdrop-blur-xl overflow-hidden">
      <DataStream className="opacity-30" lines={3} />
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse-neon">
              <Logo size="lg" />
            </div>
            <div className="hidden md:flex items-center space-x-3 text-sm text-gray-400">
              <span>v2.0.1</span>
              <StatusIndicator status="online" label="Systems Operational" />
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>Region: US-East</span>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <span>Latency: 12ms</span>
            </div>
          </div>
          
          {/* Search bar or other header content */}
          {children && (
            <div className="flex-1 max-w-xl mx-8">
              {children}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Global</span>
            </div>
            <Button variant="outline" size="sm" className="glass-card border-blue-400/30">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <SoundToggle />
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
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

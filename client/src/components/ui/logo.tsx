import React from "react";
import { cn } from "@/lib/utils";
import logoImage from "@assets/NEOCORE_1753023287223.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

const sizeConfig = {
  sm: {
    logo: "w-6 h-6",
    text: "text-lg",
  },
  md: {
    logo: "w-8 h-8",
    text: "text-xl",
  },
  lg: {
    logo: "w-12 h-12",
    text: "text-2xl",
  },
  xl: {
    logo: "w-16 h-16",
    text: "text-3xl",
  },
};

export default function Logo({ 
  size = "md", 
  showText = true, 
  className, 
  textClassName 
}: LogoProps) {
  const config = sizeConfig[size];
  
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoImage} 
        alt="NeoCore Logo" 
        className={cn(config.logo, "object-contain", showText && "mr-3")}
      />
      {showText && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent",
          config.text,
          textClassName
        )}>
          NeoCore
        </span>
      )}
    </div>
  );
}

// Specialized logo variants
export function LogoMark({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  return <Logo size={size} showText={false} className={className} />;
}

export function LogoWithTagline({ 
  size = "md", 
  tagline = "Backend Platform",
  className 
}: { 
  size?: "sm" | "md" | "lg" | "xl"; 
  tagline?: string;
  className?: string;
}) {
  const config = sizeConfig[size];
  
  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src={logoImage} 
        alt="NeoCore Logo" 
        className={cn(config.logo, "object-contain mr-3")}
      />
      <div>
        <div className={cn(
          "font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent",
          config.text
        )}>
          NeoCore
        </div>
        <div className="text-xs text-gray-400">{tagline}</div>
      </div>
    </div>
  );
}
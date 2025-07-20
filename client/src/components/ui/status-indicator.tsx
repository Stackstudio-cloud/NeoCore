import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, XCircle, Clock, Wifi, WifiOff } from "lucide-react";

export type Status = 'online' | 'offline' | 'warning' | 'error' | 'loading';

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    icon: CheckCircle,
    dotColor: 'bg-green-400',
  },
  warning: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    icon: AlertCircle,
    dotColor: 'bg-yellow-400',
  },
  error: {
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    icon: XCircle,
    dotColor: 'bg-red-400',
  },
  offline: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
    icon: WifiOff,
    dotColor: 'bg-gray-400',
  },
  loading: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    icon: Clock,
    dotColor: 'bg-blue-400',
  },
};

const sizeConfig = {
  sm: {
    iconSize: 'w-3 h-3',
    dotSize: 'w-2 h-2',
    text: 'text-xs',
    padding: 'px-2 py-1',
  },
  md: {
    iconSize: 'w-4 h-4',
    dotSize: 'w-3 h-3',
    text: 'text-sm',
    padding: 'px-3 py-1.5',
  },
  lg: {
    iconSize: 'w-5 h-5',
    dotSize: 'w-4 h-4',
    text: 'text-base',
    padding: 'px-4 py-2',
  },
};

export default function StatusIndicator({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizing = sizeConfig[size];
  
  if (!config) {
    console.warn(`Invalid status: ${status}`);
    return null;
  }
  
  const Icon = config.icon;

  const pulseAnimation = status === 'loading' ? 'animate-pulse' : '';
  const dotPulse = status === 'online' ? 'animate-ping' : '';

  if (!label && !showIcon) {
    // Just a status dot
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div className={cn("rounded-full", sizing.dotSize, config.dotColor, pulseAnimation)} />
        {status === 'online' && (
          <div className={cn("absolute rounded-full", sizing.dotSize, config.dotColor, "opacity-75", dotPulse)} />
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-full border",
      sizing.padding,
      config.bgColor,
      `border-${status === 'online' ? 'green' : status === 'warning' ? 'yellow' : status === 'error' ? 'red' : status === 'offline' ? 'gray' : 'blue'}-400/30`,
      className
    )}>
      {showIcon && (
        <div className="relative flex items-center">
          <div className={cn("rounded-full", sizing.dotSize, config.dotColor, pulseAnimation)} />
          {status === 'online' && (
            <div className={cn("absolute rounded-full", sizing.dotSize, config.dotColor, "opacity-75", dotPulse)} />
          )}
        </div>
      )}
      
      {label && (
        <span className={cn(config.color, sizing.text, "font-medium")}>
          {label}
        </span>
      )}
    </div>
  );
}

// Compound component for displaying multiple status indicators
export function StatusGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

// Hook for managing status state
export function useStatus(initialStatus: Status = 'loading') {
  const [status, setStatus] = React.useState<Status>(initialStatus);
  const [message, setMessage] = React.useState<string>('');

  const updateStatus = React.useCallback((newStatus: Status, newMessage?: string) => {
    setStatus(newStatus);
    if (newMessage !== undefined) {
      setMessage(newMessage);
    }
  }, []);

  return { status, message, updateStatus };
}
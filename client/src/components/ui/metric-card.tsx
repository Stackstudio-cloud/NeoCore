import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'neutral';
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const statusColors = {
  success: 'text-green-400 border-green-400/20 bg-green-400/10',
  warning: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
  error: 'text-red-400 border-red-400/20 bg-red-400/10',
  neutral: 'text-gray-400 border-gray-400/20 bg-gray-400/10',
};

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  status = 'neutral',
  description,
  className,
  children,
}: MetricCardProps) {
  const TrendIcon = trendIcons[trend];
  
  return (
    <Card className={cn(
      "glass-card relative overflow-hidden group hover:scale-105 transition-all duration-300",
      statusColors[status],
      className
    )}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn("w-5 h-5", statusColors[status].split(' ')[0])} />
        )}
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {change && (
            <Badge 
              variant="outline" 
              className={cn(
                "px-2 py-1 text-xs border-0",
                trendColors[trend],
                trend === 'up' ? 'bg-green-400/20' : trend === 'down' ? 'bg-red-400/20' : 'bg-gray-400/20'
              )}
            >
              <TrendIcon className="w-3 h-3 mr-1" />
              {Math.abs(change.value)}% {change.period}
            </Badge>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-gray-400 mt-2">
            {description}
          </p>
        )}
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Specialized metric cards
export function DatabaseMetricCard({
  connections,
  queriesPerMinute,
  averageResponseTime,
  className,
}: {
  connections: number;
  queriesPerMinute: number;
  averageResponseTime: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <MetricCard
        title="Active Connections"
        value={connections}
        status={connections > 100 ? 'warning' : 'success'}
        trend={connections > 100 ? 'up' : 'neutral'}
      />
      <MetricCard
        title="Queries/Min"
        value={`${queriesPerMinute.toLocaleString()}`}
        status="success"
        trend="up"
        change={{ value: 12, period: 'vs last hour' }}
      />
      <MetricCard
        title="Avg Response"
        value={`${averageResponseTime}ms`}
        status={averageResponseTime > 100 ? 'warning' : 'success'}
        trend={averageResponseTime > 100 ? 'down' : 'up'}
      />
    </div>
  );
}

export function ApiMetricCard({
  totalRequests,
  errorRate,
  uptime,
  className,
}: {
  totalRequests: number;
  errorRate: number;
  uptime: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      <MetricCard
        title="Total Requests"
        value={totalRequests.toLocaleString()}
        status="success"
        trend="up"
        change={{ value: 8, period: 'vs yesterday' }}
      />
      <MetricCard
        title="Error Rate"
        value={`${errorRate.toFixed(2)}%`}
        status={errorRate > 5 ? 'error' : errorRate > 1 ? 'warning' : 'success'}
        trend={errorRate > 1 ? 'down' : 'up'}
      />
      <MetricCard
        title="Uptime"
        value={`${uptime.toFixed(1)}%`}
        status={uptime > 99 ? 'success' : uptime > 95 ? 'warning' : 'error'}
        trend={uptime > 99 ? 'up' : 'down'}
      />
    </div>
  );
}
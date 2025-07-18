import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
  glowColor?: "blue" | "green" | "pink" | "purple" | "cyan";
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend,
  className,
  glowColor = "blue"
}: MetricCardProps) {
  const glowClasses = {
    blue: "hover:neon-glow",
    green: "hover:neon-glow-green",
    pink: "hover:neon-glow-pink", 
    purple: "hover:shadow-purple-400",
    cyan: "hover:shadow-cyan-400"
  };

  const valueColors = {
    blue: "text-blue-400",
    green: "text-green-400",
    pink: "text-pink-400",
    purple: "text-purple-400", 
    cyan: "text-cyan-400"
  };

  return (
    <div className={cn(
      "metric-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1",
      glowClasses[glowColor],
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className={cn("text-3xl font-bold mb-2", valueColors[glowColor])}>
        {value}
      </div>
      
      {subtitle && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{subtitle}</span>
          {trend && (
            <div className={cn(
              "text-xs font-medium",
              trend === "up" && "text-green-400",
              trend === "down" && "text-red-400",
              trend === "neutral" && "text-gray-400"
            )}>
              {trend === "up" && "↗"}
              {trend === "down" && "↘"}
              {trend === "neutral" && "→"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

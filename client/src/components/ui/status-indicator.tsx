import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning" | "error";
  label?: string;
  showPulse?: boolean;
  className?: string;
}

export default function StatusIndicator({ 
  status, 
  label, 
  showPulse = true, 
  className 
}: StatusIndicatorProps) {
  const statusColors = {
    online: "bg-green-400",
    offline: "bg-gray-400", 
    warning: "bg-yellow-400",
    error: "bg-red-400"
  };

  const pulseColors = {
    online: "animate-pulse",
    offline: "",
    warning: "animate-pulse",
    error: "animate-pulse"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "w-2 h-2 rounded-full",
          statusColors[status],
          showPulse && pulseColors[status]
        )}
      />
      {label && (
        <span className="text-sm text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NeonCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "green" | "pink" | "purple" | "cyan";
  hoverable?: boolean;
}

export default function NeonCard({ 
  title, 
  description, 
  children, 
  className,
  glowColor = "blue",
  hoverable = true
}: NeonCardProps) {
  const glowClasses = {
    blue: "border-blue-400/30 hover:neon-glow",
    green: "border-green-400/30 hover:neon-glow-green", 
    pink: "border-pink-400/30 hover:neon-glow-pink",
    purple: "border-purple-400/30 hover:shadow-purple-400",
    cyan: "border-cyan-400/30 hover:shadow-cyan-400"
  };

  return (
    <Card className={cn(
      "glass-card transition-all duration-300",
      glowClasses[glowColor],
      hoverable && "hover:-translate-y-1",
      className
    )}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

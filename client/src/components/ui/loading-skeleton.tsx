import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-800/50 to-gray-700/30",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-2 w-3/4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex space-x-4 p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-8 w-16" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function CodeBlockSkeleton() {
  return (
    <div className="glass-card p-4 space-y-2">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
      ))}
    </div>
  );
}
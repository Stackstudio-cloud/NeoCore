import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/ui/metric-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";

interface MetricsData {
  connections: number;
  queries_per_min: number;
  uptime: number;
  response_time: number;
}

export default function MetricsCarousel() {
  const [liveMetrics, setLiveMetrics] = useState<MetricsData>({
    connections: 847,
    queries_per_min: 12300,
    uptime: 99.9,
    response_time: 45
  });

  const { lastMessage } = useWebSocket("/ws");

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'metrics_update') {
      setLiveMetrics(lastMessage.data);
    }
  }, [lastMessage]);

  const metrics = [
    {
      title: "Uptime",
      value: `${liveMetrics.uptime}%`,
      subtitle: "Last 30 days",
      glowColor: "green" as const,
    },
    {
      title: "Response Time",
      value: `${liveMetrics.response_time}ms`,
      subtitle: "Average",
      glowColor: "blue" as const,
    },
    {
      title: "API Requests",
      value: "1M+",
      subtitle: "This month",
      glowColor: "purple" as const,
    },
    {
      title: "Active Connections",
      value: liveMetrics.connections,
      subtitle: "Real-time",
      glowColor: "cyan" as const,
    },
    {
      title: "Queries/min",
      value: `${(liveMetrics.queries_per_min / 1000).toFixed(1)}K`,
      subtitle: "Current rate",
      glowColor: "pink" as const,
    },
    {
      title: "Support",
      value: "24/7",
      subtitle: "Available now",
      glowColor: "green" as const,
    },
  ];

  return (
    <div className="mb-8">
      <Carousel className="w-full">
        <CarouselContent className="-ml-4">
          {metrics.map((metric, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <MetricCard
                title={metric.title}
                value={metric.value}
                subtitle={metric.subtitle}
                glowColor={metric.glowColor}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

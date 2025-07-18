import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";
import NeonCard from "@/components/ui/neon-card";
import CodeEditor from "@/components/ui/code-editor";
import StatusIndicator from "@/components/ui/status-indicator";
import { Progress } from "@/components/ui/progress";

export default function LiveDashboard() {
  const [metrics, setMetrics] = useState({
    connections: 847,
    queries_per_min: 12300,
  });

  const { lastMessage, isConnected } = useWebSocket("/ws");

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'metrics_update') {
      setMetrics({
        connections: lastMessage.data.connections,
        queries_per_min: lastMessage.data.queries_per_min,
      });
    }
  }, [lastMessage]);

  const sampleQuery = `query GetUsers {
  users {
    id
    name
    email
    createdAt
  }
}`;

  return (
    <NeonCard title="Live Dashboard" className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GraphQL Playground */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">GraphQL Playground</h3>
          <CodeEditor
            code={sampleQuery}
            language="graphql"
            readOnly
            onRun={() => console.log("Running GraphQL query")}
          />
          <div className="flex items-center text-gray-400 text-sm">
            <StatusIndicator 
              status={isConnected ? "online" : "offline"} 
              label={`Connected to ${isConnected ? 'smartdb-prod' : 'disconnected'}`}
            />
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200">Real-time Metrics</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {metrics.connections}
              </div>
              <div className="text-sm text-muted-foreground mb-2">Active Connections</div>
              <Progress 
                value={(metrics.connections / 1000) * 100} 
                className="h-2"
              />
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {(metrics.queries_per_min / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-muted-foreground mb-2">Queries/min</div>
              <Progress 
                value={67} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  );
}

import React from "react";
import { useQuery } from "@tanstack/react-query";
import NeonCard from "@/components/ui/neon-card";
import MetricCard from "@/components/ui/metric-card";
import StatusIndicator from "@/components/ui/status-indicator";
import CodeEditor from "@/components/ui/code-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Plus, Settings, Activity } from "lucide-react";
import { TableSkeleton, CardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function DatabasePage() {
  const { data: databases, isLoading } = useQuery({
    queryKey: ["/api/projects/1/databases"],
  });

  const sampleSQL = `-- Create a new table with advanced features
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  profile JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  embedding vector(1536)  -- pgvector extension
);

-- Create an index for similarity search
CREATE INDEX ON users USING ivfflat (embedding vector_cosine_ops);

-- Insert sample data
INSERT INTO users (name, email, profile) VALUES 
('John Doe', 'john@example.com', '{"age": 30, "city": "SF"}');`;

  if (isLoading) {
    return (
      <div className="animate-slide-left space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  const database = databases?.[0];

  return (
    <div className="animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Database Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your PostgreSQL database with extensions and real-time monitoring
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Database
        </Button>
      </div>

      {/* Database Overview */}
      {database && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <NeonCard title="Database Instance" glowColor="blue">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-xl font-semibold">{database.name}</h3>
                      <p className="text-muted-foreground">PostgreSQL {database.version}</p>
                    </div>
                  </div>
                  <StatusIndicator status="online" label="Running" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Connection String</p>
                  <code className="block p-3 bg-slate-900 rounded-lg text-sm">
                    {database.connectionString}
                  </code>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Extensions</p>
                  <div className="flex flex-wrap gap-2">
                    {(database.extensions as string[])?.map((ext, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-400/20 text-blue-400">
                        {ext}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </NeonCard>
          </div>

          <div className="space-y-6">
            <MetricCard
              title="Active Connections"
              value={(database.metrics as any)?.connections || 0}
              description="Current"
              icon={Activity}
              status="success"
            />
            <MetricCard
              title="Queries/min"
              value={`${((database.metrics as any)?.queries_per_min / 1000).toFixed(1)}K` || "0"}
              description="Average"
              icon={Database}
              status="success"
            />
          </div>
        </div>
      )}

      {/* SQL Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NeonCard title="SQL Editor" glowColor="cyan">
          <CodeEditor
            code={sampleSQL}
            language="sql"
            onRun={() => console.log("Running SQL query")}
          />
        </NeonCard>

        <NeonCard title="Schema Explorer" glowColor="purple">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Tables</h3>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
            
            <div className="space-y-2">
              {['users', 'posts', 'comments', 'categories'].map((table) => (
                <div 
                  key={table}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>{table}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.floor(Math.random() * 1000)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}

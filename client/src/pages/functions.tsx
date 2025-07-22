import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NeonCard from "@/components/ui/neon-card";
import MetricCard from "@/components/ui/metric-card";
import CodeEditor from "@/components/ui/code-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Play, Plus, Settings, Clock, Activity, Code, Terminal } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FunctionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newFunctionName, setNewFunctionName] = useState("");
  const [selectedRuntime, setSelectedRuntime] = useState("nodejs18");

  const { data: functions, isLoading } = useQuery({
    queryKey: ["/api/projects/1/functions"],
  });

  const createFunctionMutation = useMutation({
    mutationFn: (functionData: any) =>
      apiRequest("POST", "/api/projects/1/functions", functionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/1/functions"] });
      toast({
        title: "Function created",
        description: "Serverless function has been created successfully",
      });
      setNewFunctionName("");
    },
  });

  const handleCreateFunction = () => {
    if (!newFunctionName.trim()) return;
    
    createFunctionMutation.mutate({
      name: newFunctionName,
      runtime: selectedRuntime,
      status: "deployed",
      invocations: 0,
    });
  };

  const sampleFunction = `// Example serverless function
export default async function handler(req, res) {
  const { method, body } = req;
  
  try {
    // Access environment variables
    const apiKey = process.env.API_KEY;
    
    if (method === 'GET') {
      // Handle GET request
      res.status(200).json({ 
        message: 'Hello from NeoCore Functions!',
        timestamp: new Date().toISOString()
      });
    } else if (method === 'POST') {
      // Handle POST request
      const { name } = body;
      
      // Perform some logic
      const result = await processData(name);
      
      res.status(200).json({ 
        result,
        processed: true 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function processData(name) {
  // Your business logic here
  return \`Processed: \${name}\`;
}`;

  if (isLoading) {
    return <div className="animate-pulse">Loading functions...</div>;
  }

  const totalInvocations = Array.isArray(functions) ? functions.reduce((sum: any, func: any) => sum + func.invocations, 0) : 0;
  const activeFunctions = Array.isArray(functions) ? functions.filter((func: any) => func.status === "deployed").length : 0;

  return (
    <div className="animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
            NeoCore Functions
          </h1>
          <p className="text-muted-foreground mt-2">
            Deploy and manage serverless JavaScript/TypeScript functions
          </p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          New Function
        </Button>
      </div>

      {/* Functions Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Functions"
          value={activeFunctions}
          icon={Zap}
          status="success"
        />
        <MetricCard
          title="Total Invocations"
          value={totalInvocations.toLocaleString()}
          description="All time"
          icon={Activity}
          status="success"
        />
        <MetricCard
          title="Avg Duration"
          value="145ms"
          description="Last 24h"
          icon={Clock}
          status="success"
        />
        <MetricCard
          title="Error Rate"
          value="0.2%"
          description="Last 7 days"
          icon={Terminal}
          status="success"
        />
      </div>

      {/* Functions Management */}
      <Tabs defaultValue="functions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="functions">Functions</TabsTrigger>
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="functions">
          <div className="space-y-6">
            {/* Create Function */}
            <NeonCard title="Deploy New Function" glowColor="green">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="function-name">Function Name</Label>
                    <Input
                      id="function-name"
                      placeholder="my-awesome-function"
                      value={newFunctionName}
                      onChange={(e) => setNewFunctionName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="runtime">Runtime</Label>
                    <Select value={selectedRuntime} onValueChange={setSelectedRuntime}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select runtime" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nodejs18">Node.js 18</SelectItem>
                        <SelectItem value="nodejs20">Node.js 20</SelectItem>
                        <SelectItem value="python39">Python 3.9</SelectItem>
                        <SelectItem value="python311">Python 3.11</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleCreateFunction}
                  disabled={!newFunctionName.trim() || createFunctionMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Deploy Function
                </Button>
              </div>
            </NeonCard>

            {/* Existing Functions */}
            <NeonCard title="Deployed Functions" glowColor="blue">
              <div className="space-y-4">
                {Array.isArray(functions) && functions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No functions deployed yet. Create your first function above.
                  </div>
                ) : (
                  Array.isArray(functions) && functions.map((func: any) => (
                    <div 
                      key={func.id}
                      className="flex items-center justify-between p-6 rounded-lg bg-slate-900/50 border border-blue-400/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{func.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {func.runtime} • {func.invocations} invocations
                          </p>
                          {func.lastInvoked && (
                            <p className="text-xs text-muted-foreground">
                              Last invoked: {new Date(func.lastInvoked).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge variant={func.status === "deployed" ? "default" : "secondary"}>
                          {func.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Test
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard title="Function Code" glowColor="purple">
              <CodeEditor
                code={sampleFunction}
                language="javascript"
                onRun={() => toast({
                  title: "Function executed",
                  description: "Function ran successfully in test environment",
                })}
              />
            </NeonCard>

            <NeonCard title="Environment Variables" glowColor="cyan">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Configuration</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { key: "API_KEY", value: "***************" },
                    { key: "DATABASE_URL", value: "***************" },
                    { key: "NODE_ENV", value: "production" },
                  ].map((env, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-sm">{env.key}</span>
                      </div>
                      <span className="text-sm text-muted-foreground font-mono">{env.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <NeonCard title="Function Logs" glowColor="pink">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Recent Executions</h3>
                <Button variant="outline" size="sm">
                  <Terminal className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {[
                    { timestamp: "2024-01-15T10:30:00Z", level: "INFO", message: "Function invoked successfully" },
                    { timestamp: "2024-01-15T10:29:45Z", level: "INFO", message: "Processing request with method: POST" },
                    { timestamp: "2024-01-15T10:29:30Z", level: "DEBUG", message: "Environment variables loaded" },
                    { timestamp: "2024-01-15T10:29:15Z", level: "INFO", message: "Function cold start completed in 234ms" },
                    { timestamp: "2024-01-15T10:28:00Z", level: "ERROR", message: "Invalid request body format" },
                  ].map((log, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-gray-500 text-xs">{log.timestamp}</span>
                      <span className={`text-xs font-medium ${
                        log.level === 'ERROR' ? 'text-red-400' :
                        log.level === 'DEBUG' ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-gray-300 text-xs">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </NeonCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

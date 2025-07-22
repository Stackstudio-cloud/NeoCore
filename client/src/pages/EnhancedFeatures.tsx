import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Globe, Zap, Bot, Users, Layers } from "lucide-react";

export default function EnhancedFeatures() {
  const [selectedDatabase, setSelectedDatabase] = useState(1);

  // Fetch database branches
  const { data: branches = [] } = useQuery({
    queryKey: ['/api/databases', selectedDatabase, 'branches'],
  });

  // Fetch edge regions
  const { data: regions = [] } = useQuery({
    queryKey: ['/api/edge-regions'],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Enhanced Features</h1>
        <p className="text-gray-400">
          Next-generation development capabilities inspired by industry leaders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Database Branching - Inspired by Neon */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">Database Branching</CardTitle>
            </div>
            <CardDescription>
              Git-like branching for databases, inspired by Neon's innovation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Branches</span>
              <Badge variant="secondary">{branches.length}</Badge>
            </div>
            <div className="space-y-2">
              {branches.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No branches created yet</p>
                </div>
              ) : (
                branches.slice(0, 3).map((branch: any) => (
                  <div key={branch.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                    <span className="text-sm text-white">{branch.name}</span>
                    <Badge variant={branch.isMain ? "default" : "outline"}>
                      {branch.isMain ? "main" : "feature"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full" variant="outline">
              Create Branch
            </Button>
          </CardContent>
        </Card>

        {/* Real-time Collaboration - Inspired by Cursor/Figma */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              <CardTitle className="text-white">Live Collaboration</CardTitle>
            </div>
            <CardDescription>
              Real-time code editing with live cursors, inspired by Cursor AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Sessions</span>
              <Badge variant="secondary">2</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">John Doe</span>
                <span className="text-xs text-gray-400">main.ts:45</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-white">Jane Smith</span>
                <span className="text-xs text-gray-400">api.ts:12</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Join Session
            </Button>
          </CardContent>
        </Card>

        {/* Visual Canvas - Inspired by Railway */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Visual Infrastructure</CardTitle>
            </div>
            <CardDescription>
              Drag-and-drop infrastructure builder, inspired by Railway
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Canvas Nodes</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded text-center">
                <span className="text-xs text-blue-400">Database</span>
              </div>
              <div className="p-2 bg-green-500/20 border border-green-500/30 rounded text-center">
                <span className="text-xs text-green-400">API</span>
              </div>
              <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded text-center">
                <span className="text-xs text-purple-400">Function</span>
              </div>
              <div className="p-2 bg-orange-500/20 border border-orange-500/30 rounded text-center">
                <span className="text-xs text-orange-400">Storage</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Open Canvas
            </Button>
          </CardContent>
        </Card>

        {/* Edge Computing - Inspired by Fly.io */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              <CardTitle className="text-white">Edge Deployment</CardTitle>
            </div>
            <CardDescription>
              Global edge computing network, inspired by Fly.io
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Regions</span>
              <Badge variant="secondary">{regions.length}</Badge>
            </div>
            <div className="space-y-2">
              {regions.slice(0, 3).map((region: any) => (
                <div key={region.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div>
                    <span className="text-sm text-white">{region.name}</span>
                    <div className="text-xs text-gray-400">{region.country}</div>
                  </div>
                  <Badge variant="outline">{region.latency}ms</Badge>
                </div>
              ))}
            </div>
            <Button className="w-full" variant="outline">
              Deploy to Edge
            </Button>
          </CardContent>
        </Card>

        {/* AI Code Generation - Enhanced */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-yellow-400" />
              <CardTitle className="text-white">AI Code Generation</CardTitle>
            </div>
            <CardDescription>
              Advanced AI coding assistant, enhanced with GPT-4o-mini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Generations Today</span>
              <Badge variant="secondary">47</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">API Routes</span>
                <Badge variant="outline">TypeScript</Badge>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">React Components</span>
                <Badge variant="outline">JSX</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Generate Code
            </Button>
          </CardContent>
        </Card>

        {/* Performance Monitoring */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <CardTitle className="text-white">Performance Insights</CardTitle>
            </div>
            <CardDescription>
              Real-time performance monitoring and optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">45ms</div>
                <div className="text-xs text-gray-400">Avg Response</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">API Requests</span>
                <span className="text-white">1.2M/day</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Database Queries</span>
                <span className="text-white">850K/day</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Competitive Feature Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">✓</div>
            <div className="text-sm text-gray-300">Database Branching</div>
            <div className="text-xs text-gray-500">Like Neon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">✓</div>
            <div className="text-sm text-gray-300">Live Collaboration</div>
            <div className="text-xs text-gray-500">Like Cursor AI</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">✓</div>
            <div className="text-sm text-gray-300">Visual Canvas</div>
            <div className="text-xs text-gray-500">Like Railway</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">✓</div>
            <div className="text-sm text-gray-300">Edge Computing</div>
            <div className="text-xs text-gray-500">Like Fly.io</div>
          </div>
        </div>
      </div>
    </div>
  );
}
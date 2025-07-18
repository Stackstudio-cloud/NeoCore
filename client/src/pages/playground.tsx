import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Play, Save, Share2, Code, Terminal, Database, Zap, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CodePlayground from '@/components/ui/code-playground';
import HolographicChart from '@/components/effects/holographic-chart';
import MatrixRain from '@/components/effects/matrix-rain';

export default function Playground() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.neocore.io/v1/');
  const [headers, setHeaders] = useState('{\n  "Authorization": "Bearer YOUR_TOKEN",\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Sample performance data
  const performanceData = [120, 98, 156, 89, 134, 178, 92, 145, 167, 201];

  const apiExamples = [
    {
      id: 'database',
      name: 'Database Query',
      language: 'sql',
      description: 'Query your PostgreSQL database with auto-generated GraphQL',
      code: `-- Get all active users with their projects
SELECT 
  u.id,
  u.email,
  u.created_at,
  COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON u.id = p.owner_id
WHERE u.status = 'active'
GROUP BY u.id, u.email, u.created_at
ORDER BY u.created_at DESC
LIMIT 10;

-- Vector similarity search for AI embeddings
SELECT 
  content,
  metadata,
  embedding <-> '[0.1, 0.2, 0.3, ...]'::vector as distance
FROM documents
ORDER BY distance ASC
LIMIT 5;`
    },
    {
      id: 'graphql',
      name: 'GraphQL API',
      language: 'graphql',
      description: 'Auto-generated GraphQL API with real-time subscriptions',
      code: `# Query with nested relationships
query GetProject($id: ID!) {
  project(id: $id) {
    id
    name
    description
    owner {
      email
      profile {
        displayName
      }
    }
    databases {
      name
      status
      metrics {
        connections
        queriesPerMinute
      }
    }
    functions {
      name
      runtime
      lastInvoked
      invocations
    }
  }
}

# Real-time subscription
subscription ProjectMetrics($projectId: ID!) {
  projectMetricsUpdated(projectId: $projectId) {
    timestamp
    cpuUsage
    memoryUsage
    requestCount
    errorRate
  }
}`
    },
    {
      id: 'functions',
      name: 'Edge Functions',
      language: 'javascript',
      description: 'Deploy serverless functions at the edge with global distribution',
      code: `// AI-powered content moderation function
export default async function handler(req, res) {
  const { content, userId } = req.body;
  
  try {
    // Use NeoCore AI for content analysis
    const analysis = await neocore.ai.analyze({
      text: content,
      models: ['toxicity', 'spam', 'sentiment'],
      userId
    });
    
    // Store results in database
    await neocore.db.from('content_analysis').insert({
      user_id: userId,
      content,
      toxicity_score: analysis.toxicity,
      sentiment: analysis.sentiment,
      is_spam: analysis.spam > 0.7,
      created_at: new Date()
    });
    
    // Return moderation decision
    return res.json({
      approved: analysis.toxicity < 0.8 && analysis.spam < 0.7,
      confidence: analysis.confidence,
      reason: analysis.reason,
      requestId: analysis.id
    });
    
  } catch (error) {
    console.error('Content moderation failed:', error);
    return res.status(500).json({ 
      error: 'Moderation service unavailable',
      fallback: 'manual_review'
    });
  }
}`
    }
  ];

  const executeRequest = async () => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      const mockResponses = {
        'GET': `{
  "status": "success",
  "data": {
    "projects": [
      {
        "id": "proj_7x8y9z",
        "name": "NeoCore Demo",
        "status": "active",
        "region": "us-east-1",
        "databases": 3,
        "functions": 12,
        "storage": "2.4GB"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}`,
        'POST': `{
  "status": "created",
  "data": {
    "id": "db_abc123",
    "name": "production-db",
    "connectionString": "postgresql://user:***@db.neocore.io:5432/prod",
    "region": "us-east-1",
    "status": "initializing"
  }
}`,
        'PUT': `{
  "status": "updated",
  "data": {
    "id": "func_def456",
    "name": "ai-content-moderator",
    "runtime": "nodejs18",
    "deploymentUrl": "https://ai-moderator-abc123.neocore.run",
    "status": "deployed"
  }
}`
      };

      setResponse(mockResponses[method as keyof typeof mockResponses] || mockResponses.GET);
      setIsLoading(false);
      
      toast({
        title: "Request executed",
        description: `${method} request completed successfully`
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 relative">
      <MatrixRain className="opacity-10" />
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            API Playground
          </h1>
          <p className="text-muted-foreground mt-2">
            Test and explore NeoCore APIs with real-time feedback and performance monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-400/50 text-green-400">
            <Terminal className="w-3 h-3 mr-1" />
            Live Environment
          </Badge>
          <Badge variant="outline" className="border-blue-400/50 text-blue-400">
            <Zap className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* API Tester */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-green-400/20 bg-charcoal/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                HTTP Request Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.neocore.io/v1/"
                  className="flex-1"
                />
                <Button onClick={executeRequest} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  {isLoading ? 'Executing...' : 'Send'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Headers</label>
                  <Textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    className="font-mono text-sm mt-1"
                    rows={4}
                  />
                </div>

                {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Request Body</label>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder='{\n  "name": "My Database",\n  "region": "us-east-1"\n}'
                      className="font-mono text-sm mt-1"
                      rows={6}
                    />
                  </div>
                )}
              </div>

              {response && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-green-400">Response</label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(response)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="bg-slate-900/60 border border-green-400/20 rounded-lg p-4 text-sm overflow-x-auto text-gray-300">
                    {response}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Examples */}
          <CodePlayground
            title="API Integration Examples"
            examples={apiExamples}
          />
        </div>

        {/* Performance Monitor */}
        <div className="space-y-6">
          <Card className="border-blue-400/20 bg-charcoal/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Performance Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <HolographicChart
                    data={performanceData}
                    width={250}
                    height={120}
                    color="#00ff41"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">127ms</div>
                    <div className="text-gray-400">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99.9%</div>
                    <div className="text-gray-400">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">847</div>
                    <div className="text-gray-400">Req/min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">12</div>
                    <div className="text-gray-400">Regions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-400/20 bg-charcoal/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Environment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Environment</span>
                <Badge variant="secondary">Production</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Region</span>
                <Badge variant="secondary">US-East-1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Rate Limit</span>
                <Badge variant="secondary">1000/min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Timeout</span>
                <Badge variant="secondary">30s</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
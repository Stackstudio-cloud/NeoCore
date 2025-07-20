import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NeonCard from "@/components/ui/neon-card";
import MetricCard from "@/components/ui/metric-card";
import CodeEditor from "@/components/ui/code-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, MessageSquare, Plus, Settings, Zap, Search, Bot, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DevelopmentAssistant from "@/components/ai/development-assistant";
import MatrixRain from "@/components/effects/matrix-rain";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function AIPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAssistantName, setNewAssistantName] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [queryInput, setQueryInput] = useState("");

  const { data: assistants, isLoading } = useQuery({
    queryKey: ["/api/projects/1/ai"],
  });

  const createAssistantMutation = useMutation({
    mutationFn: (assistantData: any) =>
      apiRequest("POST", "/api/projects/1/ai", assistantData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/1/ai"] });
      toast({
        title: "AI Assistant created",
        description: "Your AI assistant has been created successfully",
      });
      setNewAssistantName("");
    },
  });

  const handleCreateAssistant = () => {
    if (!newAssistantName.trim()) return;
    
    createAssistantMutation.mutate({
      name: newAssistantName,
      model: selectedModel,
      description: "AI assistant for data interaction",
      config: {
        temperature: 0.7,
        max_tokens: 1000,
      },
      active: true,
    });
  };

  const sampleEmbeddingQuery = `-- Natural language query example
SELECT * FROM products 
WHERE embedding <-> query_embedding(
  'Find comfortable running shoes under $100'
) < 0.3
ORDER BY embedding <-> query_embedding(
  'Find comfortable running shoes under $100'
) ASC
LIMIT 10;`;

  const sampleAssistantConfig = `{
  "name": "Customer Support AI",
  "model": "gpt-4",
  "system_prompt": "You are a helpful customer support assistant for NeoCore. You have access to user data and can help with account issues, billing questions, and technical support.",
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_user_info",
        "description": "Get user account information",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {
              "type": "string",
              "description": "The user ID"
            }
          }
        }
      }
    },
    {
      "type": "function", 
      "function": {
        "name": "search_knowledge_base",
        "description": "Search the knowledge base for relevant information",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "The search query"
            }
          }
        }
      }
    }
  ],
  "permissions": {
    "tables": ["users", "orders", "support_tickets"],
    "actions": ["read", "update"]
  }
}`;

  if (isLoading) {
    return <div className="animate-pulse">Loading AI services...</div>;
  }

  const activeAssistants = assistants?.filter(assistant => assistant.active).length || 0;

  return (
    <div className="animate-slide-left relative">
      <MatrixRain className="opacity-10" />
      
      {/* AI Development Assistant */}
      <div className="mb-8 relative z-10">
        <DevelopmentAssistant />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NeoCore AI
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered embeddings, assistants, and natural language queries
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Assistant
        </Button>
      </div>

      {/* AI Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Active Assistants"
          value={activeAssistants}
          icon={<Bot className="w-4 h-4" />}
          glowColor="purple"
        />
        <MetricCard
          title="Embeddings"
          value="15.2K"
          subtitle="Generated"
          icon={<Sparkles className="w-4 h-4" />}
          glowColor="blue"
        />
        <MetricCard
          title="AI Queries"
          value="3.8K"
          subtitle="This month"
          icon={<MessageSquare className="w-4 h-4" />}
          glowColor="green"
        />
        <MetricCard
          title="Response Time"
          value="1.2s"
          subtitle="Average"
          icon={<Zap className="w-4 h-4" />}
          glowColor="pink"
        />
      </div>

      {/* AI Services */}
      <Tabs defaultValue="assistants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistants">AI Assistants</TabsTrigger>
          <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
          <TabsTrigger value="queries">Natural Language</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="assistants">
          <div className="space-y-6">
            {/* Create Assistant */}
            <NeonCard title="Create AI Assistant" glowColor="purple">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assistant-name">Assistant Name</Label>
                    <Input
                      id="assistant-name"
                      placeholder="Customer Support AI"
                      value={newAssistantName}
                      onChange={(e) => setNewAssistantName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">AI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this assistant will help with..."
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleCreateAssistant}
                  disabled={!newAssistantName.trim() || createAssistantMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Create Assistant
                </Button>
              </div>
            </NeonCard>

            {/* Existing Assistants */}
            <NeonCard title="AI Assistants" glowColor="blue">
              <div className="space-y-4">
                {assistants?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No AI assistants created yet. Create your first assistant above.
                  </div>
                ) : (
                  assistants?.map((assistant) => (
                    <div 
                      key={assistant.id}
                      className="flex items-center justify-between p-6 rounded-lg bg-slate-900/50 border border-purple-400/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <Brain className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{assistant.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assistant.model} • {assistant.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge variant={assistant.active ? "default" : "secondary"}>
                          {assistant.active ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
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

        <TabsContent value="embeddings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard title="Auto-Embeddings" glowColor="green">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Automatically generate embeddings for your data as it's inserted or modified.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                    <div>
                      <p className="font-medium">Products Table</p>
                      <p className="text-sm text-muted-foreground">Description field</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                    <div>
                      <p className="font-medium">Articles Table</p>
                      <p className="text-sm text-muted-foreground">Content field</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                    <div>
                      <p className="font-medium">Users Table</p>
                      <p className="text-sm text-muted-foreground">Bio field</p>
                    </div>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </div>
                
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Embeddings
                </Button>
              </div>
            </NeonCard>

            <NeonCard title="Similarity Search" glowColor="cyan">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use embeddings to perform similarity searches and find related content.
                </p>
                
                <CodeEditor
                  code={sampleEmbeddingQuery}
                  language="sql"
                  readOnly
                  onRun={() => toast({
                    title: "Query executed",
                    description: "Similarity search completed successfully",
                  })}
                />
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="queries">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard title="Natural Language Queries" glowColor="pink">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Query your data using natural language. The AI will convert your questions into proper SQL queries.
                </p>
                
                <div>
                  <Label htmlFor="nl-query">Ask a question about your data</Label>
                  <Textarea
                    id="nl-query"
                    placeholder="Find all users who signed up in the last month and have made at least 3 purchases"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={() => toast({
                    title: "Query processed",
                    description: "Natural language query converted to SQL",
                  })}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Convert to SQL
                </Button>
              </div>
            </NeonCard>

            <NeonCard title="Generated SQL" glowColor="blue">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The AI-generated SQL query based on your natural language input.
                </p>
                
                <CodeEditor
                  code={`-- Generated from: "Find all users who signed up in the last month and have made at least 3 purchases"
SELECT 
  u.id,
  u.name,
  u.email,
  u.created_at,
  COUNT(o.id) as purchase_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= NOW() - INTERVAL '1 month'
GROUP BY u.id, u.name, u.email, u.created_at
HAVING COUNT(o.id) >= 3
ORDER BY purchase_count DESC;`}
                  language="sql"
                  readOnly
                  onRun={() => toast({
                    title: "SQL executed",
                    description: "Query ran successfully",
                  })}
                />
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <NeonCard title="AI Configuration" glowColor="purple">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Assistant Configuration Example</h3>
                <CodeEditor
                  code={sampleAssistantConfig}
                  language="json"
                  readOnly
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Supported Models</h4>
                  <div className="space-y-2">
                    {[
                      { name: "GPT-4", provider: "OpenAI", status: "Available" },
                      { name: "GPT-3.5 Turbo", provider: "OpenAI", status: "Available" },
                      { name: "Claude 3", provider: "Anthropic", status: "Available" },
                      { name: "Gemini Pro", provider: "Google", status: "Available" },
                    ].map((model, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-sm text-muted-foreground">{model.provider}</p>
                        </div>
                        <Badge variant="default">{model.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Embedding Providers</h4>
                  <div className="space-y-2">
                    {[
                      { name: "OpenAI Embeddings", model: "text-embedding-3-large", status: "Active" },
                      { name: "Google Embeddings", model: "textembedding-gecko", status: "Active" },
                      { name: "Cohere Embeddings", model: "embed-english-v3.0", status: "Available" },
                    ].map((provider, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">{provider.model}</p>
                        </div>
                        <Badge variant={provider.status === "Active" ? "default" : "secondary"}>
                          {provider.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </NeonCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

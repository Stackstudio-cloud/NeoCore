import { useState } from "react";
import NeonCard from "@/components/ui/neon-card";
import CodeEditor from "@/components/ui/code-editor";
import StatusIndicator from "@/components/ui/status-indicator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Play, Book, Settings } from "lucide-react";

export default function GraphQLPage() {
  const [query, setQuery] = useState(`query GetUsers {
  users {
    id
    name
    email
    profile
    createdAt
  }
}`);

  const [response, setResponse] = useState(`{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com", 
        "profile": {
          "age": 30,
          "city": "San Francisco"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "2", 
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profile": {
          "age": 28,
          "city": "New York"
        },
        "createdAt": "2024-01-16T14:20:00Z"
      }
    ]
  }
}`);

  const subscriptionExample = `subscription OnUserCreated {
  userInserted {
    id
    name
    email
    createdAt
  }
}`;

  const mutationExample = `mutation CreateUser($input: UserInput!) {
  insertUser(object: $input) {
    id
    name
    email
    createdAt
  }
}`;

  return (
    <div className="animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            GraphQL API
          </h1>
          <p className="text-muted-foreground mt-2">
            Auto-generated GraphQL API with real-time subscriptions and permissions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <StatusIndicator status="online" label="API Active" />
          <Button className="bg-green-600 hover:bg-green-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* API Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <NeonCard title="Endpoint" glowColor="green">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">GraphQL Endpoint</p>
              <code className="block p-2 bg-slate-900 rounded text-sm">
                https://api.smartdb.io/v1/graphql
              </code>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">WebSocket</p>
              <code className="block p-2 bg-slate-900 rounded text-sm">
                wss://api.smartdb.io/v1/graphql
              </code>
            </div>
          </div>
        </NeonCard>

        <NeonCard title="Features" glowColor="blue">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              Auto-generated from schema
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              Real-time subscriptions
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              Fine-grained permissions
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
              Relationship queries
            </li>
          </ul>
        </NeonCard>

        <NeonCard title="Performance" glowColor="purple">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg Response</span>
              <span className="text-sm font-medium text-purple-400">23ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Requests/min</span>
              <span className="text-sm font-medium text-purple-400">8.2K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
              <span className="text-sm font-medium text-purple-400">94%</span>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* GraphQL Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NeonCard title="Query Editor" glowColor="green">
          <Tabs defaultValue="query" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="query">Query</TabsTrigger>
              <TabsTrigger value="mutation">Mutation</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="query" className="mt-4">
              <CodeEditor
                code={query}
                language="graphql"
                onRun={() => console.log("Running GraphQL query")}
              />
            </TabsContent>
            
            <TabsContent value="mutation" className="mt-4">
              <CodeEditor
                code={mutationExample}
                language="graphql"
                readOnly
                onRun={() => console.log("Running GraphQL mutation")}
              />
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-4">
              <CodeEditor
                code={subscriptionExample}
                language="graphql"
                readOnly
                onRun={() => console.log("Starting GraphQL subscription")}
              />
            </TabsContent>
          </Tabs>
        </NeonCard>

        <NeonCard title="Response" glowColor="blue">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Response</span>
              <div className="flex items-center space-x-2">
                <StatusIndicator status="online" />
                <span className="text-xs text-muted-foreground">200 OK - 23ms</span>
              </div>
            </div>
            <CodeEditor
              code={response}
              language="json"
              readOnly
            />
          </div>
        </NeonCard>
      </div>

      {/* Schema Explorer */}
      <NeonCard title="Schema Explorer" glowColor="cyan">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Types */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Code className="w-4 h-4 mr-2 text-cyan-400" />
              Types
            </h3>
            <div className="space-y-2">
              {['User', 'Post', 'Comment', 'Category'].map((type) => (
                <div 
                  key={type}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="text-cyan-400">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Queries */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Book className="w-4 h-4 mr-2 text-green-400" />
              Queries
            </h3>
            <div className="space-y-2">
              {['users', 'posts', 'comments', 'user_by_pk'].map((query) => (
                <div 
                  key={query}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="text-green-400">{query}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mutations */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Play className="w-4 h-4 mr-2 text-purple-400" />
              Mutations
            </h3>
            <div className="space-y-2">
              {['insert_user', 'update_user', 'delete_user', 'insert_post'].map((mutation) => (
                <div 
                  key={mutation}
                  className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <span className="text-purple-400">{mutation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </NeonCard>
    </div>
  );
}

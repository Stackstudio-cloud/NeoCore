import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DATABASE_PROVIDERS, getDatabasesByType, type DatabaseProvider } from "@shared/enhanced-tools";
import { Plus, Play, Database, Settings, Trash2, TestTube, Eye } from "lucide-react";

const connectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  connectionString: z.string().min(1, "Connection string is required"),
});

type ConnectionForm = z.infer<typeof connectionSchema>;

interface DatabaseConnection {
  id: number;
  name: string;
  provider: string;
  connectionString: string;
  status: 'connected' | 'disconnected' | 'error';
  config: any;
  createdAt: string;
}

export default function DatabaseManager() {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [queryText, setQueryText] = useState('');
  const [activeConnection, setActiveConnection] = useState<number | null>(null);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<ConnectionForm>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      name: '',
      provider: '',
      connectionString: '',
    },
  });

  const { data: connections = [], isLoading } = useQuery<DatabaseConnection[]>({
    queryKey: ['/api/databases/connections'],
  });

  const { data: queryResult } = useQuery({
    queryKey: ['/api/databases/query-result'],
    enabled: false,
  });

  const createConnectionMutation = useMutation({
    mutationFn: async (data: ConnectionForm) => {
      return apiRequest('POST', '/api/databases/connections', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/databases/connections'] });
      setShowConnectionDialog(false);
      form.reset();
      toast({
        title: "Success",
        description: "Database connection created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create connection",
        variant: "destructive",
      });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (connectionId: number) => {
      return apiRequest('POST', `/api/databases/connections/${connectionId}/test`);
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Success" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/databases/connections'] });
    },
  });

  const executeQueryMutation = useMutation({
    mutationFn: async ({ connectionId, query }: { connectionId: number; query: string }) => {
      return apiRequest('POST', `/api/databases/connections/${connectionId}/query`, { query });
    },
    onSuccess: (data) => {
      toast({
        title: "Query executed",
        description: `Returned ${data.rows?.length || 0} rows`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Query failed",
        description: error.message || "Failed to execute query",
        variant: "destructive",
      });
    },
  });

  const deleteConnectionMutation = useMutation({
    mutationFn: async (connectionId: number) => {
      return apiRequest('DELETE', `/api/databases/connections/${connectionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/databases/connections'] });
      toast({
        title: "Success",
        description: "Connection deleted successfully",
      });
    },
  });

  const handleExecuteQuery = () => {
    if (!activeConnection || !queryText.trim()) return;
    executeQueryMutation.mutate({
      connectionId: activeConnection,
      query: queryText,
    });
  };

  const getProviderInfo = (providerId: string): DatabaseProvider => {
    return DATABASE_PROVIDERS[providerId] || DATABASE_PROVIDERS.postgresql;
  };

  const relationalDbs = getDatabasesByType('relational');
  const documentDbs = getDatabasesByType('document');
  const keyValueDbs = getDatabasesByType('key-value');
  const graphDbs = getDatabasesByType('graph');
  const timeSeriesDbs = getDatabasesByType('time-series');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Database Manager
          </h1>
          <p className="text-gray-400 mt-2">
            Connect and manage multiple database providers
          </p>
        </div>
        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Database Connection</DialogTitle>
              <DialogDescription>
                Connect to a new database provider
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createConnectionMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="My Database" className="bg-gray-800 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Provider</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue placeholder="Select a database provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {Object.values(DATABASE_PROVIDERS).map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              <div className="flex items-center space-x-2">
                                <span>{provider.icon}</span>
                                <span>{provider.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="connectionString"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection String</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={selectedProvider ? getProviderInfo(selectedProvider).connectionString : "Enter connection string"}
                          className="bg-gray-800 border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600"
                  disabled={createConnectionMutation.isPending}
                >
                  Create Connection
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Database Providers */}
        <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Supported Providers</CardTitle>
            <CardDescription>Choose from various database types</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="relational" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="relational">SQL</TabsTrigger>
                <TabsTrigger value="nosql">NoSQL</TabsTrigger>
              </TabsList>
              <TabsContent value="relational" className="space-y-3">
                {relationalDbs.map((db) => (
                  <div key={db.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{db.icon}</span>
                      <div>
                        <div className="font-medium text-white">{db.name}</div>
                        <div className="text-xs text-gray-400">{db.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="nosql" className="space-y-3">
                {[...documentDbs, ...keyValueDbs, ...graphDbs, ...timeSeriesDbs].map((db) => (
                  <div key={db.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{db.icon}</span>
                      <div>
                        <div className="font-medium text-white">{db.name}</div>
                        <div className="text-xs text-gray-400">{db.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Active Connections */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Active Connections</CardTitle>
            <CardDescription>Manage your database connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connections.map((connection) => {
                const provider = getProviderInfo(connection.provider);
                return (
                  <div
                    key={connection.id}
                    className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                      activeConnection === connection.id
                        ? 'border-cyan-500 bg-cyan-600/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setActiveConnection(connection.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{provider.icon}</span>
                        <div>
                          <div className="font-medium text-white">{connection.name}</div>
                          <div className="text-sm text-gray-400">{provider.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={connection.status === 'connected' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {connection.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            testConnectionMutation.mutate(connection.id);
                          }}
                          disabled={testConnectionMutation.isPending}
                        >
                          <TestTube className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConnectionMutation.mutate(connection.id);
                          }}
                          disabled={deleteConnectionMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {connections.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No database connections yet. Add one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Interface */}
      {activeConnection && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Query Interface</CardTitle>
            <CardDescription>
              Execute queries on {connections.find(c => c.id === activeConnection)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Query</label>
                <Button
                  onClick={handleExecuteQuery}
                  disabled={!queryText.trim() || executeQueryMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>
              <Textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="SELECT * FROM users;"
                className="font-mono bg-gray-800 border-gray-600 min-h-[120px]"
              />
            </div>

            {executeQueryMutation.data && (
              <div className="border border-gray-600 rounded-lg">
                <div className="p-3 bg-gray-800 border-b border-gray-600">
                  <h4 className="font-medium text-white">Query Results</h4>
                </div>
                <div className="p-3 max-h-64 overflow-auto">
                  <pre className="text-sm text-gray-300">
                    {JSON.stringify(executeQueryMutation.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
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
import { TESTING_FRAMEWORKS, getTestingFrameworksByType, type TestingFramework } from "@shared/enhanced-tools";
import { Plus, Play, TestTube, Settings, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

const testSuiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  framework: z.string().min(1, "Framework is required"),
  description: z.string().optional(),
});

type TestSuiteForm = z.infer<typeof testSuiteSchema>;

interface TestSuite {
  id: number;
  name: string;
  framework: string;
  description?: string;
  testFiles: string[];
  config: any;
  lastRun?: string;
  results: {
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  status: 'idle' | 'running' | 'passed' | 'failed';
}

export default function TestingSuite() {
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [showSuiteDialog, setShowSuiteDialog] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<TestSuiteForm>({
    resolver: zodResolver(testSuiteSchema),
    defaultValues: {
      name: '',
      framework: '',
      description: '',
    },
  });

  const { data: testSuites = [], isLoading } = useQuery<TestSuite[]>({
    queryKey: ['/api/testing/suites'],
  });

  const createSuiteMutation = useMutation({
    mutationFn: async (data: TestSuiteForm) => {
      return apiRequest('POST', '/api/testing/suites', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testing/suites'] });
      setShowSuiteDialog(false);
      form.reset();
      toast({
        title: "Success",
        description: "Test suite created successfully",
      });
    },
  });

  const runTestsMutation = useMutation({
    mutationFn: async (suiteId: number) => {
      return apiRequest('POST', `/api/testing/suites/${suiteId}/run`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testing/suites'] });
      toast({
        title: "Tests Started",
        description: "Test suite is now running",
      });
    },
  });

  const deleteSuiteMutation = useMutation({
    mutationFn: async (suiteId: number) => {
      return apiRequest('DELETE', `/api/testing/suites/${suiteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testing/suites'] });
      toast({
        title: "Success",
        description: "Test suite deleted successfully",
      });
    },
  });

  const getFrameworkInfo = (frameworkId: string): TestingFramework => {
    return TESTING_FRAMEWORKS[frameworkId] || TESTING_FRAMEWORKS.jest;
  };

  const getStatusIcon = (status: TestSuite['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <TestTube className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestSuite['status']) => {
    switch (status) {
      case 'running':
        return 'bg-yellow-600';
      case 'passed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const unitFrameworks = getTestingFrameworksByType('unit');
  const e2eFrameworks = getTestingFrameworksByType('e2e');
  const integrationFrameworks = getTestingFrameworksByType('integration');
  const performanceFrameworks = getTestingFrameworksByType('performance');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Testing Suite
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive testing tools and frameworks
          </p>
        </div>
        <Dialog open={showSuiteDialog} onOpenChange={setShowSuiteDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Test Suite
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create Test Suite</DialogTitle>
              <DialogDescription>
                Set up a new testing framework for your project
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createSuiteMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suite Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Unit Tests" className="bg-gray-800 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Framework</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue placeholder="Select a testing framework" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {Object.values(TESTING_FRAMEWORKS).map((framework) => (
                            <SelectItem key={framework.id} value={framework.id}>
                              {framework.name} ({framework.type})
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe what this test suite covers..."
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
                  disabled={createSuiteMutation.isPending}
                >
                  Create Test Suite
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Testing Frameworks */}
        <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Available Frameworks</CardTitle>
            <CardDescription>Choose from popular testing tools</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="unit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="unit">Unit</TabsTrigger>
                <TabsTrigger value="e2e">E2E</TabsTrigger>
              </TabsList>
              <TabsContent value="unit" className="space-y-3">
                {[...unitFrameworks, ...integrationFrameworks].map((framework) => (
                  <div key={framework.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{framework.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {framework.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{framework.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {framework.language.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="e2e" className="space-y-3">
                {[...e2eFrameworks, ...performanceFrameworks].map((framework) => (
                  <div key={framework.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{framework.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {framework.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{framework.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {framework.language.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Test Suites */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Test Suites</CardTitle>
            <CardDescription>Manage your testing configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testSuites.map((suite) => {
                const framework = getFrameworkInfo(suite.framework);
                return (
                  <div
                    key={suite.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedSuite === suite.id
                        ? 'border-cyan-500 bg-cyan-600/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(suite.status)}
                        <div>
                          <div className="font-medium text-white">{suite.name}</div>
                          <div className="text-sm text-gray-400">{framework.name}</div>
                          {suite.description && (
                            <div className="text-xs text-gray-500 mt-1">{suite.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(suite.status)}>
                          {suite.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runTestsMutation.mutate(suite.id)}
                          disabled={runTestsMutation.isPending || suite.status === 'running'}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSuiteMutation.mutate(suite.id)}
                          disabled={deleteSuiteMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Test Results */}
                    {suite.results && (
                      <div className="mt-4 grid grid-cols-4 gap-4 p-3 bg-gray-800 rounded">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{suite.results.passed}</div>
                          <div className="text-xs text-gray-400">Passed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-400">{suite.results.failed}</div>
                          <div className="text-xs text-gray-400">Failed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-400">{suite.results.skipped}</div>
                          <div className="text-xs text-gray-400">Skipped</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-400">{suite.results.duration}ms</div>
                          <div className="text-xs text-gray-400">Duration</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {testSuites.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No test suites configured yet. Create one to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Example Test Code */}
      {selectedFramework && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Example Test</CardTitle>
            <CardDescription>
              Sample test code for {getFrameworkInfo(selectedFramework).name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 bg-gray-800 p-4 rounded-lg overflow-x-auto">
              <code>{getFrameworkInfo(selectedFramework).exampleTest}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
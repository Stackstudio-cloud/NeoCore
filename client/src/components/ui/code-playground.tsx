import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import { Copy, Play, Save, Share2, Code, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  title: string;
  examples: {
    id: string;
    name: string;
    language: string;
    code: string;
    description?: string;
  }[];
  className?: string;
}

export default function CodePlayground({ title, examples, className = '' }: CodePlaygroundProps) {
  const [activeExample, setActiveExample] = useState(examples[0]?.id || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const currentExample = examples.find(ex => ex.id === activeExample) || examples[0];

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentExample.code);
      toast({
        title: "Code copied!",
        description: "Code has been copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate code execution
    setTimeout(() => {
      const mockOutputs = [
        '✓ Code executed successfully\n📊 Response time: 120ms\n🔍 Memory usage: 45MB',
        '🚀 API endpoint created\n📈 Status: 200 OK\n💾 Data saved to database',
        '🤖 AI model initialized\n🧠 Processing complete\n📋 Results: 3 matches found',
        '🔗 WebSocket connection established\n📡 Real-time updates enabled\n⚡ Latency: 15ms'
      ];
      
      setOutput(mockOutputs[Math.floor(Math.random() * mockOutputs.length)]);
      setIsRunning(false);
    }, 2000);
  };

  const saveCode = () => {
    toast({
      title: "Code saved!",
      description: "Your code has been saved to your workspace"
    });
  };

  const shareCode = () => {
    toast({
      title: "Share link copied!",
      description: "Code playground link copied to clipboard"
    });
  };

  return (
    <Card className={`border-blue-400/20 bg-charcoal/50 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-400/50 text-green-400">
              Interactive
            </Badge>
            <Badge variant="outline" className="border-purple-400/50 text-purple-400">
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeExample} onValueChange={setActiveExample}>
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            {examples.map(example => (
              <TabsTrigger 
                key={example.id} 
                value={example.id}
                className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
              >
                {example.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {examples.map(example => (
            <TabsContent key={example.id} value={example.id}>
              <div className="space-y-4">
                {example.description && (
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                )}
                
                <div className="relative">
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-t-lg border-b border-slate-700">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {example.language}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {example.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" onClick={copyCode}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={saveCode}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={shareCode}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <pre className="bg-slate-900/80 p-4 rounded-b-lg text-sm overflow-x-auto">
                    <code className="text-green-400 font-mono">{example.code}</code>
                  </pre>
                </div>

                <div className="flex items-center space-x-3">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                    <Terminal className="w-3 h-3 mr-1" />
                    Live Environment
                  </Badge>
                </div>

                {output && (
                  <div className="bg-slate-900/60 border border-green-400/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Terminal className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm text-green-400">Output</span>
                    </div>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{output}</pre>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
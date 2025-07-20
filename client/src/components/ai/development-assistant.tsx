import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Code, Database, Zap, Lightbulb, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatCompletion } from '@/lib/ai-client';
import { useMutation } from '@tanstack/react-query';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'suggestion' | 'query' | 'normal';
}

interface DevelopmentAssistantProps {
  className?: string;
}

export default function DevelopmentAssistant({ className = '' }: DevelopmentAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your NeoCore AI development assistant powered by Gemini. I can help you with:\n\n• Writing database schemas and queries\n• Generating API endpoints\n• Creating serverless functions\n• Optimizing performance\n• Security best practices\n\nWhat would you like to build today?',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const quickActions = [
    { 
      label: 'Create Database Schema', 
      icon: Database, 
      prompt: 'Help me create a PostgreSQL database schema for a modern web application' 
    },
    { 
      label: 'Generate API Endpoints', 
      icon: Code, 
      prompt: 'Generate REST API endpoints with authentication and proper error handling' 
    },
    { 
      label: 'Optimize Performance', 
      icon: Zap, 
      prompt: 'Analyze and suggest performance optimizations for my backend' 
    },
    { 
      label: 'Security Review', 
      icon: CheckCircle, 
      prompt: 'Review my API security and suggest improvements' 
    }
  ];

  // Gemini AI mutation
  const aiMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      conversationHistory.push({ role: 'user', content: userMessage });
      
      const systemPrompt = `You are an AI development assistant for NeoCore, a comprehensive backend development platform. 
      NeoCore is a modern full-stack application that provides:
      - PostgreSQL database management with Drizzle ORM
      - REST API development with Express.js and TypeScript
      - Real-time features with WebSocket support
      - React frontend with Tailwind CSS and shadcn/ui components
      - AI-powered development tools and code generation
      
      Your role is to help developers with:
      - Database schema design and optimization
      - API endpoint development and security
      - Frontend component creation
      - Performance optimization
      - Modern web development best practices
      
      Always provide practical, production-ready code examples using the NeoCore stack (PostgreSQL, Express.js, React, TypeScript).
      Format code blocks with proper syntax highlighting using markdown.
      Be helpful, detailed, and focus on modern development practices.`;
      
      return await chatCompletion({ 
        messages: conversationHistory, 
        systemPrompt 
      });
    },
    onSuccess: (response) => {
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        type: response.text.includes('```') ? 'code' : 'normal'
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      toast({
        title: "AI Error",
        description: "Failed to get AI response. Please check your Gemini API key and try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure your Gemini API key is configured correctly.',
        timestamp: new Date(),
        type: 'normal'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSend = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Use real Gemini AI
    aiMutation.mutate(message);
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <Card className={`border-purple-400/20 bg-charcoal/50 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          AI Development Assistant
          <Badge variant="outline" className="ml-2 text-xs">
            Powered by Gemini 2.0
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              className="text-xs border-purple-400/20 hover:bg-purple-400/10"
              disabled={aiMutation.isPending}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Chat Area */}
        <ScrollArea className="h-96 border border-purple-400/20 rounded-lg p-4 bg-slate-900/50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600/20 text-blue-100'
                      : 'bg-purple-600/20 text-purple-100'
                  }`}
                >
                  {message.type && message.type !== 'normal' && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {message.type === 'code' && <Code className="w-3 h-3 mr-1" />}
                      {message.type === 'suggestion' && <Lightbulb className="w-3 h-3 mr-1" />}
                      {message.type}
                    </Badge>
                  )}
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {message.content}
                  </pre>
                  <div className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {aiMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-purple-600/20 text-purple-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                    <span className="text-sm">Gemini AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about development..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1"
            disabled={aiMutation.isPending}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={aiMutation.isPending || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Status indicator */}
        <div className="text-xs text-gray-400 text-center">
          {aiMutation.isPending ? 'Generating response...' : 'Ready to help with your development questions'}
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AI_ASSISTANTS, getAllAssistants, type AIAssistant } from "@shared/ai-assistants";
import { Send, MessageCircle, Brain, Code, Database, Shield, TestTube, Smartphone, Rocket } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  assistantType: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const AssistantIcon = ({ assistant }: { assistant: AIAssistant }) => {
  const iconMap = {
    general: Brain,
    frontend: Code,
    backend: Database,
    security: Shield,
    testing: TestTube,
    mobile: Smartphone,
    devops: Rocket,
    database: Database
  };
  
  const Icon = iconMap[assistant.id as keyof typeof iconMap] || Brain;
  return <Icon className="h-5 w-5" style={{ color: assistant.color }} />;
};

export default function SpecializedAssistants() {
  const [selectedAssistant, setSelectedAssistant] = useState<string>('general');
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['/api/ai/conversations'],
  });

  const { data: currentConversation } = useQuery<Conversation>({
    queryKey: ['/api/ai/conversations', activeConversation],
    enabled: !!activeConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ assistantType, message, conversationId }: {
      assistantType: string;
      message: string;
      conversationId?: string;
    }) => {
      return apiRequest('POST', '/api/ai/chat', {
        assistantType,
        message,
        conversationId,
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/conversations'] });
      if (data.conversationId) {
        setActiveConversation(data.conversationId);
        queryClient.invalidateQueries({ queryKey: ['/api/ai/conversations', data.conversationId] });
      }
      setCurrentMessage('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async (assistantType: string) => {
      return apiRequest('POST', '/api/ai/conversations', { assistantType });
    },
    onSuccess: (data: any) => {
      setActiveConversation(data.id);
      queryClient.invalidateQueries({ queryKey: ['/api/ai/conversations'] });
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    sendMessageMutation.mutate({
      assistantType: selectedAssistant,
      message: currentMessage,
      conversationId: activeConversation || undefined,
    });
  };

  const handleNewConversation = () => {
    createConversationMutation.mutate(selectedAssistant);
  };

  const assistants = getAllAssistants();
  const currentAssistant = AI_ASSISTANTS[selectedAssistant];
  const assistantConversations = conversations.filter(c => c.assistantType === selectedAssistant);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AI Development Assistants
          </h1>
          <p className="text-gray-400 mt-2">
            Specialized AI experts for every aspect of development
          </p>
        </div>
        <Button 
          onClick={handleNewConversation}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
          disabled={createConversationMutation.isPending}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Assistant Selection */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400">Specialists</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {assistants.map((assistant) => (
                    <div
                      key={assistant.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedAssistant === assistant.id
                          ? 'bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/50'
                          : 'bg-gray-800/50 hover:bg-gray-700/50 border border-transparent'
                      }`}
                      onClick={() => setSelectedAssistant(assistant.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{assistant.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">
                            {assistant.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {assistant.specialization}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-full bg-gray-900/50 border-gray-700 flex flex-col">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AssistantIcon assistant={currentAssistant} />
                  <div>
                    <CardTitle className="text-xl text-white">
                      {currentAssistant.name}
                    </CardTitle>
                    <CardDescription>
                      {currentAssistant.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" style={{ borderColor: currentAssistant.color }}>
                  {currentAssistant.model}
                </Badge>
              </div>
              
              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {currentAssistant.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <div className="flex-1 flex">
              {/* Conversations Sidebar */}
              <div className="w-64 border-r border-gray-700 p-4">
                <h3 className="font-medium text-gray-300 mb-3">Recent Chats</h3>
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {assistantConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          activeConversation === conversation.id
                            ? 'bg-cyan-600/20 border border-cyan-500/50'
                            : 'hover:bg-gray-700/50'
                        }`}
                        onClick={() => setActiveConversation(conversation.id)}
                      >
                        <div className="text-sm text-white truncate">
                          {conversation.title || 'New Conversation'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(conversation.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  {currentConversation ? (
                    <div className="space-y-4">
                      {currentConversation.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                                : 'bg-gray-800 text-gray-100 border border-gray-700'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      ))}
                      {sendMessageMutation.isPending && (
                        <div className="flex justify-start">
                          <div className="bg-gray-800 text-gray-100 border border-gray-700 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                              <span className="text-sm">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-4">{currentAssistant.icon}</div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          Start a conversation with {currentAssistant.name}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          Ask questions or request help with {currentAssistant.specialization.toLowerCase()}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Example questions:</p>
                          {currentAssistant.examples.map((example, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-400 p-2 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-700/50"
                              onClick={() => setCurrentMessage(example)}
                            >
                              "{example}"
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t border-gray-700 p-4">
                  <div className="flex space-x-2">
                    <Textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder={`Ask ${currentAssistant.name} anything...`}
                      className="flex-1 min-h-[60px] bg-gray-800 border-gray-600 text-white resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Code, Sparkles, Copy, Download, ThumbsUp, ThumbsDown, Wand2, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CodeSuggestion {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  framework: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  rating: number;
  usageCount: number;
  aiGenerated: boolean;
  contextual: boolean;
}

const suggestionCategories = [
  'API Endpoints',
  'Database Queries',
  'Authentication',
  'UI Components',
  'State Management',
  'Testing',
  'Performance',
  'Security',
  'DevOps',
  'Utilities'
];

const frameworks = [
  'React',
  'Vue',
  'Angular',
  'Express.js',
  'Next.js',
  'FastAPI',
  'Django',
  'Spring Boot',
  'Laravel',
  'Ruby on Rails'
];

const languages = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift'
];

export default function CodeSuggestions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [context, setContext] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFramework, setSelectedFramework] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [autoPlay, setAutoPlay] = useState(false);
  const { toast } = useToast();

  // Fetch code suggestions
  const { data: suggestions = [], isLoading, refetch } = useQuery<CodeSuggestion[]>({
    queryKey: ['/api/ai/code-suggestions', selectedCategory, selectedFramework, selectedLanguage, context],
    retry: false,
  });

  // Generate new suggestions based on context
  const generateSuggestionsMutation = useMutation({
    mutationFn: async (data: { context: string; category?: string; framework?: string; language?: string }) => {
      return await apiRequest("POST", "/api/ai/generate-suggestions", data);
    },
    onSuccess: () => {
      toast({
        title: "Suggestions Generated",
        description: "New code suggestions have been generated based on your context.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Rate suggestion
  const rateSuggestionMutation = useMutation({
    mutationFn: async (data: { suggestionId: string; rating: 'up' | 'down' }) => {
      return await apiRequest("POST", `/api/ai/code-suggestions/${data.suggestionId}/rate`, {
        rating: data.rating
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Auto-play carousel
  useEffect(() => {
    if (autoPlay && suggestions.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % suggestions.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, suggestions.length]);

  const currentSuggestion = suggestions[currentIndex];

  const nextSuggestion = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const copyCode = () => {
    if (currentSuggestion) {
      navigator.clipboard.writeText(currentSuggestion.code);
      toast({
        title: "Code Copied",
        description: "Code has been copied to your clipboard.",
      });
    }
  };

  const downloadCode = () => {
    if (currentSuggestion) {
      const blob = new Blob([currentSuggestion.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentSuggestion.title.toLowerCase().replace(/\s+/g, '-')}.${currentSuggestion.language === 'TypeScript' ? 'ts' : 'js'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Code Downloaded",
        description: "Code file has been downloaded.",
      });
    }
  };

  const generateSuggestions = () => {
    generateSuggestionsMutation.mutate({
      context,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      framework: selectedFramework !== 'all' ? selectedFramework : undefined,
      language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-purple-400" />
            Intelligent Code Suggestions
          </h1>
          <p className="text-gray-400">AI-powered contextual code suggestions with smart recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoPlay ? "default" : "outline"}
            onClick={() => setAutoPlay(!autoPlay)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {autoPlay ? "Stop Auto-play" : "Auto-play"}
          </Button>
        </div>
      </div>

      {/* Context Input & Filters */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            Context & Filters
          </CardTitle>
          <CardDescription>
            Provide context to get more relevant AI-generated suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Describe what you're building or the problem you're solving
            </label>
            <Textarea
              placeholder="e.g., I need to create a user authentication system with JWT tokens and password validation..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {suggestionCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Framework</label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frameworks</SelectItem>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework} value={framework}>{framework}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateSuggestions}
                disabled={generateSuggestionsMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                {generateSuggestionsMutation.isPending ? "Generating..." : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestion Carousel */}
      {isLoading ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="flex items-center justify-center h-96">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" />
              Loading suggestions...
            </div>
          </CardContent>
        </Card>
      ) : suggestions.length > 0 && currentSuggestion ? (
        <Card className="bg-gray-900/50 border-gray-800 relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-green-400" />
                <div>
                  <CardTitle className="text-white text-xl">{currentSuggestion.title}</CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    {currentSuggestion.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rateSuggestionMutation.mutate({ 
                    suggestionId: currentSuggestion.id, 
                    rating: 'up' 
                  })}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => rateSuggestionMutation.mutate({ 
                    suggestionId: currentSuggestion.id, 
                    rating: 'down' 
                  })}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                {currentSuggestion.language}
              </Badge>
              <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                {currentSuggestion.framework}
              </Badge>
              <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                {currentSuggestion.category}
              </Badge>
              <Badge variant="secondary" className={`${
                currentSuggestion.difficulty === 'beginner' ? 'bg-green-900/50 text-green-300' :
                currentSuggestion.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-red-900/50 text-red-300'
              }`}>
                {currentSuggestion.difficulty}
              </Badge>
              {currentSuggestion.aiGenerated && (
                <Badge variant="secondary" className="bg-pink-900/50 text-pink-300">
                  AI Generated
                </Badge>
              )}
              {currentSuggestion.contextual && (
                <Badge variant="secondary" className="bg-cyan-900/50 text-cyan-300">
                  Contextual
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{currentSuggestion.code}</code>
              </pre>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Rating: {currentSuggestion.rating}/5</span>
                <span>Used: {currentSuggestion.usageCount} times</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {currentIndex + 1} of {suggestions.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevSuggestion}
                  disabled={suggestions.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSuggestion}
                  disabled={suggestions.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          
          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {suggestions.slice(0, 5).map((suggestion: CodeSuggestion, index: number) => (
              <button
                key={suggestion.id || index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-purple-400' : 'bg-gray-600'
                }`}
              />
            ))}
            {suggestions.length > 5 && (
              <span className="text-xs text-gray-400 ml-2">+{suggestions.length - 5}</span>
            )}
          </div>
        </Card>
      ) : (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="flex flex-col items-center justify-center h-96 text-center">
            <Wand2 className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No Suggestions Yet</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Provide some context about what you're building and click "Generate" to get AI-powered code suggestions.
            </p>
            <Button 
              onClick={generateSuggestions}
              disabled={!context.trim() || generateSuggestionsMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Suggestions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">{suggestions.length}</div>
              <div className="text-sm text-gray-400">Total Suggestions</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {suggestions.filter((s: CodeSuggestion) => s.aiGenerated).length}
              </div>
              <div className="text-sm text-gray-400">AI Generated</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {suggestions.filter((s: CodeSuggestion) => s.contextual).length}
              </div>
              <div className="text-sm text-gray-400">Contextual</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-white">
                {Math.round(suggestions.reduce((acc: number, s: CodeSuggestion) => acc + s.rating, 0) / suggestions.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-400">Avg Rating</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
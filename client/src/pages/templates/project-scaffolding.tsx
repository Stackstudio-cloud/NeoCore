import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PROJECT_TEMPLATES } from "@shared/enhanced-tools";
import { Rocket, Copy, Download, Star, Clock, Code, Database, Globe, Smartphone } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  templateId: z.string().min(1, "Template is required"),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface GeneratedProject {
  id: string;
  name: string;
  template: string;
  description?: string;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
  createdAt: string;
  downloadUrl: string;
}

export default function ProjectScaffolding() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      templateId: '',
    },
  });

  const { data: recentProjects = [] } = useQuery<GeneratedProject[]>({
    queryKey: ['/api/templates/recent'],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectForm) => {
      return apiRequest('POST', '/api/templates/generate', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates/recent'] });
      setShowCreateDialog(false);
      form.reset();
      toast({
        title: "Project Generated",
        description: "Your project has been scaffolded successfully",
      });
    },
  });

  const downloadProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest('GET', `/api/templates/download/${projectId}`);
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your project files are being downloaded",
      });
    },
  });

  const getTemplatesByCategory = (category: string) => {
    if (category === 'all') {
      return Object.values(PROJECT_TEMPLATES);
    }
    return Object.values(PROJECT_TEMPLATES).filter(t => t.category === category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Globe className="h-4 w-4" />;
      case 'backend':
        return <Database className="h-4 w-4" />;
      case 'fullstack':
        return <Code className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Rocket className="h-4 w-4" />;
    }
  };

  const getTemplateIcon = (template: any) => {
    return getCategoryIcon(template.category);
  };

  const categories = ['all', 'frontend', 'backend', 'fullstack', 'mobile'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Project Scaffolding
          </h1>
          <p className="text-gray-400 mt-2">
            Generate complete project structures from proven templates
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
              <Rocket className="h-4 w-4 mr-2" />
              Generate Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Generate New Project</DialogTitle>
              <DialogDescription>
                Create a complete project structure from a template
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createProjectMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="my-awesome-app" className="bg-gray-800 border-gray-600" />
                      </FormControl>
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
                          placeholder="Brief description of your project..."
                          className="bg-gray-800 border-gray-600"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {Object.values(PROJECT_TEMPLATES).map((template) => (
                          <div
                            key={template.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              field.value === template.id
                                ? 'border-cyan-500 bg-cyan-600/10'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                            onClick={() => field.onChange(template.id)}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              {getTemplateIcon(template)}
                              <div className="font-medium text-white text-sm">{template.name}</div>
                            </div>
                            <div className="text-xs text-gray-400">{template.description}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.technologies.slice(0, 3).map((tech) => (
                                <Badge key={tech} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600"
                  disabled={createProjectMutation.isPending}
                >
                  Generate Project
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template Categories */}
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-gradient-to-r from-cyan-600 to-purple-600' : ''}
          >
            {getCategoryIcon(category)}
            <span className="ml-2 capitalize">{category}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Project Templates</CardTitle>
            <CardDescription>Choose a template to scaffold your project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getTemplatesByCategory(selectedCategory).map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
                    selectedTemplate === template.id
                      ? 'border-cyan-500 bg-cyan-600/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getTemplateIcon(template)}
                      <div className="font-medium text-white">{template.name}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={template.category === 'fullstack' ? 'border-purple-500 text-purple-400' : ''}
                    >
                      {template.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">{template.description}</div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{template.popularity}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.setupTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Recent Projects</CardTitle>
            <CardDescription>Your recently generated projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div key={project.id} className="p-3 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-white text-sm">{project.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {PROJECT_TEMPLATES[project.template]?.name || project.template}
                    </Badge>
                  </div>
                  
                  {project.description && (
                    <div className="text-xs text-gray-400 mb-2">{project.description}</div>
                  )}
                  
                  <div className="text-xs text-gray-500 mb-3">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => downloadProjectMutation.mutate(project.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`Generated project: ${project.name}`);
                        toast({ title: "Copied", description: "Project info copied to clipboard" });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {recentProjects.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No projects generated yet. Create your first project to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Details */}
      {selectedTemplate && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">
              {PROJECT_TEMPLATES[selectedTemplate].name} Template
            </CardTitle>
            <CardDescription>
              Detailed information about this template
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {PROJECT_TEMPLATES[selectedTemplate].features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TEMPLATES[selectedTemplate].technologies.map((tech) => (
                  <Badge key={tech} className="bg-gradient-to-r from-cyan-600 to-purple-600">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Quick Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize">{PROJECT_TEMPLATES[selectedTemplate].category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Setup Time:</span>
                  <span className="text-white">{PROJECT_TEMPLATES[selectedTemplate].setupTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Popularity:</span>
                  <span className="text-white">{PROJECT_TEMPLATES[selectedTemplate].popularity}⭐</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
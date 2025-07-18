import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NeonCard from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, Users, Settings, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: authProviders, isLoading } = useQuery({
    queryKey: ["/api/projects/1/auth"],
  });

  const updateProviderMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      apiRequest("PATCH", `/api/auth/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/1/auth"] });
      toast({
        title: "Provider updated",
        description: "Authentication provider settings have been saved",
      });
    },
  });

  const handleProviderToggle = (providerId: number, enabled: boolean) => {
    updateProviderMutation.mutate({
      id: providerId,
      updates: { enabled }
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading authentication settings...</div>;
  }

  const enabledProviders = authProviders?.filter(p => p.enabled) || [];
  
  return (
    <div className="animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Authentication
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure authentication providers and security settings
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Provider
        </Button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <NeonCard glowColor="purple">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold">{enabledProviders.length}</p>
              <p className="text-sm text-muted-foreground">Active Providers</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="green">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold">2.4K</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="blue">
          <div className="flex items-center space-x-3">
            <Key className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold">98.7%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </NeonCard>

        <NeonCard glowColor="cyan">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-cyan-400" />
            <div>
              <p className="text-2xl font-bold">MFA</p>
              <p className="text-sm text-muted-foreground">Security Level</p>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Auth Configuration */}
      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <NeonCard title="Authentication Providers" glowColor="purple">
            <div className="space-y-6">
              {authProviders?.map((provider) => (
                <div 
                  key={provider.id}
                  className="flex items-center justify-between p-6 rounded-lg bg-slate-900/50 border border-purple-400/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      {provider.provider === 'email' && '📧'}
                      {provider.provider === 'google' && '🔍'}
                      {provider.provider === 'github' && '🐙'}
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{provider.provider}</h3>
                      <p className="text-sm text-muted-foreground">
                        {provider.provider === 'email' && 'Email and password authentication'}
                        {provider.provider === 'google' && 'Sign in with Google OAuth'}
                        {provider.provider === 'github' && 'Sign in with GitHub OAuth'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={provider.enabled ? "default" : "secondary"}>
                      {provider.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(enabled) => handleProviderToggle(provider.id, enabled)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </NeonCard>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard title="Security Settings" glowColor="blue">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Verify email addresses on signup</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Strength</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong passwords</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </NeonCard>

            <NeonCard title="Session Settings" glowColor="green">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    defaultValue="30"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="refresh-token">Refresh Token Expiry (days)</Label>
                  <Input
                    id="refresh-token"
                    type="number"
                    defaultValue="30"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Remember Me</Label>
                    <p className="text-sm text-muted-foreground">Allow extended sessions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <NeonCard title="User Management" glowColor="cyan">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Users</h3>
                <Button variant="outline">View All</Button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "John Doe", email: "john@example.com", provider: "email", status: "active" },
                  { name: "Jane Smith", email: "jane@example.com", provider: "google", status: "active" },
                  { name: "Bob Johnson", email: "bob@example.com", provider: "github", status: "pending" },
                ].map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="capitalize">
                        {user.provider}
                      </Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

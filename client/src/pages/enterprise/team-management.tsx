import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Settings, Crown, Shield, Eye, UserPlus, Mail, MoreVertical } from "lucide-react";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

const inviteSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(['admin', 'developer', 'viewer']),
});

type TeamForm = z.infer<typeof teamSchema>;
type InviteForm = z.infer<typeof inviteSchema>;

interface Team {
  id: number;
  name: string;
  description: string;
  ownerId: string;
  tier: string;
  memberCount: number;
  createdAt: string;
  settings: {
    allowGuestAccess: boolean;
    defaultProjectVisibility: string;
    requireApprovalForJoining: boolean;
  };
}

interface TeamMember {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
}

export default function TeamManagement() {
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(1);
  const { toast } = useToast();

  const teamForm = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '', description: '' },
  });

  const inviteForm = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', role: 'developer' },
  });

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  const { data: teamMembers = [] } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams', selectedTeam, 'members'],
    enabled: !!selectedTeam,
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: TeamForm) => {
      return apiRequest('POST', '/api/teams', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      setShowTeamDialog(false);
      teamForm.reset();
      toast({ title: "Success", description: "Team created successfully" });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: InviteForm) => {
      return apiRequest('POST', `/api/teams/${selectedTeam}/invite`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams', selectedTeam, 'members'] });
      setShowInviteDialog(false);
      inviteForm.reset();
      toast({ title: "Success", description: "Invitation sent successfully" });
    },
  });

  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: number; role: string }) => {
      return apiRequest('PATCH', `/api/teams/${selectedTeam}/members/${memberId}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams', selectedTeam, 'members'] });
      toast({ title: "Success", description: "Member role updated" });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      return apiRequest('DELETE', `/api/teams/${selectedTeam}/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams', selectedTeam, 'members'] });
      toast({ title: "Success", description: "Member removed from team" });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-400" />;
      case 'developer':
        return <UserPlus className="h-4 w-4 text-green-400" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-400" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-600';
      case 'admin':
        return 'bg-blue-600';
      case 'developer':
        return 'bg-green-600';
      case 'viewer':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const currentTeam = teams.find(t => t.id === selectedTeam);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Team Management
          </h1>
          <p className="text-gray-400 mt-2">
            Collaborate and manage your development teams
          </p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={!selectedTeam}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join {currentTeam?.name}
                </DialogDescription>
              </DialogHeader>
              <Form {...inviteForm}>
                <form onSubmit={inviteForm.handleSubmit((data) => inviteMemberMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={inviteForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="user@example.com" className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={inviteForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-purple-600">
                    Send Invitation
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Team</DialogTitle>
                <DialogDescription>
                  Set up a new team for collaboration
                </DialogDescription>
              </DialogHeader>
              <Form {...teamForm}>
                <form onSubmit={teamForm.handleSubmit((data) => createTeamMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={teamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Development Team" className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={teamForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your team..." className="bg-gray-800 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-purple-600">
                    Create Team
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <Card className="lg:col-span-1 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Your Teams</CardTitle>
            <CardDescription>Select a team to manage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTeam === team.id
                      ? 'bg-cyan-600/20 border border-cyan-500/50'
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">{team.name}</div>
                      <div className="text-sm text-gray-400">{team.memberCount} members</div>
                    </div>
                    <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600">
                      {team.tier}
                    </Badge>
                  </div>
                  {team.description && (
                    <div className="text-xs text-gray-500 mt-2">{team.description}</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="lg:col-span-2 bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">
              {currentTeam ? `${currentTeam.name} Members` : 'Team Members'}
            </CardTitle>
            <CardDescription>
              Manage team members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTeam ? (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-purple-600">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{member.name}</div>
                        <div className="text-sm text-gray-400">{member.email}</div>
                        <div className="text-xs text-gray-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        className={`${getRoleColor(member.role)} flex items-center space-x-1`}
                      >
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </Badge>
                      <Badge
                        variant={member.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {member.status}
                      </Badge>
                      {member.role !== 'owner' && (
                        <Select
                          onValueChange={(role) => updateMemberRoleMutation.mutate({ memberId: member.id, role })}
                          defaultValue={member.role}
                        >
                          <SelectTrigger className="w-32 h-8 bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
                {teamMembers.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No team members yet. Invite some people to get started.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Select a team to view its members
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Team Settings */}
      {currentTeam && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Team Settings</CardTitle>
            <CardDescription>Configure team preferences and permissions</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-white">Access Control</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Guest Access</span>
                  <Badge variant={currentTeam.settings.allowGuestAccess ? 'default' : 'secondary'}>
                    {currentTeam.settings.allowGuestAccess ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Approval Required</span>
                  <Badge variant={currentTeam.settings.requireApprovalForJoining ? 'default' : 'secondary'}>
                    {currentTeam.settings.requireApprovalForJoining ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Default Visibility</h4>
              <Badge className="bg-gradient-to-r from-cyan-600 to-purple-600">
                {currentTeam.settings.defaultProjectVisibility}
              </Badge>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Bulk Invite
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NeonCard from "@/components/ui/neon-card";
import MetricCard from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Upload, FolderPlus, Settings, File, Image, Video } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function StoragePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newBucketName, setNewBucketName] = useState("");

  const { data: buckets, isLoading } = useQuery({
    queryKey: ["/api/projects/1/storage"],
  });

  const createBucketMutation = useMutation({
    mutationFn: (bucketData: any) =>
      apiRequest("POST", "/api/projects/1/storage", bucketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/1/storage"] });
      toast({
        title: "Bucket created",
        description: "Storage bucket has been created successfully",
      });
      setNewBucketName("");
    },
  });

  const handleCreateBucket = () => {
    if (!newBucketName.trim()) return;
    
    createBucketMutation.mutate({
      name: newBucketName,
      public: false,
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading storage...</div>;
  }

  const totalFiles = buckets?.reduce((sum, bucket) => sum + bucket.fileCount, 0) || 0;
  const totalSize = buckets?.reduce((sum, bucket) => sum + bucket.totalSize, 0) || 0;

  return (
    <div className="animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Storage Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage files with S3 storage and global CDN delivery
          </p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Files"
          value={totalFiles.toLocaleString()}
          icon={<File className="w-4 h-4" />}
          glowColor="pink"
        />
        <MetricCard
          title="Storage Used"
          value={`${(totalSize / (1024 * 1024)).toFixed(1)} MB`}
          icon={<Cloud className="w-4 h-4" />}
          glowColor="blue"
        />
        <MetricCard
          title="CDN Requests"
          value="45.2K"
          subtitle="This month"
          icon={<Image className="w-4 h-4" />}
          glowColor="green"
        />
        <MetricCard
          title="Bandwidth"
          value="1.2 GB"
          subtitle="This month"
          icon={<Video className="w-4 h-4" />}
          glowColor="purple"
        />
      </div>

      {/* Storage Management */}
      <Tabs defaultValue="buckets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="buckets">Buckets</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="buckets">
          <div className="space-y-6">
            {/* Create Bucket */}
            <NeonCard title="Create New Bucket" glowColor="pink">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Label htmlFor="bucket-name">Bucket Name</Label>
                  <Input
                    id="bucket-name"
                    placeholder="my-awesome-bucket"
                    value={newBucketName}
                    onChange={(e) => setNewBucketName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleCreateBucket}
                  disabled={!newBucketName.trim() || createBucketMutation.isPending}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </NeonCard>

            {/* Existing Buckets */}
            <NeonCard title="Storage Buckets" glowColor="blue">
              <div className="space-y-4">
                {buckets?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No storage buckets found. Create your first bucket above.
                  </div>
                ) : (
                  buckets?.map((bucket) => (
                    <div 
                      key={bucket.id}
                      className="flex items-center justify-between p-6 rounded-lg bg-slate-900/50 border border-blue-400/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 flex items-center justify-center">
                          <Cloud className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{bucket.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {bucket.fileCount} files • {(bucket.totalSize / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge variant={bucket.public ? "default" : "secondary"}>
                          {bucket.public ? "Public" : "Private"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </NeonCard>
          </div>
        </TabsContent>

        <TabsContent value="files">
          <NeonCard title="File Explorer" glowColor="green">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Files</h3>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "user-avatar.jpg", size: "245 KB", type: "image", bucket: "avatars" },
                  { name: "document.pdf", size: "1.2 MB", type: "document", bucket: "documents" },
                  { name: "video-intro.mp4", size: "15.8 MB", type: "video", bucket: "media" },
                  { name: "backup.zip", size: "8.4 MB", type: "archive", bucket: "backups" },
                ].map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                        {file.type === 'image' && <Image className="w-5 h-5" />}
                        {file.type === 'video' && <Video className="w-5 h-5" />}
                        {file.type === 'document' && <File className="w-5 h-5" />}
                        {file.type === 'archive' && <File className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{file.bucket} • {file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </NeonCard>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NeonCard title="CDN Settings" glowColor="purple">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable CDN</Label>
                    <p className="text-sm text-muted-foreground">Global content delivery network</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Image Optimization</Label>
                    <p className="text-sm text-muted-foreground">Auto resize and compress images</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache Control</Label>
                    <p className="text-sm text-muted-foreground">Automatic cache headers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </NeonCard>

            <NeonCard title="Upload Settings" glowColor="cyan">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                  <Input
                    id="max-file-size"
                    type="number"
                    defaultValue="100"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="allowed-types">Allowed File Types</Label>
                  <Input
                    id="allowed-types"
                    defaultValue="jpg,png,gif,pdf,mp4,zip"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Virus Scanning</Label>
                    <p className="text-sm text-muted-foreground">Scan uploaded files</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </NeonCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

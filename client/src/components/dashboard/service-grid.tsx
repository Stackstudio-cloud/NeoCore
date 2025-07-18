import { useQuery } from "@tanstack/react-query";
import NeonCard from "@/components/ui/neon-card";
import StatusIndicator from "@/components/ui/status-indicator";
import { Database, Code, Shield, Cloud } from "lucide-react";

export default function ServiceGrid() {
  const { data: databases } = useQuery({
    queryKey: ["/api/projects/1/databases"],
  });

  const { data: authProviders } = useQuery({
    queryKey: ["/api/projects/1/auth"],
  });

  const { data: storageBuckets } = useQuery({
    queryKey: ["/api/projects/1/storage"],
  });

  const services = [
    {
      title: "Database",
      subtitle: "PostgreSQL",
      icon: <Database className="w-6 h-6" />,
      status: "running" as const,
      glowColor: "blue" as const,
      features: [
        "Real-time APIs",
        "Auto backups", 
        "Extensions support"
      ],
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      title: "GraphQL API",
      subtitle: "Auto-generated",
      icon: <Code className="w-6 h-6" />,
      status: "online" as const,
      glowColor: "green" as const,
      features: [
        "Instant API",
        "Subscriptions",
        "Permissions"
      ],
      imageUrl: "https://images.unsplash.com/photo-1580584126903-c17d41830450?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      title: "Authentication",
      subtitle: "Multi-provider",
      icon: <Shield className="w-6 h-6" />,
      status: "online" as const,
      glowColor: "purple" as const,
      features: [
        "OAuth providers",
        "MFA support",
        "WebAuthn"
      ],
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      title: "Storage",
      subtitle: "S3 + CDN",
      icon: <Cloud className="w-6 h-6" />,
      status: "online" as const,
      glowColor: "pink" as const,
      features: [
        "CDN delivery",
        "Image transform",
        "Permissions"
      ],
      imageUrl: "https://images.unsplash.com/photo-1551808525-51a94da548ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {services.map((service, index) => (
        <NeonCard
          key={index}
          glowColor={service.glowColor}
          className="group cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
              service.glowColor === 'blue' ? 'from-blue-500 to-blue-600' :
              service.glowColor === 'green' ? 'from-green-500 to-green-600' :
              service.glowColor === 'purple' ? 'from-purple-500 to-purple-600' :
              'from-pink-500 to-pink-600'
            } flex items-center justify-center mr-4`}>
              {service.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.subtitle}</p>
            </div>
          </div>
          
          <div 
            className="h-32 rounded-lg mb-4 bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${service.imageUrl})` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-t ${
              service.glowColor === 'blue' ? 'from-blue-500/20' :
              service.glowColor === 'green' ? 'from-green-500/20' :
              service.glowColor === 'purple' ? 'from-purple-500/20' :
              'from-pink-500/20'
            } to-transparent rounded-lg`} />
          </div>
          
          <div className="space-y-2">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                {feature}
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <StatusIndicator status={service.status} label="Active" />
          </div>
        </NeonCard>
      ))}
    </div>
  );
}

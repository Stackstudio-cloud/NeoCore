import { useQuery } from "@tanstack/react-query";
import MetricsCarousel from "@/components/dashboard/metrics-carousel";
import ServiceGrid from "@/components/dashboard/service-grid";
import LiveDashboard from "@/components/dashboard/live-dashboard";
import NeonCard from "@/components/ui/neon-card";
import { Button } from "@/components/ui/button";
import { Rocket, FileText } from "lucide-react";

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="animate-slide-left">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-green-400 to-purple-500 bg-clip-text text-transparent">
          The Future of Backend Development
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          NeoCore provides a complete, fully managed infrastructure stack with PostgreSQL, GraphQL, Auth, and Storage
        </p>
        
        {/* Quick Stats Carousel */}
        <MetricsCarousel />
      </section>

      {/* Core Services Grid */}
      <section className="mb-12">
        <ServiceGrid />
      </section>

      {/* Extended Services Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-400">NeoCore Extended Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your backend with additional services for custom deployment, serverless functions, and AI capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NeoCore Run */}
          <NeonCard
            title="NeoCore Run"
            description="Custom Services"
            glowColor="cyan"
          >
            <div 
              className="h-40 rounded-lg mb-6 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 to-transparent rounded-lg" />
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Deploy Redis, MongoDB, or any containerized application</span>
              </li>
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Minimal latency with integrated networking</span>
              </li>
            </ul>
          </NeonCard>

          {/* NeoCore Functions */}
          <NeonCard
            title="NeoCore Functions"
            description="Serverless"
            glowColor="green"
          >
            <div 
              className="h-40 rounded-lg mb-6 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580584126903-c17d41830450?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 to-transparent rounded-lg" />
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>JavaScript/TypeScript functions</span>
              </li>
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Auto-generated HTTP endpoints</span>
              </li>
            </ul>
          </NeonCard>

          {/* NeoCore AI */}
          <NeonCard
            title="NeoCore AI"
            description="AI Integration"
            glowColor="purple"
          >
            <div 
              className="h-40 rounded-lg mb-6 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent rounded-lg" />
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>Auto-embeddings for similarity search</span>
              </li>
              <li className="flex items-start">
                <Rocket className="w-4 h-4 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                <span>AI assistants for user interaction</span>
              </li>
            </ul>
          </NeonCard>
        </div>
      </section>

      {/* Interactive Dashboard Section */}
      <LiveDashboard />

      {/* CTA Section */}
      <section className="text-center py-16">
        <NeonCard className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-green-400 to-purple-500 bg-clip-text text-transparent">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers using NeoCore to build scalable, secure applications with cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
              <Rocket className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" className="px-8 py-4 glass-card border-blue-400/50">
              <FileText className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </NeonCard>
      </section>
    </div>
  );
}

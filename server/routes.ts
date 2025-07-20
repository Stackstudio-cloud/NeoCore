import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertDatabaseSchema, insertStorageBucketSchema, insertFunctionSchema, insertAiAssistantSchema } from "@shared/schema";
import { 
  generateCode, 
  generateSQL, 
  analyzeSentiment, 
  analyzeImage,
  chatCompletion,
  summarizeDocument,
  generateImage
} from "./lib/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Send initial connection message
    ws.send(JSON.stringify({ type: 'connected', message: 'NeoCore WebSocket connected' }));
    
    // Send periodic metrics updates
    const metricsInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'metrics_update',
          data: {
            connections: Math.floor(Math.random() * 200) + 750,
            queries_per_min: Math.floor(Math.random() * 5000) + 10000,
            uptime: 99.9,
            response_time: Math.floor(Math.random() * 20) + 30,
          }
        }));
      }
    }, 5000);

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clearInterval(metricsInterval);
    });
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Databases routes
  app.get("/api/projects/:projectId/databases", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const databases = await storage.getDatabases(projectId);
      res.json(databases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch databases" });
    }
  });

  app.post("/api/projects/:projectId/databases", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const databaseData = insertDatabaseSchema.parse({ ...req.body, projectId });
      const database = await storage.createDatabase(databaseData);
      res.status(201).json(database);
    } catch (error) {
      res.status(400).json({ message: "Invalid database data" });
    }
  });

  // Auth providers routes
  app.get("/api/projects/:projectId/auth", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const providers = await storage.getAuthProviders(projectId);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch auth providers" });
    }
  });

  app.patch("/api/auth/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const provider = await storage.updateAuthProvider(id, updates);
      if (!provider) {
        return res.status(404).json({ message: "Auth provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to update auth provider" });
    }
  });

  // Storage buckets routes
  app.get("/api/projects/:projectId/storage", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const buckets = await storage.getStorageBuckets(projectId);
      res.json(buckets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch storage buckets" });
    }
  });

  app.post("/api/projects/:projectId/storage", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const bucketData = insertStorageBucketSchema.parse({ ...req.body, projectId });
      const bucket = await storage.createStorageBucket(bucketData);
      res.status(201).json(bucket);
    } catch (error) {
      res.status(400).json({ message: "Invalid storage bucket data" });
    }
  });

  // Functions routes
  app.get("/api/projects/:projectId/functions", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const functions = await storage.getFunctions(projectId);
      res.json(functions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch functions" });
    }
  });

  app.post("/api/projects/:projectId/functions", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const functionData = insertFunctionSchema.parse({ ...req.body, projectId });
      const func = await storage.createFunction(functionData);
      res.status(201).json(func);
    } catch (error) {
      res.status(400).json({ message: "Invalid function data" });
    }
  });

  // AI assistants routes
  app.get("/api/projects/:projectId/ai", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const assistants = await storage.getAiAssistants(projectId);
      res.json(assistants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI assistants" });
    }
  });

  app.post("/api/projects/:projectId/ai", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const assistantData = insertAiAssistantSchema.parse({ ...req.body, projectId });
      const assistant = await storage.createAiAssistant(assistantData);
      res.status(201).json(assistant);
    } catch (error) {
      res.status(400).json({ message: "Invalid AI assistant data" });
    }
  });

  // Metrics routes
  app.get("/api/projects/:projectId/metrics", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const type = req.query.type as string;
      const metrics = await storage.getMetrics(projectId, type);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // AI API routes powered by Gemini
  app.post("/api/ai/generate-code", async (req, res) => {
    try {
      const { prompt, language, context } = req.body;
      const result = await generateCode({ prompt, language, context });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-sql", async (req, res) => {
    try {
      const { naturalLanguage, schema, context } = req.body;
      const result = await generateSQL({ naturalLanguage, schema, context });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/analyze-sentiment", async (req, res) => {
    try {
      const { text } = req.body;
      const result = await analyzeSentiment(text);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/analyze-image", async (req, res) => {
    try {
      const { imageBase64, prompt } = req.body;
      const result = await analyzeImage(imageBase64, prompt);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const result = await generateImage(prompt);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, systemPrompt } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Messages array is required" });
      }
      
      const result = await chatCompletion(messages, systemPrompt);
      res.json(result);
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  });

  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { text, maxLength } = req.body;
      const result = await summarizeDocument(text, maxLength);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}

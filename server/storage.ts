import {
  projects, databases, apiEndpoints, authProviders, storageeBuckets, functions, aiAssistants, metrics,
  type Project, type InsertProject,
  type Database, type InsertDatabase,
  type ApiEndpoint, type InsertApiEndpoint,
  type AuthProvider, type InsertAuthProvider,
  type StorageBucket, type InsertStorageBucket,
  type Function, type InsertFunction,
  type AiAssistant, type InsertAiAssistant,
  type Metric, type InsertMetric
} from "@shared/schema";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Databases
  getDatabases(projectId: number): Promise<Database[]>;
  getDatabase(id: number): Promise<Database | undefined>;
  createDatabase(database: InsertDatabase): Promise<Database>;
  updateDatabase(id: number, updates: Partial<Database>): Promise<Database | undefined>;

  // API Endpoints
  getApiEndpoints(projectId: number): Promise<ApiEndpoint[]>;
  createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint>;
  updateApiEndpoint(id: number, updates: Partial<ApiEndpoint>): Promise<ApiEndpoint | undefined>;

  // Auth Providers
  getAuthProviders(projectId: number): Promise<AuthProvider[]>;
  updateAuthProvider(id: number, updates: Partial<AuthProvider>): Promise<AuthProvider | undefined>;

  // Storage Buckets
  getStorageBuckets(projectId: number): Promise<StorageBucket[]>;
  createStorageBucket(bucket: InsertStorageBucket): Promise<StorageBucket>;
  updateStorageBucket(id: number, updates: Partial<StorageBucket>): Promise<StorageBucket | undefined>;

  // Functions
  getFunctions(projectId: number): Promise<Function[]>;
  createFunction(func: InsertFunction): Promise<Function>;
  updateFunction(id: number, updates: Partial<Function>): Promise<Function | undefined>;

  // AI Assistants
  getAiAssistants(projectId: number): Promise<AiAssistant[]>;
  createAiAssistant(assistant: InsertAiAssistant): Promise<AiAssistant>;
  updateAiAssistant(id: number, updates: Partial<AiAssistant>): Promise<AiAssistant | undefined>;

  // Metrics
  getMetrics(projectId: number, type?: string): Promise<Metric[]>;
  addMetric(metric: InsertMetric): Promise<Metric>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project> = new Map();
  private databases: Map<number, Database> = new Map();
  private apiEndpoints: Map<number, ApiEndpoint> = new Map();
  private authProviders: Map<number, AuthProvider> = new Map();
  private storageBuckets: Map<number, StorageBucket> = new Map();
  private functions: Map<number, Function> = new Map();
  private aiAssistants: Map<number, AiAssistant> = new Map();
  private metrics: Map<number, Metric> = new Map();
  
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default project
    const defaultProject: Project = {
      id: 1,
      name: "SmartDB Demo",
      description: "Demo project showcasing SmartDB capabilities",
      status: "active",
      region: "us-east-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(1, defaultProject);

    // Create default database
    const defaultDatabase: Database = {
      id: 1,
      projectId: 1,
      name: "main-db",
      connectionString: "postgresql://smartdb:***@db.smartdb.io:5432/main",
      status: "running",
      version: "15.0",
      extensions: ["pgvector", "postgis"],
      metrics: { connections: 847, queries_per_min: 12300 },
    };
    this.databases.set(1, defaultDatabase);

    // Create default auth providers
    const authProvidersData = [
      { id: 1, projectId: 1, provider: "email", enabled: true, config: {} },
      { id: 2, projectId: 1, provider: "google", enabled: true, config: {} },
      { id: 3, projectId: 1, provider: "github", enabled: false, config: {} },
    ];
    authProvidersData.forEach(provider => this.authProviders.set(provider.id, provider));

    this.currentId = 10;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const newProject: Project = {
      ...project,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Databases
  async getDatabases(projectId: number): Promise<Database[]> {
    return Array.from(this.databases.values()).filter(db => db.projectId === projectId);
  }

  async getDatabase(id: number): Promise<Database | undefined> {
    return this.databases.get(id);
  }

  async createDatabase(database: InsertDatabase): Promise<Database> {
    const id = this.currentId++;
    const newDatabase: Database = { ...database, id };
    this.databases.set(id, newDatabase);
    return newDatabase;
  }

  async updateDatabase(id: number, updates: Partial<Database>): Promise<Database | undefined> {
    const database = this.databases.get(id);
    if (!database) return undefined;
    
    const updatedDatabase = { ...database, ...updates };
    this.databases.set(id, updatedDatabase);
    return updatedDatabase;
  }

  // API Endpoints
  async getApiEndpoints(projectId: number): Promise<ApiEndpoint[]> {
    return Array.from(this.apiEndpoints.values()).filter(endpoint => endpoint.projectId === projectId);
  }

  async createApiEndpoint(endpoint: InsertApiEndpoint): Promise<ApiEndpoint> {
    const id = this.currentId++;
    const newEndpoint: ApiEndpoint = { ...endpoint, id };
    this.apiEndpoints.set(id, newEndpoint);
    return newEndpoint;
  }

  async updateApiEndpoint(id: number, updates: Partial<ApiEndpoint>): Promise<ApiEndpoint | undefined> {
    const endpoint = this.apiEndpoints.get(id);
    if (!endpoint) return undefined;
    
    const updatedEndpoint = { ...endpoint, ...updates };
    this.apiEndpoints.set(id, updatedEndpoint);
    return updatedEndpoint;
  }

  // Auth Providers
  async getAuthProviders(projectId: number): Promise<AuthProvider[]> {
    return Array.from(this.authProviders.values()).filter(provider => provider.projectId === projectId);
  }

  async updateAuthProvider(id: number, updates: Partial<AuthProvider>): Promise<AuthProvider | undefined> {
    const provider = this.authProviders.get(id);
    if (!provider) return undefined;
    
    const updatedProvider = { ...provider, ...updates };
    this.authProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  // Storage Buckets
  async getStorageBuckets(projectId: number): Promise<StorageBucket[]> {
    return Array.from(this.storageBuckets.values()).filter(bucket => bucket.projectId === projectId);
  }

  async createStorageBucket(bucket: InsertStorageBucket): Promise<StorageBucket> {
    const id = this.currentId++;
    const newBucket: StorageBucket = { ...bucket, id };
    this.storageBuckets.set(id, newBucket);
    return newBucket;
  }

  async updateStorageBucket(id: number, updates: Partial<StorageBucket>): Promise<StorageBucket | undefined> {
    const bucket = this.storageBuckets.get(id);
    if (!bucket) return undefined;
    
    const updatedBucket = { ...bucket, ...updates };
    this.storageBuckets.set(id, updatedBucket);
    return updatedBucket;
  }

  // Functions
  async getFunctions(projectId: number): Promise<Function[]> {
    return Array.from(this.functions.values()).filter(func => func.projectId === projectId);
  }

  async createFunction(func: InsertFunction): Promise<Function> {
    const id = this.currentId++;
    const newFunction: Function = { ...func, id };
    this.functions.set(id, newFunction);
    return newFunction;
  }

  async updateFunction(id: number, updates: Partial<Function>): Promise<Function | undefined> {
    const func = this.functions.get(id);
    if (!func) return undefined;
    
    const updatedFunction = { ...func, ...updates };
    this.functions.set(id, updatedFunction);
    return updatedFunction;
  }

  // AI Assistants
  async getAiAssistants(projectId: number): Promise<AiAssistant[]> {
    return Array.from(this.aiAssistants.values()).filter(assistant => assistant.projectId === projectId);
  }

  async createAiAssistant(assistant: InsertAiAssistant): Promise<AiAssistant> {
    const id = this.currentId++;
    const newAssistant: AiAssistant = { ...assistant, id };
    this.aiAssistants.set(id, newAssistant);
    return newAssistant;
  }

  async updateAiAssistant(id: number, updates: Partial<AiAssistant>): Promise<AiAssistant | undefined> {
    const assistant = this.aiAssistants.get(id);
    if (!assistant) return undefined;
    
    const updatedAssistant = { ...assistant, ...updates };
    this.aiAssistants.set(id, updatedAssistant);
    return updatedAssistant;
  }

  // Metrics
  async getMetrics(projectId: number, type?: string): Promise<Metric[]> {
    const projectMetrics = Array.from(this.metrics.values()).filter(metric => metric.projectId === projectId);
    return type ? projectMetrics.filter(metric => metric.metricType === type) : projectMetrics;
  }

  async addMetric(metric: InsertMetric): Promise<Metric> {
    const id = this.currentId++;
    const newMetric: Metric = { ...metric, id, timestamp: new Date() };
    this.metrics.set(id, newMetric);
    return newMetric;
  }
}

export const storage = new MemStorage();

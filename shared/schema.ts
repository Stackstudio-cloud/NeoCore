import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, paused, archived
  region: text("region").notNull().default("us-east-1"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const databases = pgTable("databases", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  connectionString: text("connection_string").notNull(),
  status: text("status").notNull().default("running"), // running, stopped, maintenance
  version: text("version").notNull().default("15.0"),
  extensions: jsonb("extensions").default([]),
  metrics: jsonb("metrics").default({}),
});

export const apiEndpoints = pgTable("api_endpoints", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  type: text("type").notNull(), // graphql, rest, functions
  url: text("url").notNull(),
  status: text("status").notNull().default("active"),
  config: jsonb("config").default({}),
});

export const authProviders = pgTable("auth_providers", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  provider: text("provider").notNull(), // email, google, github, etc.
  enabled: boolean("enabled").notNull().default(false),
  config: jsonb("config").default({}),
});

export const storageBuckets = pgTable("storage_buckets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  public: boolean("public").notNull().default(false),
  fileCount: integer("file_count").notNull().default(0),
  totalSize: integer("total_size").notNull().default(0),
});

export const functions = pgTable("functions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  runtime: text("runtime").notNull().default("nodejs18"),
  status: text("status").notNull().default("deployed"),
  lastInvoked: timestamp("last_invoked"),
  invocations: integer("invocations").notNull().default(0),
});

export const aiAssistants = pgTable("ai_assistants", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  model: text("model").notNull().default("gpt-4"),
  description: text("description"),
  config: jsonb("config").default({}),
  active: boolean("active").notNull().default(true),
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  metricType: text("metric_type").notNull(), // api_requests, db_connections, storage_usage
  value: integer("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Enhanced schema for business features
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using text for compatibility with auth providers
  email: text("email").unique().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  tier: text("tier").notNull().default("free"), // free, pro, team, enterprise
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
  preferences: jsonb("preferences").default({
    theme: "dark",
    notifications: true,
    soundEffects: true,
    defaultAIAssistant: "general"
  }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: text("owner_id").notNull(),
  tier: text("tier").notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow(),
  settings: jsonb("settings").default({
    allowGuestAccess: false,
    defaultProjectVisibility: "private",
    requireApprovalForJoining: true
  }),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("developer"), // owner, admin, developer, viewer
  permissions: jsonb("permissions").default([]),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const userUsage = pgTable("user_usage", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  aiRequests: integer("ai_requests").notNull().default(0),
  apiCalls: integer("api_calls").notNull().default(0),
  storageUsed: integer("storage_used").notNull().default(0), // in bytes
  projectsCount: integer("projects_count").notNull().default(0),
  lastReset: timestamp("last_reset").defaultNow(), // for monthly limits
});

// Enhanced AI assistants
export const specializedAssistants = pgTable("specialized_assistants", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  assistantType: text("assistant_type").notNull(), // general, frontend, backend, etc.
  customizations: jsonb("customizations").default({}),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  assistantType: text("assistant_type").notNull(),
  title: text("title"),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced developer tools
export const projectDatabases = pgTable("project_databases", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  provider: text("provider").notNull(), // postgresql, mongodb, redis, etc.
  name: text("name").notNull(),
  connectionString: text("connection_string").notNull(),
  status: text("status").notNull().default("connected"),
  config: jsonb("config").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testSuites = pgTable("test_suites", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  name: text("name").notNull(),
  framework: text("framework").notNull(), // jest, vitest, cypress, etc.
  testFiles: jsonb("test_files").notNull().default([]),
  config: jsonb("config").default({}),
  lastRun: timestamp("last_run"),
  results: jsonb("results").default({}),
});

// Enterprise features
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  teamId: integer("team_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  metadata: jsonb("metadata").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(), // hashed API key
  permissions: jsonb("permissions").notNull().default([]),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Content & Templates
export const projectTemplates = pgTable("project_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // fullstack, frontend, backend, mobile, etc.
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  tags: jsonb("tags").default([]),
  structure: jsonb("structure").notNull(), // file structure and content
  dependencies: jsonb("dependencies").default({}),
  instructions: text("instructions"),
  createdBy: text("created_by"),
  isPublic: boolean("is_public").notNull().default(true),
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const codeSnippets = pgTable("code_snippets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  language: text("language").notNull(),
  category: text("category").notNull(), // authentication, database, api, etc.
  code: text("code").notNull(),
  tags: jsonb("tags").default([]),
  createdBy: text("created_by"),
  isPublic: boolean("is_public").notNull().default(true),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Project collaboration
export const projectCollaborators = pgTable("project_collaborators", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(),
  role: text("role").notNull().default("developer"), // owner, admin, developer, viewer
  permissions: jsonb("permissions").default([]),
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const projectActivity = pgTable("project_activity", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  details: jsonb("details").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert and Select schemas
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDatabaseSchema = createInsertSchema(databases).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, lastActive: true });
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true, createdAt: true });
export const insertProjectTemplateSchema = createInsertSchema(projectTemplates).omit({ id: true, createdAt: true, usageCount: true });
export const insertCodeSnippetSchema = createInsertSchema(codeSnippets).omit({ id: true, createdAt: true, likes: true });
export const insertTestSuiteSchema = createInsertSchema(testSuites).omit({ id: true, lastRun: true, results: true });
export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({ id: true });
export const insertAuthProviderSchema = createInsertSchema(authProviders).omit({ id: true });
export const insertStorageBucketSchema = createInsertSchema(storageBuckets).omit({ id: true });
export const insertFunctionSchema = createInsertSchema(functions).omit({ id: true });
export const insertAiAssistantSchema = createInsertSchema(aiAssistants).omit({ id: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true });

// Select types
export type Project = typeof projects.$inferSelect;
export type Database = typeof databases.$inferSelect;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type UserUsage = typeof userUsage.$inferSelect;
export type SpecializedAssistant = typeof specializedAssistants.$inferSelect;
export type AIConversation = typeof aiConversations.$inferSelect;
export type ProjectDatabase = typeof projectDatabases.$inferSelect;
export type TestSuite = typeof testSuites.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type APIKey = typeof apiKeys.$inferSelect;
export type ProjectTemplate = typeof projectTemplates.$inferSelect;
export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;
export type ProjectActivity = typeof projectActivity.$inferSelect;

// Insert types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertDatabase = z.infer<typeof insertDatabaseSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertProjectTemplate = z.infer<typeof insertProjectTemplateSchema>;
export type InsertCodeSnippet = z.infer<typeof insertCodeSnippetSchema>;
export type InsertTestSuite = z.infer<typeof insertTestSuiteSchema>;

// Legacy types for compatibility
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type AuthProvider = typeof authProviders.$inferSelect;
export type InsertAuthProvider = z.infer<typeof insertAuthProviderSchema>;
export type StorageBucket = typeof storageBuckets.$inferSelect;
export type InsertStorageBucket = z.infer<typeof insertStorageBucketSchema>;
export type Function = typeof functions.$inferSelect;
export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type AiAssistant = typeof aiAssistants.$inferSelect;
export type InsertAiAssistant = z.infer<typeof insertAiAssistantSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

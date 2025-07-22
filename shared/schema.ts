import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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
  value: integer("value").notNull().default(0),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

// Database Branching System (inspired by Neon)
export const databaseBranches = pgTable("database_branches", {
  id: serial("id").primaryKey(),
  databaseId: integer("database_id").notNull(),
  name: text("name").notNull(), // main, dev, feature/auth, etc.
  parentBranchId: integer("parent_branch_id"), // null for main branch
  isMain: boolean("is_main").notNull().default(false),
  status: text("status").notNull().default("active"), // active, merged, deleted
  schemaHash: text("schema_hash"), // for detecting changes
  createdAt: timestamp("created_at").defaultNow(),
  lastCommitAt: timestamp("last_commit_at").defaultNow(),
  mergedAt: timestamp("merged_at"),
});

// Real-time Collaboration (inspired by Cursor/Figma)
export const collaborationSessions = pgTable("collaboration_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: text("user_id").notNull(),
  sessionId: text("session_id").notNull(),
  fileName: text("file_name"),
  cursorPosition: jsonb("cursor_position").default({}),
  isActive: boolean("is_active").notNull().default(true),
  lastActivity: timestamp("last_activity").defaultNow(),
});

// Visual Project Canvas (inspired by Railway)
export const projectCanvas = pgTable("project_canvas", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  nodeType: text("node_type").notNull(), // database, api, function, storage
  nodeId: integer("node_id").notNull(), // references the actual resource
  position: jsonb("position").notNull(), // {x: number, y: number}
  dimensions: jsonb("dimensions").default({}), // {width: number, height: number}
  connections: jsonb("connections").default([]), // array of connected node IDs
  metadata: jsonb("metadata").default({}),
});

// Edge Computing Regions (inspired by Fly.io)
export const edgeRegions = pgTable("edge_regions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(), // us-east-1, eu-west-1, etc.
  name: text("name").notNull(),
  country: text("country").notNull(),
  latency: integer("latency").notNull().default(0), // in milliseconds
  isActive: boolean("is_active").notNull().default(true),
});

// Enhanced Database with branching support
export const databaseConnections = pgTable("database_connections", {
  id: serial("id").primaryKey(),
  databaseId: integer("database_id").notNull(),
  branchId: integer("branch_id"), // null for main connection
  regionId: integer("region_id").notNull(),
  connectionString: text("connection_string").notNull(),
  isReadReplica: boolean("is_read_replica").notNull().default(false),
  lastHealthCheck: timestamp("last_health_check").defaultNow(),
  status: text("status").notNull().default("healthy"), // healthy, degraded, down
});

// AI Enhanced Features (inspired by Cursor AI)
export const aiCodeGeneration = pgTable("ai_code_generation", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  assistantId: integer("assistant_id").notNull(),
  prompt: text("prompt").notNull(),
  generatedCode: text("generated_code"),
  language: text("language").notNull().default("typescript"),
  filePath: text("file_path"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
  executionTime: integer("execution_time"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports for all tables
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export type Database = typeof databases.$inferSelect;
export type InsertDatabase = typeof databases.$inferInsert;

export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = typeof apiEndpoints.$inferInsert;

export type AuthProvider = typeof authProviders.$inferSelect;
export type InsertAuthProvider = typeof authProviders.$inferInsert;

export type StorageBucket = typeof storageBuckets.$inferSelect;
export type InsertStorageBucket = typeof storageBuckets.$inferInsert;

export type Function = typeof functions.$inferSelect;
export type InsertFunction = typeof functions.$inferInsert;

export type AiAssistant = typeof aiAssistants.$inferSelect;
export type InsertAiAssistant = typeof aiAssistants.$inferInsert;

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = typeof metrics.$inferInsert;

// New enhanced types
export type DatabaseBranch = typeof databaseBranches.$inferSelect;
export type InsertDatabaseBranch = typeof databaseBranches.$inferInsert;

export type CollaborationSession = typeof collaborationSessions.$inferSelect;
export type InsertCollaborationSession = typeof collaborationSessions.$inferInsert;

export type ProjectCanvasNode = typeof projectCanvas.$inferSelect;
export type InsertProjectCanvasNode = typeof projectCanvas.$inferInsert;

export type EdgeRegion = typeof edgeRegions.$inferSelect;
export type InsertEdgeRegion = typeof edgeRegions.$inferInsert;

export type DatabaseConnection = typeof databaseConnections.$inferSelect;
export type InsertDatabaseConnection = typeof databaseConnections.$inferInsert;

export type AiCodeGeneration = typeof aiCodeGeneration.$inferSelect;
export type InsertAiCodeGeneration = typeof aiCodeGeneration.$inferInsert;

// Insert schemas using drizzle-zod
export const insertProjectSchema = createInsertSchema(projects);
export const insertDatabaseSchema = createInsertSchema(databases);
export const insertStorageBucketSchema = createInsertSchema(storageBuckets);
export const insertFunctionSchema = createInsertSchema(functions);
export const insertAiAssistantSchema = createInsertSchema(aiAssistants);
export const insertMetricSchema = createInsertSchema(metrics);

// Enhanced schemas
export const insertDatabaseBranchSchema = createInsertSchema(databaseBranches);
export const insertCollaborationSessionSchema = createInsertSchema(collaborationSessions);
export const insertProjectCanvasNodeSchema = createInsertSchema(projectCanvas);
export const insertEdgeRegionSchema = createInsertSchema(edgeRegions);
export const insertDatabaseConnectionSchema = createInsertSchema(databaseConnections);
export const insertAiCodeGenerationSchema = createInsertSchema(aiCodeGeneration);
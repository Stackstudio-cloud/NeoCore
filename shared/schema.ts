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

export const storagebuckets = pgTable("storage_buckets", {
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
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDatabaseSchema = createInsertSchema(databases).omit({
  id: true,
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
});

export const insertAuthProviderSchema = createInsertSchema(authProviders).omit({
  id: true,
});

export const insertStorageBucketSchema = createInsertSchema(storagebuckets).omit({
  id: true,
});

export const insertFunctionSchema = createInsertSchema(functions).omit({
  id: true,
});

export const insertAiAssistantSchema = createInsertSchema(aiAssistants).omit({
  id: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
});

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Database = typeof databases.$inferSelect;
export type InsertDatabase = z.infer<typeof insertDatabaseSchema>;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type AuthProvider = typeof authProviders.$inferSelect;
export type InsertAuthProvider = z.infer<typeof insertAuthProviderSchema>;
export type StorageBucket = typeof storageeBuckets.$inferSelect;
export type InsertStorageBucket = z.infer<typeof insertStorageBucketSchema>;
export type Function = typeof functions.$inferSelect;
export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type AiAssistant = typeof aiAssistants.$inferSelect;
export type InsertAiAssistant = z.infer<typeof insertAiAssistantSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

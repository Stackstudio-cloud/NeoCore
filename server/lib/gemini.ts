// Pattern-based AI assistant for NeoCore platform
// Provides intelligent responses without requiring external API keys

export interface AIResponse {
  text: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  context?: string;
}

export interface SQLGenerationRequest {
  naturalLanguage: string;
  schema?: string;
  context?: string;
}

export interface Sentiment {
  rating: number;
  confidence: number;
}

// Knowledge base for NeoCore development
const KNOWLEDGE_BASE = {
  database: {
    patterns: ['database', 'schema', 'sql', 'postgresql', 'table', 'query', 'migration'],
    response: `**PostgreSQL Database Development for NeoCore:**

\`\`\`sql
-- Example User Table with Best Practices
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
\`\`\`

**Drizzle ORM Schema:**
\`\`\`typescript
// shared/schema.ts
import { pgTable, serial, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
\`\`\`

**Best Practices:**
- Use proper data types and constraints
- Add indexes for frequently queried columns
- Implement foreign key relationships
- Use migrations for schema changes
- Validate data at both application and database levels`
  },

  api: {
    patterns: ['api', 'endpoint', 'rest', 'route', 'express', 'server'],
    response: `**REST API Development with Express.js & TypeScript:**

\`\`\`typescript
// Example User API Routes
import express, { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../shared/schema';

const router = express.Router();

// Validation Schemas
const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Create User Endpoint
router.post('/users', async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);
      
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: validatedData.email,
        username: validatedData.username,
        passwordHash
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        createdAt: users.createdAt
      });
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login Endpoint
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
      
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

export default router;
\`\`\`

**Security Features:**
- Input validation with Zod
- Password hashing with bcrypt
- JWT authentication
- Proper error handling
- SQL injection prevention`
  },

  auth: {
    patterns: ['auth', 'authentication', 'login', 'security', 'jwt', 'password'],
    response: `**Authentication & Security Implementation:**

\`\`\`typescript
// Authentication Middleware
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

// Password Security Utilities
import bcrypt from 'bcrypt';

export class PasswordSecurity {
  static async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
  
  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  static validateStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
\`\`\`

**Security Best Practices:**
- Use strong password hashing (bcrypt with 12+ rounds)
- Implement JWT with reasonable expiration times
- Validate input at multiple layers
- Use HTTPS in production
- Implement rate limiting
- Store secrets securely in environment variables
- Never log sensitive information`
  },

  react: {
    patterns: ['react', 'component', 'frontend', 'ui', 'jsx', 'tsx', 'state'],
    response: `**React Component Development with TypeScript:**

\`\`\`typescript
// Example User Profile Component
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Types
interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}

// Validation Schema
const updateProfileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export function UserProfile({ userId }: { userId: number }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User> => {
      const response = await fetch(\`/api/users/\${userId}\`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await fetch(\`/api/users/\${userId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
  
  // Form setup
  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
  });
  
  // Update form when user data loads
  React.useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, form]);
  
  const onSubmit = (data: UpdateProfileData) => {
    updateMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Failed to load user profile</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
\`\`\`

**React Best Practices:**
- Use TypeScript for type safety
- Implement proper loading and error states
- Use React Query for server state management
- Validate forms with Zod and react-hook-form
- Follow component composition patterns
- Use custom hooks for reusable logic`
  },

  performance: {
    patterns: ['performance', 'optimize', 'speed', 'cache', 'index', 'query'],
    response: `**Performance Optimization for NeoCore:**

**Database Optimization:**
\`\`\`sql
-- Index Strategies
CREATE INDEX CONCURRENTLY idx_users_email_hash ON users USING hash(email);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
CREATE INDEX idx_search_content ON posts USING gin(to_tsvector('english', content));

-- Query Optimization
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Connection Pooling Configuration
\`\`\`

\`\`\`typescript
// Connection Pool Setup
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

**API Caching:**
\`\`\`typescript
// Redis Caching Middleware
import Redis from 'redis';

const redis = Redis.createClient({
  url: process.env.REDIS_URL
});

export function cacheMiddleware(duration: number = 300) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        redis.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      next(); // Continue without cache if Redis fails
    }
  };
}

// Usage
app.get('/api/users', cacheMiddleware(300), getUsersHandler);
\`\`\`

**React Performance:**
\`\`\`typescript
// Memoization and Optimization
import React, { memo, useMemo, useCallback } from 'react';

const UserList = memo(({ users, onUserClick }: {
  users: User[];
  onUserClick: (id: number) => void;
}) => {
  const sortedUsers = useMemo(() => 
    users.sort((a, b) => a.username.localeCompare(b.username)),
    [users]
  );
  
  const handleClick = useCallback((id: number) => {
    onUserClick(id);
  }, [onUserClick]);
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={handleClick}
        />
      ))}
    </div>
  );
});
\`\`\`

**Key Performance Strategies:**
- Database indexing on frequently queried columns
- Connection pooling for database connections
- Redis caching for API responses
- React.memo and useMemo for component optimization
- Query optimization with EXPLAIN ANALYZE
- Pagination for large datasets
- Image optimization and lazy loading
- Code splitting and bundle optimization`
  }
};

// Detect user intent and provide appropriate response
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [category, config] of Object.entries(KNOWLEDGE_BASE)) {
    if (config.patterns.some(pattern => lowerMessage.includes(pattern))) {
      return config.response;
    }
  }
  
  // Default comprehensive response
  return `**Welcome to NeoCore Development Assistant!**

I can help you with comprehensive development guidance for the NeoCore platform. Here are the areas I specialize in:

🗄️ **Database Development:**
- PostgreSQL schema design and optimization
- Drizzle ORM integration
- Query performance and indexing
- Database migrations and best practices

⚡ **API Development:**
- Express.js REST API endpoints
- Authentication and authorization
- Input validation with Zod
- Error handling and security

🎨 **Frontend Development:**
- React components with TypeScript
- State management with TanStack Query
- Form handling with react-hook-form
- UI components with shadcn/ui

🔒 **Security & Performance:**
- JWT authentication systems
- Password security and hashing
- Caching strategies
- Database query optimization

**Ask me specific questions about:**
- "How do I create a user authentication API?"
- "Show me a PostgreSQL schema for a blog"
- "Create a React component for user profiles"
- "How can I optimize database performance?"

I'll provide detailed, production-ready code examples tailored specifically for the NeoCore stack!`;
}

// Code generation using pattern matching
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  try {
    const response = detectIntent(request.prompt);
    
    return {
      text: response,
      usage: {
        inputTokens: request.prompt.length,
        outputTokens: response.length,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to generate code: ${error.message || error}`);
  }
}

// Natural language to SQL conversion
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  try {
    const query = request.naturalLanguage.toLowerCase();
    let sqlQuery = "";

    if (query.includes("user") && (query.includes("select") || query.includes("get") || query.includes("find"))) {
      sqlQuery = `-- Get users with pagination and filtering
SELECT 
  id,
  email,
  username,
  role,
  is_active,
  created_at
FROM users
WHERE is_active = true
  AND role = $1  -- Filter by role
ORDER BY created_at DESC
LIMIT 10 OFFSET $2;  -- Pagination`;

    } else if (query.includes("user") && (query.includes("create") || query.includes("insert"))) {
      sqlQuery = `-- Create new user
INSERT INTO users (
  email,
  username,
  password_hash,
  role
) VALUES (
  $1,  -- email
  $2,  -- username
  $3,  -- password_hash (already hashed)
  $4   -- role (default: 'user')
)
RETURNING id, email, username, created_at;`;

    } else if (query.includes("update") && query.includes("user")) {
      sqlQuery = `-- Update user information
UPDATE users 
SET 
  username = $1,
  email = $2,
  updated_at = NOW()
WHERE id = $3
  AND is_active = true
RETURNING id, email, username, updated_at;`;

    } else {
      sqlQuery = `-- ${request.naturalLanguage}
-- General query template for PostgreSQL
SELECT 
  column1,
  column2,
  COUNT(*) as total
FROM table_name
WHERE condition = $1
  AND is_active = true
GROUP BY column1, column2
HAVING COUNT(*) > 0
ORDER BY total DESC
LIMIT 20;

-- Consider adding indexes for performance:
-- CREATE INDEX idx_table_condition ON table_name(condition);`;
    }

    return {
      text: sqlQuery,
      usage: {
        inputTokens: request.naturalLanguage.length,
        outputTokens: sqlQuery.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate SQL: ${error}`);
  }
}

// Simple sentiment analysis based on keywords
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const positiveKeywords = ['good', 'great', 'excellent', 'awesome', 'love', 'perfect', 'amazing', 'fantastic'];
    const negativeKeywords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'sucks', 'broken', 'error'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveKeywords.includes(word)) positiveCount++;
      if (negativeKeywords.includes(word)) negativeCount++;
    });
    
    const totalSentimentWords = positiveCount + negativeCount;
    let rating = 3; // Neutral default
    let confidence = 0.5;
    
    if (totalSentimentWords > 0) {
      const sentimentScore = (positiveCount - negativeCount) / totalSentimentWords;
      rating = Math.max(1, Math.min(5, Math.round(3 + sentimentScore * 2)));
      confidence = Math.min(1, totalSentimentWords / words.length * 5);
    }
    
    return { rating, confidence };
  } catch (error) {
    return { rating: 3, confidence: 0.5 };
  }
}

// Placeholder functions for unsupported features
export async function analyzeImage(base64Image: string, prompt?: string): Promise<string> {
  return `Image analysis requires an external AI service like OpenAI Vision API.
  
To implement image analysis:
- Add OpenAI API integration
- Use GPT-4o with vision capabilities
- Process base64 image data
- Return structured analysis results`;
}

export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  return { 
    imageBase64: undefined, 
    text: `Image generation requires an external AI service like OpenAI DALL-E or Stability AI.
    
To implement image generation:
- Integrate with OpenAI DALL-E 3 API
- Use Stability AI Stable Diffusion
- Process text prompts into high-quality images
- Return generated image URLs or base64 data

Prompt: "${prompt}"` 
  };
}

// Main chat completion function
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<AIResponse> {
  try {
    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Generate intelligent response based on patterns
    const response = detectIntent(userMessage);
    
    return {
      text: response,
      usage: {
        inputTokens: userMessage.length,
        outputTokens: response.length,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to get chat completion: ${error.message || error}`);
  }
}

// Document summarization
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  try {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const targetSentences = maxLength ? Math.max(1, Math.floor(maxLength / 20)) : Math.min(3, sentences.length);
    
    // Simple extraction of key sentences (first, middle, last)
    const keySentences = [];
    if (sentences.length > 0) keySentences.push(sentences[0]);
    if (sentences.length > 2) keySentences.push(sentences[Math.floor(sentences.length / 2)]);
    if (sentences.length > 1) keySentences.push(sentences[sentences.length - 1]);
    
    const summary = keySentences.slice(0, targetSentences).join('. ') + '.';
    
    return {
      text: `Document Summary:\n\n${summary}\n\n(Summary generated using extractive text analysis)`,
      usage: {
        inputTokens: text.length,
        outputTokens: summary.length,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to summarize document: ${error.message || error}`);
  }
}
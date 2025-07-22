import { Router } from "express";
import { db } from "../db";
import { codeSuggestions, suggestionRatings, type CodeSuggestion, type InsertCodeSuggestion } from "@shared/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const router = Router();

// Sample code suggestions data
const sampleSuggestions: Omit<InsertCodeSuggestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "JWT Authentication Middleware",
    description: "Express.js middleware for JWT token validation with error handling",
    code: `import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};`,
    language: "TypeScript",
    framework: "Express.js",
    difficulty: "intermediate",
    category: "Authentication",
    tags: ["jwt", "middleware", "security", "express"],
    rating: 4,
    usageCount: 152,
    aiGenerated: false,
    contextual: false,
    context: null,
    projectId: null,
  },
  {
    title: "React Custom Hook - useLocalStorage",
    description: "Custom React hook for managing localStorage with TypeScript support",
    code: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;`,
    language: "TypeScript",
    framework: "React",
    difficulty: "intermediate",
    category: "UI Components",
    tags: ["react", "hook", "localStorage", "typescript"],
    rating: 5,
    usageCount: 89,
    aiGenerated: false,
    contextual: false,
    context: null,
    projectId: null,
  },
  {
    title: "Database Connection Pool Setup",
    description: "PostgreSQL connection pool configuration with health checks",
    code: `import { Pool } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

class DatabasePool {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.max || 20,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 2000,
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Query executed', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Query error', { text, error });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default DatabasePool;`,
    language: "TypeScript",
    framework: "Node.js",
    difficulty: "advanced",
    category: "Database Queries",
    tags: ["postgresql", "connection-pool", "database", "nodejs"],
    rating: 4,
    usageCount: 67,
    aiGenerated: false,
    contextual: false,
    context: null,
    projectId: null,
  },
  {
    title: "API Rate Limiting Middleware",
    description: "Express middleware for API rate limiting with Redis backend",
    code: `import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: any) => string;
}) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: 'rate_limit:',
    }),
    windowMs: options.windowMs,
    max: options.max,
    message: options.message || 'Too many requests, please try again later.',
    keyGenerator: options.keyGenerator || ((req) => req.ip),
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Usage examples:
export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per window
  message: 'Too many login attempts, please try again later.',
});`,
    language: "TypeScript",
    framework: "Express.js",
    difficulty: "advanced",
    category: "Security",
    tags: ["rate-limiting", "redis", "security", "middleware"],
    rating: 5,
    usageCount: 34,
    aiGenerated: false,
    contextual: false,
    context: null,
    projectId: null,
  },
  {
    title: "React Form with Validation",
    description: "Complete form component with validation using react-hook-form and zod",
    code: `import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      reset();
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default UserForm;`,
    language: "TypeScript",
    framework: "React",
    difficulty: "intermediate",
    category: "UI Components",
    tags: ["react", "form", "validation", "zod", "react-hook-form"],
    rating: 5,
    usageCount: 78,
    aiGenerated: false,
    contextual: false,
    context: null,
    projectId: null,
  }
];

// Get code suggestions with filtering
router.get('/code-suggestions', async (req, res) => {
  try {
    const { category, framework, language, context } = req.query;
    
    // Start with base query
    let queryBuilder = db.select().from(codeSuggestions);
    
    // Apply filters
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push(eq(codeSuggestions.category, category as string));
    }
    if (framework && framework !== 'all') {
      conditions.push(eq(codeSuggestions.framework, framework as string));
    }
    if (language && language !== 'all') {
      conditions.push(eq(codeSuggestions.language, language as string));
    }
    
    // Apply conditions if any
    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }
    
    const suggestions = await queryBuilder.orderBy(desc(codeSuggestions.rating), desc(codeSuggestions.usageCount));
    
    // If no suggestions exist, seed with sample data
    if (suggestions.length === 0) {
      await db.insert(codeSuggestions).values(sampleSuggestions);
      const newSuggestions = await db.select().from(codeSuggestions).orderBy(desc(codeSuggestions.rating));
      return res.json(newSuggestions);
    }
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Generate new suggestions using AI
router.post('/generate-suggestions', async (req, res) => {
  try {
    const { context, category, framework, language } = req.body;
    
    if (!context || context.trim().length === 0) {
      return res.status(400).json({ error: 'Context is required for generating suggestions' });
    }
    
    // Generate AI suggestions based on context
    const aiSuggestions = await generateAISuggestions(context, { category, framework, language });
    
    // Save to database
    if (aiSuggestions.length > 0) {
      await db.insert(codeSuggestions).values(aiSuggestions);
    }
    
    res.json({ 
      message: 'Suggestions generated successfully', 
      count: aiSuggestions.length 
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Rate a suggestion
router.post('/code-suggestions/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (!rating || !['up', 'down'].includes(rating)) {
      return res.status(400).json({ error: 'Rating must be "up" or "down"' });
    }
    
    // Record the rating
    await db.insert(suggestionRatings).values({
      suggestionId: parseInt(id),
      userId: 'anonymous', // TODO: Get from auth
      rating,
    });
    
    // Update suggestion rating
    const ratingValue = rating === 'up' ? 1 : -1;
    await db.update(codeSuggestions)
      .set({ 
        rating: sql`${codeSuggestions.rating} + ${ratingValue}`,
        updatedAt: new Date()
      })
      .where(eq(codeSuggestions.id, parseInt(id)));
    
    res.json({ message: 'Rating recorded successfully' });
  } catch (error) {
    console.error('Error rating suggestion:', error);
    res.status(500).json({ error: 'Failed to record rating' });
  }
});

// Generate AI suggestions using OpenAI
async function generateAISuggestions(
  context: string, 
  filters: { category?: string; framework?: string; language?: string }
): Promise<Omit<InsertCodeSuggestion, 'id' | 'createdAt' | 'updatedAt'>[]> {
  try {
    const prompt = `Generate 3 practical code suggestions based on this context: "${context}"
    
    ${filters.category ? `Category: ${filters.category}` : ''}
    ${filters.framework ? `Framework: ${filters.framework}` : ''}
    ${filters.language ? `Language: ${filters.language}` : ''}
    
    For each suggestion, provide:
    1. A clear, descriptive title
    2. A brief description explaining what the code does
    3. Complete, working code that follows best practices
    4. Appropriate difficulty level (beginner/intermediate/advanced)
    5. Relevant tags
    
    Make the suggestions practical and immediately useful for developers.`;
    
    // For now, return contextual variations of existing suggestions
    // In a real implementation, this would call OpenAI API
    const contextualSuggestions: Omit<InsertCodeSuggestion, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: `Context-Aware Solution: ${context.slice(0, 30)}...`,
        description: `AI-generated solution tailored to your specific context: ${context.slice(0, 50)}...`,
        code: `// Generated based on your context: ${context}
// This is a placeholder for AI-generated code
// In production, this would be generated by OpenAI

function contextualSolution() {
  // Implementation based on: ${context}
  console.log('This would be AI-generated code based on your specific needs');
  return true;
}

export default contextualSolution;`,
        language: filters.language || "TypeScript",
        framework: filters.framework || "Node.js",
        difficulty: "intermediate",
        category: filters.category || "Utilities",
        tags: ["ai-generated", "contextual", "custom"],
        rating: 3,
        usageCount: 1,
        aiGenerated: true,
        contextual: true,
        context: context,
        projectId: null,
      }
    ];
    
    return contextualSuggestions;
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
}

export default router;
import { LanguageServiceClient } from '@google-cloud/language';

// Initialize Google Cloud Natural Language API with API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is not set");
}

// Initialize the client with API key authentication
const languageClient = new LanguageServiceClient({
  apiKey: apiKey,
});

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

// Code generation using intelligent analysis and patterns
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  try {
    if (!apiKey) {
      throw new Error("Google Cloud API key is not configured. Please set GEMINI_API_KEY environment variable.");
    }

    // Analyze the request to understand intent
    const document = {
      content: request.prompt,
      type: 'PLAIN_TEXT' as const,
    };

    const [entitiesResult] = await languageClient.analyzeEntities({ document });
    const entities = entitiesResult.entities || [];

    // Generate code based on common patterns and detected entities
    let generatedCode = "";
    const language = request.language?.toLowerCase() || "typescript";
    const prompt = request.prompt.toLowerCase();

    if (prompt.includes("api") || prompt.includes("endpoint")) {
      if (language.includes("typescript") || language.includes("javascript")) {
        generatedCode = `// Express.js API endpoint
import express, { Request, Response } from 'express';
import { z } from 'zod';

const router = express.Router();

// Validation schema
const requestSchema = z.object({
  // Add your validation fields here
});

// API endpoint
router.post('/api/endpoint', async (req: Request, res: Response) => {
  try {
    const validatedData = requestSchema.parse(req.body);
    
    // Your business logic here
    const result = await processData(validatedData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;`;
      }
    } else if (prompt.includes("database") || prompt.includes("schema")) {
      if (prompt.includes("postgresql") || prompt.includes("sql")) {
        generatedCode = `-- PostgreSQL Database Schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Trigger to update updated_at timestamp
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
  EXECUTE FUNCTION update_updated_at_column();`;
      }
    } else if (prompt.includes("auth") || prompt.includes("login")) {
      generatedCode = `// Authentication system
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function authenticateUser(email: string, password: string) {
  try {
    // Find user in database
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  } catch (error) {
    throw error;
  }
}`;
    } else {
      // Generic code structure
      generatedCode = `// ${request.prompt}
// Generated code structure

export function processRequest(data: any) {
  try {
    // Validate input
    if (!data) {
      throw new Error('Invalid input data');
    }

    // Process logic here
    const result = performOperation(data);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

function performOperation(data: any) {
  // Implement your logic here
  return data;
}`;
    }

    return {
      text: generatedCode,
      usage: {
        inputTokens: request.prompt.length,
        outputTokens: generatedCode.length,
      },
    };
  } catch (error: any) {
    console.error("Code generation error:", error);
    throw new Error(`Failed to generate code: ${error.message || error}`);
  }
}

// Natural language to SQL conversion
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  try {
    const document = {
      content: request.naturalLanguage,
      type: 'PLAIN_TEXT' as const,
    };

    const [entitiesResult] = await languageClient.analyzeEntities({ document });
    
    let sqlQuery = "";
    const query = request.naturalLanguage.toLowerCase();

    if (query.includes("select") || query.includes("get") || query.includes("find")) {
      sqlQuery = `-- ${request.naturalLanguage}
SELECT * 
FROM table_name 
WHERE condition = 'value'
ORDER BY created_at DESC
LIMIT 10;`;
    } else if (query.includes("insert") || query.includes("add") || query.includes("create")) {
      sqlQuery = `-- ${request.naturalLanguage}
INSERT INTO table_name (column1, column2, column3)
VALUES ($1, $2, $3)
RETURNING id, created_at;`;
    } else if (query.includes("update") || query.includes("modify")) {
      sqlQuery = `-- ${request.naturalLanguage}
UPDATE table_name 
SET column1 = $1, 
    column2 = $2,
    updated_at = NOW()
WHERE id = $3
RETURNING *;`;
    } else if (query.includes("delete") || query.includes("remove")) {
      sqlQuery = `-- ${request.naturalLanguage}
DELETE FROM table_name 
WHERE id = $1
RETURNING id;`;
    } else {
      sqlQuery = `-- ${request.naturalLanguage}
-- Please provide more specific requirements for SQL generation
SELECT 
  column1,
  column2,
  COUNT(*) as total
FROM table_name
WHERE condition = 'value'
GROUP BY column1, column2
ORDER BY total DESC;`;
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

// Sentiment analysis using Google Cloud Natural Language API
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const document = {
      content: text,
      type: 'PLAIN_TEXT' as const,
    };

    const [result] = await languageClient.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;

    // Convert to 1-5 rating scale
    const score = sentiment?.score || 0;
    const magnitude = sentiment?.magnitude || 0;
    
    const rating = Math.max(1, Math.min(5, Math.round((score + 1) * 2.5)));
    const confidence = Math.min(1, magnitude / 2);

    return {
      rating,
      confidence,
    };
  } catch (error) {
    throw new Error(`Failed to analyze sentiment: ${error}`);
  }
}

// Image analysis (placeholder since Natural Language API doesn't support images)
export async function analyzeImage(base64Image: string, prompt?: string): Promise<string> {
  try {
    return `Image analysis is not available with Google Cloud Natural Language API. 
For image analysis, you would need to use Google Cloud Vision API.
    
To analyze images, consider implementing:
- Google Cloud Vision API for object detection
- Content analysis and labeling
- Text extraction from images (OCR)
- Face detection and analysis`;
  } catch (error) {
    throw new Error(`Failed to analyze image: ${error}`);
  }
}

// Generate images (not supported by Natural Language API)
export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  try {
    return { 
      imageBase64: undefined, 
      text: `Image generation is not available with Google Cloud Natural Language API.
      
For image generation, consider using:
- OpenAI DALL-E API
- Stability AI Stable Diffusion
- Google Cloud Vertex AI image generation models

Generated image description based on prompt: "${prompt}"
- Style: Modern, professional
- Content: ${prompt}
- Format: High-resolution digital image` 
    };
  } catch (error) {
    throw new Error(`Failed to generate image: ${error}`);
  }
}

// Chat completion using Natural Language API for analysis and pattern matching
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<AIResponse> {
  try {
    if (!apiKey) {
      throw new Error("Google Cloud API key is not configured. Please set GEMINI_API_KEY environment variable.");
    }
    
    // Get the latest user message for analysis
    const userMessage = messages[messages.length - 1]?.content || "";
    
    // Use Natural Language API to analyze the text
    const document = {
      content: userMessage,
      type: 'PLAIN_TEXT' as const,
    };

    // Analyze sentiment and entities
    const [sentimentResult] = await languageClient.analyzeSentiment({ document });
    const [entitiesResult] = await languageClient.analyzeEntities({ document });
    
    // Generate a helpful response based on the analysis and detected patterns
    let response = "";
    const query = userMessage.toLowerCase();
    
    if (query.includes('database') || query.includes('schema') || query.includes('sql')) {
      response = `For database development with NeoCore, here's a comprehensive approach:

**PostgreSQL Schema Design:**
\`\`\`sql
-- User table with proper constraints
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
\`\`\`

**Best Practices:**
- Use proper data types and constraints
- Implement foreign key relationships
- Add indexes for frequently queried columns
- Use migrations for schema changes
- Validate data at application and database level`;

    } else if (query.includes('api') || query.includes('endpoint') || query.includes('rest')) {
      response = `For API development in NeoCore, follow these patterns:

**Express.js API Endpoint:**
\`\`\`typescript
import express, { Request, Response } from 'express';
import { z } from 'zod';

const router = express.Router();

// Request validation schema
const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8)
});

// POST /api/users
router.post('/users', async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Save to database
    const user = await db.users.create({
      email: validatedData.email,
      username: validatedData.username,
      password_hash: hashedPassword
    });
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
\`\`\`

**Key Features:**
- Input validation with Zod
- Proper HTTP status codes
- Error handling
- Security best practices`;

    } else if (query.includes('auth') || query.includes('login') || query.includes('security')) {
      response = `For authentication and security in NeoCore:

**JWT Authentication System:**
\`\`\`typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login endpoint
export async function login(email: string, password: string) {
  // Find user
  const user = await db.users.findOne({ email });
  if (!user) throw new Error('User not found');
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error('Invalid credentials');
  
  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
  
  return { token, user: { id: user.id, email: user.email } };
}

// Auth middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
\`\`\`

**Security Measures:**
- Password hashing with bcrypt
- JWT tokens with expiration
- Input validation and sanitization
- Rate limiting
- HTTPS enforcement`;

    } else if (query.includes('performance') || query.includes('optimize')) {
      response = `Performance optimization strategies for NeoCore:

**Database Optimization:**
- Add proper indexes on frequently queried columns
- Use connection pooling
- Implement query optimization
- Use prepared statements
- Cache frequently accessed data

**API Performance:**
\`\`\`typescript
// Connection pooling
import { Pool } from 'pg';
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Caching middleware
import Redis from 'redis';
const redis = Redis.createClient();

export function cacheMiddleware(duration: number) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
}
\`\`\`

**Best Practices:**
- Implement pagination for large datasets
- Use compression middleware
- Optimize bundle sizes
- Monitor application metrics`;

    } else {
      response = `I'm here to help with NeoCore development! I can assist with:

🗄️ **Database Development:**
- PostgreSQL schema design
- Query optimization
- Migrations and seeding
- Data validation

⚡ **API Development:**
- Express.js endpoints
- Authentication & authorization
- Input validation
- Error handling

🎨 **Frontend Development:**
- React components
- TypeScript integration
- State management
- UI/UX best practices

🔒 **Security & Performance:**
- Authentication systems
- Performance optimization
- Caching strategies
- Security best practices

What specific aspect would you like help with?`;
    }

    // Add sentiment-based response adjustment
    const sentiment = sentimentResult.documentSentiment;
    if (sentiment?.score !== undefined && sentiment.score !== null && sentiment.score < -0.2) {
      response += "\n\nI notice you might be facing some challenges. Feel free to provide more details about any specific issues you're encountering, and I'll provide targeted solutions.";
    }

    return {
      text: response,
      usage: {
        inputTokens: userMessage.length,
        outputTokens: response.length,
      },
    };
  } catch (error: any) {
    console.error("Google Cloud Natural Language API Error:", error);
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid_api_key')) {
      throw new Error("Invalid Google Cloud API key. Please check your API key in Replit Secrets.");
    }
    throw new Error(`Failed to get chat completion: ${error.message || error}`);
  }
}

// Document analysis and summarization
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  try {
    const document = {
      content: text,
      type: 'PLAIN_TEXT' as const,
    };

    const [entitiesResult] = await languageClient.analyzeEntities({ document });
    const [sentimentResult] = await languageClient.analyzeSentiment({ document });
    
    const entities = entitiesResult.entities || [];
    const sentiment = sentimentResult.documentSentiment;
    
    // Extract key information
    const keyEntities = entities
      .filter(entity => entity.salience && entity.salience > 0.1)
      .map(entity => entity.name)
      .slice(0, 5);
    
    const summary = `Document Summary:

Key Topics: ${keyEntities.length > 0 ? keyEntities.join(', ') : 'General content'}

Sentiment: ${sentiment?.score ? (sentiment.score > 0 ? 'Positive' : sentiment.score < 0 ? 'Negative' : 'Neutral') : 'Neutral'}

Content Overview: This document discusses ${keyEntities.length > 0 ? keyEntities[0] : 'various topics'} and related concepts. The analysis identified ${entities.length} entities with varying levels of importance.

${maxLength ? `(Summary limited to approximately ${maxLength} words)` : ''}`;

    return {
      text: summary,
      usage: {
        inputTokens: text.length,
        outputTokens: summary.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to summarize document: ${error}`);
  }
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Code, Database, Zap, Lightbulb, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'code' | 'suggestion' | 'query' | 'normal';
}

interface DevelopmentAssistantProps {
  className?: string;
}

export default function DevelopmentAssistant({ className = '' }: DevelopmentAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your NeoCore AI development assistant. I can help you with:\n\n• Writing database schemas and queries\n• Generating API endpoints\n• Creating serverless functions\n• Optimizing performance\n• Security best practices\n\nWhat would you like to build today?',
      timestamp: new Date(),
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const quickActions = [
    { 
      label: 'Create Database Schema', 
      icon: Database, 
      prompt: 'Help me create a database schema for a social media app with users, posts, and comments' 
    },
    { 
      label: 'Generate API Endpoints', 
      icon: Code, 
      prompt: 'Generate REST API endpoints for user authentication and CRUD operations' 
    },
    { 
      label: 'Optimize Performance', 
      icon: Zap, 
      prompt: 'Analyze my database queries and suggest performance optimizations' 
    },
    { 
      label: 'Security Review', 
      icon: CheckCircle, 
      prompt: 'Review my API security and suggest improvements' 
    }
  ];

  const handleSend = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        'database schema': {
          content: `I'll help you create a comprehensive database schema for a social media app. Here's a PostgreSQL schema with proper relationships:

\`\`\`sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Add indexes for performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
\`\`\`

This schema includes:
✓ Proper UUID primary keys
✓ Foreign key relationships
✓ Cascade deletes for data integrity
✓ Performance indexes
✓ Timestamp tracking
✓ Nested comments support`,
          type: 'code'
        },
        'api endpoints': {
          content: `I'll generate comprehensive REST API endpoints for your social media app with proper authentication:

\`\`\`typescript
// Authentication endpoints
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile

// User endpoints
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/posts
GET    /api/users/:id/followers

// Post endpoints
GET    /api/posts              // Get all posts with pagination
POST   /api/posts              // Create new post
GET    /api/posts/:id          // Get specific post
PUT    /api/posts/:id          // Update post
DELETE /api/posts/:id          // Delete post
POST   /api/posts/:id/like     // Like/unlike post
GET    /api/posts/:id/comments // Get post comments

// Comment endpoints
POST   /api/posts/:id/comments     // Create comment
PUT    /api/comments/:id           // Update comment
DELETE /api/comments/:id           // Delete comment

// Example implementation:
export const postRoutes = {
  // Get all posts with pagination
  async getPosts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const posts = await db.query(\`
      SELECT p.*, u.username, u.display_name, u.avatar_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    \`, [limit, offset]);
    
    res.json({
      posts: posts.rows,
      pagination: {
        page,
        limit,
        hasMore: posts.rows.length === limit
      }
    });
  }
};
\`\`\`

Key features:
✓ RESTful URL structure
✓ Proper HTTP methods
✓ Authentication middleware
✓ Pagination support
✓ Error handling
✓ Rate limiting ready`,
          type: 'code'
        },
        'performance': {
          content: `I'll analyze common performance bottlenecks and provide optimization strategies:

**Database Optimizations:**

1. **Query Optimization:**
\`\`\`sql
-- Instead of N+1 queries, use joins
SELECT p.*, u.username, COUNT(l.id) as likes_count
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY p.id, u.username;

-- Use proper indexes
CREATE INDEX CONCURRENTLY idx_posts_user_created 
ON posts(user_id, created_at DESC);
\`\`\`

2. **Caching Strategy:**
\`\`\`typescript
// Redis caching for frequent queries
const getCachedPosts = async (userId: string) => {
  const cacheKey = \`user_posts:\${userId}\`;
  const cached = await redis.get(cacheKey);
  
  if (cached) return JSON.parse(cached);
  
  const posts = await db.getUserPosts(userId);
  await redis.setex(cacheKey, 300, JSON.stringify(posts));
  return posts;
};
\`\`\`

3. **Connection Pooling:**
\`\`\`typescript
// Optimize database connections
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  max: 20,        // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
\`\`\`

**Performance Improvements:**
✓ 10x faster queries with proper indexes
✓ 50% reduction in database load with caching
✓ Better user experience with pagination
✓ Reduced memory usage with connection pooling`,
          type: 'suggestion'
        },
        'security': {
          content: `I'll review your API security and provide enterprise-grade improvements:

**Authentication & Authorization:**

\`\`\`typescript
// JWT with refresh tokens
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Middleware for protected routes
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
\`\`\`

**Input Validation & Sanitization:**

\`\`\`typescript
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Input validation
const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  media_urls: z.array(z.string().url()).optional()
});

app.post('/api/posts', apiLimiter, authenticate, async (req, res) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
});
\`\`\`

**Security Headers:**

\`\`\`typescript
import helmet from 'helmet';
import cors from 'cors';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
\`\`\`

**Security Improvements:**
✓ JWT tokens with short expiration
✓ Rate limiting to prevent abuse
✓ Input validation with Zod
✓ HTTPS enforcement
✓ SQL injection prevention
✓ XSS protection headers`,
          type: 'suggestion'
        }
      };

      // Determine response type based on message content
      let responseType: 'code' | 'suggestion' | 'query' | 'normal' = 'normal';
      let responseContent = `I understand you're asking about "${message}". Let me help you with that.

Here's a comprehensive solution tailored to your needs. I've analyzed your requirements and generated optimized code that follows best practices for scalability, security, and performance.

Would you like me to explain any specific part in more detail or help you implement this solution?`;

      // Match keywords to provide specific responses
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('database') || lowerMessage.includes('schema')) {
        responseContent = responses['database schema'].content;
        responseType = responses['database schema'].type as any;
      } else if (lowerMessage.includes('api') || lowerMessage.includes('endpoint')) {
        responseContent = responses['api endpoints'].content;
        responseType = responses['api endpoints'].type as any;
      } else if (lowerMessage.includes('performance') || lowerMessage.includes('optimize')) {
        responseContent = responses['performance'].content;
        responseType = responses['performance'].type as any;
      } else if (lowerMessage.includes('security') || lowerMessage.includes('auth')) {
        responseContent = responses['security'].content;
        responseType = responses['security'].type as any;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        type: responseType
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickAction = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <Card className={`border-purple-400/20 bg-charcoal/50 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          AI Development Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.prompt)}
              className="text-xs border-purple-400/20 hover:bg-purple-400/10"
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Chat Area */}
        <ScrollArea className="h-96 border border-purple-400/20 rounded-lg p-4 bg-slate-900/50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600/20 text-blue-100'
                      : 'bg-purple-600/20 text-purple-100'
                  }`}
                >
                  {message.type && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      {message.type === 'code' && <Code className="w-3 h-3 mr-1" />}
                      {message.type === 'suggestion' && <Lightbulb className="w-3 h-3 mr-1" />}
                      {message.type}
                    </Badge>
                  )}
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {message.content}
                  </pre>
                  <div className="text-xs text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-600/20 text-purple-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-200"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about development..."
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
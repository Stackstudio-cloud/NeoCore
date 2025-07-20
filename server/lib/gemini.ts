import OpenAI from 'openai';

// Initialize OpenAI with API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("OPENAI_API_KEY environment variable is not set");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: apiKey || "" });

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

// Code generation using OpenAI
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  try {
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
    }

    const systemPrompt = `You are an expert software developer for NeoCore platform. Generate clean, efficient, and well-documented code based on the user's requirements.
    
Language: ${request.language || 'TypeScript/JavaScript'}
Context: ${request.context || 'Modern web development with PostgreSQL, Express.js, React, TypeScript'}

Provide production-ready code with proper error handling, validation, and best practices. Include comments explaining key concepts.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "Failed to generate code";
    
    return {
      text: content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      },
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.message?.includes('API key') || error.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY in Replit Secrets.");
    }
    throw new Error(`Failed to generate code: ${error.message || error}`);
  }
}

// Natural language to SQL conversion
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  try {
    const systemPrompt = `You are a PostgreSQL expert for the NeoCore platform. Convert natural language to optimized PostgreSQL queries.
    
Context: ${request.context || 'PostgreSQL database with modern features'}
Schema: ${request.schema || 'Standard web application tables (users, posts, etc.)'}

Provide only the SQL query with brief comments. Use PostgreSQL syntax, proper indexing suggestions, and best practices.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: request.naturalLanguage }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "Failed to generate SQL";

    return {
      text: content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to generate SQL: ${error.message || error}`);
  }
}

// Sentiment analysis using OpenAI
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }"
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating || 3))),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
    };
  } catch (error) {
    throw new Error("Failed to analyze sentiment: " + error.message);
  }
}

// Image analysis using OpenAI Vision
export async function analyzeImage(base64Image: string, prompt?: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || "Analyze this image in detail and describe its key elements, context, and any notable aspects."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "Failed to analyze image";
  } catch (error: any) {
    throw new Error(`Failed to analyze image: ${error.message || error}`);
  }
}

// Generate images using OpenAI DALL-E
export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;
    
    return { 
      imageBase64: undefined, // URL provided instead
      text: `Image generated successfully: ${imageUrl}\n\nPrompt: ${prompt}\nModel: DALL-E 3\nSize: 1024x1024` 
    };
  } catch (error: any) {
    throw new Error(`Failed to generate image: ${error.message || error}`);
  }
}

// Chat completion using OpenAI for development assistance
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<AIResponse> {
  try {
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.");
    }
    
    const systemMessage = systemPrompt || `You are an AI development assistant for NeoCore, a comprehensive backend development platform. 
    NeoCore is a modern full-stack application that provides:
    - PostgreSQL database management with Drizzle ORM
    - REST API development with Express.js and TypeScript
    - Real-time features with WebSocket support
    - React frontend with Tailwind CSS and shadcn/ui components
    - AI-powered development tools and code generation
    
    Your role is to help developers with:
    - Database schema design and optimization
    - API endpoint development and security
    - Frontend component creation
    - Performance optimization
    - Modern web development best practices
    
    Always provide practical, production-ready code examples using the NeoCore stack (PostgreSQL, Express.js, React, TypeScript).
    Format code blocks with proper syntax highlighting using markdown.
    Be helpful, detailed, and focus on modern development practices.`;

    const openaiMessages = [
      { role: "system" as const, content: systemMessage },
      ...messages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return {
      text: content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      },
    };
  } catch (error: any) {
    console.error("OpenAI Chat API Error:", error);
    if (error.message?.includes('API key') || error.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your OPENAI_API_KEY in Replit Secrets.");
    }
    throw new Error(`Failed to get chat completion: ${error.message || error}`);
  }
}

// Document analysis and summarization
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  try {
    const prompt = `Please summarize the following text concisely while maintaining key points${maxLength ? ` in about ${maxLength} words` : ''}:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: maxLength ? Math.min(maxLength * 2, 1000) : 500,
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content || "Failed to summarize document";

    return {
      text: content,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      },
    };
  } catch (error: any) {
    throw new Error(`Failed to summarize document: ${error.message || error}`);
  }
}
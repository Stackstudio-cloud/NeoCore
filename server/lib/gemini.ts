import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

// Code generation using Gemini
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  try {
    const systemPrompt = `You are an expert software developer. Generate clean, efficient, and well-documented code based on the user's requirements.
    
Language: ${request.language || 'TypeScript/JavaScript'}
Context: ${request.context || 'Modern web development'}

Provide only the code with minimal explanation. Use best practices and modern syntax.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: request.prompt,
    });

    return {
      text: response.text || "Failed to generate code",
      usage: {
        inputTokens: 0, // Gemini doesn't provide detailed token usage
        outputTokens: 0,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate code: ${error}`);
  }
}

// Natural language to SQL conversion
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  try {
    const systemPrompt = `You are a SQL expert. Convert natural language queries to SQL statements.
    
Database Schema: ${request.schema || 'Standard PostgreSQL schema'}
Context: ${request.context || 'PostgreSQL database with modern features'}

Provide only the SQL query without explanation. Use PostgreSQL syntax and best practices.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: request.naturalLanguage,
    });

    return {
      text: response.text || "Failed to generate SQL",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  } catch (error) {
    throw new Error(`Failed to generate SQL: ${error}`);
  }
}

// Text analysis and sentiment
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  try {
    const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: {'rating': number, 'confidence': number}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            rating: { type: "number" },
            confidence: { type: "number" },
          },
          required: ["rating", "confidence"],
        },
      },
      contents: text,
    });

    const result = JSON.parse(response.text || '{"rating": 3, "confidence": 0.5}');
    return {
      rating: Math.max(1, Math.min(5, Math.round(result.rating))),
      confidence: Math.max(0, Math.min(1, result.confidence)),
    };
  } catch (error) {
    throw new Error(`Failed to analyze sentiment: ${error}`);
  }
}

// Image analysis using Gemini's multimodal capabilities
export async function analyzeImage(imageBase64: string, prompt?: string): Promise<AIResponse> {
  try {
    const contents = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
      prompt || "Analyze this image in detail and describe its key elements, context, and any notable aspects.",
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    return {
      text: response.text || "Failed to analyze image",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  } catch (error) {
    throw new Error(`Failed to analyze image: ${error}`);
  }
}

// Generate images using Gemini 2.0 Flash
export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return { text: "Failed to generate image" };
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      return { text: "Failed to generate image" };
    }

    let imageBase64: string | undefined;
    let text = "";

    for (const part of content.parts) {
      if (part.text) {
        text += part.text;
      } else if (part.inlineData && part.inlineData.data) {
        imageBase64 = part.inlineData.data;
      }
    }

    return { imageBase64, text };
  } catch (error) {
    throw new Error(`Failed to generate image: ${error}`);
  }
}

// Chat completion for development assistance
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): Promise<AIResponse> {
  try {
    const conversation = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: systemPrompt ? { systemInstruction: systemPrompt } : undefined,
      contents: conversation,
    });

    return {
      text: response.text || "Failed to get response",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  } catch (error) {
    throw new Error(`Failed to get chat completion: ${error}`);
  }
}

// Document analysis and summarization
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  try {
    const prompt = `Please summarize the following text concisely while maintaining key points${maxLength ? ` in about ${maxLength} words` : ''}:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      text: response.text || "Failed to summarize document",
      usage: {
        inputTokens: 0,
        outputTokens: 0,
      },
    };
  } catch (error) {
    throw new Error(`Failed to summarize document: ${error}`);
  }
}
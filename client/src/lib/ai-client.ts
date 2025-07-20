import { apiRequest } from "./queryClient";

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

export interface ImageAnalysisRequest {
  imageBase64: string;
  prompt?: string;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  systemPrompt?: string;
}

// Generate code using OpenAI
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/ai/generate-code", request);
  return response.json();
}

// Convert natural language to SQL
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/ai/generate-sql", request);
  return response.json();
}

// Analyze sentiment of text
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  const response = await apiRequest("POST", "/api/ai/analyze-sentiment", { text });
  return response.json();
}

// Analyze images with OpenAI Vision
export async function analyzeImage(request: ImageAnalysisRequest): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/ai/analyze-image", request);
  return response.json();
}

// Generate images using DALL-E
export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  const response = await apiRequest("POST", "/api/ai/generate-image", { prompt });
  return response.json();
}

// Chat completion for development assistance
export async function chatCompletion(request: ChatRequest): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/ai/chat", request);
  return response.json();
}

// Summarize documents and text
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  const response = await apiRequest("POST", "/api/ai/summarize", { text, maxLength });
  return response.json();
}

// Helper function to convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Helper to validate API key is configured
export function isAIConfigured(): boolean {
  // This will be checked on the server side, but we can show appropriate UI
  return true; // Always show AI features, let server handle validation
}
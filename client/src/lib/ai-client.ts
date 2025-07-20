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

// Generate code using Gemini AI
export async function generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
  return apiRequest("POST", "/api/ai/generate-code", request);
}

// Convert natural language to SQL
export async function generateSQL(request: SQLGenerationRequest): Promise<AIResponse> {
  return apiRequest("POST", "/api/ai/generate-sql", request);
}

// Analyze sentiment of text
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  return apiRequest("POST", "/api/ai/analyze-sentiment", { text });
}

// Analyze images with Gemini's multimodal capabilities
export async function analyzeImage(request: ImageAnalysisRequest): Promise<AIResponse> {
  return apiRequest("POST", "/api/ai/analyze-image", request);
}

// Generate images using Gemini 2.0 Flash
export async function generateImage(prompt: string): Promise<{ imageBase64?: string; text: string }> {
  return apiRequest("POST", "/api/ai/generate-image", { prompt });
}

// Chat completion for development assistance
export async function chatCompletion(request: ChatRequest): Promise<AIResponse> {
  return apiRequest("POST", "/api/ai/chat", request);
}

// Summarize documents and text
export async function summarizeDocument(text: string, maxLength?: number): Promise<AIResponse> {
  return apiRequest("POST", "/api/ai/summarize", { text, maxLength });
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
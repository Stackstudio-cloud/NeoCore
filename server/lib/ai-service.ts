import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { AI_ASSISTANTS, type AIAssistant } from "@shared/ai-assistants";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

const genai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateResponse(
    assistantId: string,
    messages: ChatMessage[],
    userContext?: any
  ): Promise<string> {
    const assistant = AI_ASSISTANTS[assistantId];
    if (!assistant) {
      throw new Error('Assistant not found');
    }

    // Prepare messages with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: this.buildSystemPrompt(assistant, userContext),
    };

    const conversationMessages = [systemMessage, ...messages];

    try {
      if (assistant.model === 'gpt-4o-mini') {
        return await this.generateOpenAIResponse(conversationMessages);
      } else if (assistant.model === 'gemini-2.5-flash') {
        return await this.generateGeminiResponse(conversationMessages);
      } else {
        throw new Error('Unsupported model');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private async generateOpenAIResponse(messages: ChatMessage[]): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages.map(msg => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  }

  private async generateGeminiResponse(messages: ChatMessage[]): Promise<string> {
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    
    // Format conversation for Gemini
    const conversationText = userMessages.map(msg => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationText}\n\nAssistant:`;

    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    return response.text || "Sorry, I couldn't generate a response.";
  }

  private buildSystemPrompt(assistant: AIAssistant, userContext?: any): string {
    let prompt = assistant.systemPrompt;

    // Add context about the NeoCore platform
    prompt += `\n\nYou are specifically working within the NeoCore platform, which is built with:
- Frontend: React with TypeScript, Tailwind CSS, Vite
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- Real-time: WebSocket integration
- UI Components: Radix UI with shadcn/ui

When providing code examples or suggestions, prioritize solutions that work well with this tech stack.`;

    // Add user context if available
    if (userContext) {
      prompt += `\n\nUser Context:
- Tier: ${userContext.tier || 'free'}
- Recent Projects: ${userContext.recentProjects || 'None'}
- Preferences: ${JSON.stringify(userContext.preferences || {})}`;
    }

    // Add specific guidance based on assistant type
    switch (assistant.id) {
      case 'frontend':
        prompt += `\n\nFocus on React best practices, TypeScript patterns, responsive design with Tailwind CSS, and modern UI/UX principles.`;
        break;
      case 'backend':
        prompt += `\n\nFocus on Express.js patterns, RESTful API design, database schema design with Drizzle ORM, and backend security.`;
        break;
      case 'security':
        prompt += `\n\nPrioritize security best practices for web applications, authentication, authorization, and data protection.`;
        break;
      case 'database':
        prompt += `\n\nFocus on PostgreSQL optimization, Drizzle ORM usage, schema design, and query performance.`;
        break;
    }

    return prompt;
  }

  async generateTitle(messages: ChatMessage[]): Promise<string> {
    if (messages.length === 0) return "New Conversation";

    const firstUserMessage = messages.find(m => m.role === 'user')?.content || "";
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: 'system',
            content: 'Generate a concise title (max 50 characters) for this conversation based on the user\'s first message. Focus on the main topic or question.',
          },
          {
            role: 'user',
            content: firstUserMessage,
          },
        ],
        temperature: 0.5,
        max_tokens: 20,
      });

      return response.choices[0]?.message?.content?.trim() || "Development Discussion";
    } catch (error) {
      console.error('Title generation error:', error);
      return "Development Discussion";
    }
  }
}

export const aiService = AIService.getInstance();
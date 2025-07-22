import { Router } from "express";
import { aiService, type ChatMessage } from "../lib/ai-service";
import { storage } from "../storage";

const router = Router();

// Get user's AI conversations
router.get('/conversations', async (req, res) => {
  try {
    // For demo purposes, we'll use a mock user ID
    const userId = 'demo-user';
    
    // Mock conversations data
    const conversations = [
      {
        id: '1',
        assistantType: 'general',
        title: 'Setting up a new project',
        messages: [
          {
            id: '1',
            role: 'user' as const,
            content: 'How do I set up a new React project with TypeScript?',
            timestamp: new Date()
          },
          {
            id: '2',
            role: 'assistant' as const,
            content: 'I\'ll help you set up a new React project with TypeScript. Here are the steps...',
            timestamp: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// Get specific conversation
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock conversation data
    const conversation = {
      id,
      assistantType: 'general',
      title: 'Development Discussion',
      messages: [
        {
          id: '1',
          role: 'user' as const,
          content: 'Can you help me with React state management?',
          timestamp: new Date()
        },
        {
          id: '2',
          role: 'assistant' as const,
          content: 'Absolutely! I\'d be happy to help with React state management. There are several approaches depending on your needs...',
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
});

// Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const { assistantType } = req.body;
    
    // Create new conversation
    const conversation = {
      id: Date.now().toString(),
      assistantType,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

// Send message to AI assistant
router.post('/chat', async (req, res) => {
  try {
    const { assistantType, message, conversationId } = req.body;

    if (!assistantType || !message) {
      return res.status(400).json({ message: 'Assistant type and message are required' });
    }

    // Prepare conversation history
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: message,
        timestamp: new Date()
      }
    ];

    // Generate AI response
    const aiResponse = await aiService.generateResponse(assistantType, messages);

    // Mock response for now
    const response = {
      message: aiResponse,
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date()
    };

    res.json(response);
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Failed to process AI request' });
  }
});

export default router;
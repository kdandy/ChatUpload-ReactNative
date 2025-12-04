import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.model = null;
    this.genAI = null;
    this.chatHistory = [];
    this.initialize();
  }

  initialize() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      console.log('Initializing Gemini with key:', apiKey ? 'Present' : 'Missing');
      
      if (!apiKey) {
        console.error('❌ Gemini API key is missing in .env file');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash', // Latest stable model (Nov 2025)
        generationConfig: {
          temperature: 0.7,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
        systemInstruction: `You are UNDIP AI Assistant, a helpful and knowledgeable AI assistant for Universitas Diponegoro (UNDIP).

Your personality:
- Professional yet friendly and approachable
- Expert in academic topics, general knowledge, and helpful advice
- Clear, concise, and accurate in responses
- Supportive and encouraging to students and users

Guidelines:
- Provide accurate, helpful, and well-structured responses
- Use proper grammar and clear language (Indonesian or English based on user's language)
- Keep responses informative but concise (2-4 paragraphs max unless asked for more detail)
- When uncertain, be honest and suggest where users might find more information
- Be respectful and maintain a professional tone

Respond naturally as a knowledgeable assistant representing UNDIP.`,
      });
      
      console.log('✅ Gemini initialized successfully with gemini-2.5-flash');
    } catch (error) {
      console.error('❌ Error initializing Gemini:', error);
    }
  }

  // Check if message is question for AI - Always return true (no restrictions)
  isAIQuestion(message) {
    // Always respond to all messages
    return true;
  }

  // Clean message from AI prefix
  cleanMessage(message) {
    // Remove common AI prefixes if present
    return message
      .replace(/^(ai|gemini|bot|@ai|@gemini)[\s:,]+/i, '')
      .trim();
  }

  // Send message to Gemini AI
  async sendMessage(userMessage, conversationHistory = [], imageUrl = null) {
    try {
      if (!this.model) {
        console.error('❌ Gemini model not initialized');
        throw new Error('Gemini model not initialized. Check API key.');
      }

      // Clean message
      const cleanedMessage = this.cleanMessage(userMessage);
      
      console.log('📤 Sending to Gemini:', cleanedMessage);
      if (imageUrl) {
        console.log('🖼️ With image:', imageUrl);
      }

      // Create chat session with history (limit to last 5 for context)
      const recentHistory = conversationHistory.slice(-5);
      
      // Convert history to Gemini format (text only for now)
      let geminiHistory = recentHistory.map(msg => {
        const parts = [];
        
        // Add text if available
        if (msg.text) {
          parts.push({ text: msg.text });
        }
        
        // For images, add description instead of inline data (needs base64 conversion)
        if (msg.imageUrl && !msg.text) {
          parts.push({ text: '[User sent an image]' });
        }
        
        return {
          role: msg.isAI ? 'model' : 'user',
          parts: parts.length > 0 ? parts : [{ text: '' }],
        };
      });
      
      // Ensure first message is from user (Gemini API requirement)
      if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        // Remove first message if it's from AI
        geminiHistory = geminiHistory.slice(1);
      }
      
      const chat = this.model.startChat({
        history: geminiHistory,
      });

      // Prepare message parts (text only)
      const messageParts = [];
      
      if (cleanedMessage) {
        messageParts.push({ text: cleanedMessage });
      }
      
      // For images, add text description (full image support needs base64 conversion)
      if (imageUrl) {
        const imageText = cleanedMessage 
          ? `\n[Image: ${imageUrl}]` 
          : 'Please describe what you see in this image.';
        messageParts[0] = { text: (cleanedMessage || '') + `\n[User sent an image but image analysis is not yet implemented]` };
      }

      // Send message
      const result = await chat.sendMessage(messageParts.length > 0 ? messageParts : cleanedMessage);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Gemini response received:', text.substring(0, 100) + '...');

      return {
        success: true,
        text: text,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      
      // Handle specific errors
      if (error.message?.includes('API key')) {
        return {
          success: false,
          text: 'Maaf, konfigurasi AI belum lengkap. Silakan hubungi admin.',
          error: 'API_KEY_ERROR',
        };
      }

      if (error.message?.includes('quota')) {
        return {
          success: false,
          text: 'Maaf, quota API sudah habis. Silakan coba lagi nanti.',
          error: 'QUOTA_ERROR',
        };
      }

      return {
        success: false,
        text: 'Maaf, saya tidak dapat menjawab sekarang. Silakan coba lagi.',
        error: error.message,
      };
    }
  }

  // Generate AI response for chat
  async generateResponse(message, chatHistory = [], imageUrl = null) {
    try {
      // Filter relevant history (last 10 messages)
      const recentHistory = chatHistory.slice(-10).map(msg => ({
        text: msg.message || msg.text,
        isAI: msg.isAI || false,
        imageUrl: msg.imageUrl || null,
      }));

      const result = await this.sendMessage(message, recentHistory, imageUrl);
      return result;
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        success: false,
        text: 'Terjadi kesalahan. Silakan coba lagi.',
        error: error.message,
      };
    }
  }

  // Check if Gemini is available
  isAvailable() {
    return !!this.model;
  }
}

export default new GeminiService();

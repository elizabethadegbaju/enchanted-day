import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';

// Function URL for the chat Lambda function
const CHAT_FUNCTION_URL = 'https://hernhoqiybuiqii5mdbanjfk7i0phxft.lambda-url.eu-central-1.on.aws/'; // Live URL
//const CHAT_FUNCTION_URL = 'https://vemsd2ncob4thoqrvxay7jsede0vwjgf.lambda-url.eu-central-1.on.aws/'; // Sandbox URL

interface ChatRequest {
  prompt: string;
  wedding_id?: string;
  type?: 'chat' | 'guest_inquiry' | 'optimization' | 'negotiation' | 'vendor_coordination';
  context?: Record<string, unknown>;
  stream?: boolean; // Add streaming flag
}

interface ChatResponse {
  response: string;
  data?: Record<string, unknown>;
  suggestions?: Array<{ label: string; path: string }>;
}

interface StreamingChatResponse {
  type: 'start' | 'content' | 'thinking' | 'end' | 'error';
  content?: string;
  agent?: string;
  suggestions?: Array<{ label: string; path: string }>;
  error?: string;
}

interface StrandsWorkflowResponse<T = unknown> {
  success: boolean;
  data: T;
  analysis?: Record<string, unknown>;
  logistics?: Record<string, unknown>;
  validation?: Record<string, unknown>;
  workflowId?: string;
}

interface StreamingWorkflowChunk {
  type: 'workflow_start' | 'step_complete' | 'workflow_complete' | 'error';
  step?: string;
  data?: Record<string, unknown>;
  progress?: number;
  error?: string;
}

export class ChatService {
  /**
   * Send a message to the Bedrock agent via Lambda function (non-streaming)
   */
  static async sendMessage(prompt: string, weddingId?: string): Promise<string> {
    try {
      const functionUrl = CHAT_FUNCTION_URL;
      
      const payload: ChatRequest = {
        prompt,
        wedding_id: weddingId,
        type: 'chat',
        stream: false // Non-streaming request
      };

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling chat function:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Stream a message to the Bedrock agent via Lambda function
   */
  static async streamMessage(prompt: string, weddingId?: string): Promise<ReadableStream<Uint8Array>> {
    try {
      const functionUrl = CHAT_FUNCTION_URL;
      
      const payload: ChatRequest = {
        prompt,
        wedding_id: weddingId,
        type: 'chat',
        stream: true // Streaming request
      };

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body || new ReadableStream();
    } catch (error) {
      console.error('Error streaming chat function:', error);
      throw new Error('Failed to stream AI response');
    }
  }

  /**
   * Stream guest inquiry with AI assistance
   */
  static async streamGuestInquiry(guestId: string, inquiry: string, urgency: string = 'medium'): Promise<ReadableStream<Uint8Array>> {
    try {
      const functionUrl = CHAT_FUNCTION_URL;
      
      const payload: ChatRequest = {
        prompt: `Guest inquiry: ${inquiry}`,
        type: 'guest_inquiry',
        context: { guestId, urgency }
      };

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body || new ReadableStream();
    } catch (error) {
      console.error('Error streaming guest inquiry:', error);
      throw new Error('Failed to stream guest inquiry');
    }
  }

  /**
   * Optimize wedding with AI
   */
  static async optimizeWedding(weddingId: string, goals: { goals: string[] }): Promise<StrandsWorkflowResponse> {
    try {
      const prompt = `Optimize wedding for goals: ${goals.goals.join(', ')}`;
      const response = await this.sendAIRequest(prompt, weddingId, 'optimization', goals);
      
      return {
        success: true,
        data: response.data || {},
        analysis: response.data || {},
        workflowId: `opt_${Date.now()}`
      };
    } catch (error) {
      console.error('Error optimizing wedding:', error);
      throw error;
    }
  }

  /**
   * Negotiate contract with vendor
   */
  static async negotiateContract(vendorId: string, data: {
    weddingId: string;
    terms: Record<string, unknown>;
    budget: number;
  }): Promise<StrandsWorkflowResponse> {
    try {
      const prompt = `Negotiate vendor contract with budget ${data.budget}`;
      const response = await this.sendAIRequest(prompt, data.weddingId, 'negotiation', { vendorId, ...data });
      
      return {
        success: true,
        data: response.data || {},
        analysis: response.data || {},
        workflowId: `neg_${Date.now()}`
      };
    } catch (error) {
      console.error('Error negotiating contract:', error);
      throw error;
    }
  }

  /**
   * Search vendors with AI
   */
  static async searchVendorsWithAI(weddingId: string, criteria: {
    category: string;
    budget: number;
    location: string;
    preferences: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    try {
      const prompt = `Search for ${criteria.category} vendors in ${criteria.location} with budget ${criteria.budget}`;
      const response = await this.sendAIRequest(prompt, weddingId, 'vendor_coordination', criteria);
      
      return {
        success: true,
        data: response.data || {},
        analysis: response.data || {},
        workflowId: `search_${Date.now()}`
      };
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw error;
    }
  }

  /**
   * Coordinate vendors
   */
  static async coordinateVendors(weddingId: string, data: {
    eventDate: string;
    timeline: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    try {
      const prompt = `Coordinate vendors for event on ${data.eventDate}`;
      const response = await this.sendAIRequest(prompt, weddingId, 'vendor_coordination', data);
      
      return {
        success: true,
        data: response.data || {},
        logistics: response.data || {},
        workflowId: `coord_${Date.now()}`
      };
    } catch (error) {
      console.error('Error coordinating vendors:', error);
      throw error;
    }
  }

  /**
   * Stream wedding chat
   */
  static async streamWeddingChat(weddingId: string, message: string): Promise<ReadableStream<Uint8Array>> {
    try {
      const functionUrl = CHAT_FUNCTION_URL;
      
      const payload: ChatRequest = {
        prompt: message,
        wedding_id: weddingId,
        type: 'chat'
      };

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body || new ReadableStream();
    } catch (error) {
      console.error('Error streaming wedding chat:', error);
      throw new Error('Failed to stream wedding chat');
    }
  }

  /**
   * Stream vendor chat
   */
  static async streamVendorChat(vendorId: string, data: {
    message: string;
    weddingId: string;
  }): Promise<ReadableStream<Uint8Array>> {
    try {
      const prompt = `Vendor communication: ${data.message}`;
      return await this.streamWeddingChat(data.weddingId, prompt);
    } catch (error) {
      console.error('Error streaming vendor chat:', error);
      throw error;
    }
  }

  /**
   * Private helper method to send AI requests
   */
  private static async sendAIRequest(
    prompt: string, 
    weddingId: string, 
    type: string, 
    context?: Record<string, unknown>
  ): Promise<ChatResponse> {
    const functionUrl = CHAT_FUNCTION_URL;
    
    const payload: ChatRequest = {
      prompt,
      wedding_id: weddingId,
      type: type as any,
      context
    };

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Utility function to parse streaming JSON responses (moved from api.ts)
export function parseStreamingResponse(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Record<string, unknown>, void, unknown> {
  return (async function* () {
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              yield JSON.parse(data);
            } catch (e) {
              console.warn('Failed to parse streaming data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  })();
}

// Utility for parsing chat streaming responses
export function parseChatStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<StreamingChatResponse, void, unknown> {
  return (async function* () {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('data: ')) {
            try {
              const data = trimmedLine.substring(6); // Remove 'data: '
              if (data === '[DONE]') {
                yield { type: 'end' };
                return;
              }
              const parsed = JSON.parse(data) as StreamingChatResponse;
              yield parsed;
            } catch (parseError) {
              console.error('Error parsing chat SSE data:', parseError);
              yield { 
                type: 'error', 
                error: 'Failed to parse streaming response' 
              };
            }
          }
        }
      }
    } catch (error) {
      console.error('Error reading chat stream:', error);
      yield { 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Stream reading failed' 
      };
    } finally {
      reader.releaseLock();
    }
  })();
}

// Utility for parsing Strands streaming responses (moved from api.ts)
export function parseStrandsStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<StreamingWorkflowChunk, void, unknown> {
  return (async function* () {
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              yield JSON.parse(data) as StreamingWorkflowChunk;
            } catch (e) {
              console.warn('Failed to parse Strands streaming data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  })();
}

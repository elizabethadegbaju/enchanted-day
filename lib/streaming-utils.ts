import { ChatService, parseChatStream } from './chat-service';
import { parseThinkingContent } from './thinking-utils';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  thinking?: string;
  isStreaming?: boolean;
  timestamp: Date;
  agent?: string;
  actions?: ChatAction[];
  metadata?: Record<string, unknown>;
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'create' | 'update' | 'view';
  data: Record<string, unknown>;
}

/**
 * Centralized streaming chat handler to eliminate duplication
 */
export async function handleStreamingChat(
  userInput: string,
  weddingId: string | undefined,
  options: {
    onUserMessage: (message: ChatMessage) => void;
    onAIMessageStart: (message: ChatMessage) => void;
    onAIMessageUpdate: (messageId: string, updates: Partial<ChatMessage>) => void;
    onComplete: (messageId: string, actions: ChatAction[]) => void;
    onError: (error: string) => void;
    generateActions?: (content: string) => ChatAction[];
  }
): Promise<void> {
  // Add user message
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: userInput,
    timestamp: new Date()
  };
  options.onUserMessage(userMessage);

  try {
    // Create AI message placeholder for streaming
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      thinking: '',
      timestamp: new Date(),
      agent: 'EnchantedDay AI Assistant',
      actions: [],
      isStreaming: true
    };
    
    options.onAIMessageStart(aiMessage);

    // Use streaming for better UX
    const stream = await ChatService.streamMessage(userInput, weddingId);
    const reader = stream.getReader();
    
    let accumulatedContent = '';
    let accumulatedThinking = '';
    
    for await (const chunk of parseChatStream(reader)) {
      if (chunk.type === 'start') {
        continue;
      } else if (chunk.type === 'thinking') {
        accumulatedThinking = chunk.thinking || chunk.content || '';
        
        options.onAIMessageUpdate(aiMessageId, { thinking: accumulatedThinking });
      } else if (chunk.type === 'content') {
        accumulatedContent += chunk.content || '';
        
        // Parse thinking content from accumulated content
        const { thinking, content } = parseThinkingContent(accumulatedContent);
        
        // Update accumulated thinking if found
        if (thinking && thinking !== accumulatedThinking) {
          accumulatedThinking = thinking;
        }
        
        options.onAIMessageUpdate(aiMessageId, {
          content: content,
          thinking: accumulatedThinking
        });
      } else if (chunk.type === 'end') {
        // Parse final content to ensure thinking is separated
        const { thinking, content } = parseThinkingContent(accumulatedContent);
        
        // Generate actions based on final clean content
        const actions = options.generateActions ? options.generateActions(content) : [];
        
        options.onAIMessageUpdate(aiMessageId, {
          content: content,
          thinking: thinking || accumulatedThinking,
          isStreaming: false
        });
        
        options.onComplete(aiMessageId, actions);
        break;
      } else if (chunk.type === 'error') {
        console.error('Streaming error:', chunk.error);
        options.onError(chunk.error || 'Stream processing failed');
        break;
      }
    }
    
  } catch (error) {
    console.error('Failed to get AI response:', error);
    options.onError(error instanceof Error ? error.message : 'Failed to get AI response');
  }
}

/**
 * Generate contextual actions from AI response content
 */
export function generateActionsFromResponse(response: string): ChatAction[] {
  const actions: ChatAction[] = [];
  const lowerResponse = response.toLowerCase();
  
  if (lowerResponse.includes('wedding') || lowerResponse.includes('create')) {
    actions.push({ id: '1', label: 'Create Wedding', type: 'navigate', data: { path: '/wedding/create' } });
  }
  if (lowerResponse.includes('dashboard') || lowerResponse.includes('overview')) {
    actions.push({ id: '2', label: 'View Dashboard', type: 'navigate', data: { path: '/dashboard' } });
  }
  if (lowerResponse.includes('vendor')) {
    actions.push({ id: '3', label: 'Manage Vendors', type: 'navigate', data: { path: '/vendors' } });
  }
  if (lowerResponse.includes('guest')) {
    actions.push({ id: '4', label: 'Manage Guests', type: 'navigate', data: { path: '/guests' } });
  }
  if (lowerResponse.includes('budget')) {
    actions.push({ id: '5', label: 'View Budget', type: 'navigate', data: { path: '/budget' } });
  }
  if (lowerResponse.includes('timeline')) {
    actions.push({ id: '6', label: 'View Timeline', type: 'navigate', data: { path: '/timeline' } });
  }
  
  return actions;
}
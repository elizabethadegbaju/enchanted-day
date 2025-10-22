import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://main.d1ujq8601qbdi5.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, x-amz-user-agent',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Max-Age': '86400'
  };

  try {
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    let requestBody;
    try {
      requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    const isStreamingRequest = requestBody.stream === true;
    const client = new BedrockAgentCoreClient({ region: "eu-central-1" });
    
    const requestType = requestBody.type || 'chat';
    let prompt = requestBody.prompt || event.prompt;
    
    switch (requestType) {
      case 'guest_inquiry':
        prompt = `GUEST INQUIRY: ${prompt}. Context: ${JSON.stringify(requestBody.context || {})}`;
        break;
      case 'optimization':
        prompt = `WEDDING OPTIMIZATION: ${prompt}. Goals: ${JSON.stringify(requestBody.context?.goals || [])}`;
        break;
      case 'negotiation':
        prompt = `VENDOR NEGOTIATION: ${prompt}. Terms: ${JSON.stringify(requestBody.context || {})}`;
        break;
      case 'vendor_coordination':
        prompt = `VENDOR COORDINATION: ${prompt}. Details: ${JSON.stringify(requestBody.context || {})}`;
        break;
      default:
        prompt = `CHAT: ${prompt}. Context: ${JSON.stringify(requestBody.context || {})}`;
        break;
    }
    
    const payload = {
      prompt,
      wedding_id: requestBody.wedding_id || event.wedding_id,
      type: requestType,
      context: requestBody.context || {}
    };
    
    if (!payload.prompt) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }
    
    const input = {
      runtimeSessionId: requestBody.sessionId || `session_${Date.now()}`,
      agentRuntimeArn: "arn:aws:bedrock-agentcore:eu-central-1:911167904324:runtime/agents_orchestrator-tWEBsUEND5",
      qualifier: "DEFAULT",
      payload: new TextEncoder().encode(JSON.stringify(payload)),
      // Add streaming configuration if supported
      ...(isStreamingRequest && { enableStreaming: true })
    };

    console.log('Invoking Bedrock agent with payload:', JSON.stringify({
      ...input,
      payload: JSON.stringify(payload)
    }));

    const command = new InvokeAgentRuntimeCommand(input);
    const response = await client.send(command);

    if (isStreamingRequest) {
      // For now, use enhanced fallback streaming since we need to properly handle the response type
      const textResponse = response.response ? 
        (response.response as any).transformToString ? 
          await (response.response as any).transformToString() : 
          "No response received" 
        : "No response received";
      
      const streamingBody = simulateChunkedStreaming(textResponse);
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
        body: streamingBody,
      };
    } else {
      // Non-streaming response
      const textResponse = response.response ? await response.response.transformToString() : "No response received";
      
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: textResponse }),
      };
    }
  } catch (error) {
    console.error('Lambda function error:', error);
    
    // Handle specific Bedrock model validation errors
    if (error instanceof Error && error.message.includes('ValidationException')) {
      if (error.message.includes('model identifier is invalid')) {
        return {
          statusCode: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            error: 'Bedrock agent model configuration error',
            details: 'The agent is configured with an invalid model identifier. Please update the agent to use a valid Claude model ID.',
            suggestion: 'Valid models: anthropic.claude-3-5-sonnet-20241022-v2:0, anthropic.claude-3-sonnet-20240229-v1:0',
            originalError: error.message
          }),
        };
      }
    }
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error) 
      }),
    };
  }
};

// Handle true async iterator streaming with lifecycle events
async function processRealTimeStream(stream: AsyncIterable<any>): Promise<string> {
  let sseOutput = '';
  let currentToolUse: string | null = null;
  let isThinking = false;
  
  try {
    // Initialize stream
    sseOutput += formatSSEEvent('lifecycle', { type: 'init_stream', agent: 'EnchantedDay AI Assistant' });
    
    for await (const chunk of stream) {
      // Track lifecycle events
      if (chunk.metadata?.eventType) {
        switch (chunk.metadata.eventType) {
          case 'start':
            sseOutput += formatSSEEvent('lifecycle', { type: 'start_cycle' });
            break;
          case 'end':
            sseOutput += formatSSEEvent('lifecycle', { type: 'complete_cycle' });
            break;
        }
      }
      
      // Process content chunks
      if (chunk.chunk?.bytes) {
        const content = new TextDecoder().decode(chunk.chunk.bytes);
        const processedContent = processAIContentStreaming(content);
        
        // Handle thinking state transitions
        if (processedContent.thinkingStart && !isThinking) {
          isThinking = true;
          sseOutput += formatSSEEvent('thinking_start', { content: processedContent.thinkingStart });
        }
        
        if (processedContent.thinkingContent && isThinking) {
          sseOutput += formatSSEEvent('thinking_content', { content: processedContent.thinkingContent });
        }
        
        if (processedContent.thinkingEnd && isThinking) {
          isThinking = false;
          sseOutput += formatSSEEvent('thinking_end', { content: processedContent.thinkingEnd });
        }
        
        // Handle regular content
        if (processedContent.content) {
          sseOutput += formatSSEEvent('content', { content: processedContent.content });
        }
        
        // Handle tool usage
        if (processedContent.toolUse && processedContent.toolUse !== currentToolUse) {
          currentToolUse = processedContent.toolUse;
          sseOutput += formatSSEEvent('tool_use', { name: currentToolUse });
        }
      }
      
      // Handle errors
      if (chunk.error) {
        sseOutput += formatSSEEvent('error', { 
          error: chunk.error.message || 'Stream processing error' 
        });
      }
    }
    
    sseOutput += formatSSEEvent('lifecycle', { type: 'end_stream' });
    return sseOutput;
    
  } catch (error) {
    console.error('Error in real-time stream processing:', error);
    sseOutput += formatSSEEvent('error', { 
      error: 'Real-time stream processing failed',
      details: error instanceof Error ? error.message : String(error)
    });
    return sseOutput;
  }
}

// Simulate chunked streaming from complete text (enhanced fallback)
function simulateChunkedStreaming(text: string): string {
  let sseOutput = '';
  
  // Initialize
  sseOutput += formatSSEEvent('lifecycle', { type: 'init_stream', agent: 'EnchantedDay AI Assistant' });
  sseOutput += formatSSEEvent('lifecycle', { type: 'start_cycle' });
  
  const processedContent = processAIContent(text);
  
  // Handle thinking content with proper lifecycle
  if (processedContent.thinking) {
    sseOutput += formatSSEEvent('thinking_start', { content: '' });
    
    const thinkingChunks = splitIntoChunks(processedContent.thinking, 8);
    for (const chunk of thinkingChunks) {
      sseOutput += formatSSEEvent('thinking_content', { content: chunk });
    }
    
    sseOutput += formatSSEEvent('thinking_end', { content: '' });
  }
  
  // Handle main content with chunking
  if (processedContent.content) {
    const contentChunks = splitIntoChunks(processedContent.content, 6);
    for (const chunk of contentChunks) {
      sseOutput += formatSSEEvent('content', { content: chunk });
    }
  }
  
  sseOutput += formatSSEEvent('lifecycle', { type: 'complete_cycle' });
  sseOutput += formatSSEEvent('lifecycle', { type: 'end_stream' });
  
  return sseOutput;
}

// Enhanced content processing for streaming
function processAIContentStreaming(content: string): {
  thinkingStart?: string;
  thinkingContent?: string; 
  thinkingEnd?: string;
  content?: string;
  toolUse?: string;
} {
  const result: any = {};
  
  // Check for thinking blocks
  const thinkingStartMatch = content.match(/<thinking>/);
  const thinkingEndMatch = content.match(/<\/thinking>/);
  const thinkingContentMatch = content.match(/<thinking>(.*?)<\/thinking>/s);
  
  if (thinkingStartMatch && thinkingStartMatch.index !== undefined) {
    result.thinkingStart = content.substring(0, thinkingStartMatch.index);
  }
  
  if (thinkingEndMatch && thinkingEndMatch.index !== undefined) {
    result.thinkingEnd = content.substring(thinkingEndMatch.index + 11); // Length of </thinking>
  }
  
  if (thinkingContentMatch) {
    result.thinkingContent = thinkingContentMatch[1];
  } else if (content.includes('<thinking>') && !content.includes('</thinking>')) {
    // Ongoing thinking content
    result.thinkingContent = content.replace('<thinking>', '');
  }
  
  // Check for tool usage patterns
  const toolUseMatch = content.match(/Using tool:\s*(\w+)/i);
  if (toolUseMatch) {
    result.toolUse = toolUseMatch[1];
  }
  
  // Extract regular content (non-thinking)
  let mainContent = content.replace(/<thinking>.*?<\/thinking>/gs, '').trim();
  if (mainContent && !thinkingStartMatch && !thinkingEndMatch) {
    result.content = mainContent;
  }
  
  return result;
}

// Standardized SSE event formatting
function formatSSEEvent(type: string, data: any): string {
  const eventData = {
    type,
    timestamp: new Date().toISOString(),
    ...data
  };
  
  return `data: ${JSON.stringify(eventData)}\n\n`;
}

function processAIContent(content: string): { thinking?: string; content?: string } {
  const thinkingRegex = /<thinking>(.*?)<\/thinking>/gs;
  const thinkingMatches = content.match(thinkingRegex);
  
  let thinking: string | undefined;
  let mainContent = content;
  
  if (thinkingMatches) {
    thinking = thinkingMatches
      .map(match => match.replace(/<\/?thinking>/g, '').trim())
      .join(' ');
    
    mainContent = content.replace(thinkingRegex, '').trim();
  }
  
  return {
    thinking,
    content: mainContent || undefined
  };
}

function splitIntoChunks(text: string, wordsPerChunk: number = 10): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk + (i + wordsPerChunk < words.length ? ' ' : ''));
    }
  }
  
  return chunks;
}

function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

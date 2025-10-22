import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  // Common CORS headers to use across all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://main.d1ujq8601qbdi5.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key, x-amz-user-agent',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Max-Age': '86400'
  };

  try {
    // Handle CORS preflight requests
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    // Check if streaming is requested
    const isStreamingRequest = requestBody.stream === true;

    const client = new BedrockAgentCoreClient({ region: "eu-central-1" });
    
    // Build the payload based on request type
    const requestType = requestBody.type || 'chat';
    let prompt = requestBody.prompt || event.prompt;
    
    // Enhance prompt based on request type
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
        // Keep original prompt for general chat
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
      runtimeSessionId: "dfmeoagmreaklgmrkleafremoigrmtesogmtrskhmtkrlshmt",
      agentRuntimeArn:
        "arn:aws:bedrock-agentcore:eu-central-1:911167904324:runtime/agents_orchestrator-OY0OdR5xr5",
      qualifier: "DEFAULT",
      payload: new TextEncoder().encode(JSON.stringify(payload)),
    };

    const command = new InvokeAgentRuntimeCommand(input);
    const response = await client.send(command);

    if (isStreamingRequest) {
      // For streaming requests, we need to handle the response stream properly
      if (!response.response) {
        return {
          statusCode: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'No response stream received' }),
        };
      }

      // Convert the response stream to Server-Sent Events format
      const streamingBody = await convertBedrockStreamToSSE(response.response);
      
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
      // For non-streaming requests, return JSON as before
      const textResponse = response.response ? await response.response.transformToString() : "No response received";
      
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ response: textResponse }),
      };
    }
  } catch (error) {
    console.error('Lambda function error:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error) 
      }),
    };
  }
};

async function convertBedrockStreamToSSE(stream: any): Promise<string> {
  let sseOutput = '';
  
  try {
    // Send start event
    sseOutput += 'data: {"type":"start","agent":"EnchantedDay AI Assistant"}\n\n';
    
    // Read the stream content
    const fullResponse = await stream.transformToString();
    const lines = fullResponse.split('\n').filter((line: string) => line.trim());
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        let content = line.substring(6);
        
        // Remove quotes if present
        if (content.startsWith('"') && content.endsWith('"')) {
          content = content.slice(1, -1);
        }
        
        if (content.trim()) {
          // Process content to extract thinking and main content
          const processedContent = processAIContent(content);
          
          if (processedContent.thinking) {
            sseOutput += `data: {"type":"thinking","content":"${escapeJsonString(processedContent.thinking)}"}\n\n`;
          }
          
          if (processedContent.content) {
            // Split content into smaller chunks for better streaming effect
            const chunks = splitIntoChunks(processedContent.content, 10); // ~10 words per chunk
            
            for (const chunk of chunks) {
              sseOutput += `data: {"type":"content","content":"${escapeJsonString(chunk)}"}\n\n`;
            }
          }
        }
      }
    }
    
    // Send end event
    sseOutput += 'data: {"type":"end"}\n\n';
    
    return sseOutput;
  } catch (error) {
    console.error('Error converting Bedrock stream to SSE:', error);
    sseOutput += `data: {"type":"error","error":"Stream processing failed"}\n\n`;
    return sseOutput;
  }
}

function processAIContent(content: string): { thinking?: string; content?: string } {
  // Extract all thinking blocks
  const thinkingRegex = /<thinking>(.*?)<\/thinking>/gs;
  const thinkingMatches = content.match(thinkingRegex);
  
  let thinking: string | undefined;
  let mainContent = content;
  
  if (thinkingMatches) {
    // Combine all thinking content
    thinking = thinkingMatches
      .map(match => match.replace(/<\/?thinking>/g, '').trim())
      .join(' ');
    
    // Remove all thinking blocks from main content
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

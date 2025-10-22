import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    // Handle CORS preflight requests
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, X-Amz-Date, Authorization, X-Api-Key',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
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
          'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
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
      // For streaming requests, return Server-Sent Events format
      const textResponse = response.response ? await response.response.transformToString() : "No response received";
      
      // Parse the streaming response and convert to SSE format
      const streamingBody = convertToSSEFormat(textResponse);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error) 
      }),
    };
  }
};

function convertToSSEFormat(bedrockResponse: string): string {
  // Parse the Bedrock response which comes in "data: content" format
  const lines = bedrockResponse.split('\n').filter(line => line.trim());
  let sseOutput = '';
  
  // Send start event
  sseOutput += 'data: {"type":"start","agent":"EnchantedDay AI Assistant"}\n\n';
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const content = line.substring(6).replace(/"/g, ''); // Remove 'data: ' and quotes
      if (content.trim()) {
        sseOutput += `data: {"type":"content","content":"${content.replace(/"/g, '\\"')}"}\n\n`;
      }
    }
  }
  
  // Send end event
  sseOutput += 'data: {"type":"end"}\n\n';
  
  return sseOutput;
}

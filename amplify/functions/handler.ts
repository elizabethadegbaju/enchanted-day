import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
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
    const textResponse = response.response ? await response.response.transformToString() : "No response received";

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ response: textResponse }),
    };
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

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
    
    const payload = {
      prompt: requestBody.prompt || event.prompt,
      wedding_id: requestBody.wedding_id || event.wedding_id,
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

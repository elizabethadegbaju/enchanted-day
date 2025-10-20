import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    const client = new BedrockAgentRuntimeClient({ region: "eu-central-1" });
    
    const payload = {
      prompt: event.prompt,
      wedding_id: event.wedding_id,
    };
    
    const input = {
      sessionId: "dfmeoagmreaklgmrkleafremoigrmtesogmtrskhmtkrlshmt",
      agentId: "agents_orchestrator-OY0OdR5xr5",
      agentAliasId: "TSTALIASID",
      inputText: JSON.stringify(payload),
    };

    const command = new InvokeAgentCommand(input);
    const response = await client.send(command);
    
    // Process the response stream
    let textResponse = "";
    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk?.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          textResponse += text;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: textResponse || "No response received" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
    };
  }
};

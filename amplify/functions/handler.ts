import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";
import { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  try {
    const client = new BedrockAgentCoreClient({ region: "eu-central-1" });
    
    const payload = {
      prompt: event.prompt,
      wedding_id: event.wedding_id,
    };
    
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
      body: JSON.stringify({ response: textResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
    };
  }
};

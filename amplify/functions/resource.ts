import { defineFunction } from "@aws-amplify/backend";

export const chat = defineFunction({
  entry: "./handler.ts",
  name: "chat",
  layers: {
    "@aws-sdk/client-bedrock-agentcore": "arn:aws:lambda:eu-central-1:911167904324:layer:layer:1"
  },
  environment: {
    // Add any environment variables needed
  },
  // Add runtime configuration
  runtime: 20,
  timeoutSeconds: 60,
  memoryMB: 512
});

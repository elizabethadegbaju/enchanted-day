import { defineFunction } from "@aws-amplify/backend";

export const chat = defineFunction({
  entry: "./handler.ts",
  name: "chat"
});

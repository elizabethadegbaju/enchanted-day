import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export const orchestratorFunction = defineFunction((scope) => {
  return new lambda.Function(scope, "OrchestratorFunction", {
    runtime: lambda.Runtime.PYTHON_3_11,
    handler: "orchestrator.handler",
    code: lambda.Code.fromAsset("./amplify/functions/src"),
    timeout: Duration.seconds(60),
    memorySize: 1024,
    environment: {
      // Add environment variables here as needed
    },
  });
});

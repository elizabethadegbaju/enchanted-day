import { defineFunction } from "@aws-amplify/backend";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

export const orchestratorFunction = defineFunction((scope) => {
  // Create shared layer
  const sharedLayer = new lambda.LayerVersion(scope, "SharedDependenciesLayer", {
    code: lambda.Code.fromAsset("./amplify/functions/src", {
      bundling: {
        image: lambda.Runtime.PYTHON_3_11.bundlingImage,
        command: [
          "bash",
          "-c",
          "pip install -r requirements.txt -t /asset-output/python --no-cache-dir",
        ],
      },
    }),
    compatibleRuntimes: [lambda.Runtime.PYTHON_3_11],
    description: "Shared Python dependencies for all Lambda functions",
  });

  // Create the function with the layer
  return new lambda.Function(scope, "OrchestratorFunction", {
    runtime: lambda.Runtime.PYTHON_3_11,
    handler: "orchestrator.handler",
    code: lambda.Code.fromAsset("./amplify/functions/src"),
    timeout: Duration.seconds(60),
    memorySize: 1024,
    layers: [sharedLayer],
  });
});

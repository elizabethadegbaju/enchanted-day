import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { Duration, CfnOutput } from 'aws-cdk-lib';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { chat } from './functions/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  chat,
});

// Configure the chat function with proper permissions
backend.chat.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'bedrock:InvokeAgent',
      'bedrock-agent:*',
      'bedrock-agentcore:*',
    ],
    resources: ['*'],
  })
);

// Add Function URL to make it accessible via HTTP
const functionUrl = backend.chat.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE, // Allow public access
  cors: {
    allowCredentials: false,
    allowedHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
    allowedMethods: [HttpMethod.POST],
    allowedOrigins: ['*'],
    maxAge: Duration.days(1), // 24 hours
  },
});

// Export the Function URL
new CfnOutput(backend.chat.stack, 'ChatFunctionUrl', {
  value: functionUrl.url,
  description: 'URL for the chat Lambda function',
});

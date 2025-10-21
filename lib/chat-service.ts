import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';

interface ChatRequest {
  prompt: string;
  wedding_id?: string;
}

interface ChatResponse {
  response: string;
}

export class ChatService {
  /**
   * Send a message to the Bedrock agent via Lambda function
   */
  static async sendMessage(prompt: string, weddingId?: string): Promise<string> {
    try {
      // Get the current Amplify configuration
      const config = Amplify.getConfig();

      // TODO: For now, we'll need to manually construct the function URL
      // This will be available in amplify_outputs.json after deployment
      const functionName = 'chat';
      const region = config.Auth?.Cognito.userPoolClientId ? 
        config.Auth.Cognito.userPoolId.split('_')[0] || 'eu-central-1' : 
        'eu-central-1';

      // TODO: This URL structure will need to be updated based on actual deployment
      const functionUrl = `https://${functionName}.lambda-url.${region}.on.aws/`;
      
      const payload: ChatRequest = {
        prompt,
        wedding_id: weddingId
      };

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling chat function:', error);
      throw new Error('Failed to get AI response');
    }
  }
}

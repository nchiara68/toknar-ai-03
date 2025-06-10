import { a, defineData } from '@aws-amplify/backend';
import type { ClientSchema } from '@aws-amplify/backend';
import { textract } from '../functions/textract/resource';

const schema = a.schema({
  // Define your AI-powered chat conversation
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3 Haiku'),
    systemPrompt: 'You are a helpful assistant',
  }).authorization((allow) => allow.owner()),

  // Define the extractText mutation
  extractText: a
    .mutation()
    .arguments({
      bucket: a.string(), // S3 bucket name
      key: a.string(),    // S3 object key
    })
    .returns(a.string()) // Returns extracted text
    .handler(a.handler.function(textract)) // Connect to textract Lambda
    .authorization((allow) => allow.authenticated()), // ✅ IAM-authenticated users only
});

// Export schema and data binding
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam', // ✅ Use IAM to authorize API calls
  },
});

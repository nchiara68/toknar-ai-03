// amplify/data/resource.ts
import { a, defineData } from '@aws-amplify/backend';
import type { ClientSchema } from '@aws-amplify/backend';

// Define your schema
const schema = a.schema({
  // Keep your existing Todo model
  Todo: a.model({
    content: a.string().required(),
    done: a.boolean().required(),
  })
  .authorization((allow) => [allow.owner()]),

  // Define a conversation data model for document chat
  chat: a.conversation({
    // Use Claude 3 Haiku model
    aiModel: a.ai.model('Claude 3 Haiku'),
    // System prompt will be dynamically updated based on document content
    systemPrompt: `You are a helpful AI assistant that can also answer questions about documents that users have uploaded.

When a user uploads a document, you will receive the extracted text content and should use it to answer their questions.

Instructions:
1. Base your responses primarily on the content from the uploaded document
2. Be specific and cite relevant parts of the document when possible
3. If the question cannot be answered from the document content, clearly state that
4. Be helpful and provide context when explaining concepts from the documents
5. If asked about something not in the document, acknowledge the limitation and offer to help with what is available
6. If no document has been uploaded yet, let the user know they need to upload a document first

Always be accurate and honest about what information is available in the document.`,
  })
  .authorization((allow) => allow.owner()),
});

// Export the schema type
export type Schema = ClientSchema<typeof schema>;

// Export the data configuration
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
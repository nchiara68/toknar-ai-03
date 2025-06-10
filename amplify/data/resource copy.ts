
// amplify/data/resource.ts
import { a, defineData } from '@aws-amplify/backend';
import type { ClientSchema } from '@aws-amplify/backend';
import { textract } from '../functions/textract/resource';

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model('Claude 3 Haiku'),
    systemPrompt: 'You are a helpful assistant',
  }).authorization((allow) => allow.owner()),

  extractText: a
    .mutation()
    .arguments({
      bucket: a.string(),
      key: a.string(),
    })
    .returns(a.string())
    .handler(a.handler.function(textract))
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

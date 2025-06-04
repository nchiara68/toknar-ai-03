import { defineStorage } from '@aws-amplify/backend';

export const uploadBucket = defineStorage({
  name: 'chatbot-uploads',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['get', 'write', 'delete']),
    ],
  }),
});

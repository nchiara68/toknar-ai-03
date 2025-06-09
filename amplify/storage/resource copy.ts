// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';
import { textract } from '../functions/textract/resource';
export const uploadBucket = defineStorage({
  name: 'chatbot-uploads',
  access: (allow) => ({
    'uploads/*': [allow.authenticated.to(['get', 'write', 'delete'])],
  })
});

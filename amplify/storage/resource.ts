// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';
//import { textract } from '../functions/textract/resource';
import { textractHandler } from '../functions/textractHandler/resource';
export const uploadBucket = defineStorage({
  name: 'chatbot-uploads',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['read', 'write']),
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
  }),
  
});


export const storage = defineStorage({
  name: 'documentUploads',
  access: (allow) => ({
    'uploads/*': [allow.authenticated.to(['read', 'write'])],
  }),
  triggers: {
    onUpload: textractHandler,
  }
});
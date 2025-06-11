// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'fileStorage',
  access: (allow) => ({
    'uploads/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'processed/*': [
      allow.authenticated.to(['read']),
    ],
  }),
});
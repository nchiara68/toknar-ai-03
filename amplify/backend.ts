// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const fileProcessor = defineFunction({
  name: 'file-processor',
  entry: './functions/file-processor/handler.ts',
});

export const backend = defineBackend({
  auth,
  data,
  storage,
  fileProcessor,
});
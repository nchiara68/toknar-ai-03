import { defineFunction } from '@aws-amplify/backend';

export const textract = defineFunction({
  name: 'textract',
  entry: './handler.ts',
});

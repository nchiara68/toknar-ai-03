import { defineFunction } from '@aws-amplify/backend';

export const textractHandler = defineFunction({
  entry: './textractHandler.ts',
});

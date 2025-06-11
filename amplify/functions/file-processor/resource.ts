import { defineFunction } from '@aws-amplify/backend';

const fileProcessor = defineFunction({
  name: 'file-processor',
  entry: './handler.ts',
});

export { fileProcessor };
export default fileProcessor;
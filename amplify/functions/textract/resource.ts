// amplify/functions/textract/resource.ts
import { defineFunction } from '@aws-amplify/backend';
//import { handler } from '../textract/handler'; 
export const textract = defineFunction({
  name: 'textract',
  entry: '../textract/handler.ts',
});

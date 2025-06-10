//amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import {uploadBucket} from './storage/resource'; // ✅ Import the module, not just uploadBucket

import { textract } from './functions/textract/resource';
import { textractHandler } from './functions/textractHandler/resource';
export default defineBackend({
  auth,
  data,
  uploadBucket,
  textract, // ✅ Add this line to include the function
  textractHandler,
});

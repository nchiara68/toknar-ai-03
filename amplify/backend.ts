import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import {uploadBucket} from './storage/resource'; // ✅ Import the module, not just uploadBucket

export default defineBackend({
  auth,
  data,
  uploadBucket, // ✅ Register all exports from ./storage/resource
});

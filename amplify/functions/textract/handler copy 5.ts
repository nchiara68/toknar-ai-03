// amplify/functions/textract/handler.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

// Create S3 and Textract clients
const s3 = new S3Client({});
const textract = new TextractClient({});

// Helper to convert a readable stream to a buffer
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// Lambda handler function triggered by custom mutation
export const handler = async ({
  arguments: { bucket, key },
}: {
  arguments: { bucket: string; key: string };
}): Promise<string> => {
  console.log('📥 Mutation received with bucket:', bucket, 'and key:', key);

  if (!bucket || !key) {
    console.error('❌ Missing bucket or key');
    throw new Error('Missing bucket or key');
  }
// ✅ Optional fix: Reject unsupported file types early
  const supportedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff'];
  const fileExtension = key.slice(key.lastIndexOf('.')).toLowerCase();
  if (!supportedExtensions.includes(fileExtension)) {
    const errMsg = `Unsupported file type: ${fileExtension}. Supported types are ${supportedExtensions.join(', ')}`;
    console.error('🚫', errMsg);
    throw new Error(errMsg);
  }

  try {
    // Retrieve file from S3
    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const fileBuffer = await streamToBuffer(response.Body as Readable);
    console.log('📄 Fetched file from S3 - Buffer size:', fileBuffer.length);

    // Send to Textract
    const textractOutput = await textract.send(
      new DetectDocumentTextCommand({
        Document: { Bytes: fileBuffer },
      })
    );
    console.log('🧠 Textract response received');

    // Extract lines of text
    const text =
      textractOutput.Blocks?.filter((block) => block.BlockType === 'LINE')
        .map((block) => block.Text)
        .join('\n') ?? '';

    if (!text || text.trim() === '') {
      console.warn('⚠️ Textract returned no readable lines.');
    } else {
      console.log('📤 Extracted text preview:', text.slice(0, 300));
    }

    return text;
  } catch (err: unknown) {
  if (err instanceof Error) {
    const errorName = (err as { name?: string }).name;
    if (errorName === 'UnsupportedDocumentException') {
      console.error('❌ Textract failed: Unsupported document format. Ensure file is a valid PDF/PNG/JPEG.');
    } else if (errorName === 'AccessDeniedException') {
      console.error('🔒 Textract/S3 access denied. Check IAM permissions.');
    }
    console.error('❌ Textract processing failed:', err.message);
  } else {
    console.error('❌ Unknown error type:', err);
  }
  throw err;
}

};
// This handler function is designed to be used with AWS Amplify's custom mutation
// capabilities, allowing you to trigger text extraction from PDF or TXT files
// uploaded to an S3 bucket. It retrieves the file, processes it with Amazon Textract,
// and returns the extracted text. Ensure your S3 bucket and Textract permissions
// are correctly configured in your Amplify project for this to work seamlessly.
// Make sure to test this handler with various PDF and TXT files to ensure
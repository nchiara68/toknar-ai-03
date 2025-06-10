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
  } catch (err) {
    console.error('❌ Textract processing failed:', err);
    throw err;
  }
};
// This handler function is designed to be used with AWS Amplify's custom mutation
// capabilities, allowing you to trigger text extraction from PDF or TXT files
// uploaded to an S3 bucket. It retrieves the file, processes it with Amazon Textract,
// and returns the extracted text. Ensure your S3 bucket and Textract permissions
// are correctly configured in your Amplify project for this to work seamlessly.
// Make sure to test this handler with various PDF and TXT files to ensure
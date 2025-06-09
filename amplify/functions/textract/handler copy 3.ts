// amplify/functions/textract/handler.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

// Create AWS clients
const s3 = new S3Client({});
const textract = new TextractClient({});

// Stream helper
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// Main Lambda handler
export const handler = async ({
  arguments: { bucket, key },
}: {
  arguments: { bucket: string; key: string };
}): Promise<string> => {
  console.log('📥 Textract Lambda invoked with:', { bucket, key });

  if (!bucket || !key) {
    console.error('❌ Missing bucket or key.');
    throw new Error('Missing bucket or key');
  }

  try {
    const s3Object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    console.log('✅ S3 file fetched.');

    const fileBuffer = await streamToBuffer(s3Object.Body as Readable);
    console.log('📦 File converted to buffer. Size:', fileBuffer.length);

    const textractOutput = await textract.send(
      new DetectDocumentTextCommand({ Document: { Bytes: fileBuffer } })
    );

    console.log('📄 Textract response:', JSON.stringify(textractOutput, null, 2));

    const text =
      textractOutput.Blocks?.filter((block) => block.BlockType === 'LINE')
        .map((block) => block.Text)
        .join('\n') ?? '';

    if (!text) {
      console.warn('⚠️ No text found in Textract output.');
    } else {
      console.log('✅ Text extracted successfully.');
    }

    return text;
  } catch (error) {
    console.error('❌ Textract handler error:', error);
    throw error;
  }
};

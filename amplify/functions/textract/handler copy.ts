import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

// Initialize AWS clients
const s3 = new S3Client({});
const textract = new TextractClient({});

// Convert readable stream to Buffer
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// Lambda handler
export const handler = async ({
  arguments: { bucket, key },
}: {
  arguments: { bucket: string; key: string };
}): Promise<string> => {
  if (!bucket || !key) {
    throw new Error('Missing bucket or key');
  }

  console.log(`Fetching PDF from bucket: ${bucket}, key: ${key}`);

  // Fetch from S3
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const fileBuffer = await streamToBuffer(response.Body as Readable);

  console.log(`PDF size in bytes: ${fileBuffer.length}`);

  // Run Textract
  const textractOutput = await textract.send(
    new DetectDocumentTextCommand({
      Document: { Bytes: fileBuffer },
    })
  );

  console.log('Textract result blocks:', JSON.stringify(textractOutput.Blocks, null, 2));

  // Extract and return lines
  const lines = textractOutput.Blocks?.filter((block) => block.BlockType === 'LINE') ?? [];
  const text = lines.map((block) => block.Text).join('\n');

  if (!text.trim()) {
    console.warn('⚠️ No text extracted from PDF');
  }

  return text;
};

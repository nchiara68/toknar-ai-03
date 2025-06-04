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

// Lambda function handler
export const handler = async ({
  arguments: { bucket, key },
}: {
  arguments: { bucket: string; key: string };
}) => {
  if (!bucket || !key) {
    throw new Error('Missing bucket or key');
  }

  // Fetch file from S3
  const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const fileBuffer = await streamToBuffer(response.Body as Readable);

  // Run Textract to extract text
  const result = await textract.send(
    new DetectDocumentTextCommand({
      Document: { Bytes: fileBuffer },
    })
  );

  // Extract only the lines of text
  const text =
    result.Blocks?.filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join('\n') ?? '';

  return text;
  const textractOutput = await textract.send(
  new DetectDocumentTextCommand({ Document: { Bytes: fileBuffer } })
);

console.log('Textract Blocks:', JSON.stringify(textractOutput.Blocks, null, 2));

};

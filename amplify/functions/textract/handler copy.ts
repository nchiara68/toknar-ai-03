import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

const s3 = new S3Client({});
const textract = new TextractClient({});

// Helper to convert stream to buffer
const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

interface ExtractTextEvent {
  arguments: {
    bucket: string;
    key: string;
  };
}

export const handler = async (event: ExtractTextEvent): Promise<string> => {
  const { bucket, key } = event.arguments;

  if (!bucket || !key) {
    throw new Error('Missing bucket or key.');
  }

  const s3Object = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const fileBuffer = await streamToBuffer(s3Object.Body as Readable);

  const textractOutput = await textract.send(
    new DetectDocumentTextCommand({ Document: { Bytes: fileBuffer } })
  );

  const text =
    textractOutput.Blocks?.filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join('\n') ?? '';

  return text;
};

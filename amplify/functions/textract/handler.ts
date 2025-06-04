import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

const s3 = new S3Client({});
const textract = new TextractClient({ region: 'eu-central-1' });

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

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

  // Run Textract AnalyzeDocument with FORMS and TABLES feature types
  const result = await textract.send(
    new AnalyzeDocumentCommand({
      Document: { Bytes: fileBuffer },
      FeatureTypes: ['TABLES', 'FORMS'],
    })
  );

  // Extract LINE blocks
  const text =
    result.Blocks?.filter((block) => block.BlockType === 'LINE')
      .map((block) => block.Text)
      .join('\n') ?? '';

  console.log('Extracted text:', text);

  return text;
};

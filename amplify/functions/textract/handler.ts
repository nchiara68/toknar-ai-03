// amplify/functions/textract/handler.ts
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

const s3 = new S3Client({});
const textract = new TextractClient({});

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

export const handler = async ({
  arguments: { bucket, key },
}: {
  arguments: { bucket: string; key: string };
}): Promise<string> => {
  console.log('📥 Mutation received with bucket:', bucket, 'and key:', key);

  if (!bucket || !key) {
    throw new Error('Missing bucket or key');
  }

  const fileExtension = key.slice(key.lastIndexOf('.')).toLowerCase();

  const supportedTextractTypes = ['.pdf', '.png', '.jpg', '.jpeg', '.tiff'];
  const supportedTxtTypes = ['.txt'];

  try {
    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const fileBuffer = await streamToBuffer(response.Body as Readable);

    console.log('📄 Fetched file from S3 - Buffer size:', fileBuffer.length);

    if (supportedTxtTypes.includes(fileExtension)) {
      const text = fileBuffer.toString('utf-8');
      console.log('📃 Extracted text from .txt:', text.slice(0, 300));
      return text;
    }

    if (supportedTextractTypes.includes(fileExtension)) {
      const textractOutput = await textract.send(
        new DetectDocumentTextCommand({
          Document: { Bytes: fileBuffer },
        })
      );

      const text =
        textractOutput.Blocks?.filter((b) => b.BlockType === 'LINE')
          .map((b) => b.Text)
          .join('\n') ?? '';

      console.log('🧠 Textract processed file. Preview:', text.slice(0, 300));
      return text || '⚠️ No text found in document.';
    }

    const msg = `❌ Unsupported file type: ${fileExtension}`;
    console.error(msg);
    throw new Error(msg);
  }  catch (err: unknown) {
  if (err instanceof Error) {
    const errorName = (err as { name?: string }).name;
    if (errorName === 'UnsupportedDocumentException') {
      console.error('❌ Textract failed: Unsupported document format.');
    } else if (errorName === 'AccessDeniedException') {
      console.error('🔒 Access denied. Check IAM permissions.');
    }
    console.error('❌ Error:', err.message);
  } else {
    console.error('❌ Unknown error:', err);
  }
  throw err;
}

};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { Readable } from 'stream';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body ?? '{}');
    const { bucket, key } = body;

    if (!bucket || !key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing bucket or key in request body.' }),
      };
    }

    const s3 = new S3Client({});
    const textract = new TextractClient({});

    // Helper function to convert a stream to a buffer
    const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    };

    // Get the file from S3
    const getObject = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const fileBuffer = await streamToBuffer(getObject.Body as Readable);

    // Run Textract to extract text
    const textractOutput = await textract.send(
      new DetectDocumentTextCommand({
        Document: { Bytes: fileBuffer },
      })
    );

    // Combine lines into a single string
    const text = textractOutput.Blocks?.filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n') ?? '';

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (error: unknown) {
    console.error('Textract error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing file with Textract.' }),
    };
  }
};

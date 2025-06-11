// amplify/functions/file-processor/handler.ts
import { S3Event, S3Handler } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

// Use require with eslint disable for pdf-parse
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

// Simple PDF parsing function
async function parsePDF(buffer: Uint8Array): Promise<{ text: string }> {
  try {
    // Convert Uint8Array to Buffer for pdf-parse compatibility
    const nodeBuffer = Buffer.from(buffer);
    return await pdfParse(nodeBuffer);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export const handler: S3Handler = async (event: S3Event) => {
  console.log('Processing S3 event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    
    console.log(`Processing file: ${key} from bucket: ${bucket}`);

    try {
      // Get the uploaded file
      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
      
      const response = await s3Client.send(getObjectCommand);
      
      // Convert stream to buffer using transformToByteArray
      const fileBytes = await response.Body?.transformToByteArray();
      
      if (!fileBytes) {
        throw new Error('Failed to read file content');
      }

      let extractedText = '';
      const fileName = key.split('/').pop() || '';
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      // Extract content based on file type
      if (fileExtension === 'pdf') {
        const pdfData = await parsePDF(fileBytes);
        extractedText = pdfData.text;
      } else if (fileExtension === 'txt') {
        extractedText = new TextDecoder('utf-8').decode(fileBytes);
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      // Create result object
      const result = {
        originalFile: key,
        fileName: fileName,
        fileType: fileExtension,
        extractedText: extractedText,
        extractedAt: new Date().toISOString(),
        wordCount: extractedText.split(/\s+/).length,
      };

      // Save extracted content to processed folder
      const processedKey = key.replace('uploads/', 'processed/').replace(/\.[^/.]+$/, '.json');
      
      const putObjectCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: processedKey,
        Body: JSON.stringify(result, null, 2),
        ContentType: 'application/json',
      });

      await s3Client.send(putObjectCommand);
      
      console.log(`Successfully processed ${key} -> ${processedKey}`);
      
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
      
      // Save error information
      const errorKey = key.replace('uploads/', 'processed/').replace(/\.[^/.]+$/, '.error.json');
      const errorResult = {
        originalFile: key,
        error: error instanceof Error ? error.message : 'Unknown error',
        processedAt: new Date().toISOString(),
      };
      
      const putErrorCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: errorKey,
        Body: JSON.stringify(errorResult, null, 2),
        ContentType: 'application/json',
      });

      await s3Client.send(putErrorCommand);
    }
  }
};
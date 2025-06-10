// src/server/textract-test.ts
import fs from 'fs';
import path from 'path';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';

// Initialize the Textract client
const textract = new TextractClient({ region: 'eu-central-1' });

// Function to run Textract on a local PDF file
async function runTextract(filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);
  const fileBuffer = fs.readFileSync(absolutePath);

  const command = new DetectDocumentTextCommand({
    Document: { Bytes: fileBuffer },
  });

  try {
    const response = await textract.send(command);

    const lines = response.Blocks?.filter((b) => b.BlockType === 'LINE')
      .map((b) => b.Text)
      .join('\n');

    console.log('📝 Extracted Text:\n', lines || '[No text found]');
  } catch (err) {
    console.error('❌ Textract error:', err);
  }
}

// Replace with your actual file path
runTextract('./server/2023 Audited Financials AG.pdf');

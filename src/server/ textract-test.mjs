// textract-test.mjs
import fs from 'fs';
import { TextractClient, DetectDocumentTextCommand } from '@aws-sdk/client-textract';

const textract = new TextractClient({ region: 'eu-central-1' }); // Your region

async function runTextract(filePath) {
  const fileBuffer = fs.readFileSync(filePath);

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

// 🧪 Run it with your local file
await runTextract('./2023 Audited Financials AG.pdf');

//import React from 'react';
import PdfTxtFileUploader02 from '../components/PdfTxtFileUploader02';
console.log('✅ Page 4 has been invoked');
export default function UploadPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Document Upload & Textract</h1>
      <p>Upload a PDF or TXT file. It will be stored in S3 and processed by AWS Textract automatically.</p>
      <PdfTxtFileUploader02 />
    </main>
  );
}

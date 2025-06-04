// src/pages/UploadPage.tsx
//import React from 'react';
import { PdfTxtFileUploader } from '../components/PdfTxtFileUploader';

const UploadPage = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload PDF or TXT File</h1>
      <PdfTxtFileUploader />
    </div>
  );
};

export default UploadPage;

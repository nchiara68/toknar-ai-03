//src/components/PdfTxtFileUploader02.tsx
import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
console.log('✅ PdfTxtFileUploader02 has been called');
export default function PdfTxtFileUploader02() {
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage(null);

    try {
      const result = await uploadData({
        path: `uploads/${file.name}`,
        data: file,
      }).result;

      setMessage(`✅ Upload successful! File path: ${result.path}`);
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('Upload failed:', err.message);
    setMessage(`❌ Upload failed: ${err.message}`);
  } else {
    console.error('Upload failed:', err);
    setMessage('❌ Upload failed due to an unknown error.');
  }
}
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || undefined)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{ marginLeft: '1rem' }}
      >
        {uploading ? 'Uploading...' : 'Upload & Start Textract'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
console.log('✅ PdfTxtFileUploader02 has been executed');
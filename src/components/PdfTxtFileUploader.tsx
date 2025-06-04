import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { useState } from 'react';

const client = generateClient<Schema>();

export const PdfTxtFileUploader = () => {
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-semibold">Upload PDF or TXT file</h2>

      <FileUploader
        acceptedFileTypes={['application/pdf', 'text/plain']}
        path="uploads/"
        maxFileCount={1}
        isResumable
        onUploadSuccess={async ({ key }) => {
          try {
            setStatus('File uploaded. Extracting text...');
            const response = await client.mutations.extractText({
              bucket: 'chatbot-uploads', // ✅ your storage name
              key,                       // ✅ the uploaded file key (e.g., 'uploads/file.pdf')
            });

            console.log('Extracted text:', response);
            setStatus(`Extracted text:\n\n${response}`);
          } catch (error) {
            console.error('Error extracting text:', error);
            setStatus('Error extracting text.');
          }
        }}
      />

      {status && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {status}
        </div>
      )}
    </div>
  );
};

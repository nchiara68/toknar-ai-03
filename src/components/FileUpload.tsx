// src/components/FileUpload.tsx
import React, { useState } from 'react';
import { uploadData, list, getUrl } from 'aws-amplify/storage';
import { DocumentChat } from './DocumentChat';

interface ProcessedFile {
  originalFile: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  extractedAt: string;
  wordCount: number;
}

interface FileUploadProps {
  onFileProcessed?: (result: ProcessedFile) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setError('Please select a PDF or TXT file.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      // Upload file with timestamp to avoid conflicts
      const timestamp = Date.now();
      const fileName = `${timestamp}-${selectedFile.name}`;
      const key = `uploads/${fileName}`;

      await uploadData({
        key,
        data: selectedFile,
        options: {
          contentType: selectedFile.type,
        },
      });

      console.log('File uploaded successfully:', key);
      setUploading(false);
      setProcessing(true);

      // Poll for processed result
      await pollForResult(key);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const pollForResult = async (uploadedKey: string) => {
    const processedKey = uploadedKey.replace('uploads/', 'processed/').replace(/\.[^/.]+$/, '.json');
    const errorKey = uploadedKey.replace('uploads/', 'processed/').replace(/\.[^/.]+$/, '.error.json');
    
    const maxAttempts = 30; // 30 attempts with 2-second intervals = 1 minute
    let attempts = 0;

    const poll = async () => {
      attempts++;
      
      try {
        // Check if processing is complete
        const files = await list({
          prefix: processedKey,
          options: {
            listAll: true,
          },
        });

        if (files.items.length > 0) {
          // Get the processed result
          const url = await getUrl({ key: processedKey });
          const response = await fetch(url.url.toString());
          const processedResult: ProcessedFile = await response.json();
          
          setResult(processedResult);
          setProcessing(false);
          setShowChat(true); // Show chat interface when processing is complete
          onFileProcessed?.(processedResult);
          return;
        }

        // Check for error file
        const errorFiles = await list({
          prefix: errorKey,
          options: {
            listAll: true,
          },
        });

        if (errorFiles.items.length > 0) {
          const errorUrl = await getUrl({ key: errorKey });
          const errorResponse = await fetch(errorUrl.url.toString());
          const errorResult = await errorResponse.json();
          
          setError(`Processing failed: ${errorResult.error}`);
          setProcessing(false);
          return;
        }

        // Continue polling if not found and under max attempts
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          setError('Processing timeout. Please try again.');
          setProcessing(false);
        }
        
      } catch (err) {
        console.error('Polling error:', err);
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setError('Failed to check processing status.');
          setProcessing(false);
        }
      }
    };

    setTimeout(poll, 2000); // Start polling after 2 seconds
  };

  const reset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setUploading(false);
    setProcessing(false);
    setShowChat(false);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Document Content Extractor</h2>
      
      {!result && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF or Text File
            </label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileSelect}
              disabled={uploading || processing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {selectedFile && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || processing}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload and Extract'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {processing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            <p className="text-blue-700">Processing your file... This may take a few moments.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Extraction Complete!</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>File:</strong> {result.fileName}</p>
              <p><strong>Type:</strong> {result.fileType.toUpperCase()}</p>
              <p><strong>Word Count:</strong> {result.wordCount.toLocaleString()}</p>
              <p><strong>Processed:</strong> {new Date(result.extractedAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="font-semibold text-gray-800 mb-2">Extracted Content:</h4>
            <div className="max-h-64 overflow-y-auto bg-white p-3 rounded border text-sm text-gray-700">
              <pre className="whitespace-pre-wrap font-mono">{result.extractedText}</pre>
            </div>
          </div>

          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Upload Another File
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {showChat ? 'Hide Chat' : 'Chat About Document'}
          </button>
        </div>
      )}
      </div>

      {/* Chat Interface */}
      {showChat && result && (
        <DocumentChat
          documentInfo={{
            fileName: result.fileName,
            fileType: result.fileType,
            wordCount: result.wordCount,
            extractedAt: result.extractedAt,
            extractedText: result.extractedText,
          }}
        />
      )}
    </div>
  );
};
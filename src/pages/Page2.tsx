// src/pages/DocumentAnalyzer.tsx
import React, { useState } from 'react';
import { 
  Card, 
  Heading, 
  Text, 
  Button, 
  Alert, 
  Flex, 
  View,
  Divider,
  Grid
} from '@aws-amplify/ui-react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { list, getUrl } from 'aws-amplify/storage';
import { DocumentChat } from '../components/DocumentChat';

interface ProcessedFile {
  originalFile: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  extractedAt: string;
  wordCount: number;
}

export const DocumentAnalyzer: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadSuccess = async (event: { key?: string }) => {
    if (!event.key) {
      setError('Upload succeeded but no file key was provided');
      setUploading(false);
      return;
    }
    
    console.log('File uploaded successfully:', event.key);
    setUploading(false);
    setProcessing(true);
    setError(null);
    
    // Poll for processed result
    await pollForResult(event.key);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setError('Upload failed: ' + error);
    setUploading(false);
  };

  const handleUploadStart = () => {
    setUploading(true);
    setError(null);
    setResult(null);
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
    setResult(null);
    setError(null);
    setProcessing(false);
    setUploading(false);
  };

  return (
    <View padding="1rem">
      <Flex direction="column" alignItems="center">
        
        {/* Header */}
        <View textAlign="center" marginBottom="2rem">
          <Heading level={1} marginBottom="0.5rem">
            Document AI Analyzer
          </Heading>
          <Text variation="secondary">
            Upload a PDF or text file and chat with AI about its content
          </Text>
        </View>

        {/* Upload Section */}
        {!result && (
          <Card width="100%" maxWidth="600px" marginBottom="1rem">
            <Heading level={3} marginBottom="1rem">
              Upload Document
            </Heading>
            
            <FileUploader
              acceptedFileTypes={['.pdf', '.txt']}
              path="uploads/"
              maxFileCount={1}
              maxFileSize={10485760} // 10MB
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              onUploadStart={handleUploadStart}
            />

            {/* Upload Status */}
            {uploading && (
              <Alert variation="info" marginTop="1rem">
                <Heading level={4}>Uploading your document...</Heading>
                <Text>Please wait while we upload your file.</Text>
              </Alert>
            )}

            {/* Processing Status */}
            {processing && (
              <Alert variation="info" marginTop="1rem">
                <Heading level={4}>Processing your document...</Heading>
                <Text>This may take a few moments depending on file size.</Text>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variation="error" marginTop="1rem" isDismissible onDismiss={() => setError(null)}>
                <Heading level={4}>Error</Heading>
                <Text>{error}</Text>
              </Alert>
            )}
          </Card>
        )}

        {/* Results Section */}
        {result && (
          <View width="100%">
            {/* Document Summary */}
            <Card marginBottom="1rem">
              <Flex justifyContent="space-between" alignItems="flex-start">
                <View flex="1">
                  <Heading level={3} marginBottom="1rem">
                    Document Processed Successfully
                  </Heading>
                  
                  <Grid templateColumns="1fr 1fr" gap="1rem">
                    <View>
                      <Text variation="secondary">File:</Text>
                      <Text fontWeight="bold">{result.fileName}</Text>
                    </View>
                    <View>
                      <Text variation="secondary">Type:</Text>
                      <Text fontWeight="bold">{result.fileType.toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text variation="secondary">Words:</Text>
                      <Text fontWeight="bold">{result.wordCount.toLocaleString()}</Text>
                    </View>
                    <View>
                      <Text variation="secondary">Processed:</Text>
                      <Text fontWeight="bold">{new Date(result.extractedAt).toLocaleDateString()}</Text>
                    </View>
                  </Grid>
                </View>
                
                <Button onClick={reset} variation="link" size="small">
                  Upload New Document
                </Button>
              </Flex>
            </Card>

            <Divider marginBottom="1rem" />

            {/* Chat Interface */}
            <DocumentChat
              documentInfo={{
                fileName: result.fileName,
                fileType: result.fileType,
                wordCount: result.wordCount,
                extractedAt: result.extractedAt,
                extractedText: result.extractedText,
              }}
            />
          </View>
        )}
      </Flex>
    </View>
  );
};
export default DocumentAnalyzer;
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from '../AIclient';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';

const client = generateClient<Schema>();
import { getCurrentUser } from 'aws-amplify/auth';

const user = await getCurrentUser();
console.log('✅ Logged in user:', user);

function ChatReact() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const chat = useAIConversation('chat');
  const messages = chat[0].data.messages;
  const sendMessage = chat[1];

  const handleUpload = async ({ key }: { key?: string }) => {
  console.log('📥 Upload success callback triggered with key:', key);

  if (!key) {
    console.warn('⚠️ No file key provided. Aborting.');
    return;
  }

  try {
    console.log('🔐 Fetching current user...');
    const user = await getCurrentUser();
    console.log('✅ Logged in user:', user);

    setUploadStatus('📤 Uploading and extracting text...');
    console.log('📡 Calling extractText mutation with:', {
      bucket: 'chatbot-uploads',
      key,
    });

    const extracted = await client.mutations.extractText({
      bucket: 'chatbot-uploads',
      key,
    });

    console.log('📄 extractText response:', extracted);

    setUploadStatus('✅ Text extracted. Sending to chat...');

    if (extracted.data) {
      console.log('📨 Sending extracted text to AI chat...');
      await sendMessage({
        content: [{ text: extracted.data }],
      });
      console.log('✅ Text sent to chat successfully.');
      setUploadStatus('💬 Text sent to chat.');
    } else {
      console.warn('⚠️ extractText returned no data.');
      setUploadStatus('⚠️ No text extracted from file.');
    }
  } catch (err) {
    console.error('❌ Error during extractText mutation or message send:', err);
    setUploadStatus('❌ Error extracting or sending text.');

    // Optional: Log stack trace for deeper debugging
    if (err instanceof Error) {
      console.error('🧵 Stack trace:', err.stack);
    }
  }
};


  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Inquiry our AI engine</h2>

      {/* ✅ File Upload Component */}
      <div className="p-4 bg-gray-50 rounded-xl shadow space-y-2">
        <h3 className="text-md font-medium">Upload PDF or TXT</h3>
        <FileUploader
          acceptedFileTypes={['application/pdf', 'text/plain']}
          path="uploads/"
          maxFileCount={1}
          isResumable
          onUploadSuccess={handleUpload}
        />
        {uploadStatus && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{uploadStatus}</p>
        )}
      </div>

      {/* ✅ AI Chat Component */}
      <AIConversation messages={messages} handleSendMessage={sendMessage} />
    </main>
  );
}

export default ChatReact;

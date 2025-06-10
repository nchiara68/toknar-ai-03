import { AIConversation } from '@aws-amplify/ui-react-ai';
import { useAIConversation } from '../AIclient';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';


const client = generateClient<Schema>();
// then call
//await client.mutations.extractText({ bucket, key });
console.log('✅ Available mutations:', Object.keys(client.mutations));

function ChatReact() {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const chat = useAIConversation('chat');
  const messages = chat[0].data.messages;
  const sendMessage = chat[1];

  const handleUpload = async ({ key }: { key?: string }) => {
    if (!key) return;

    try {
      // Optional: Check current auth user before calling mutation
      const user = await getCurrentUser();
      console.log('✅ Logged in user:', user);

      setUploadStatus('📤 Uploading and extracting text...');

      const extracted = await client.mutations.extractText({
        bucket: 'chatbot-uploads', // Change if needed
        key,
      });

      setUploadStatus('✅ Text extracted. Sending to chat...');

      if (extracted.data) {
        await sendMessage({
          content: [{ text: extracted.data }],
        });
        setUploadStatus('💬 Text sent to chat.');
      } else {
        setUploadStatus('⚠️ No text extracted from file.');
      }
    } catch (err) {
      console.error('❌ Error during extractText mutation:', err);
      setUploadStatus('❌ Error extracting or sending text.');
    }
  };

  return (
    <main className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Inquiry our AI engine</h2>

      {/* File Upload Section */}
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

      {/* AI Chat */}
      <AIConversation messages={messages} handleSendMessage={sendMessage} />
    </main>
  );
}

export default ChatReact;

// src/components/DocumentChat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

type Subscription = { unsubscribe: () => void };

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DocumentChatProps {
  documentInfo?: {
    fileName: string;
    fileType: string;
    wordCount: number;
    extractedAt: string;
    extractedText: string;
  };
}

export const DocumentChat: React.FC<DocumentChatProps> = ({ documentInfo }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [conversation, setConversation] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = useCallback(async () => {
    if (!documentInfo) return;

    try {
      setIsLoading(true);
      
      // Create a new conversation
      const newConversation = await client.conversations.chat.create();

      if (newConversation.data) {
        setConversation(newConversation.data);

        // Subscribe to streaming responses and store the subscription
        setSubscription(newConversation.data.onStreamEvent({
          next: (event) => {
            if (event.contentBlockDeltaIndex !== undefined && event.text) {
              // Handle streaming text from assistant
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                
                if (lastMessage && lastMessage.role === 'assistant' && lastMessage.id === 'streaming') {
                  // Update existing streaming message
                  lastMessage.content += event.text;
                } else {
                  // Create new assistant message
                  newMessages.push({
                    id: 'streaming',
                    role: 'assistant',
                    content: event.text || '',
                    timestamp: new Date()
                  });
                }
                return newMessages;
              });
            }
          },
          error: (error) => {
            console.error('Streaming error:', error);
            setIsLoading(false);
          }
        }));

        // Send initial context message with document content
        const contextMessage = `I have uploaded a document: "${documentInfo.fileName}" (${documentInfo.fileType.toUpperCase()}) with ${documentInfo.wordCount.toLocaleString()} words.

Here is the extracted content:

${documentInfo.extractedText}

Please analyze this document and let me know what it's about, then ask me what I'd like to know about it.`;

        // Send the context message
        await newConversation.data.sendMessage({
          content: [{ text: contextMessage }]
        });

        // Add user message to UI
        setMessages([{
          id: Date.now().toString(),
          role: 'user',
          content: contextMessage,
          timestamp: new Date()
        }]);

      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      const errorMessage: Message = {
        id: 'init-error',
        role: 'assistant',
        content: 'I encountered an error while initializing the conversation. Please try refreshing the page.',
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [documentInfo]);

  useEffect(() => {
    // Initialize conversation when document is loaded and no conversation exists
    if (documentInfo && !conversation) {
      initializeConversation();
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [documentInfo, conversation, initializeConversation, subscription]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !conversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to conversation
      await conversation.sendMessage({
        content: [{ text: messageContent }]
      });

      // The response will be handled by the streaming subscription
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    // Clean up subscription
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    
    setMessages([]);
    setConversation(null);
    setInputMessage('');
    
    if (documentInfo) {
      // Reinitialize conversation
      await initializeConversation();
    }
  };

  if (!documentInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Loaded</h3>
          <p className="text-gray-500">Upload a document first to start chatting about its content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Document Chat with Claude</h3>
            <p className="text-blue-100 text-sm">
              Discussing: {documentInfo.fileName} ({documentInfo.wordCount.toLocaleString()} words)
            </p>
          </div>
          <button
            onClick={clearChat}
            className="text-blue-200 hover:text-white transition-colors"
            title="Clear chat"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Claude is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Claude a question about your document..."
              disabled={isLoading || !conversation}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading || !conversation}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-end"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};
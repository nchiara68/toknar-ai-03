// src/components/DocumentChat.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';
import {
  Card,
  Heading,
  Text,
  Button,
  Flex,
  View,
  TextAreaField,
  ScrollView,
  Divider
} from '@aws-amplify/ui-react';

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
          next: (event: { contentBlockDeltaIndex?: number; text?: string }) => {
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
          error: (error: unknown) => {
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
      <Card>
        <View textAlign="center" padding="2rem">
          <Heading level={3} marginBottom="1rem">No Document Loaded</Heading>
          <Text variation="secondary">Upload a document first to start chatting about its content.</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      {/* Chat Header */}
      <Flex justifyContent="space-between" alignItems="center" padding="1rem" backgroundColor="var(--amplify-colors-blue-60)">
        <View>
          <Heading level={3} color="white" margin="0">Document Chat with Claude</Heading>
          <Text color="white" fontSize="0.875rem">
            Discussing: {documentInfo.fileName} ({documentInfo.wordCount.toLocaleString()} words)
          </Text>
        </View>
        <Button onClick={clearChat} variation="link" color="white" title="Clear chat">
          🗑️
        </Button>
      </Flex>

      {/* Messages Area */}
      <ScrollView height="400px" padding="1rem">
        <View>
          {messages.map((message) => (
            <Flex
              key={message.id}
              justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
              marginBottom="1rem"
            >
              <Card
                maxWidth="75%"
                padding="0.75rem"
                backgroundColor={
                  message.role === 'user' 
                    ? 'var(--amplify-colors-blue-60)' 
                    : 'var(--amplify-colors-neutral-20)'
                }
              >
                <Text 
                  color={message.role === 'user' ? 'white' : 'black'}
                  whiteSpace="pre-wrap"
                >
                  {message.content}
                </Text>
                <Text 
                  fontSize="0.75rem" 
                  marginTop="0.25rem"
                  color={message.role === 'user' ? 'white' : 'var(--amplify-colors-neutral-60)'}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Card>
            </Flex>
          ))}
          
          {isLoading && (
            <Flex justifyContent="flex-start">
              <Card padding="0.75rem" backgroundColor="var(--amplify-colors-neutral-20)">
                <Flex alignItems="center">
                  <Text>Claude is thinking...</Text>
                </Flex>
              </Card>
            </Flex>
          )}
          
          <div ref={messagesEndRef} />
        </View>
      </ScrollView>

      <Divider />

      {/* Input Area */}
      <View padding="1rem">
        <Flex gap="0.5rem">
          <TextAreaField
            label=""
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Claude a question about your document..."
            isDisabled={isLoading || !conversation}
            rows={2}
            flex="1"
          />
          <Button
            onClick={sendMessage}
            isDisabled={!inputMessage.trim() || isLoading || !conversation}
          >
            Send
          </Button>
        </Flex>
        <Text fontSize="0.75rem" color="var(--amplify-colors-neutral-60)" marginTop="0.5rem">
          Press Enter to send, Shift+Enter for new line
        </Text>
      </View>
    </Card>
  );
};
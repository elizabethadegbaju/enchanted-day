import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { Send, MessageCircle } from 'lucide-react';
import { apiClient, parseStrandsStream } from '@/lib/api';

interface GuestInquiryChatProps {
  guestId: string;
  guestName: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  workflowStep?: string;
}

export const GuestInquiryChat: React.FC<GuestInquiryChatProps> = ({
  guestId,
  guestName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendInquiry = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const stream = await apiClient.streamGuestInquiry(guestId, input.trim(), urgency);
      const reader = stream.getReader();
      
      let aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '',
        timestamp: new Date()
      };

      setMessages((prev: ChatMessage[]) => [...prev, aiMessage]);

      for await (const chunk of parseStrandsStream(reader)) {
        switch (chunk.type) {
          case 'workflow_start':
            setMessages((prev: ChatMessage[]) => prev.map(msg => 
              msg.id === aiMessage.id 
                ? { ...msg, content: 'Analyzing your inquiry...' }
                : msg
            ));
            break;

          case 'step_complete':
            if (chunk.step === 'analyze') {
              setMessages((prev: ChatMessage[]) => prev.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, content: 'Generating personalized response...' }
                  : msg
              ));
            } else if (chunk.step === 'respond' && chunk.data?.content) {
              const content = typeof chunk.data.content === 'string' ? chunk.data.content : 'Response received'
              setMessages((prev: ChatMessage[]) => prev.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, content, workflowStep: chunk.step }
                  : msg
              ));
            }
            break;

          case 'workflow_complete':
            setIsStreaming(false);
            break;

          case 'error':
            toast({
              title: 'Error processing inquiry',
              description: chunk.error || 'An error occurred',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            setIsStreaming(false);
            break;
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      toast({
        title: 'Connection error',
        description: 'Failed to process inquiry',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendInquiry();
    }
  };

  return (
    <Box h="500px" display="flex" flexDirection="column" border="1px" borderColor="gray.200" borderRadius="md">
      <Box p={4} borderBottom="1px" borderColor="gray.200" bg="gray.50">
        <HStack justify="space-between">
          <HStack>
            <MessageCircle size={20} />
            <Text fontWeight="semibold">Chat with {guestName}</Text>
          </HStack>
          <HStack>
            <Text fontSize="sm">Urgency:</Text>
            <Badge 
              colorScheme={urgency === 'high' ? 'red' : urgency === 'medium' ? 'yellow' : 'green'}
              cursor="pointer"
              onClick={() => {
                const levels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
                const currentIndex = levels.indexOf(urgency);
                setUrgency(levels[(currentIndex + 1) % levels.length]);
              }}
            >
              {urgency}
            </Badge>
          </HStack>
        </HStack>
      </Box>

      <VStack flex={1} overflowY="auto" p={4} spacing={3} align="stretch">
        {messages.map((message) => (
          <Box
            key={message.id}
            alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
            maxW="80%"
          >
            <Box
              bg={message.type === 'user' ? 'blue.500' : 'gray.100'}
              color={message.type === 'user' ? 'white' : 'black'}
              px={3}
              py={2}
              borderRadius="lg"
              borderBottomRightRadius={message.type === 'user' ? 'sm' : 'lg'}
              borderBottomLeftRadius={message.type === 'user' ? 'lg' : 'sm'}
            >
              <Text fontSize="sm">{message.content}</Text>
              {message.workflowStep && (
                <Badge size="sm" mt={1} colorScheme="green">
                  AI Response
                </Badge>
              )}
            </Box>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {message.timestamp.toLocaleTimeString()}
            </Text>
          </Box>
        ))}
        {isStreaming && (
          <Box alignSelf="flex-start">
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">AI is thinking...</Text>
            </HStack>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </VStack>

      <Box p={4} borderTop="1px" borderColor="gray.200">
        <HStack>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the wedding..."
            disabled={isStreaming}
          />
          <Button
            onClick={handleSendInquiry}
            disabled={!input.trim() || isStreaming}
            colorScheme="blue"
            leftIcon={<Send size={16} />}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
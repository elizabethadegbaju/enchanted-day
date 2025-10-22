'use client'

import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Avatar,
  Flex,
  IconButton,
  Badge,
  useColorModeValue,
  Container,
  Textarea,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react'
import { 
  Send,
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  Camera,
  Settings,
  MoreVertical,
  Mic,
  Paperclip,
  Heart,
  Brain,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { amplifyDataClient } from '@/lib/amplify-client'
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer'
import { ChatService, parseChatStream } from '@/lib/chat-service'
import { useWedding } from '@/contexts/WeddingContext'
import { handleStreamingChat, generateActionsFromResponse, ChatMessage, ChatAction } from '@/lib/streaming-utils'
import { parseThinkingContent } from '@/lib/thinking-utils'

const initialGreeting = "Hi! I'm your AI wedding planner. I'm here to help make your special day absolutely magical! ✨\n\nI can assist with:\n• Vendor coordination and negotiations\n• Timeline management and deadline tracking\n• Guest management and RSVP follow-ups\n• Budget optimization and cost tracking\n• Crisis prevention and contingency planning\n\nWhat would you like to work on today?"

const quickActions = [
  { icon: Calendar, label: 'Check Timeline', action: 'timeline' },
  { icon: Users, label: 'Manage Vendors', action: 'vendors' },
  { icon: DollarSign, label: 'Review Budget', action: 'budget' },
  { icon: Camera, label: 'Mood Boards', action: 'media' },
  { icon: Settings, label: 'Crisis Check', action: 'crisis' },
  { icon: Sparkles, label: 'Cultural Help', action: 'cultural' },
]

// Component to render thinking section
const ThinkingSection = ({ thinking, isStreaming }: { thinking: string; isStreaming?: boolean }) => {
  const { isOpen, onToggle } = useDisclosure()
  
  return (
    <Box mb={3}>
      <Button
        size="xs"
        variant="ghost"
        leftIcon={isStreaming ? <Spinner size="xs" /> : <Brain size={12} />}
        rightIcon={isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        onClick={onToggle}
        colorScheme="blue"
        fontSize="xs"
      >
        {isStreaming ? 'AI Thinking...' : 'AI Thinking Process'}
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={2}
          p={3}
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="md"
          fontSize="sm"
          color="blue.800"
          fontStyle="italic"
        >
          <MarkdownRenderer content={thinking} />
        </Box>
      </Collapse>
    </Box>
  )
}

// Component to render message content with markdown
const MessageContent = ({ message }: { message: ChatMessage }) => {
  return (
    <Box>
      {message.thinking && <ThinkingSection thinking={message.thinking} isStreaming={message.isStreaming} />}
      <Box fontSize="sm">
        <MarkdownRenderer content={message.content} />
      </Box>
    </Box>
  )
}



// Markdown-like formatting component
function FormattedText({ content }: { content: string }) {
  const formatText = (text: string) => {
    // Simple markdown-like formatting
    return text
      .split('\n')
      .map((line, index) => {
        let formattedLine = line
        
        // Bold text **text**
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // Bullet points
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return (
            <Text key={index} as="li" ml={4} mb={1}>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }} />
            </Text>
          )
        }
        
        // Numbers (1., 2., etc.)
        if (/^\d+\.\s/.test(line.trim())) {
          return (
            <Text key={index} as="li" ml={4} mb={1} style={{ listStyleType: 'decimal' }}>
              <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s*/, '') }} />
            </Text>
          )
        }
        
        return (
          <Text key={index} mb={1}>
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </Text>
        )
      })
  }

  return <VStack align="start" spacing={1}>{formatText(content)}</VStack>
}

// Helper function to parse thinking content from agent response
export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: initialGreeting,
      timestamp: new Date(),
      agent: 'EnchantedDay AI Assistant',
      actions: [
        { id: '1', label: 'Create Wedding', type: 'navigate', data: { path: '/wedding/create' } },
        { id: '2', label: 'View Dashboard', type: 'navigate', data: { path: '/dashboard' } },
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuthenticator()
  const { selectedWeddingId } = useWedding()

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.200', 'gray.700')

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')

    try {
      // Create AI message placeholder for streaming
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '',
        thinking: '',
        timestamp: new Date(),
        agent: 'EnchantedDay AI Assistant',
        actions: [],
        isStreaming: true
      }
      
      setMessages((prev: ChatMessage[]) => [...prev, aiMessage])

      // Use streaming for better UX
      const stream = await ChatService.streamMessage(currentInput, selectedWeddingId || undefined)
      const reader = stream.getReader()
      
      let accumulatedContent = ''
      let accumulatedThinking = ''
      
      for await (const chunk of parseChatStream(reader)) {
        if (chunk.type === 'start') {
          // Stream started
          continue
        } else if (chunk.type === 'thinking') {
          // Add thinking content
          accumulatedThinking = chunk.thinking || chunk.content || ''
          
          // Update the AI message with thinking content
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, thinking: accumulatedThinking }
                : msg
            )
          )
        } else if (chunk.type === 'content') {
          // Add content chunk
          accumulatedContent += chunk.content || ''
          
          // Parse thinking content from accumulated content
          const { thinking, content: cleanContent } = parseThinkingContent(accumulatedContent)
          
          // Update accumulated thinking if found
          if (thinking && thinking !== accumulatedThinking) {
            accumulatedThinking = thinking
          }
          
          // Update the AI message with parsed content and thinking
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: cleanContent,
                    thinking: accumulatedThinking
                  }
                : msg
            )
          )
        } else if (chunk.type === 'end') {
          // Parse final content to ensure thinking is separated
          const { thinking, content: cleanContent } = parseThinkingContent(accumulatedContent)
          
          // Stream ended - generate actions based on final clean content and mark as complete
          const actions = generateActionsFromResponse(cleanContent)
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: cleanContent,
                    thinking: thinking || accumulatedThinking,
                    actions, 
                    isStreaming: false 
                  }
                : msg
            )
          )
          break
        } else if (chunk.type === 'error') {
          console.error('Streaming error:', chunk.error)
          // Handle error - maybe show fallback
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: 'Sorry, I encountered an error processing your request.', isStreaming: false }
                : msg
            )
          )
          break
        }
      }
      
    } catch (error) {
      console.error('Failed to get AI response:', error)
      
      // Fallback to mock response if the Lambda function fails
      const mockResponse = generateAIResponse(currentInput)
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting to my AI services right now. Let me try to help you with a basic response.\n\n" + mockResponse.content,
        timestamp: new Date(),
        agent: mockResponse.agent,
        actions: mockResponse.actions
      }
      
      setMessages((prev: ChatMessage[]) => [...prev, fallbackMessage])
    } finally {
      // Remove setIsTyping(false) since we're not using isTyping anymore
    }
  }

  const generateAIResponse = (userInput: string): { content: string; agent: string; actions: ChatAction[] } => {
    const input = userInput.toLowerCase()
    let response = "I understand you'd like help with that. Let me connect you with the right specialist agent!"
    let agent = 'EnchantedDay AI Assistant'
    let actions: ChatAction[] = [
      { id: '1', label: 'Create Wedding', type: 'navigate', data: { path: '/wedding/create' } },
      { id: '2', label: 'View Dashboard', type: 'navigate', data: { path: '/dashboard' } }
    ]

    if (input.includes('vendor')) {
      agent = 'EnchantedDay AI Assistant'
      response = "I'm your Vendor Management Agent. I can help you find, coordinate, and manage all your wedding vendors. What specific vendor needs do you have?"
      actions = [
        { id: '1', label: 'Find Vendors', type: 'navigate', data: { path: '/vendors/search' } },
        { id: '2', label: 'Manage Vendors', type: 'navigate', data: { path: '/vendors' } }
      ]
    } else if (input.includes('timeline') || input.includes('schedule')) {
      agent = 'EnchantedDay AI Assistant'
      response = "I'm your Schedule Management Agent. I can help you optimize your timeline, track deadlines, and resolve scheduling conflicts. What timeline assistance do you need?"
      actions = [
        { id: '1', label: 'View Timeline', type: 'navigate', data: { path: '/timeline' } },
        { id: '2', label: 'Check Deadlines', type: 'navigate', data: { path: '/timeline/deadlines' } }
      ]
    } else if (input.includes('budget')) {
      agent = 'EnchantedDay AI Assistant'
      response = "I'm your Budget Management Agent. I can help you track expenses, optimize spending, and stay within budget. What budget questions do you have?"
      actions = [
        { id: '1', label: 'View Budget', type: 'navigate', data: { path: '/budget' } },
        { id: '2', label: 'Track Expenses', type: 'navigate', data: { path: '/budget/expenses' } }
      ]
    } else if (input.includes('guest')) {
      agent = 'EnchantedDay AI Assistant'
      response = "I'm your Guest Experience Agent. I can help you manage your guest list, track RSVPs, and coordinate guest experiences. How can I help with your guests?"
      actions = [
        { id: '1', label: 'Manage Guests', type: 'navigate', data: { path: '/guests' } },
        { id: '2', label: 'Track RSVPs', type: 'navigate', data: { path: '/guests/rsvp' } }
      ]
    }

    return { content: response, agent, actions }
  }

  const handleQuickAction = async (action: string) => {
    const userInput = `Help me with ${action}`
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])

    try {
      // Initialize the AI message for streaming
      const aiMessageId = (Date.now() + 1).toString()
      const initialAiMessage: ChatMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '',
        thinking: '',
        timestamp: new Date(),
        agent: 'EnchantedDay AI Assistant',
        actions: [],
        isStreaming: true
      }
      
      setMessages((prev: ChatMessage[]) => [...prev, initialAiMessage])

      // Use streaming for real-time response
      const stream = await ChatService.streamMessage(userInput, selectedWeddingId || undefined)
      const reader = stream.getReader()
      
      let accumulatedContent = ''
      let accumulatedThinking = ''
      
      for await (const chunk of parseChatStream(reader)) {
        if (chunk.type === 'start') {
          continue
        } else if (chunk.type === 'thinking') {
          accumulatedThinking = chunk.thinking || chunk.content || ''
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, thinking: accumulatedThinking }
                : msg
            )
          )
        } else if (chunk.type === 'content') {
          accumulatedContent += chunk.content || ''
          
          // Parse thinking content from accumulated content
          const { thinking, content: cleanContent } = parseThinkingContent(accumulatedContent)
          
          // Update accumulated thinking if found
          if (thinking && thinking !== accumulatedThinking) {
            accumulatedThinking = thinking
          }
          
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: cleanContent,
                    thinking: accumulatedThinking
                  }
                : msg
            )
          )
        } else if (chunk.type === 'end') {
          // Parse final content to ensure thinking is separated
          const { thinking, content: cleanContent } = parseThinkingContent(accumulatedContent)
          
          const actions = generateActionsFromResponse(cleanContent)
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: cleanContent,
                    thinking: thinking || accumulatedThinking,
                    actions, 
                    isStreaming: false 
                  }
                : msg
            )
          )
          break
        } else if (chunk.type === 'error') {
          console.error('Streaming error:', chunk.error)
          setMessages((prev: ChatMessage[]) => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: 'Sorry, I encountered an error processing your request.', isStreaming: false }
                : msg
            )
          )
          break
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      
      // Fallback to mock response if the Lambda function fails
      const mockResponse = generateAIResponse(userInput)
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting to my AI services right now. Let me try to help you with a basic response.\n\n" + mockResponse.content,
        timestamp: new Date(),
        agent: mockResponse.agent,
        actions: mockResponse.actions
      }
      
      setMessages((prev: ChatMessage[]) => [...prev, fallbackMessage])
    } finally {
      // Remove setIsTyping(false) since we're not using isTyping anymore
    }
  }

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'navigate') {
      window.location.href = action.data.path as string
    }
  }

  return (
    <Box minH="100vh" bg="neutral.50">
      <Box
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={6}
        py={4}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="4xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Avatar
                size="sm"
                bg="brand.500"
                icon={<Heart size={16} />}
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                  EnchantedDay AI
                </Text>
                <Text fontSize="sm" color="neutral.600">
                  Your AI Wedding Planner
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={2}>
              <Badge colorScheme="green" variant="subtle">
                <HStack spacing={1}>
                  <Box w={2} h={2} bg="green.500" borderRadius="full" />
                  <Text>Online</Text>
                </HStack>
              </Badge>
              
              <Menu>
                <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                <MenuList>
                  <MenuItem onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => window.location.href = '/wedding/create'}>
                    Create Wedding
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="4xl" py={6}>
        <VStack spacing={6} align="stretch" h="calc(100vh - 200px)">
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Text fontSize="sm" color="neutral.600" textAlign="center">
                  Quick Actions
                </Text>
                <HStack spacing={4} wrap="wrap" justify="center">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={action.action}
                        leftIcon={<Icon size={16} />}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                      >
                        {action.label}
                      </Button>
                    )
                  })}
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Box flex={1} overflowY="auto">
            <VStack spacing={4} align="stretch">
              {messages.map((message) => (
                <HStack
                  key={message.id}
                  align="start"
                  justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
                  spacing={3}
                >
                  {message.type === 'ai' && (
                    <Avatar
                      size="sm"
                      bg="brand.500"
                      icon={<Sparkles size={14} />}
                    />
                  )}
                  
                  <VStack
                    align={message.type === 'user' ? 'end' : 'start'}
                    spacing={2}
                    maxW="70%"
                  >
                    {message.type === 'ai' && message.agent && (
                      <Text fontSize="xs" color="neutral.500">
                        {message.agent}
                      </Text>
                    )}
                    

                    
                    <Card
                      bg={message.type === 'user' ? 'brand.500' : bgColor}
                      color={message.type === 'user' ? 'white' : 'inherit'}
                      variant={message.type === 'user' ? 'solid' : 'outline'}
                    >
                      <CardBody py={3} px={4}>
                        {message.type === 'user' ? (
                          <Text fontSize="sm" whiteSpace="pre-wrap">
                            {message.content}
                          </Text>
                        ) : (
                          <Box fontSize="sm">
                            {message.isStreaming && !message.content.trim() && !message.thinking?.trim() ? (
                              <HStack spacing={2}>
                                <Spinner size="xs" />
                                <Text color="neutral.600">AI is thinking...</Text>
                              </HStack>
                            ) : (
                              <MessageContent message={message} />
                            )}
                          </Box>
                        )}
                      </CardBody>
                    </Card>

                    {message.actions && message.actions.length > 0 && (
                      <HStack spacing={2} wrap="wrap">
                        {message.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="xs"
                            variant="outline"
                            onClick={() => handleActionClick(action)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </HStack>
                    )}

                    <Text fontSize="xs" color="neutral.400">
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </VStack>

                  {message.type === 'user' && (
                    <Avatar
                      size="sm"
                      name={user?.username || 'User'}
                      bg="neutral.500"
                    />
                  )}
                </HStack>
              ))}

              {/* Remove this isTyping indicator since we handle thinking in streaming messages */}

              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          <Card>
            <CardBody>
              <HStack spacing={3}>
                <IconButton
                  icon={<Paperclip size={16} />}
                  variant="ghost"
                  size="sm"
                  aria-label="Attach file"
                />
                
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about your wedding planning..."
                  resize="none"
                  rows={1}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                
                <VStack spacing={2}>
                  <IconButton
                    icon={<Mic size={16} />}
                    variant="ghost"
                    size="sm"
                    aria-label="Voice input"
                  />
                  <IconButton
                    icon={<Send size={16} />}
                    colorScheme="brand"
                    size="sm"
                    onClick={handleSendMessage}
                    isDisabled={!inputValue.trim()}
                    aria-label="Send message"
                  />
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}
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
import { useState, useRef, useEffect, Fragment } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import ReactMarkdown from 'react-markdown'
import { amplifyDataClient } from '@/lib/amplify-client'
import { ChatService, parseChatStream, parseChatStreamEnhanced } from '@/lib/chat-service'
import { useWedding } from '@/contexts/WeddingContext'

interface ChatMessage {
  id: string
  type: 'user' | 'ai' | 'system'
  content: string
  contentParts?: ContentPart[] // New array-based content structure
  thinking?: string
  isStreaming?: boolean
  timestamp: Date
  agent?: string
  actions?: ChatAction[]
  metadata?: Record<string, unknown>
}

interface ContentPart {
  id: string
  type: 'text' | 'thinking'
  content: string
  isComplete?: boolean // For streaming - indicates if this part is fully received
}

interface ChatAction {
  id: string
  label: string
  type: 'navigate' | 'create' | 'update' | 'view'
  data: Record<string, unknown>
}

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
const ThinkingSection = ({ thinking }: { thinking: string }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box mb={3}>
      <Button
        size="xs"
        variant="ghost"
        leftIcon={<Brain size={12} />}
        rightIcon={isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        onClick={onToggle}
        colorScheme="blue"
        fontSize="xs"
      >
        AI Thinking Process
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
          <ReactMarkdown>{thinking}</ReactMarkdown>
        </Box>
      </Collapse>
    </Box>
  )
}

// Component to render message content from array of parts
const MessageContent = ({ message }: { message: ChatMessage }) => {
  if (message.contentParts) {
    // Render from contentParts array
    return (
      <Box fontSize="sm">
        {message.contentParts.map((part: ContentPart) => (
          <Fragment key={part.id}>
            {part.type === 'text' ? (
              <Box mb={2}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <Box mb={2}>{children}</Box>,
                    br: () => <Box height="1" />,
                  }}
                >
                  {part.content}
                </ReactMarkdown>
              </Box>
            ) : (
              <Box mb={3}>
                <ThinkingSection thinking={part.content} />
              </Box>
            )}
          </Fragment>
        ))}
      </Box>
    )
  }

  // Fallback to old parsing method for backward compatibility
  const parts = parseContentWithInlineThinking(message.content)
  return (
    <Box fontSize="sm">
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </Box>
  )
}

// Thinking Component for AI messages with visibility control
function AIThinkingDisplay({ thinking, isVisible }: { thinking: string; isVisible: boolean }) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false })
  const bgColor = useColorModeValue('purple.50', 'purple.900')
  const borderColor = useColorModeValue('purple.200', 'purple.600')

  if (!thinking.trim() || !isVisible) return null

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={3}
      mb={2}
      fontSize="xs"
    >
      <HStack
        onClick={onToggle}
        cursor="pointer"
        justify="space-between"
        _hover={{ opacity: 0.8 }}
      >
        <HStack spacing={2}>
          <Brain size={14} />
          <Text fontWeight="medium" color="purple.600">
            AI Thinking Process
          </Text>
        </HStack>
        <IconButton
          size="xs"
          variant="ghost"
          icon={isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          aria-label="Toggle thinking"
        />
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={2} pt={2} borderTop="1px solid" borderColor={borderColor}>
          <Text color="purple.700" fontStyle="italic" fontSize="xs">
            {thinking}
          </Text>
        </Box>
      </Collapse>
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

// Helper functions for managing content parts array
function createTextPart(content: string, isComplete: boolean = false): ContentPart {
  return {
    id: `text_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'text',
    content,
    isComplete
  }
}

function createThinkingPart(content: string, isComplete: boolean = false): ContentPart {
  return {
    id: `thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'thinking',
    content,
    isComplete
  }
}

function updateLastPart(parts: ContentPart[], newContent: string): ContentPart[] {
  if (parts.length === 0) {
    return [createTextPart(newContent, false)]
  }

  const updatedParts = [...parts]
  const lastPart = updatedParts[updatedParts.length - 1]
  updatedParts[updatedParts.length - 1] = {
    ...lastPart,
    content: lastPart.content + newContent
  }

  return updatedParts
}

function processStreamingContent(currentParts: ContentPart[], newChunk: string): ContentPart[] {
  let parts = [...currentParts]
  let remainingChunk = newChunk
  let currentIndex = 0

  while (currentIndex < remainingChunk.length) {
    const openTagIndex = remainingChunk.indexOf('<thinking>', currentIndex)
    const closeTagIndex = remainingChunk.indexOf('</thinking>', currentIndex)

    // Determine the next significant position
    let nextEventIndex = remainingChunk.length
    let nextEventType: 'open' | 'close' | 'end' = 'end'

    if (openTagIndex !== -1 && (closeTagIndex === -1 || openTagIndex < closeTagIndex)) {
      nextEventIndex = openTagIndex
      nextEventType = 'open'
    } else if (closeTagIndex !== -1) {
      nextEventIndex = closeTagIndex
      nextEventType = 'close'
    }

    // Add content before the next event to current part
    if (nextEventIndex > currentIndex) {
      const contentBeforeEvent = remainingChunk.slice(currentIndex, nextEventIndex)
      if (contentBeforeEvent) {
        parts = updateLastPart(parts, contentBeforeEvent)
      }
    }

    // Handle the event
    if (nextEventType === 'open') {
      // <thinking> found - complete current part and start thinking part
      if (parts.length > 0) {
        parts[parts.length - 1] = { ...parts[parts.length - 1], isComplete: true }
      }
      parts.push(createThinkingPart('', false)) // Start new thinking part
      currentIndex = nextEventIndex + '<thinking>'.length

    } else if (nextEventType === 'close') {
      // </thinking> found - complete thinking part and start text part
      if (parts.length > 0) {
        parts[parts.length - 1] = { ...parts[parts.length - 1], isComplete: true }
      }
      parts.push(createTextPart('', false)) // Start new text part
      currentIndex = nextEventIndex + '</thinking>'.length

    } else {
      // End of chunk reached
      break
    }
  }

  // Ensure we have at least one part
  if (parts.length === 0) {
    parts.push(createTextPart('', false))
  }

  return parts
}
function parseContentWithInlineThinking(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/g
  let match
  let keyCounter = 0

  while ((match = thinkingRegex.exec(content)) !== null) {
    // Add content before thinking block
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index).trim()
      if (textBefore) {
        parts.push(
          <Box key={`content-${keyCounter++}`} mb={2}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <Box mb={2}>{children}</Box>,
                br: () => <Box height="1" />,
              }}
            >
              {textBefore}
            </ReactMarkdown>
          </Box>
        )
      }
    }

    // Add thinking block component
    const thinkingContent = match[1].trim()
    if (thinkingContent) {
      parts.push(
        <Box key={`thinking-${keyCounter++}`} mb={3}>
          <ThinkingSection thinking={thinkingContent} />
        </Box>
      )
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining content after last thinking block
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex).trim()
    if (remainingText) {
      parts.push(
        <Box key={`content-${keyCounter++}`}>
          <ReactMarkdown
            components={{
              p: ({ children }) => <Box mb={2}>{children}</Box>,
              br: () => <Box height="1" />,
            }}
          >
            {remainingText}
          </ReactMarkdown>
        </Box>
      )
    }
  }

  // If no thinking blocks found, return the original content
  if (parts.length === 0) {
    parts.push(
      <ReactMarkdown
        key="content-only"
        components={{
          p: ({ children }) => <Box mb={2}>{children}</Box>,
          br: () => <Box height="1" />,
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  return parts
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: initialGreeting,
      timestamp: new Date(),
      agent: 'Wedding Planning Assistant',
      actions: [
        { id: '1', label: 'Create Wedding', type: 'navigate', data: { path: '/wedding/create' } },
        { id: '2', label: 'View Dashboard', type: 'navigate', data: { path: '/dashboard' } },
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [lastMessageTime, setLastMessageTime] = useState(0) // Debounce mechanism
  const currentRequestRef = useRef<AbortController | null>(null) // Track current request
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

  // Cleanup function to abort any ongoing requests
  useEffect(() => {
    return () => {
      if (currentRequestRef.current) {
        currentRequestRef.current.abort()
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    // Debounce mechanism - prevent rapid messages
    const now = Date.now()
    if (now - lastMessageTime < 1000) return // 1 second cooldown
    setLastMessageTime(now)

    // Cancel any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsTyping(true)

    try {
      // Create new abort controller for this request
      const abortController = new AbortController()
      currentRequestRef.current = abortController

      // Create AI message placeholder for streaming with contentParts array
      const aiMessageId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // More unique ID
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '', // Keep for backward compatibility
        contentParts: [], // New array-based structure
        thinking: '',
        timestamp: new Date(),
        agent: 'EnchantedDay AI Assistant',
        actions: [],
        isStreaming: true
      }

      setMessages((prev: ChatMessage[]) => [...prev, aiMessage])

      // Use enhanced streaming for better UX with lifecycle events
      const stream = await ChatService.streamMessage(currentInput, selectedWeddingId || undefined)
      const reader = stream.getReader()

      let accumulatedContent = ''
      let accumulatedThinking = ''
      let hasProcessedEnd = false // Flag to prevent duplicate processing
      let isInThinkingMode = false

      for await (const chunk of parseChatStreamEnhanced(reader)) {
        // Check if request was aborted
        if (abortController.signal.aborted) {
          reader.releaseLock()
          return
        }

        if (hasProcessedEnd) break // Prevent processing after end

        // Handle lifecycle events
        if (chunk.type === 'lifecycle') {
          if (chunk.data?.type === 'init_stream') {
            // Stream initialized
            continue
          } else if (chunk.data?.type === 'start_cycle') {
            // New processing cycle started
            continue
          } else if (chunk.data?.type === 'complete_cycle') {
            // Processing cycle completed
            continue
          } else if (chunk.data?.type === 'end_stream') {
            hasProcessedEnd = true
            break
          }
        }

        // Handle thinking state transitions
        else if (chunk.type === 'thinking_start') {
          isInThinkingMode = true
          // Initialize thinking section
        }

        else if (chunk.type === 'thinking_content') {
          if (isInThinkingMode) {
            accumulatedThinking += chunk.data?.content || ''

            // Update the AI message with thinking content
            setMessages((prev: ChatMessage[]) =>
              prev.map(msg =>
                msg.id === aiMessageId
                  ? { ...msg, thinking: accumulatedThinking }
                  : msg
              )
            )
          }
        }

        else if (chunk.type === 'thinking_end') {
          isInThinkingMode = false
          // Finalize thinking section
        }

        // Handle tool usage
        else if (chunk.type === 'tool_use') {
          console.log(`AI is using tool: ${chunk.data?.name}`)
          // Could add a tool usage indicator in UI
        }

        // Handle regular content
        else if (chunk.type === 'content') {
          // Add content chunk and convert literal \n to actual line breaks
          const newChunk = (chunk.data?.content || '').replace(/\\n/g, '\n')
          accumulatedContent += newChunk

          // Update the AI message using the new content parts approach
          setMessages((prev: ChatMessage[]) =>
            prev.map(msg => {
              if (msg.id === aiMessageId) {
                const updatedParts = processStreamingContent(msg.contentParts || [], newChunk)
                return {
                  ...msg,
                  content: accumulatedContent, // Keep for backward compatibility
                  contentParts: updatedParts
                }
              }
              return msg
            })
          )
        }

        // Handle errors
        else if (chunk.type === 'error') {
          console.error('Streaming error:', chunk.data?.error)
          throw new Error(chunk.data?.error || 'Streaming failed')
        }

        // Fallback for legacy events
        else if (chunk.type === 'start') {
          // Legacy start event
          continue
        }

        else if (chunk.type === 'thinking') {
          // Legacy thinking event
          accumulatedThinking = chunk.thinking || chunk.content || ''
          setMessages((prev: ChatMessage[]) =>
            prev.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, thinking: accumulatedThinking }
                : msg
            )
          )
        }

        else if (chunk.type === 'end') {
          hasProcessedEnd = true
          break
        }
      }

      // Final content processing and generate actions
      const finalContent = accumulatedContent.replace(/\\n/g, '\n')
      const actions = generateActionsFromResponse(finalContent)

      setMessages((prev: ChatMessage[]) =>
        prev.map(msg => {
          if (msg.id === aiMessageId) {
            // Mark all parts as complete
            const completedParts = (msg.contentParts || []).map(part => ({
              ...part,
              isComplete: true
            }))

            return {
              ...msg,
              content: finalContent,
              contentParts: completedParts,
              actions,
              isStreaming: false
            }
          }
          return msg
        })
      )

    } catch (error) {
      console.error('Failed to get AI response:', error)

      // Only show fallback if request wasn't aborted
      if (currentRequestRef.current && !currentRequestRef.current.signal.aborted) {
        // Fallback to mock response if the Lambda function fails
        const fallbackResponse = generateFallbackResponse()
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm having trouble connecting to my AI services right now. Let me try to help you with a basic response.\n\n" + fallbackResponse.content,
          timestamp: new Date(),
          agent: fallbackResponse.agent,
          actions: fallbackResponse.actions
        }

        setMessages((prev: ChatMessage[]) => [...prev, fallbackMessage])
      }
    } finally {
      setIsTyping(false)
      currentRequestRef.current = null
    }
  }

  const generateActionsFromResponse = (response: string): ChatAction[] => {
    // You can enhance this to parse the AI response and generate relevant actions
    const actions: ChatAction[] = []

    if (response.toLowerCase().includes('wedding') || response.toLowerCase().includes('create')) {
      actions.push({ id: '1', label: 'Create Wedding', type: 'navigate', data: { path: '/wedding/create' } })
    }
    if (response.toLowerCase().includes('dashboard') || response.toLowerCase().includes('overview')) {
      actions.push({ id: '2', label: 'View Dashboard', type: 'navigate', data: { path: '/dashboard' } })
    }
    if (response.toLowerCase().includes('vendor')) {
      actions.push({ id: '3', label: 'Manage Vendors', type: 'navigate', data: { path: '/vendors' } })
    }
    if (response.toLowerCase().includes('guest')) {
      actions.push({ id: '4', label: 'Manage Guests', type: 'navigate', data: { path: '/guests' } })
    }
    if (response.toLowerCase().includes('budget')) {
      actions.push({ id: '5', label: 'View Budget', type: 'navigate', data: { path: '/budget' } })
    }

    return actions
  }

  const generateFallbackResponse = (): { content: string; agent: string; actions: ChatAction[] } => {
    return {
      content: "I'm currently experiencing connection issues with my AI services. Please try again in a moment, or use the navigation options below to access different areas of your wedding planning dashboard.",
      agent: 'EnchantedDay AI Assistant',
      actions: [
        { id: '1', label: 'Dashboard', type: 'navigate', data: { path: '/dashboard' } },
        { id: '2', label: 'Vendors', type: 'navigate', data: { path: '/vendors' } },
        { id: '3', label: 'Timeline', type: 'navigate', data: { path: '/timeline' } },
        { id: '4', label: 'Budget', type: 'navigate', data: { path: '/budget' } },
        { id: '5', label: 'Guests', type: 'navigate', data: { path: '/guests' } }
      ]
    }
  }

  const handleQuickAction = async (action: string) => {
    if (isTyping) return // Prevent multiple simultaneous requests

    // Debounce mechanism - prevent rapid actions
    const now = Date.now()
    if (now - lastMessageTime < 1000) return // 1 second cooldown
    setLastMessageTime(now)

    // Cancel any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
    }

    const userInput = `Help me with ${action}`

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages((prev: ChatMessage[]) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Create new abort controller for this request
      const abortController = new AbortController()
      currentRequestRef.current = abortController

      // Initialize the AI message for streaming with contentParts array
      const aiMessageId = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // More unique ID
      const initialAiMessage: ChatMessage = {
        id: aiMessageId,
        type: 'ai',
        content: '', // Keep for backward compatibility
        contentParts: [], // New array-based structure
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
      let hasProcessedEnd = false // Flag to prevent duplicate processing

      for await (const chunk of parseChatStream(reader)) {
        // Check if request was aborted
        if (abortController.signal.aborted) {
          reader.releaseLock()
          return
        }

        if (hasProcessedEnd) break // Prevent processing after end

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
          // Add content chunk and convert literal \n to actual line breaks
          const newChunk = (chunk.content || '').replace(/\\n/g, '\n')
          accumulatedContent += newChunk

          // Update the AI message using the new content parts approach
          setMessages((prev: ChatMessage[]) =>
            prev.map(msg => {
              if (msg.id === aiMessageId) {
                const updatedParts = processStreamingContent(msg.contentParts || [], newChunk)
                return {
                  ...msg,
                  content: accumulatedContent, // Keep for backward compatibility
                  contentParts: updatedParts
                }
              }
              return msg
            })
          )
        } else if (chunk.type === 'end') {
          hasProcessedEnd = true // Mark as processed

          // Final content processing and generate actions
          const finalContent = accumulatedContent.replace(/\\n/g, '\n')
          const actions = generateActionsFromResponse(finalContent)

          setMessages((prev: ChatMessage[]) =>
            prev.map(msg => {
              if (msg.id === aiMessageId) {
                // Mark all parts as complete
                const completedParts = (msg.contentParts || []).map(part => ({
                  ...part,
                  isComplete: true
                }))

                return {
                  ...msg,
                  content: finalContent,
                  contentParts: completedParts,
                  actions,
                  isStreaming: false
                }
              }
              return msg
            })
          )
          break
        } else if (chunk.type === 'error') {
          hasProcessedEnd = true // Mark as processed
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

      // Only show fallback if request wasn't aborted
      if (currentRequestRef.current && !currentRequestRef.current.signal.aborted) {
        // Fallback to mock response if the Lambda function fails
        const fallbackResponse = generateFallbackResponse()
        const fallbackMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm having trouble connecting to my AI services right now. Let me try to help you with a basic response.\n\n" + fallbackResponse.content,
          timestamp: new Date(),
          agent: fallbackResponse.agent,
          actions: fallbackResponse.actions
        }

        setMessages((prev: ChatMessage[]) => [...prev, fallbackMessage])
      }
    } finally {
      setIsTyping(false)
      currentRequestRef.current = null
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
                        isDisabled={isTyping}
                        isLoading={isTyping}
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
                            {message.isStreaming &&
                              (!message.contentParts || message.contentParts.length === 0) &&
                              !message.content.trim() &&
                              !message.thinking ? (
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
                    if (e.key === 'Enter' && !e.shiftKey && !isTyping) {
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
                    isDisabled={!inputValue.trim() || isTyping}
                    isLoading={isTyping}
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
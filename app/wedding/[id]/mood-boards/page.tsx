'use client'

import React, { useState, useEffect } from 'react'
import {
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  useDisclosure,
  useColorModeValue,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MoodBoardCard } from '@/components/wedding/MoodBoardCard'
import { CreateMoodBoardModal } from '@/components/wedding/CreateMoodBoardModal'
import { createMoodBoard, getMoodBoardsData, type MoodBoardListData } from '@/lib/wedding-data-service'
import { Plus, Palette, Image as ImageIcon, Video, Link, Sparkles, MessageCircle } from 'lucide-react'
import type { MoodBoard } from '@/types'
import { useWedding } from '@/contexts/WeddingContext'

export default function MoodBoardsPage() {
  const params = useParams()
  const weddingId = params.id as string
  const { weddings, isLoading: weddingLoading } = useWedding()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const router = useRouter()
  
  const [moodBoards, setMoodBoards] = useState<MoodBoardListData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if the wedding ID is valid
  const isValidWedding = weddings.some(wedding => wedding.id === weddingId)

  useEffect(() => {
    if (!weddingLoading) {
      if (!isValidWedding && weddings.length > 0) {
        // Invalid wedding ID, redirect to dashboard
        router.push('/dashboard')
        return
      }
      
      if (weddingId && isValidWedding) {
        loadMoodBoardsData()
      } else if (weddings.length === 0) {
        // No weddings found, stop loading and show welcome screen
        setLoading(false)
      }
    }
  }, [weddingId, weddingLoading, isValidWedding, weddings.length])

  const loadMoodBoardsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getMoodBoardsData(weddingId)
      setMoodBoards(data)
    } catch (err) {
      console.error('Error loading mood boards data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load mood boards')
      setMoodBoards([])
    } finally {
      setLoading(false)
    }
  }

  const cardBg = useColorModeValue('white', 'gray.800')

  // Loading state while checking weddings
  if (loading || weddingLoading) {
    return (
      <DashboardLayout title="Mood Boards">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="brand.500" />
          <Text>Loading mood boards...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  // No weddings found - show welcome screen
  if (weddings.length === 0) {
    return (
      <DashboardLayout title="Welcome to EnchantedDay">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <VStack spacing={4} textAlign="center">
            <Box>
              <Sparkles size={64} color="var(--chakra-colors-brand-500)" />
            </Box>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                Welcome to Your AI Wedding Planner!
              </Text>
              <Text fontSize="lg" color="neutral.600" maxW="2xl">
                Let's start planning your magical day. Our AI assistant is here to help you every step of the way.
              </Text>
            </VStack>
          </VStack>

          <VStack spacing={4} w="full" maxW="md">
            <Button
              leftIcon={<Plus size={20} />}
              colorScheme="brand"
              size="lg"
              w="full"
              h="auto"
              py={4}
              onClick={() => router.push('/wedding/create')}
            >
              <VStack spacing={1}>
                <Text fontSize="md" fontWeight="semibold">Create Your Wedding</Text>
                <Text fontSize="sm" opacity={0.9}>Set up your special day details</Text>
              </VStack>
            </Button>
            
            <Button
              leftIcon={<MessageCircle size={20} />}
              variant="outline"
              colorScheme="brand"
              size="lg"
              w="full"
              h="auto"
              py={4}
              onClick={() => router.push('/chat')}
            >
              <VStack spacing={1}>
                <Text fontSize="md" fontWeight="semibold">Chat with AI Assistant</Text>
                <Text fontSize="sm" color="neutral.600">Get instant planning help</Text>
              </VStack>
            </Button>
          </VStack>
        </VStack>
      </DashboardLayout>
    )
  }

  const handleViewMoodBoard = (moodBoard: any) => {
    // Navigate to mood board detail page
    router.push(`/wedding/${weddingId}/mood-boards/${moodBoard.id}`)
  }

  const handleCreateMoodBoard = async (moodBoardData: any) => {
    try {
      const newMoodBoardId = await createMoodBoard({
        name: moodBoardData.name,
        description: moodBoardData.description,
        phaseId: moodBoardData.phase_id,
        weddingId: weddingId
      })
      
      // Close modal and optionally refresh data
      onClose()
      
      // Navigate to the new mood board detail page
      router.push(`/wedding/${weddingId}/mood-boards/${newMoodBoardId}`)
    } catch (error) {
      console.error('Error creating mood board:', error)
      toast({
        title: 'Error',
        description: 'Failed to create mood board. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <DashboardLayout
      title="Mood Boards"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Wedding Details', href: `/wedding/${weddingId}` },
        { label: 'Mood Boards' },
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text color="neutral.600">
              Collect and organize visual inspiration for your wedding
            </Text>
          </VStack>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            onClick={onOpen}
          >
            Create Mood Board
          </Button>
        </HStack>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card bg={cardBg} size="sm">
            <CardBody>
              <VStack spacing={2}>
                <HStack spacing={2}>
                  <Palette size={20} color="var(--chakra-colors-brand-500)" />
                  <Text fontSize="sm" color="neutral.600">Total Boards</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">{moodBoards.length}</Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} size="sm">
            <CardBody>
              <VStack spacing={2}>
                <HStack spacing={2}>
                  <ImageIcon size={20} color="var(--chakra-colors-green-500)" />
                  <Text fontSize="sm" color="neutral.600">Total Images</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {moodBoards.reduce((sum, board) => sum + (board.images?.length || 0), 0)}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} size="sm">
            <CardBody>
              <VStack spacing={2}>
                <HStack spacing={2}>
                  <Video size={20} color="var(--chakra-colors-purple-500)" />
                  <Text fontSize="sm" color="neutral.600">Total Videos</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {moodBoards.reduce((sum, board) => 
                    sum + (board.videos?.length || 0), 0
                  )}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} size="sm">
            <CardBody>
              <VStack spacing={2}>
                <HStack spacing={2}>
                  <Link size={20} color="var(--chakra-colors-blue-500)" />
                  <Text fontSize="sm" color="neutral.600">Inspiration Links</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {moodBoards.reduce((sum, board) => 
                    sum + (board.inspirationLinks?.length || 0), 0
                  )}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Loading State */}
        {loading && (
          <VStack spacing={4} py={8}>
            <Spinner size="xl" color="brand.500" />
            <Text>Loading mood boards...</Text>
          </VStack>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>Unable to load mood boards!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </VStack>
          </Alert>
        )}

        {/* Mood Boards Grid */}
        {!loading && !error && (
          <>
            {moodBoards.length === 0 ? (
              <Card bg={cardBg}>
                <CardBody py={12}>
                  <VStack spacing={4}>
                    <Palette size={48} color="var(--chakra-colors-neutral-400)" />
                    <VStack spacing={2}>
                      <Text fontSize="lg" fontWeight="semibold" color="neutral.600">
                        No mood boards yet
                      </Text>
                      <Text color="neutral.500" textAlign="center">
                        Create your first mood board to start collecting visual inspiration for your wedding
                      </Text>
                    </VStack>
                    <Button
                      leftIcon={<Plus size={16} />}
                      colorScheme="brand"
                      onClick={onOpen}
                    >
                      Create Your First Mood Board
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {moodBoards.map((moodBoard) => (
                  <MoodBoardCard
                    key={moodBoard.id}
                    moodBoard={moodBoard as any}
                    onView={() => handleViewMoodBoard(moodBoard)}
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}

        {/* Create Mood Board Modal */}
        <CreateMoodBoardModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={handleCreateMoodBoard}
          weddingId={weddingId}
        />
      </VStack>
    </DashboardLayout>
  )
}
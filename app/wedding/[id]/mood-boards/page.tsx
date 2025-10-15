'use client'

import React from 'react'
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
} from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MoodBoardCard } from '@/components/wedding/MoodBoardCard'
import { CreateMoodBoardModal } from '@/components/wedding/CreateMoodBoardModal'
import { Plus, Palette, Image as ImageIcon, Video } from 'lucide-react'
import type { MoodBoard } from '@/types'

export default function MoodBoardsPage() {
  const params = useParams()
  const weddingId = params.id as string
  const { isOpen, onOpen, onClose } = useDisclosure()

  
  // Mock data - will be replaced with real API calls
  const moodBoards: MoodBoard[] = [
    {
      id: '1',
      name: 'Overall Wedding Vision',
      description: 'Main inspiration and color palette for the entire wedding',
      images: [
        {
          id: '1',
          type: 'image',
          url: '/api/placeholder/300/200',
          s3Key: 'wedding-1/mood-1.jpg',
          filename: 'inspiration-1.jpg',
          tags: ['romantic', 'elegant'],
          uploadedAt: new Date(),
          metadata: { size: 1024000, format: 'jpg', dimensions: { width: 300, height: 200 } }
        }
      ],
      videos: [],
      links: [
        {
          id: '1',
          url: 'https://pinterest.com/pin/123',
          title: 'Elegant Garden Wedding',
          description: 'Beautiful outdoor ceremony setup',
          source: 'Pinterest',
          tags: ['garden', 'outdoor'],
          addedAt: new Date()
        }
      ],
      colorPalette: {
        primary: ['#E8B4B8', '#F4D1D1'],
        secondary: ['#A8C8A8', '#D4E8D4'],
        accent: ['#F5E6D3', '#E8D5B7'],
        neutral: ['#F8F8F8', '#E5E5E5']
      },
      styleKeywords: ['romantic', 'elegant', 'garden', 'vintage'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      phaseId: '1',
      name: 'Legal Ceremony',
      description: 'Simple and intimate ceremony inspiration',
      images: [],
      videos: [],
      links: [],
      colorPalette: {
        primary: ['#FFFFFF', '#F5F5F5'],
        secondary: ['#E8B4B8'],
        accent: ['#F5E6D3'],
        neutral: ['#F8F8F8']
      },
      styleKeywords: ['minimalist', 'intimate', 'classic'],
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      phaseId: '2',
      name: 'Church Wedding',
      description: 'Traditional church ceremony with elegant details',
      images: [
        {
          id: '2',
          type: 'image',
          url: '/api/placeholder/300/200',
          s3Key: 'wedding-1/church-1.jpg',
          filename: 'church-inspiration.jpg',
          tags: ['traditional', 'church'],
          uploadedAt: new Date(),
          metadata: { size: 1024000, format: 'jpg', dimensions: { width: 300, height: 200 } }
        }
      ],
      videos: [],
      links: [],
      colorPalette: {
        primary: ['#E8B4B8', '#F4D1D1'],
        secondary: ['#FFFFFF', '#F5F5F5'],
        accent: ['#F5E6D3'],
        neutral: ['#F8F8F8']
      },
      styleKeywords: ['traditional', 'elegant', 'church', 'formal'],
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22')
    }
  ]

  const cardBg = useColorModeValue('white', 'gray.800')

  const handleViewMoodBoard = (moodBoard: MoodBoard) => {
    // Navigate to mood board detail page
    window.location.href = `/wedding/${weddingId}/mood-boards/${moodBoard.id}`
  }

  const handleCreateMoodBoard = (moodBoardData: Partial<MoodBoard>) => {
    console.log('Creating mood board:', moodBoardData)
    // TODO: Implement API call to create mood board
    onClose()
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
            <Text fontSize="2xl" fontWeight="bold">Mood Boards</Text>
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
                  {moodBoards.reduce((sum, board) => sum + board.images.length, 0)}
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
                  {moodBoards.reduce((sum, board) => sum + board.videos.length, 0)}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} size="sm">
            <CardBody>
              <VStack spacing={2}>
                <HStack spacing={2}>
                  <Text fontSize="sm" color="neutral.600">Style Keywords</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {new Set(moodBoards.flatMap(board => board.styleKeywords)).size}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Mood Boards Grid */}
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
                moodBoard={moodBoard}
                onView={() => handleViewMoodBoard(moodBoard)}
              />
            ))}
          </SimpleGrid>
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
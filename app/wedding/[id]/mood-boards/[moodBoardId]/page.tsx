'use client'

import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MediaUploadZone } from '@/components/wedding/MediaUploadZone'
import { ColorPaletteManager } from '@/components/wedding/ColorPaletteManager'
import { StyleKeywordManager } from '@/components/wedding/StyleKeywordManager'
import { InspirationLinkManager } from '@/components/wedding/InspirationLinkManager'
import { MediaGallery } from '@/components/wedding/MediaGallery'
import { ArrowLeft, Edit, Share, Download, Plus } from 'lucide-react'
import type { MoodBoard, InspirationLink, MediaAsset, ColorPalette } from '@/types'

// Define local interface that matches component expectations
interface LocalMoodBoard {
  id: string;
  name: string;
  description?: string;
  images: LocalMediaAsset[];
  videos: LocalMediaAsset[];
  links: LocalInspirationLink[];
  colorPalette: LocalColorPalette;
  styleKeywords: string[];
  phase_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LocalMediaAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  s3_key: string;
  filename: string;
  tags?: string[];
  uploaded_at: string;
  metadata: any;
}

interface LocalInspirationLink {
  id: string;
  url: string;
  title: string;
  description: string;
  source: string;
  tags?: string[];
  added_at: string;
}

interface LocalColorPalette {
  primary: string[];
  secondary: string[];
  accent: string[];
  neutral: string[];
}

export default function MoodBoardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const weddingId = params.id as string
  const moodBoardId = params.moodBoardId as string
  
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure()
  
  // Mock data - will be replaced with real API calls
  const [moodBoard, setMoodBoard] = useState<LocalMoodBoard>({
    id: moodBoardId,
    name: 'Overall Wedding Vision',
    description: 'Main inspiration and color palette for the entire wedding',
    images: [
      {
        id: '1',
        type: 'IMAGE',
        url: '/api/placeholder/400/300',
        s3_key: 'wedding-1/mood-1.jpg',
        filename: 'inspiration-1.jpg',
        tags: ['romantic', 'elegant', 'flowers'],
        uploaded_at: '2024-01-15T00:00:00.000Z',
        metadata: { size: 1024000, format: 'jpg', dimensions: { width: 400, height: 300 } }
      },
      {
        id: '2',
        type: 'IMAGE',
        url: '/api/placeholder/400/300',
        s3_key: 'wedding-1/mood-2.jpg',
        filename: 'inspiration-2.jpg',
        tags: ['decor', 'table-setting'],
        uploaded_at: '2024-01-16T00:00:00.000Z',
        metadata: { size: 1024000, format: 'jpg', dimensions: { width: 400, height: 300 } }
      }
    ],
    videos: [],
    links: [
      {
        id: '1',
        url: 'https://pinterest.com/pin/123',
        title: 'Elegant Garden Wedding',
        description: 'Beautiful outdoor ceremony setup with romantic lighting',
        source: 'Pinterest',
        tags: ['garden', 'outdoor', 'ceremony'],
        added_at: '2024-01-17T00:00:00.000Z'
      }
    ],
    colorPalette: {
      primary: ['#E8B4B8', '#F4D1D1'],
      secondary: ['#A8C8A8', '#D4E8D4'],
      accent: ['#F5E6D3', '#E8D5B7'],
      neutral: ['#F8F8F8', '#E5E5E5']
    },
    styleKeywords: ['romantic', 'elegant', 'garden', 'vintage', 'soft', 'natural'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  })

  const cardBg = useColorModeValue('white', 'gray.800')

  const handleMediaUpload = (files: File[]) => {
    console.log('Uploading files:', files)
    // TODO: Implement file upload logic
    onUploadClose()
  }

  const handleColorPaletteUpdate = (colorPalette: LocalColorPalette) => {
    setMoodBoard((prev: LocalMoodBoard) => ({
      ...prev,
      colorPalette,
      updatedAt: new Date()
    }))
  }

  const handleStyleKeywordsUpdate = (styleKeywords: string[]) => {
    setMoodBoard((prev: LocalMoodBoard) => ({
      ...prev,
      styleKeywords,
      updatedAt: new Date()
    }))
  }

  const handleInspirationLinksUpdate = (links: any[]) => {
    const localLinks: LocalInspirationLink[] = links.map(link => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      source: link.source,
      tags: link.tags || [],
      added_at: link.added_at || new Date().toISOString()
    }))
    
    setMoodBoard((prev: LocalMoodBoard) => ({
      ...prev,
      links: localLinks,
      updatedAt: new Date()
    }))
  }

  const handleMediaDelete = (mediaId: string) => {
    setMoodBoard((prev: LocalMoodBoard) => ({
      ...prev,
      images: prev.images.filter(img => img.id !== mediaId),
      videos: prev.videos.filter(vid => vid.id !== mediaId),
      updatedAt: new Date()
    }))
  }

  return (
    <DashboardLayout
      title={moodBoard.name}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Wedding Details', href: `/wedding/${weddingId}` },
        { label: 'Mood Boards', href: `/wedding/${weddingId}/mood-boards` },
        { label: moodBoard.name },
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<ArrowLeft size={16} />}
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                    <Text fontSize="2xl" fontWeight="bold">
                      {moodBoard.name}
                    </Text>
                    {moodBoard.phase_id && (
                      <Badge colorScheme="brand">Phase Specific</Badge>
                    )}
                  </HStack>
                  
                  {moodBoard.description && (
                    <Text color="neutral.600" maxW="2xl">
                      {moodBoard.description}
                    </Text>
                  )}
                  
                  <HStack spacing={4} fontSize="sm" color="neutral.500">
                    <Text>
                      {moodBoard.images.length + moodBoard.videos.length} media items
                    </Text>
                    <Text>•</Text>
                    <Text>{moodBoard.links.length} inspiration links</Text>
                    <Text>•</Text>
                    <Text>Updated {moodBoard.updatedAt.toLocaleDateString()}</Text>
                  </HStack>
                </VStack>
                
                <HStack spacing={2}>
                  <Button
                    leftIcon={<Plus size={16} />}
                    colorScheme="brand"
                    onClick={onUploadOpen}
                  >
                    Add Media
                  </Button>
                  <Button leftIcon={<Edit size={16} />} variant="outline">
                    Edit Details
                  </Button>
                  <Button leftIcon={<Share size={16} />} variant="outline">
                    Share
                  </Button>
                  <Button leftIcon={<Download size={16} />} variant="outline">
                    Export
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Content Tabs */}
        <Card bg={cardBg}>
          <CardBody p={0}>
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList>
                <Tab>Media Gallery</Tab>
                <Tab>Color Palette</Tab>
                <Tab>Style Keywords</Tab>
                <Tab>Inspiration Links</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <MediaGallery
                    images={moodBoard.images}
                    videos={moodBoard.videos}
                    onDelete={handleMediaDelete}
                    onUpload={onUploadOpen}
                  />
                </TabPanel>
                
                <TabPanel>
                  <ColorPaletteManager
                    colorPalette={moodBoard.colorPalette}
                    onChange={handleColorPaletteUpdate}
                  />
                </TabPanel>
                
                <TabPanel>
                  <StyleKeywordManager
                    keywords={moodBoard.styleKeywords}
                    onChange={handleStyleKeywordsUpdate}
                  />
                </TabPanel>
                
                <TabPanel>
                  <InspirationLinkManager
                    links={moodBoard.links}
                    onChange={handleInspirationLinksUpdate}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Media Upload Modal */}
        <MediaUploadZone
          isOpen={isUploadOpen}
          onClose={onUploadClose}
          onUpload={handleMediaUpload}
          acceptedTypes={['image/*', 'video/*']}
          maxFiles={10}
        />
      </VStack>
    </DashboardLayout>
  )
}
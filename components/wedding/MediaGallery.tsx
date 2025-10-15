'use client'

import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  SimpleGrid,
  Image,
  Card,
  CardBody,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Wrap,
  WrapItem,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  AspectRatio,
} from '@chakra-ui/react'
import { 
  Plus, 
  Play, 
  Download, 
  Trash2, 
  Edit, 
  MoreVertical,
  Image as ImageIcon,
  Video,
  Eye
} from 'lucide-react'
import type { MediaAsset } from '@/types'

interface MediaGalleryProps {
  images: MediaAsset[]
  videos: MediaAsset[]
  onDelete: (mediaId: number) => void
  onUpload: () => void
}

export function MediaGallery({ images, videos, onDelete, onUpload }: MediaGalleryProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all')
  const toast = useToast()

  const allMedia = [...images, ...videos].sort((a, b) => 
    new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  )

  const filteredMedia = allMedia.filter(media => {
    if (filter === 'all') return true
    if (filter === 'images') return media.type === 'IMAGE'
    if (filter === 'videos') return media.type === 'VIDEO'
    return true
  })

  const handleViewMedia = (media: MediaAsset) => {
    setSelectedMedia(media)
    onOpen()
  }

  const handleDownload = (media: MediaAsset) => {
    // In a real implementation, this would download from S3
    const link = document.createElement('a')
    link.href = media.url
    link.download = media.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Download started',
      description: `${media.filename} is being downloaded.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleDelete = (media: MediaAsset) => {
    onDelete(media.id)
    toast({
      title: 'Media deleted',
      description: `${media.filename} has been removed from your mood board.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Media Gallery</Text>
          <Text fontSize="sm" color="neutral.600">
            {images.length} images, {videos.length} videos
          </Text>
        </VStack>
        
        <HStack spacing={3}>
          {/* Filter Buttons */}
          <HStack spacing={1}>
            <Button
              size="sm"
              variant={filter === 'all' ? 'solid' : 'ghost'}
              colorScheme="brand"
              onClick={() => setFilter('all')}
            >
              All ({allMedia.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'images' ? 'solid' : 'ghost'}
              colorScheme="brand"
              onClick={() => setFilter('images')}
            >
              Images ({images.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'videos' ? 'solid' : 'ghost'}
              colorScheme="brand"
              onClick={() => setFilter('videos')}
            >
              Videos ({videos.length})
            </Button>
          </HStack>
          
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            onClick={onUpload}
          >
            Add Media
          </Button>
        </HStack>
      </HStack>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {filteredMedia.map((media) => (
            <Card key={media.id} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody p={0}>
                <VStack spacing={0} align="stretch">
                  {/* Media Preview */}
                  <Box position="relative" cursor="pointer" onClick={() => handleViewMedia(media)}>
                    <AspectRatio ratio={4/3}>
                      {media.type === 'IMAGE' ? (
                        <Image
                          src={media.url}
                          alt={media.filename}
                          objectFit="cover"
                          borderTopRadius="md"
                        />
                      ) : (
                        <Box
                          bg="black"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderTopRadius="md"
                          position="relative"
                        >
                          {/* Video thumbnail would be generated in real implementation */}
                          <Video size={32} color="white" />
                          <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)"
                            bg="blackAlpha.600"
                            borderRadius="full"
                            p={2}
                          >
                            <Play size={20} color="white" />
                          </Box>
                        </Box>
                      )}
                    </AspectRatio>
                    
                    {/* Media Type Badge */}
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme={media.type === 'IMAGE' ? 'green' : 'purple'}
                      size="sm"
                    >
                      {media.type === 'IMAGE' ? 'IMG' : 'VID'}
                    </Badge>

                    {/* Duration for videos */}
                    {media.type === 'VIDEO' && (media.metadata as any)?.duration && (
                      <Badge
                        position="absolute"
                        bottom={2}
                        right={2}
                        bg="blackAlpha.700"
                        color="white"
                        size="sm"
                      >
                        {formatDuration((media.metadata as any)?.duration || 0)}
                      </Badge>
                    )}

                    {/* Hover overlay */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="blackAlpha.600"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0}
                      _hover={{ opacity: 1 }}
                      transition="opacity 0.2s"
                      borderTopRadius="md"
                    >
                      <Eye size={24} color="white" />
                    </Box>
                  </Box>

                  {/* Media Info */}
                  <VStack spacing={2} p={3} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1} minW={0}>
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                          {media.filename}
                        </Text>
                        <HStack spacing={2} fontSize="xs" color="neutral.500">
                          <Text>{formatFileSize((media.metadata as any)?.size || 0)}</Text>
                          {(media.metadata as any)?.dimensions && (
                            <Text>
                              {(media.metadata as any).dimensions.width}×{(media.metadata as any).dimensions.height}
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                      
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Media options"
                          icon={<MoreVertical size={14} />}
                          size="sm"
                          variant="ghost"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<Eye size={14} />}
                            onClick={() => handleViewMedia(media)}
                          >
                            View
                          </MenuItem>
                          <MenuItem
                            icon={<Download size={14} />}
                            onClick={() => handleDownload(media)}
                          >
                            Download
                          </MenuItem>
                          <MenuItem
                            icon={<Edit size={14} />}
                          >
                            Edit Tags
                          </MenuItem>
                          <MenuItem
                            icon={<Trash2 size={14} />}
                            color="red.500"
                            onClick={() => handleDelete(media)}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>

                    {/* Tags */}
                    {media.tags && media.tags.length > 0 && (
                      <Wrap spacing={1}>
                        {media.tags.slice(0, 2).map((tag) => tag ? (
                          <WrapItem key={tag}>
                            <Tag size="xs" colorScheme="brand">
                              {tag}
                            </Tag>
                          </WrapItem>
                        ) : null)}
                        {media.tags && media.tags.length > 2 && (
                          <WrapItem>
                            <Tag size="sm" variant="outline">
                              +{(media.tags?.length || 0) - 2}
                            </Tag>
                          </WrapItem>
                        )}
                      </Wrap>
                    )}

                    <Text fontSize="xs" color="neutral.500">
                      {new Date(media.uploaded_at).toLocaleDateString()}
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Card>
          <CardBody py={12}>
            <VStack spacing={4}>
              {filter === 'all' && <ImageIcon size={48} color="var(--chakra-colors-neutral-400)" />}
              {filter === 'images' && <ImageIcon size={48} color="var(--chakra-colors-neutral-400)" />}
              {filter === 'videos' && <Video size={48} color="var(--chakra-colors-neutral-400)" />}
              
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="neutral.600">
                  {filter === 'all' && 'No media files yet'}
                  {filter === 'images' && 'No images yet'}
                  {filter === 'videos' && 'No videos yet'}
                </Text>
                <Text color="neutral.500" textAlign="center">
                  {filter === 'all' && 'Upload images and videos to start building your mood board'}
                  {filter === 'images' && 'Upload images to add visual inspiration to your mood board'}
                  {filter === 'videos' && 'Upload videos to capture motion and atmosphere for your wedding'}
                </Text>
              </VStack>
              <Button
                leftIcon={<Plus size={16} />}
                colorScheme="brand"
                onClick={onUpload}
              >
                Upload {filter === 'all' ? 'Media' : filter === 'images' ? 'Images' : 'Videos'}
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Media Viewer Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" shadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton color="white" size="lg" />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
            {selectedMedia && (
              <Box maxW="full" maxH="full">
                {selectedMedia.type === 'IMAGE' ? (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.filename}
                    maxW="full"
                    maxH="90vh"
                    objectFit="contain"
                  />
                ) : (
                  <Box
                    as="video"
                    controls
                    maxW="full"
                    maxH="90vh"
                    src={selectedMedia.url}
                  />
                )}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Switch,
  Text,
  Divider,
  useToast,
  Flex,
  Badge,
  IconButton,
  SimpleGrid,
  Box,
  Image,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, Plus, X } from 'lucide-react'
import type { UIMoodBoard } from '@/types'
import { ColorPaletteManager } from './ColorPaletteManager'
import { StyleKeywordManager } from './StyleKeywordManager'
import { MediaUploadZone } from './MediaUploadZone'

const editMoodBoardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  isPublic: z.boolean(),
  isFinalized: z.boolean(),
})

type EditMoodBoardFormData = z.infer<typeof editMoodBoardSchema>

interface EditMoodBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<UIMoodBoard>) => Promise<void>
  moodBoard: UIMoodBoard
}

export function EditMoodBoardModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  moodBoard
}: EditMoodBoardModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false)
  const [isVideoUploadOpen, setIsVideoUploadOpen] = useState(false)
  const [styleKeywords, setStyleKeywords] = useState<string[]>(moodBoard.styleKeywords || [])
  const [colorPalette, setColorPalette] = useState(moodBoard.colorPalette ? {
    primary: moodBoard.colorPalette.primary || [],
    secondary: moodBoard.colorPalette.secondary || [],
    accent: moodBoard.colorPalette.accent || [],
    neutral: moodBoard.colorPalette.neutral || []
  } : {
    primary: [],
    secondary: [],
    accent: [],
    neutral: []
  })
  const [inspirationLinks, setInspirationLinks] = useState(moodBoard.inspirationLinks || [])
  const [images, setImages] = useState(moodBoard.images || [])
  const [videos, setVideos] = useState(moodBoard.videos || [])
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<EditMoodBoardFormData>({
    resolver: zodResolver(editMoodBoardSchema),
    defaultValues: {
      name: moodBoard.name,
      description: moodBoard.description || '',
      isPublic: moodBoard.isPublic || false,
      isFinalized: moodBoard.isFinalized || false,
    },
    mode: 'onChange',
  })

  const watchedValues = watch()

  useEffect(() => {
    if (isOpen) {
      setStyleKeywords(moodBoard.styleKeywords || [])
      setColorPalette(moodBoard.colorPalette ? {
        primary: moodBoard.colorPalette.primary || [],
        secondary: moodBoard.colorPalette.secondary || [],
        accent: moodBoard.colorPalette.accent || [],
        neutral: moodBoard.colorPalette.neutral || []
      } : {
        primary: [],
        secondary: [],
        accent: [],
        neutral: []
      })
      setInspirationLinks(moodBoard.inspirationLinks || [])
      setImages(moodBoard.images || [])
      setVideos(moodBoard.videos || [])
      reset({
        name: moodBoard.name,
        description: moodBoard.description || '',
        isPublic: moodBoard.isPublic || false,
        isFinalized: moodBoard.isFinalized || false,
      })
    }
  }, [isOpen, moodBoard, reset])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleFormSubmit = async (data: EditMoodBoardFormData) => {
    try {
      setIsSubmitting(true)

      const updatedMoodBoard: Partial<UIMoodBoard> = {
        id: moodBoard.id,
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        isFinalized: data.isFinalized,
        styleKeywords,
        colorPalette,
        inspirationLinks,
        images,
        videos,
        updatedAt: new Date(),
      }

      await onSubmit(updatedMoodBoard)

      toast({
        title: 'Mood Board Updated',
        description: `"${data.name}" has been successfully updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onClose()
    } catch (error) {
      console.error('Error updating mood board:', error)
      toast({
        title: 'Error',
        description: 'Failed to update mood board. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (newFiles: File[]) => {
    // Convert File objects to the expected format
    const newImages = newFiles.map(file => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      tags: [],
      uploadedAt: new Date()
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const handleVideoUpload = (newFiles: File[]) => {
    // Convert File objects to the expected format
    const newVideos = newFiles.map(file => ({
      id: `vid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      filename: file.name,
      tags: [],
      uploadedAt: new Date()
    }))
    setVideos(prev => [...prev, ...newVideos])
  }

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const handleRemoveVideo = (videoId: string) => {
    setVideos(prev => prev.filter(vid => vid.id !== videoId))
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'style', label: 'Style & Colors' },
    { id: 'media', label: 'Media' },
    { id: 'links', label: 'Inspiration' },
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <Text>Edit Mood Board</Text>
          <Text fontSize="sm" color="gray.600" fontWeight="normal" mt={1}>
            Update your mood board details and content
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Tab Navigation */}
            <HStack spacing={1} borderBottom="1px solid" borderColor="gray.200">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'solid' : 'ghost'}
                  colorScheme={activeTab === tab.id ? 'purple' : 'gray'}
                  size="sm"
                  borderRadius="md md 0 0"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </HStack>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <VStack spacing={4} align="stretch">
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Mood Board Name</FormLabel>
                    <Input
                      {...register('name')}
                      placeholder="Enter mood board name"
                    />
                    {errors.name && (
                      <Text color="red.500" fontSize="sm">
                        {errors.name.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...register('description')}
                      placeholder="Describe this mood board..."
                      rows={3}
                    />
                    {errors.description && (
                      <Text color="red.500" fontSize="sm">
                        {errors.description.message}
                      </Text>
                    )}
                  </FormControl>

                  <Divider />

                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">Public Mood Board</Text>
                          <Text fontSize="sm" color="gray.600">
                            Allow others to view this mood board
                          </Text>
                        </VStack>
                        <Switch
                          {...register('isPublic')}
                          colorScheme="purple"
                          size="lg"
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">Finalized</Text>
                          <Text fontSize="sm" color="gray.600">
                            Mark as complete and ready for review
                          </Text>
                        </VStack>
                        <Switch
                          {...register('isFinalized')}
                          colorScheme="green"
                          size="lg"
                        />
                      </HStack>
                    </FormControl>
                  </VStack>
                </VStack>
              )}

              {/* Style & Colors Tab */}
              {activeTab === 'style' && (
                <VStack spacing={6} align="stretch">
                  <StyleKeywordManager
                    keywords={styleKeywords}
                    onChange={setStyleKeywords}
                  />
                  <ColorPaletteManager
                    colorPalette={colorPalette}
                    onChange={setColorPalette}
                  />
                </VStack>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <VStack spacing={6} align="stretch">
                  {/* Images Section */}
                  <Box>
                    <Text fontWeight="semibold" mb={3}>Images</Text>
                    <Button
                      leftIcon={<Plus size={16} />}
                      onClick={() => setIsImageUploadOpen(true)}
                      colorScheme="purple"
                      variant="outline"
                      mb={4}
                    >
                      Add Images
                    </Button>
                    {images.length > 0 && (
                      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4} mt={4}>
                        {images.map((image) => (
                          <Box key={image.id} position="relative" borderRadius="md" overflow="hidden">
                            <Image
                              src={image.url}
                              alt={image.filename}
                              w="100%"
                              h="120px"
                              objectFit="cover"
                            />
                            <IconButton
                              icon={<X size={16} />}
                              size="sm"
                              colorScheme="red"
                              position="absolute"
                              top={2}
                              right={2}
                              onClick={() => handleRemoveImage(image.id)}
                              aria-label="Remove image"
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>

                  <Divider />

                  {/* Videos Section */}
                  <Box>
                    <Text fontWeight="semibold" mb={3}>Videos</Text>
                    <Button
                      leftIcon={<Plus size={16} />}
                      onClick={() => setIsVideoUploadOpen(true)}
                      colorScheme="purple"
                      variant="outline"
                      mb={4}
                    >
                      Add Videos
                    </Button>
                    {videos.length > 0 && (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                        {videos.map((video) => (
                          <Box key={video.id} position="relative" borderRadius="md" overflow="hidden">
                            <video
                              src={video.url}
                              controls
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              icon={<X size={16} />}
                              size="sm"
                              colorScheme="red"
                              position="absolute"
                              top={2}
                              right={2}
                              onClick={() => handleRemoveVideo(video.id)}
                              aria-label="Remove video"
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    )}
                  </Box>
                </VStack>
              )}

              {/* Inspiration Links Tab */}
              {activeTab === 'links' && (
                <Box>
                  <Text color="gray.600" textAlign="center" py={8}>
                    Inspiration links editing coming soon!
                  </Text>
                </Box>
              )}
            </form>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleSubmit(handleFormSubmit)}
              isLoading={isSubmitting}
              loadingText="Updating..."
              isDisabled={!isValid}
            >
              Update Mood Board
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
      
      {/* Media Upload Modals */}
      <MediaUploadZone
        isOpen={isImageUploadOpen}
        onClose={() => setIsImageUploadOpen(false)}
        onUpload={handleImageUpload}
        acceptedTypes={["image/*"]}
        maxFiles={10}
      />
      
      <MediaUploadZone
        isOpen={isVideoUploadOpen}
        onClose={() => setIsVideoUploadOpen(false)}
        onUpload={handleVideoUpload}
        acceptedTypes={["video/*"]}
        maxFiles={5}
      />
    </Modal>
  )
}
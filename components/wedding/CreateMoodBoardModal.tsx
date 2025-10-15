'use client'

import React, { useState } from 'react'
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
  Select,
  Text,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { MoodBoard } from '@/types'

const createMoodBoardSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  phaseId: z.string().optional(),
})

type CreateMoodBoardFormData = z.infer<typeof createMoodBoardSchema>

interface CreateMoodBoardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<MoodBoard>) => void
  weddingId: string
}

export function CreateMoodBoardModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: CreateMoodBoardModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CreateMoodBoardFormData>({
    resolver: zodResolver(createMoodBoardSchema),
    mode: 'onChange'
  })

  // Mock wedding phases - will be replaced with real data
  const weddingPhases = [
    { id: '1', name: 'Legal Ceremony' },
    { id: '2', name: 'Church Wedding' },
    { id: '3', name: 'Reception' },
    { id: '4', name: 'After Party' },
  ]

  const handleFormSubmit = async (data: CreateMoodBoardFormData) => {
    setIsSubmitting(true)
    
    try {
      const moodBoardData: any = {
        name: data.name,
        description: data.description || '',
        phase_id: data.phaseId || undefined,
        images: [],
        videos: [],
        links: [],
        colorPalette: {
          primary: [],
          secondary: [],
          accent: [],
          neutral: []
        },
        styleKeywords: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await onSubmit(moodBoardData)
      
      toast({
        title: 'Mood board created',
        description: 'Your new mood board has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      
      reset()
      onClose()
    } catch (error) {
      toast({
        title: 'Error creating mood board',
        description: 'There was an error creating your mood board. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Mood Board</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Text color="neutral.600">
                Create a mood board to collect and organize visual inspiration for your wedding.
              </Text>

              <Divider />

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Mood Board Name *</FormLabel>
                <Input
                  {...register('name')}
                  placeholder="e.g., Overall Wedding Vision, Reception Decor"
                />
                {errors.name && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.name.message}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register('description')}
                  placeholder="Describe the purpose and style of this mood board..."
                  rows={3}
                />
                {errors.description && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.description.message}
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Wedding Phase (Optional)</FormLabel>
                <Select {...register('phaseId')} placeholder="Select a specific phase">
                  {weddingPhases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.name}
                    </option>
                  ))}
                </Select>
                <Text fontSize="sm" color="neutral.500" mt={1}>
                  Leave empty to create a general mood board for the entire wedding
                </Text>
              </FormControl>

              <VStack spacing={3} align="start" p={4} bg="neutral.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="medium">What you can add to your mood board:</Text>
                <VStack spacing={1} align="start" fontSize="sm" color="neutral.600">
                  <Text>• Upload images and videos for visual inspiration</Text>
                  <Text>• Add links from Pinterest, Instagram, and other sources</Text>
                  <Text>• Create and manage color palettes</Text>
                  <Text>• Tag content with style keywords</Text>
                </VStack>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                isLoading={isSubmitting}
                isDisabled={!isValid}
              >
                Create Mood Board
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
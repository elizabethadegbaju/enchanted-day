'use client'

import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Input,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
  Badge,
  Link,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Wrap,
  WrapItem,
  Tag,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, ExternalLink, Edit, Trash2, Link as LinkIcon } from 'lucide-react'
import type { InspirationLink } from '@/types'

interface InspirationLinkManagerProps {
  links: InspirationLink[]
  onChange: (links: InspirationLink[]) => void
}

const addLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  tags: z.string().optional(),
})

type AddLinkFormData = z.infer<typeof addLinkSchema>

export function InspirationLinkManager({ links, onChange }: InspirationLinkManagerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingLink, setEditingLink] = useState<InspirationLink | null>(null)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid }
  } = useForm<AddLinkFormData>({
    resolver: zodResolver(addLinkSchema),
    mode: 'onChange'
  })

  const detectSource = (url: string): string => {
    if (url.includes('pinterest.com')) return 'Pinterest'
    if (url.includes('instagram.com')) return 'Instagram'
    if (url.includes('theknot.com')) return 'The Knot'
    if (url.includes('weddingwire.com')) return 'WeddingWire'
    if (url.includes('brides.com')) return 'Brides'
    if (url.includes('marthastewartweddings.com')) return 'Martha Stewart Weddings'
    if (url.includes('stylemepretty.com')) return 'Style Me Pretty'
    return 'Website'
  }

  const generateThumbnail = (): string => {
    // In a real implementation, this would use a service to generate thumbnails
    // For now, return a placeholder
    return '/api/placeholder/300/200'
  }

  const handleFormSubmit = (data: AddLinkFormData) => {
    const tags = data.tags 
      ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : []

    const newLink: any = {
      id: editingLink?.id || Math.floor(Math.random() * 1000000),
      url: data.url,
      title: data.title,
      description: data.description || '',
      source: detectSource(data.url),
      tags,
      added_at: editingLink?.added_at || new Date().toISOString()
    }

    if (editingLink) {
      // Update existing link
      const updatedLinks = links.map(link => 
        link.id === editingLink.id ? newLink : link
      )
      onChange(updatedLinks)
      toast({
        title: 'Link updated',
        description: 'Inspiration link has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      // Add new link
      if (links.length >= 20) {
        toast({
          title: 'Maximum links reached',
          description: 'You can have up to 20 inspiration links.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      onChange([...links, newLink])
      toast({
        title: 'Link added',
        description: 'Inspiration link has been added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }

    handleCloseModal()
  }

  const handleEditLink = (link: InspirationLink) => {
    setEditingLink(link)
    setValue('url', link.url)
    setValue('title', link.title)
    setValue('description', link.description || '')
    setValue('tags', link.tags ? link.tags.join(', ') : '')
    onOpen()
  }

  const handleDeleteLink = (linkId: string) => {
    const updatedLinks = links.filter(link => link.id !== linkId)
    onChange(updatedLinks)
    toast({
      title: 'Link removed',
      description: 'Inspiration link has been removed.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleCloseModal = () => {
    setEditingLink(null)
    reset()
    onClose()
  }

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'Pinterest': 'red',
      'Instagram': 'purple',
      'The Knot': 'pink',
      'WeddingWire': 'orange',
      'Brides': 'green',
      'Martha Stewart Weddings': 'teal',
      'Style Me Pretty': 'blue',
      'Website': 'gray'
    }
    return colors[source] || 'gray'
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Inspiration Links</Text>
          <Text fontSize="sm" color="neutral.600">
            {links.length}/20 links • Save inspiration from Pinterest, Instagram, and other sources
          </Text>
        </VStack>
        <Button
          leftIcon={<Plus size={16} />}
          colorScheme="brand"
          onClick={onOpen}
          isDisabled={links.length >= 20}
        >
          Add Link
        </Button>
      </HStack>

      {/* Links Grid */}
      {links.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {links.map((link) => (
            <Card key={link.id} variant="outline" _hover={{ shadow: 'md' }}>
              <CardBody p={0}>
                <VStack spacing={0} align="stretch">
                  {/* Thumbnail */}
                  <Box position="relative">
                    <Image
                      src={'/api/placeholder/300/200'}
                      alt={link.title}
                      w="full"
                      h="150px"
                      objectFit="cover"
                      borderTopRadius="md"
                      fallback={
                        <Box
                          w="full"
                          h="150px"
                          bg="neutral.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderTopRadius="md"
                        >
                          <LinkIcon size={32} color="var(--chakra-colors-neutral-400)" />
                        </Box>
                      }
                    />
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme={getSourceColor(link.source)}
                      size="sm"
                    >
                      {link.source}
                    </Badge>
                  </Box>

                  {/* Content */}
                  <VStack spacing={3} p={4} align="stretch">
                    <VStack spacing={2} align="start">
                      <Text fontSize="md" fontWeight="semibold" noOfLines={2}>
                        {link.title}
                      </Text>
                      {link.description && (
                        <Text fontSize="sm" color="neutral.600" noOfLines={3}>
                          {link.description}
                        </Text>
                      )}
                    </VStack>

                    {/* Tags */}
                    {link.tags && link.tags.length > 0 && (
                      <Wrap spacing={1}>
                        {link.tags.slice(0, 3).map((tag: string | null) => tag ? (
                          <WrapItem key={tag}>
                            <Tag size="sm" variant="subtle" colorScheme="brand">
                              {tag}
                            </Tag>
                          </WrapItem>
                        ) : null)}
                        {link.tags && link.tags.length > 3 && (
                          <WrapItem>
                            <Tag size="sm" variant="outline">
                              +{(link.tags?.length || 0) - 3}
                            </Tag>
                          </WrapItem>
                        )}
                      </Wrap>
                    )}

                    {/* Actions */}
                    <HStack spacing={2} justify="space-between">
                      <Link
                        href={link.url}
                        isExternal
                        fontSize="sm"
                        color="brand.500"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        <HStack spacing={1}>
                          <ExternalLink size={14} />
                          <Text>View Original</Text>
                        </HStack>
                      </Link>
                      
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Edit link"
                          icon={<Edit size={14} />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditLink(link)}
                        />
                        <IconButton
                          aria-label="Delete link"
                          icon={<Trash2 size={14} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteLink(link.id)}
                        />
                      </HStack>
                    </HStack>

                    {/* Added Date */}
                    <Text fontSize="xs" color="neutral.500">
                      Added {new Date(link.added_at).toLocaleDateString()}
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
              <LinkIcon size={48} color="var(--chakra-colors-neutral-400)" />
              <VStack spacing={2}>
                <Text fontSize="lg" fontWeight="semibold" color="neutral.600">
                  No inspiration links yet
                </Text>
                <Text color="neutral.500" textAlign="center">
                  Add links from Pinterest, Instagram, and other sources to collect inspiration
                </Text>
              </VStack>
              <Button
                leftIcon={<Plus size={16} />}
                colorScheme="brand"
                onClick={onOpen}
              >
                Add Your First Link
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Add/Edit Link Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingLink ? 'Edit Inspiration Link' : 'Add Inspiration Link'}
          </ModalHeader>
          <ModalCloseButton />
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.url}>
                  <FormLabel>URL *</FormLabel>
                  <Input
                    {...register('url')}
                    placeholder="https://pinterest.com/pin/..."
                    type="url"
                  />
                  {errors.url && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.url.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.title}>
                  <FormLabel>Title *</FormLabel>
                  <Input
                    {...register('title')}
                    placeholder="e.g., Elegant Garden Wedding Setup"
                  />
                  {errors.title && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.title.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register('description')}
                    placeholder="Describe what you like about this inspiration..."
                    rows={3}
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.description.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Tags</FormLabel>
                  <Input
                    {...register('tags')}
                    placeholder="garden, outdoor, ceremony, flowers (comma-separated)"
                  />
                  <Text fontSize="sm" color="neutral.500" mt={1}>
                    Add tags to help organize and find this inspiration later
                  </Text>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <HStack spacing={3}>
                <Button variant="ghost" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="brand"
                  isDisabled={!isValid}
                >
                  {editingLink ? 'Update Link' : 'Add Link'}
                </Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
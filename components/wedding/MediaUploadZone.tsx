'use client'

import React, { useState, useCallback } from 'react'
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
  Box,
  Text,
  Button,
  Progress,
  List,
  ListItem,
  Alert,
  AlertIcon,
  useToast,
  Divider,
} from '@chakra-ui/react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { Upload, File, X, Check, AlertCircle } from 'lucide-react'

interface MediaUploadZoneProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxFileSize?: number // in bytes
}

interface FileWithPreview extends File {
  preview?: string
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

export function MediaUploadZone({
  isOpen,
  onClose,
  onUpload,
  acceptedTypes = ['image/*', 'video/*'],
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
}: MediaUploadZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error) => {
          toast({
            title: `Error with ${file.name}`,
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        })
      })
    }

    // Process accepted files
    const newFiles: FileWithPreview[] = acceptedFiles.map((file) => {
      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending' as const,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      })
      return fileWithPreview
    })

    setFiles((prev: FileWithPreview[]) => {
      const combined = [...prev, ...newFiles]
      if (combined.length > maxFiles) {
        toast({
          title: 'Too many files',
          description: `Maximum ${maxFiles} files allowed. Extra files will be ignored.`,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        return combined.slice(0, maxFiles)
      }
      return combined
    })
  }, [maxFiles, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize: maxFileSize,
    multiple: true,
  })

  const removeFile = (fileId: string) => {
    setFiles((prev: FileWithPreview[]) => {
      const updated = prev.filter(f => f.id !== fileId)
      // Revoke object URLs to prevent memory leaks
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updated
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    
    try {
      // Simulate upload progress
      for (let i = 0; i < files.length; i++) {
        setFiles((prev: FileWithPreview[]) => prev.map(f => 
          f.id === files[i].id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ))

        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setFiles((prev: FileWithPreview[]) => prev.map(f => 
            f.id === files[i].id 
              ? { ...f, progress }
              : f
          ))
        }

        setFiles((prev: FileWithPreview[]) => prev.map(f => 
          f.id === files[i].id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ))
      }

      // Call the upload handler
      await onUpload(files)
      
      toast({
        title: 'Upload successful',
        description: `${files.length} file(s) uploaded successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      handleClose()
    } catch (err: unknown) {
      setFiles((prev: FileWithPreview[]) => prev.map(f => ({ 
        ...f, 
        status: 'error', 
        error: 'Upload failed' 
      })))
      
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your files. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    // Clean up object URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setIsUploading(false)
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('video/')) return '🎥'
    return '📄'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Media</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Upload Zone */}
            <Box
              {...getRootProps()}
              border="2px dashed"
              borderColor={isDragActive ? 'brand.500' : 'neutral.300'}
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              bg={isDragActive ? 'brand.50' : 'neutral.50'}
              transition="all 0.2s"
              _hover={{ borderColor: 'brand.400', bg: 'brand.50' }}
            >
              <input {...getInputProps()} />
              <VStack spacing={4}>
                <Upload size={48} color="var(--chakra-colors-brand-500)" />
                <VStack spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </Text>
                  <Text color="neutral.600">
                    or click to browse your computer
                  </Text>
                </VStack>
                <VStack spacing={1} fontSize="sm" color="neutral.500">
                  <Text>Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, MOV)</Text>
                  <Text>Maximum file size: {formatFileSize(maxFileSize)}</Text>
                  <Text>Maximum {maxFiles} files</Text>
                </VStack>
              </VStack>
            </Box>

            {/* File List */}
            {files.length > 0 && (
              <>
                <Divider />
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                      Selected Files ({files.length})
                    </Text>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFiles([])}
                      isDisabled={isUploading}
                    >
                      Clear All
                    </Button>
                  </HStack>

                  <List spacing={3} maxH="300px" overflowY="auto">
                    {files.map((file) => (
                      <ListItem key={file.id}>
                        <HStack spacing={3} align="start">
                          <Text fontSize="lg">{getFileIcon(file)}</Text>
                          
                          <VStack spacing={1} align="start" flex={1} minW={0}>
                            <HStack spacing={2} w="full">
                              <Text fontSize="sm" fontWeight="medium" noOfLines={1} flex={1}>
                                {file.name}
                              </Text>
                              <Text fontSize="xs" color="neutral.500">
                                {formatFileSize(file.size)}
                              </Text>
                            </HStack>
                            
                            {file.status === 'uploading' && (
                              <Box w="full">
                                <Progress
                                  value={file.progress || 0}
                                  size="sm"
                                  colorScheme="brand"
                                  borderRadius="full"
                                />
                                <Text fontSize="xs" color="neutral.500" mt={1}>
                                  Uploading... {file.progress || 0}%
                                </Text>
                              </Box>
                            )}
                            
                            {file.status === 'error' && (
                              <Alert status="error" size="sm" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="xs">{file.error || 'Upload failed'}</Text>
                              </Alert>
                            )}
                          </VStack>

                          <Box>
                            {file.status === 'pending' && (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() => removeFile(file.id)}
                                isDisabled={isUploading}
                              >
                                <X size={14} />
                              </Button>
                            )}
                            {file.status === 'success' && (
                              <Check size={16} color="var(--chakra-colors-green-500)" />
                            )}
                            {file.status === 'error' && (
                              <AlertCircle size={16} color="var(--chakra-colors-red-500)" />
                            )}
                          </Box>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose} isDisabled={isUploading}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleUpload}
              isLoading={isUploading}
              isDisabled={files.length === 0}
              loadingText="Uploading..."
            >
              Upload {files.length > 0 && `(${files.length})`}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
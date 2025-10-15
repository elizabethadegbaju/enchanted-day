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
  CardHeader,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Badge,
  useToast,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { Plus, Hash, Sparkles } from 'lucide-react'

interface StyleKeywordManagerProps {
  keywords: string[]
  onChange: (keywords: string[]) => void
}

const SUGGESTED_KEYWORDS = {
  'Style': [
    'romantic', 'elegant', 'rustic', 'modern', 'vintage', 'bohemian', 'classic', 'minimalist',
    'glamorous', 'whimsical', 'industrial', 'traditional', 'contemporary', 'chic', 'sophisticated'
  ],
  'Mood': [
    'intimate', 'festive', 'serene', 'joyful', 'dreamy', 'cozy', 'luxurious', 'playful',
    'dramatic', 'peaceful', 'energetic', 'magical', 'warm', 'fresh', 'timeless'
  ],
  'Setting': [
    'outdoor', 'indoor', 'garden', 'beach', 'forest', 'urban', 'countryside', 'mountain',
    'vineyard', 'ballroom', 'church', 'barn', 'rooftop', 'lakeside', 'desert'
  ],
  'Colors': [
    'neutral', 'pastel', 'bold', 'monochrome', 'colorful', 'earth-tones', 'jewel-tones',
    'soft', 'vibrant', 'muted', 'warm', 'cool', 'metallic', 'natural', 'bright'
  ],
  'Elements': [
    'floral', 'greenery', 'candles', 'lights', 'fabric', 'wood', 'metal', 'glass',
    'stone', 'lace', 'silk', 'burlap', 'crystal', 'pearls', 'feathers'
  ]
}

export function StyleKeywordManager({ keywords, onChange }: StyleKeywordManagerProps) {
  const [newKeyword, setNewKeyword] = useState('')
  const toast = useToast()

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase()
    
    if (!trimmedKeyword) {
      toast({
        title: 'Invalid keyword',
        description: 'Keyword cannot be empty.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (trimmedKeyword.length > 30) {
      toast({
        title: 'Keyword too long',
        description: 'Keywords cannot exceed 30 characters.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (keywords.includes(trimmedKeyword)) {
      toast({
        title: 'Keyword already exists',
        description: 'This keyword is already in your list.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (keywords.length >= 15) {
      toast({
        title: 'Maximum keywords reached',
        description: 'You can have up to 15 style keywords.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    onChange([...keywords, trimmedKeyword])
    setNewKeyword('')
  }

  const removeKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter(keyword => keyword !== keywordToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword(newKeyword)
    }
  }

  const addSuggestedKeyword = (keyword: string) => {
    addKeyword(keyword)
  }

  const clearAllKeywords = () => {
    onChange([])
    toast({
      title: 'Keywords cleared',
      description: 'All style keywords have been removed.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const getKeywordColor = (keyword: string) => {
    // Simple hash function to assign consistent colors
    let hash = 0
    for (let i = 0; i < keyword.length; i++) {
      hash = keyword.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = ['blue', 'green', 'purple', 'pink', 'orange', 'teal', 'cyan']
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Style Keywords</Text>
          <Text fontSize="sm" color="neutral.600">
            {keywords.length}/15 keywords • Define the style and mood of your wedding
          </Text>
        </VStack>
        {keywords.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAllKeywords}
          >
            Clear All
          </Button>
        )}
      </HStack>

      {/* Add New Keyword */}
      <Card>
        <CardHeader pb={3}>
          <Text fontSize="md" fontWeight="semibold">Add Style Keywords</Text>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <InputGroup>
                <Input
                  placeholder="Enter a style keyword (e.g., romantic, elegant, rustic)"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  maxLength={30}
                />
                <InputRightElement>
                  <Hash size={16} color="var(--chakra-colors-neutral-400)" />
                </InputRightElement>
              </InputGroup>
              <Button
                leftIcon={<Plus size={16} />}
                colorScheme="brand"
                onClick={() => addKeyword(newKeyword)}
                isDisabled={!newKeyword.trim() || keywords.length >= 15}
              >
                Add
              </Button>
            </HStack>
            
            <Text fontSize="xs" color="neutral.500">
              Keywords help describe your wedding style and can be used to find matching vendors and inspiration.
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Current Keywords */}
      <Card>
        <CardHeader pb={3}>
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="semibold">Your Keywords</Text>
            <Badge colorScheme="brand" variant="subtle">
              {keywords.length} keywords
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          {keywords.length > 0 ? (
            <Wrap spacing={2}>
              {keywords.map((keyword) => (
                <WrapItem key={keyword}>
                  <Tag
                    size="md"
                    colorScheme={getKeywordColor(keyword)}
                    variant="subtle"
                  >
                    <TagLabel>{keyword}</TagLabel>
                    <TagCloseButton onClick={() => removeKeyword(keyword)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Box
              p={6}
              border="2px dashed"
              borderColor="neutral.300"
              borderRadius="md"
              textAlign="center"
            >
              <VStack spacing={3}>
                <Hash size={32} color="var(--chakra-colors-neutral-400)" />
                <VStack spacing={1}>
                  <Text fontSize="md" color="neutral.600">No style keywords yet</Text>
                  <Text fontSize="sm" color="neutral.500">
                    Add keywords to describe your wedding style and mood
                  </Text>
                </VStack>
              </VStack>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Suggested Keywords */}
      <Card>
        <CardHeader pb={3}>
          <HStack spacing={2}>
            <Sparkles size={20} color="var(--chakra-colors-brand-500)" />
            <Text fontSize="md" fontWeight="semibold">Suggested Keywords</Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {Object.entries(SUGGESTED_KEYWORDS).map(([category, categoryKeywords]) => (
              <VStack key={category} spacing={2} align="start">
                <Text fontSize="sm" fontWeight="medium" color="neutral.700">
                  {category}
                </Text>
                <Wrap spacing={1}>
                  {categoryKeywords
                    .filter(keyword => !keywords.includes(keyword))
                    .slice(0, 8)
                    .map((keyword) => (
                    <WrapItem key={keyword}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addSuggestedKeyword(keyword)}
                        isDisabled={keywords.length >= 15}
                        _hover={{ bg: 'brand.50', borderColor: 'brand.300' }}
                      >
                        {keyword}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </VStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Tips */}
      <Card variant="outline" bg="brand.50">
        <CardBody>
          <VStack spacing={2} align="start">
            <Text fontSize="sm" fontWeight="medium" color="brand.700">
              💡 Tips for choosing style keywords:
            </Text>
            <VStack spacing={1} align="start" fontSize="sm" color="brand.600">
              <Text>• Use specific terms that capture your vision (e.g., &quot;vintage&quot; vs &quot;old&quot;)</Text>
              <Text>• Include both style and mood keywords for better matching</Text>
              <Text>• Consider your venue and season when selecting keywords</Text>
              <Text>• Keywords help vendors understand your aesthetic preferences</Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
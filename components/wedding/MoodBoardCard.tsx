'use client'

import React from 'react'
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Image,
  Box,
  Wrap,
  WrapItem,
  Tag,
  useColorModeValue,
  AspectRatio,
} from '@chakra-ui/react'
import { Eye, Edit, Palette, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import type { MoodBoard } from '@/types'

interface MoodBoardCardProps {
  moodBoard: MoodBoard
  onView: () => void
  onEdit?: () => void
}

export function MoodBoardCard({ moodBoard, onView, onEdit }: MoodBoardCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const totalAssets = moodBoard.images.length + moodBoard.videos.length + moodBoard.links.length
  const previewImage = moodBoard.images[0]

  return (
    <Card bg={cardBg} borderWidth={1} borderColor={borderColor} _hover={{ shadow: 'md' }}>
      <CardBody p={0}>
        <VStack spacing={0} align="stretch">
          {/* Preview Image */}
          <Box position="relative">
            <AspectRatio ratio={16 / 9}>
              {previewImage ? (
                <Image
                  src={previewImage.url}
                  alt={moodBoard.name}
                  objectFit="cover"
                  borderTopRadius="md"
                />
              ) : (
                <Box
                  bg="neutral.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderTopRadius="md"
                >
                  <Palette size={32} color="var(--chakra-colors-neutral-400)" />
                </Box>
              )}
            </AspectRatio>
            
            {/* Phase Badge */}
            {moodBoard.phaseId && (
              <Badge
                position="absolute"
                top={2}
                right={2}
                colorScheme="brand"
                size="sm"
              >
                Phase Specific
              </Badge>
            )}
          </Box>

          {/* Content */}
          <VStack spacing={4} p={4} align="stretch">
            {/* Header */}
            <VStack spacing={2} align="start">
              <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
                {moodBoard.name}
              </Text>
              {moodBoard.description && (
                <Text fontSize="sm" color="neutral.600" noOfLines={2}>
                  {moodBoard.description}
                </Text>
              )}
            </VStack>

            {/* Color Palette Preview */}
            {moodBoard.colorPalette && (
              <VStack spacing={2} align="start">
                <Text fontSize="xs" color="neutral.500" fontWeight="medium">
                  COLOR PALETTE
                </Text>
                <HStack spacing={1}>
                  {[
                    ...moodBoard.colorPalette.primary.slice(0, 2),
                    ...moodBoard.colorPalette.secondary.slice(0, 2),
                    ...moodBoard.colorPalette.accent.slice(0, 2)
                  ].slice(0, 6).map((color, index) => (
                    <Box
                      key={index}
                      w={6}
                      h={6}
                      bg={color}
                      borderRadius="sm"
                      border="1px solid"
                      borderColor="neutral.200"
                    />
                  ))}
                </HStack>
              </VStack>
            )}

            {/* Style Keywords */}
            {moodBoard.styleKeywords.length > 0 && (
              <VStack spacing={2} align="start">
                <Text fontSize="xs" color="neutral.500" fontWeight="medium">
                  STYLE KEYWORDS
                </Text>
                <Wrap spacing={1}>
                  {moodBoard.styleKeywords.slice(0, 4).map((keyword) => (
                    <WrapItem key={keyword}>
                      <Tag size="sm" variant="subtle" colorScheme="brand">
                        {keyword}
                      </Tag>
                    </WrapItem>
                  ))}
                  {moodBoard.styleKeywords.length > 4 && (
                    <WrapItem>
                      <Tag size="sm" variant="outline">
                        +{moodBoard.styleKeywords.length - 4}
                      </Tag>
                    </WrapItem>
                  )}
                </Wrap>
              </VStack>
            )}

            {/* Stats */}
            <HStack spacing={4} fontSize="sm" color="neutral.600">
              <HStack spacing={1}>
                <ImageIcon size={14} />
                <Text>{moodBoard.images.length}</Text>
              </HStack>
              <HStack spacing={1}>
                <LinkIcon size={14} />
                <Text>{moodBoard.links.length}</Text>
              </HStack>
              <Text>•</Text>
              <Text>{totalAssets} total items</Text>
            </HStack>

            {/* Actions */}
            <HStack spacing={2}>
              <Button
                size="sm"
                leftIcon={<Eye size={14} />}
                colorScheme="brand"
                variant="outline"
                flex={1}
                onClick={onView}
              >
                View
              </Button>
              {onEdit && (
                <Button
                  size="sm"
                  leftIcon={<Edit size={14} />}
                  variant="ghost"
                  onClick={onEdit}
                >
                  Edit
                </Button>
              )}
            </HStack>

            {/* Last Updated */}
            <Text fontSize="xs" color="neutral.500">
              Updated {moodBoard.updatedAt.toLocaleDateString()}
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}
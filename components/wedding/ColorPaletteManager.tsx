'use client'

import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Box,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  useToast,
  Wrap,
  WrapItem,
  Badge,
  IconButton,
} from '@chakra-ui/react'
import { ChromePicker } from 'react-color'
import { X, Palette, Copy } from 'lucide-react'
import type { MoodBoard } from '@/types'

interface ColorPaletteManagerProps {
  colorPalette: MoodBoard['colorPalette']
  onChange: (colorPalette: MoodBoard['colorPalette']) => void
}

type PaletteCategory = 'primary' | 'secondary' | 'accent' | 'neutral'

const CATEGORY_LABELS = {
  primary: 'Primary Colors',
  secondary: 'Secondary Colors',
  accent: 'Accent Colors',
  neutral: 'Neutral Colors'
}

const CATEGORY_DESCRIPTIONS = {
  primary: 'Main colors that define your wedding theme',
  secondary: 'Supporting colors that complement the primary palette',
  accent: 'Bold colors used sparingly for highlights and details',
  neutral: 'Background and base colors for balance'
}

const SUGGESTED_PALETTES = [
  {
    name: 'Romantic Blush',
    colors: {
      primary: ['#E8B4B8', '#F4D1D1'],
      secondary: ['#A8C8A8', '#D4E8D4'],
      accent: ['#F5E6D3', '#E8D5B7'],
      neutral: ['#F8F8F8', '#E5E5E5']
    }
  },
  {
    name: 'Classic Elegance',
    colors: {
      primary: ['#2C3E50', '#34495E'],
      secondary: ['#ECF0F1', '#BDC3C7'],
      accent: ['#F39C12', '#E67E22'],
      neutral: ['#FFFFFF', '#F8F9FA']
    }
  },
  {
    name: 'Garden Fresh',
    colors: {
      primary: ['#27AE60', '#2ECC71'],
      secondary: ['#F1C40F', '#F39C12'],
      accent: ['#E74C3C', '#C0392B'],
      neutral: ['#ECF0F1', '#D5DBDB']
    }
  }
]

export function ColorPaletteManager({ colorPalette, onChange }: ColorPaletteManagerProps) {
  const [selectedColor, setSelectedColor] = useState('#E8B4B8')
  const [activeCategory, setActiveCategory] = useState<PaletteCategory>('primary')
  const toast = useToast()

  const addColor = (category: PaletteCategory, color: string) => {
    const currentColors = colorPalette[category] || []
    if (currentColors.length >= 8) {
      toast({
        title: 'Maximum colors reached',
        description: 'You can have up to 8 colors per category.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (currentColors.includes(color)) {
      toast({
        title: 'Color already exists',
        description: 'This color is already in the palette.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const updatedPalette = {
      ...colorPalette,
      [category]: [...currentColors, color]
    }
    onChange(updatedPalette)
  }

  const removeColor = (category: PaletteCategory, colorIndex: number) => {
    const currentColors = colorPalette[category] || []
    const updatedColors = currentColors.filter((_, index) => index !== colorIndex)
    
    const updatedPalette = {
      ...colorPalette,
      [category]: updatedColors
    }
    onChange(updatedPalette)
  }

  const applySuggestedPalette = (suggestedPalette: typeof SUGGESTED_PALETTES[0]) => {
    onChange(suggestedPalette.colors)
    toast({
      title: 'Palette applied',
      description: `${suggestedPalette.name} palette has been applied.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const copyColorToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    toast({
      title: 'Color copied',
      description: `${color} copied to clipboard.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const exportPalette = () => {
    const paletteData = {
      name: 'Wedding Color Palette',
      colors: colorPalette,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-color-palette.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Palette exported',
      description: 'Color palette has been downloaded as JSON file.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const getTotalColors = () => {
    return Object.values(colorPalette).reduce((total, colors) => total + colors.length, 0)
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Color Palette Manager</Text>
          <Text fontSize="sm" color="neutral.600">
            {getTotalColors()} colors across {Object.keys(colorPalette).length} categories
          </Text>
        </VStack>
        <HStack spacing={2}>
          <Button
            leftIcon={<Copy size={16} />}
            size="sm"
            variant="outline"
            onClick={exportPalette}
          >
            Export
          </Button>
        </HStack>
      </HStack>

      {/* Color Picker */}
      <Card>
        <CardHeader pb={3}>
          <Text fontSize="md" fontWeight="semibold">Add New Color</Text>
        </CardHeader>
        <CardBody pt={0}>
          <HStack spacing={4} align="start">
            <Box>
              <ChromePicker
                color={selectedColor}
                onChange={(color) => setSelectedColor(color.hex)}
                disableAlpha
              />
            </Box>
            <VStack spacing={4} align="stretch" flex={1}>
              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="medium">Selected Color</Text>
                <HStack spacing={2}>
                  <Box
                    w={12}
                    h={12}
                    bg={selectedColor}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="neutral.200"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">{selectedColor}</Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => copyColorToClipboard(selectedColor)}
                    >
                      Copy
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
              
              <VStack spacing={2} align="start">
                <Text fontSize="sm" fontWeight="medium">Add to Category</Text>
                <Wrap spacing={2}>
                  {(Object.keys(CATEGORY_LABELS) as PaletteCategory[]).map((category) => (
                    <WrapItem key={category}>
                      <Button
                        size="sm"
                        variant={activeCategory === category ? 'solid' : 'outline'}
                        colorScheme="brand"
                        onClick={() => {
                          setActiveCategory(category)
                          addColor(category, selectedColor)
                        }}
                      >
                        {CATEGORY_LABELS[category]}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </VStack>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      {/* Color Categories */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {(Object.keys(CATEGORY_LABELS) as PaletteCategory[]).map((category) => (
          <Card key={category}>
            <CardHeader pb={3}>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Text fontSize="md" fontWeight="semibold">
                    {CATEGORY_LABELS[category]}
                  </Text>
                  <Badge size="sm" variant="outline">
                    {colorPalette[category]?.length || 0}/8
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="neutral.600">
                  {CATEGORY_DESCRIPTIONS[category]}
                </Text>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {colorPalette[category]?.length > 0 ? (
                  <Wrap spacing={2}>
                    {colorPalette[category].map((color, index) => (
                      <WrapItem key={index}>
                        <Box position="relative" role="group">
                          <Box
                            w={12}
                            h={12}
                            bg={color}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="neutral.200"
                            cursor="pointer"
                            onClick={() => copyColorToClipboard(color)}
                            _hover={{ transform: 'scale(1.05)' }}
                            transition="transform 0.2s"
                          />
                          <IconButton
                            aria-label="Remove color"
                            icon={<X size={12} />}
                            size="xs"
                            position="absolute"
                            top="-1"
                            right="-1"
                            colorScheme="red"
                            borderRadius="full"
                            onClick={() => removeColor(category, index)}
                            opacity={0}
                            _groupHover={{ opacity: 1 }}
                            transition="opacity 0.2s"
                          />
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                ) : (
                  <Box
                    p={4}
                    border="2px dashed"
                    borderColor="neutral.300"
                    borderRadius="md"
                    textAlign="center"
                  >
                    <VStack spacing={2}>
                      <Palette size={24} color="var(--chakra-colors-neutral-400)" />
                      <Text fontSize="sm" color="neutral.500">
                        No {category} colors yet
                      </Text>
                      <Text fontSize="xs" color="neutral.400">
                        Use the color picker above to add colors
                      </Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Suggested Palettes */}
      <Card>
        <CardHeader pb={3}>
          <Text fontSize="md" fontWeight="semibold">Suggested Palettes</Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {SUGGESTED_PALETTES.map((palette) => (
              <Card key={palette.name} variant="outline" size="sm">
                <CardBody>
                  <VStack spacing={3}>
                    <Text fontSize="sm" fontWeight="medium">{palette.name}</Text>
                    <VStack spacing={2} w="full">
                      {(Object.keys(palette.colors) as PaletteCategory[]).map((category) => (
                        <HStack key={category} spacing={1} w="full" justify="center">
                          {palette.colors[category].map((color, index) => (
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
                      ))}
                    </VStack>
                    <Button
                      size="sm"
                      variant="outline"
                      w="full"
                      onClick={() => applySuggestedPalette(palette)}
                    >
                      Apply Palette
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  )
}
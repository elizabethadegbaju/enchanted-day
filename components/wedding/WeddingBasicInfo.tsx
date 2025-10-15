'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface WeddingBasicInfoProps {
  coupleNames: string[]
  culturalTraditions: string[]
  onUpdate: (data: { coupleNames?: string[]; culturalTraditions?: string[] }) => void
}

const COMMON_TRADITIONS = [
  'Christian',
  'Jewish',
  'Muslim',
  'Hindu',
  'Buddhist',
  'Nigerian',
  'Indian',
  'Chinese',
  'Mexican',
  'Italian',
  'Greek',
  'Irish',
  'Scottish',
  'French',
  'German',
  'Spanish',
  'Portuguese',
  'Russian',
  'Polish',
  'Korean',
  'Japanese',
  'Thai',
  'Vietnamese',
  'Filipino',
  'Caribbean',
  'African',
  'Latin American',
  'Middle Eastern',
  'Nordic',
  'Celtic',
]

export const WeddingBasicInfo: React.FC<WeddingBasicInfoProps> = ({
  coupleNames,
  culturalTraditions,
  onUpdate,
}) => {
  const [newTradition, setNewTradition] = useState('')
  const toast = useToast()

  const updateCoupleName = (index: number, value: string) => {
    const updatedNames = [...coupleNames]
    updatedNames[index] = value
    onUpdate({ coupleNames: updatedNames })
  }

  const addCoupleName = () => {
    if (coupleNames.length < 4) {
      onUpdate({ coupleNames: [...coupleNames, ''] })
    } else {
      toast({
        title: 'Maximum reached',
        description: 'You can add up to 4 names maximum.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const removeCoupleName = (index: number) => {
    if (coupleNames.length > 1) {
      const updatedNames = coupleNames.filter((_, i) => i !== index)
      onUpdate({ coupleNames: updatedNames })
    }
  }

  const addTradition = (tradition: string) => {
    if (tradition && !culturalTraditions.includes(tradition)) {
      if (culturalTraditions.length < 5) {
        onUpdate({ culturalTraditions: [...culturalTraditions, tradition] })
        setNewTradition('')
      } else {
        toast({
          title: 'Maximum reached',
          description: 'You can add up to 5 cultural traditions maximum.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  const removeTradition = (tradition: string) => {
    onUpdate({
      culturalTraditions: culturalTraditions.filter(t => t !== tradition)
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTradition.trim()) {
      addTradition(newTradition.trim())
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          Tell us about yourselves
        </Text>
        <Text color="neutral.600">
          Let&apos;s start with the basics. Who&apos;s getting married and what cultural traditions would you like to incorporate?
        </Text>
      </VStack>

      {/* Couple Names */}
      <FormControl>
        <FormLabel fontSize="lg" fontWeight="semibold">
          Couple Names
        </FormLabel>
        <FormHelperText mb={4}>
          Enter the names of everyone getting married (up to 4 people)
        </FormHelperText>

        <VStack spacing={3} align="stretch">
          {coupleNames.map((name, index) => (
            <HStack key={index}>
              <Input
                placeholder={`Person ${index + 1} name`}
                value={name}
                onChange={(e) => updateCoupleName(index, e.target.value)}
                size="lg"
              />
              {coupleNames.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCoupleName(index)}
                  color="red.500"
                >
                  <X size={16} />
                </Button>
              )}
            </HStack>
          ))}

          {coupleNames.length < 4 && (
            <Button
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={addCoupleName}
              size="sm"
              alignSelf="start"
            >
              Add Another Person
            </Button>
          )}
        </VStack>
      </FormControl>

      {/* Cultural Traditions */}
      <FormControl>
        <FormLabel fontSize="lg" fontWeight="semibold">
          Cultural Traditions (Optional)
        </FormLabel>
        <FormHelperText mb={4}>
          Select or add cultural traditions you&apos;d like to incorporate into your wedding
        </FormHelperText>

        {/* Selected Traditions */}
        {culturalTraditions.length > 0 && (
          <VStack spacing={3} align="stretch" mb={4}>
            <Text fontSize="sm" fontWeight="medium" color="neutral.700">
              Selected Traditions:
            </Text>
            <Wrap>
              {culturalTraditions.map((tradition) => (
                <WrapItem key={tradition}>
                  <Tag size="lg" colorScheme="brand" variant="solid">
                    <TagLabel>{tradition}</TagLabel>
                    <TagCloseButton onClick={() => removeTradition(tradition)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        )}

        {/* Add Custom Tradition */}
        <VStack spacing={3} align="stretch">
          <HStack>
            <Input
              placeholder="Add a cultural tradition"
              value={newTradition}
              onChange={(e) => setNewTradition(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={() => addTradition(newTradition.trim())}
              isDisabled={!newTradition.trim() || culturalTraditions.includes(newTradition.trim())}
              colorScheme="brand"
            >
              Add
            </Button>
          </HStack>

          {/* Common Traditions */}
          <VStack spacing={2} align="start">
            <Text fontSize="sm" color="neutral.600">
              Or choose from common traditions:
            </Text>
            <Wrap>
              {COMMON_TRADITIONS
                .filter(tradition => !culturalTraditions.includes(tradition))
                .slice(0, 12)
                .map((tradition) => (
                  <WrapItem key={tradition}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addTradition(tradition)}
                      isDisabled={culturalTraditions.length >= 5}
                    >
                      {tradition}
                    </Button>
                  </WrapItem>
                ))}
            </Wrap>
          </VStack>
        </VStack>
      </FormControl>
    </VStack>
  )
}
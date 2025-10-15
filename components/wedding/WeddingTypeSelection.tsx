'use client'

import React from 'react'
import {
  VStack,
  Text,
  RadioGroup,
  Radio,
  Card,
  CardBody,
  HStack,
  Box,
  Icon,
} from '@chakra-ui/react'
import { Calendar, CalendarDays } from 'lucide-react'

interface WeddingTypeSelectionProps {
  weddingType: 'single-event' | 'multi-phase'
  onUpdate: (weddingType: 'single-event' | 'multi-phase') => void
}

export const WeddingTypeSelection: React.FC<WeddingTypeSelectionProps> = ({
  weddingType,
  onUpdate,
}) => {
  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          What type of wedding are you planning?
        </Text>
        <Text color="neutral.600">
          Choose whether you&apos;re having a single event or multiple phases/ceremonies
        </Text>
      </VStack>

      <RadioGroup
        value={weddingType}
        onChange={(value) => onUpdate(value as 'single-event' | 'multi-phase')}
      >
        <VStack spacing={4} align="stretch">
          {/* Single Event Option */}
          <Card
            cursor="pointer"
            onClick={() => onUpdate('single-event')}
            borderColor={weddingType === 'single-event' ? 'brand.500' : 'neutral.200'}
            borderWidth={weddingType === 'single-event' ? '2px' : '1px'}
            bg={weddingType === 'single-event' ? 'brand.50' : 'white'}
            _hover={{ borderColor: 'brand.300' }}
            transition="all 0.2s"
          >
            <CardBody p={6}>
              <HStack spacing={4} align="start">
                <Radio value="single-event" size="lg" colorScheme="brand" />
                <Box flex={1}>
                  <HStack spacing={3} mb={2}>
                    <Icon as={Calendar} color="brand.500" boxSize={5} />
                    <Text fontSize="lg" fontWeight="semibold">
                      Single Event Wedding
                    </Text>
                  </HStack>
                  <Text color="neutral.600" mb={3}>
                    One main wedding event, typically including ceremony and reception
                  </Text>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Perfect for traditional weddings
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Simpler planning and coordination
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Single venue and date management
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Streamlined guest experience
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          {/* Multi-Phase Option */}
          <Card
            cursor="pointer"
            onClick={() => onUpdate('multi-phase')}
            borderColor={weddingType === 'multi-phase' ? 'brand.500' : 'neutral.200'}
            borderWidth={weddingType === 'multi-phase' ? '2px' : '1px'}
            bg={weddingType === 'multi-phase' ? 'brand.50' : 'white'}
            _hover={{ borderColor: 'brand.300' }}
            transition="all 0.2s"
          >
            <CardBody p={6}>
              <HStack spacing={4} align="start">
                <Radio value="multi-phase" size="lg" colorScheme="brand" />
                <Box flex={1}>
                  <HStack spacing={3} mb={2}>
                    <Icon as={CalendarDays} color="brand.500" boxSize={5} />
                    <Text fontSize="lg" fontWeight="semibold">
                      Multi-Phase Wedding
                    </Text>
                  </HStack>
                  <Text color="neutral.600" mb={3}>
                    Multiple ceremonies or events, often spanning several days
                  </Text>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Perfect for cultural traditions (Nigerian, Indian, etc.)
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Separate legal, religious, and celebration events
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Different guest lists for different phases
                    </Text>
                    <Text fontSize="sm" color="neutral.700">
                      ✓ Unique themes and requirements per phase
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        </VStack>
      </RadioGroup>

      {/* Additional Information */}
      <Box p={4} bg="accent.50" borderRadius="lg" borderLeft="4px solid" borderColor="accent.500">
        <Text fontSize="sm" color="accent.800">
          <strong>Don&apos;t worry!</strong> You can always modify your wedding structure later. 
          Our AI will help coordinate all aspects regardless of your choice.
        </Text>
      </Box>
    </VStack>
  )
}
'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Input,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  IconButton,
  Divider,
  Badge,
  useToast,
} from '@chakra-ui/react'
import { Plus, Trash2, MapPin, Users } from 'lucide-react'
import type { WeddingPhase } from '@/types'

interface WeddingPhaseSetupProps {
  weddingType: 'single-event' | 'multi-phase'
  phases: Partial<WeddingPhase>[]
  onUpdate: (phases: Partial<WeddingPhase>[]) => void
}

const SINGLE_EVENT_TEMPLATES = [
  { name: 'Wedding Ceremony & Reception', duration: 8, guestCount: 100 },
]

const MULTI_PHASE_TEMPLATES = [
  { name: 'Legal Ceremony', duration: 2, guestCount: 20 },
  { name: 'Church Wedding', duration: 4, guestCount: 150 },
  { name: 'Traditional Ceremony', duration: 6, guestCount: 200 },
  { name: 'Reception', duration: 6, guestCount: 150 },
  { name: 'After Party', duration: 4, guestCount: 50 },
]

const VENUE_TYPES = [
  'Church/Religious Venue',
  'Banquet Hall',
  'Hotel',
  'Outdoor Garden',
  'Beach',
  'Country Club',
  'Historic Venue',
  'Restaurant',
  'Community Center',
  'Private Residence',
  'Winery/Vineyard',
  'Barn/Rustic Venue',
  'Museum/Gallery',
  'Rooftop',
  'Other',
]

export const WeddingPhaseSetup: React.FC<WeddingPhaseSetupProps> = ({
  weddingType,
  phases,
  onUpdate,
}) => {
  const toast = useToast()

  const addPhase = (template?: { name: string; duration: number; guestCount: number }) => {
    if (phases.length >= 10) {
      toast({
        title: 'Maximum reached',
        description: 'You can have up to 10 phases maximum.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const newPhase: Partial<WeddingPhase> = {
      id: `phase-${Date.now()}`,
      name: template?.name || '',
      date: new Date(),
      venue: {
        id: '',
        name: '',
        address: '',
        capacity: template?.guestCount || 100,
        type: '',
        amenities: [],
        restrictions: [],
      },
      budget: {
        total: 0,
        allocated: 0,
        spent: 0,
        currency: 'USD',
        categories: [],
      },
      specificRequirements: {
        guestCount: template?.guestCount || 100,
        duration: template?.duration || 4,
        specialNeeds: [],
        culturalRequirements: [],
      },
      vendors: [],
      guests: [],
      timeline: {
        startTime: new Date(),
        endTime: new Date(),
        milestones: [],
      },
    }

    onUpdate([...phases, newPhase])
  }

  const updatePhase = (index: number, updates: Partial<WeddingPhase>) => {
    const updatedPhases = [...phases]
    updatedPhases[index] = { ...updatedPhases[index], ...updates }
    onUpdate(updatedPhases)
  }

  const removePhase = (index: number) => {
    if (phases.length > 1) {
      const updatedPhases = phases.filter((_, i) => i !== index)
      onUpdate(updatedPhases)
    } else {
      toast({
        title: 'Cannot remove',
        description: 'You must have at least one phase.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const templates = weddingType === 'single-event' ? SINGLE_EVENT_TEMPLATES : MULTI_PHASE_TEMPLATES

  // Initialize with default phase if none exist
  if (phases.length === 0) {
    addPhase(templates[0])
    return null
  }

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          Set up your wedding {weddingType === 'multi-phase' ? 'phases' : 'event'}
        </Text>
        <Text color="neutral.600">
          {weddingType === 'multi-phase' 
            ? 'Define each phase of your wedding celebration'
            : 'Configure your wedding ceremony and reception'
          }
        </Text>
      </VStack>

      {/* Quick Templates */}
      {weddingType === 'multi-phase' && (
        <Card bg="accent.50" borderColor="accent.200">
          <CardBody>
            <VStack spacing={3} align="start">
              <Text fontSize="sm" fontWeight="semibold" color="accent.800">
                Quick Add Templates:
              </Text>
              <HStack wrap="wrap" spacing={2}>
                {templates.map((template) => (
                  <Button
                    key={template.name}
                    size="sm"
                    variant="outline"
                    colorScheme="accent"
                    onClick={() => addPhase(template)}
                    leftIcon={<Plus size={14} />}
                  >
                    {template.name}
                  </Button>
                ))}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Phases */}
      <VStack spacing={6} align="stretch">
        {phases.map((phase, index) => (
          <Card key={phase.id || index} borderColor="neutral.200">
            <CardBody p={6}>
              <VStack spacing={6} align="stretch">
                {/* Phase Header */}
                <HStack justify="space-between" align="start">
                  <HStack spacing={3}>
                    <Badge colorScheme="brand" fontSize="xs">
                      Phase {index + 1}
                    </Badge>
                    <Text fontSize="lg" fontWeight="semibold">
                      {phase.name || 'Unnamed Phase'}
                    </Text>
                  </HStack>
                  {phases.length > 1 && (
                    <IconButton
                      aria-label="Remove phase"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => removePhase(index)}
                    />
                  )}
                </HStack>

                {/* Basic Info */}
                <HStack spacing={4} align="start">
                  <FormControl flex={2}>
                    <FormLabel fontSize="sm">Phase Name</FormLabel>
                    <Input
                      placeholder="e.g., Church Ceremony, Reception"
                      value={phase.name || ''}
                      onChange={(e) => updatePhase(index, { name: e.target.value })}
                    />
                  </FormControl>
                  
                  <FormControl flex={1}>
                    <FormLabel fontSize="sm">Date</FormLabel>
                    <Input
                      type="date"
                      value={phase.date ? phase.date.toISOString().split('T')[0] : ''}
                      onChange={(e) => updatePhase(index, { 
                        date: new Date(e.target.value) 
                      })}
                    />
                  </FormControl>
                </HStack>

                <Divider />

                {/* Venue Information */}
                <VStack spacing={4} align="stretch">
                  <HStack spacing={2}>
                    <MapPin size={16} color="var(--chakra-colors-brand-500)" />
                    <Text fontSize="sm" fontWeight="semibold">Venue Information</Text>
                  </HStack>
                  
                  <HStack spacing={4} align="start">
                    <FormControl flex={2}>
                      <FormLabel fontSize="sm">Venue Name</FormLabel>
                      <Input
                        placeholder="e.g., St. Mary's Church, Grand Ballroom"
                        value={phase.venue?.name || ''}
                        onChange={(e) => updatePhase(index, {
                          venue: { ...phase.venue!, name: e.target.value }
                        })}
                      />
                    </FormControl>
                    
                    <FormControl flex={1}>
                      <FormLabel fontSize="sm">Venue Type</FormLabel>
                      <Select
                        placeholder="Select type"
                        value={(phase.venue?.type as string) || ''}
                        onChange={(e) => updatePhase(index, {
                          venue: { ...phase.venue!, type: e.target.value }
                        })}
                      >
                        {VENUE_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </HStack>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Address</FormLabel>
                    <Textarea
                      placeholder="Full venue address"
                      value={phase.venue?.address || ''}
                      onChange={(e) => updatePhase(index, {
                        venue: { ...phase.venue!, address: e.target.value }
                      })}
                      rows={2}
                    />
                  </FormControl>
                </VStack>

                <Divider />

                {/* Event Details */}
                <VStack spacing={4} align="stretch">
                  <HStack spacing={2}>
                    <Users size={16} color="var(--chakra-colors-brand-500)" />
                    <Text fontSize="sm" fontWeight="semibold">Event Details</Text>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="sm">Expected Guests</FormLabel>
                      <NumberInput
                        min={1}
                        max={1000}
                        value={(phase.specificRequirements?.guestCount as number) || 100}
                        onChange={(_, value) => updatePhase(index, {
                          specificRequirements: {
                            ...phase.specificRequirements!,
                            guestCount: value || 100
                          }
                        })}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">Duration (hours)</FormLabel>
                      <NumberInput
                        min={1}
                        max={24}
                        value={(phase.specificRequirements?.duration as number) || 4}
                        onChange={(_, value) => updatePhase(index, {
                          specificRequirements: {
                            ...phase.specificRequirements!,
                            duration: value || 4
                          }
                        })}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm">Venue Capacity</FormLabel>
                      <NumberInput
                        min={1}
                        max={2000}
                        value={(phase.venue?.capacity as number) || 100}
                        onChange={(_, value) => updatePhase(index, {
                          venue: { ...phase.venue!, capacity: value || 100 }
                        })}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Add Phase Button */}
      <Button
        leftIcon={<Plus size={16} />}
        variant="outline"
        onClick={() => addPhase()}
        alignSelf="start"
        isDisabled={phases.length >= 10}
      >
        Add Another Phase
      </Button>
    </VStack>
  )
}
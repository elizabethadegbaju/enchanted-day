'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Divider,
  SimpleGrid,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { Calendar, MapPin, Users, DollarSign, Palette, Music, Utensils, MessageCircle } from 'lucide-react'

import { WeddingPhase, BudgetInfo, WeddingPreferences } from '@/types';

interface WeddingFormData {
  coupleNames: string[]
  weddingType: 'single-event' | 'multi-phase'
  phases: any[]
  overallBudget: any
  culturalTraditions: string[]
  preferences: any
}

interface WeddingReviewProps {
  formData: WeddingFormData
  onSubmit: () => void
  isSubmitting: boolean
}

export const WeddingReview: React.FC<WeddingReviewProps> = ({
  formData,
  onSubmit,
  isSubmitting,
}) => {
  const { coupleNames, weddingType, phases, overallBudget, culturalTraditions, preferences } = formData

  const totalAllocated = (overallBudget.categories || []).reduce((sum: number, cat: any) => sum + (cat.allocated || 0), 0)
  const currencySymbol = overallBudget.currency === 'USD' ? '$' : 
                        overallBudget.currency === 'EUR' ? '€' : 
                        overallBudget.currency === 'GBP' ? '£' : 
                        overallBudget.currency

  const validationIssues = []
  
  // Check for validation issues
  if (coupleNames.filter(name => name.trim()).length === 0) {
    validationIssues.push('At least one couple name is required')
  }
  
  if (phases.length === 0) {
    validationIssues.push('At least one wedding phase is required')
  }
  
  if (!overallBudget.total || overallBudget.total <= 0) {
    validationIssues.push('Total budget must be greater than 0')
  }
  
  if (overallBudget.total && totalAllocated > overallBudget.total) {
    validationIssues.push('Budget allocation exceeds total budget')
  }

  const phasesWithMissingInfo = phases.filter(phase => 
    !phase.name?.trim() || !(phase.venue as any)?.name?.trim()
  )
  
  if (phasesWithMissingInfo.length > 0) {
    validationIssues.push(`${phasesWithMissingInfo.length} phase(s) missing name or venue information`)
  }

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          Review your wedding details
        </Text>
        <Text color="neutral.600">
          Please review all the information below before creating your wedding
        </Text>
      </VStack>

      {/* Validation Issues */}
      {validationIssues.length > 0 && (
        <Alert status="warning">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <AlertTitle>Please fix the following issues:</AlertTitle>
            <AlertDescription>
              <VStack align="start" spacing={1}>
                {validationIssues.map((issue, index) => (
                  <Text key={index} fontSize="sm">• {issue}</Text>
                ))}
              </VStack>
            </AlertDescription>
          </VStack>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">Basic Information</Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Couple Names</Text>
              <VStack align="start" spacing={1}>
                {coupleNames.filter(name => name.trim()).map((name, index) => (
                  <Text key={index} fontWeight="medium">{name}</Text>
                ))}
              </VStack>
            </VStack>
            
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Wedding Type</Text>
              <Badge colorScheme="brand" size="lg">
                {weddingType === 'single-event' ? 'Single Event' : 'Multi-Phase'}
              </Badge>
            </VStack>
            
            {culturalTraditions.length > 0 && (
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Cultural Traditions</Text>
                <Wrap>
                  {culturalTraditions.map((tradition) => (
                    <WrapItem key={tradition}>
                      <Tag size="sm" colorScheme="accent">
                        <TagLabel>{tradition}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </VStack>
            )}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Wedding Phases */}
      <Card>
        <CardHeader>
          <HStack spacing={2}>
            <Calendar size={20} color="var(--chakra-colors-brand-500)" />
            <Text fontSize="lg" fontWeight="semibold">Wedding Phases ({phases.length})</Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            {phases.map((phase, index) => (
              <Card key={index} variant="outline">
                <CardBody p={4}>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="semibold">{phase.name || 'Unnamed Phase'}</Text>
                      <Badge colorScheme="brand" size="sm">Phase {index + 1}</Badge>
                    </HStack>
                    
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <HStack spacing={2}>
                        <MapPin size={14} color="var(--chakra-colors-neutral-500)" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="neutral.600">Venue</Text>
                          <Text fontSize="sm">{phase.venue?.name || 'Not specified'}</Text>
                        </VStack>
                      </HStack>
                      
                      <HStack spacing={2}>
                        <Users size={14} color="var(--chakra-colors-neutral-500)" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="neutral.600">Expected Guests</Text>
                          <Text fontSize="sm">{(phase.specificRequirements?.guestCount as number) || 0}</Text>
                        </VStack>
                      </HStack>
                      
                      <HStack spacing={2}>
                        <Calendar size={14} color="var(--chakra-colors-neutral-500)" />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="neutral.600">Duration</Text>
                          <Text fontSize="sm">{(phase.specificRequirements?.duration as number) || 0} hours</Text>
                        </VStack>
                      </HStack>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <HStack spacing={2}>
            <DollarSign size={20} color="var(--chakra-colors-brand-500)" />
            <Text fontSize="lg" fontWeight="semibold">Budget Overview</Text>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Total Budget</Text>
                <Text fontSize="xl" fontWeight="bold" color="brand.600">
                  {currencySymbol}{overallBudget.total?.toLocaleString() || 0}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Allocated</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {currencySymbol}{totalAllocated.toLocaleString()}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Remaining</Text>
                <Text fontSize="xl" fontWeight="bold" color={(overallBudget.total || 0) - totalAllocated >= 0 ? 'green.600' : 'red.600'}>
                  {currencySymbol}{((overallBudget.total || 0) - totalAllocated).toLocaleString()}
                </Text>
              </VStack>
            </SimpleGrid>
            
            {overallBudget.categories && overallBudget.categories.length > 0 && (
              <>
                <Divider />
                <VStack spacing={2} align="start">
                  <Text fontSize="sm" color="neutral.600">Budget Categories</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} w="full">
                    {overallBudget.categories.map((category: any, index: number) => (
                      <HStack key={index} justify="space-between">
                        <Text fontSize="sm">{category.name}</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {currencySymbol}{category.allocated?.toLocaleString() || 0}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Preferences Summary */}
      {((preferences.style?.length ?? 0) > 0 || (preferences.colors?.length ?? 0) > 0 || (preferences.themes?.length ?? 0) > 0) && (
        <Card>
          <CardHeader>
            <HStack spacing={2}>
              <Palette size={20} color="var(--chakra-colors-brand-500)" />
              <Text fontSize="lg" fontWeight="semibold">Style Preferences</Text>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {(preferences.style?.length ?? 0) > 0 && (
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="neutral.600">Styles</Text>
                  <Wrap>
                    {preferences.style?.map((style: string) => (
                      <WrapItem key={style}>
                        <Tag size="sm" colorScheme="brand">
                          <TagLabel>{style}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              )}
              
              {(preferences.colors?.length ?? 0) > 0 && (
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="neutral.600">Colors</Text>
                  <Wrap>
                    {preferences.colors?.map((color: string) => (
                      <WrapItem key={color}>
                        <Tag size="sm" colorScheme="accent">
                          <TagLabel>{color}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              )}
              
              {(preferences.themes?.length ?? 0) > 0 && (
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="neutral.600">Themes</Text>
                  <Wrap>
                    {preferences.themes?.map((theme: string) => (
                      <WrapItem key={theme}>
                        <Tag size="sm" colorScheme="purple">
                          <TagLabel>{theme}</TagLabel>
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Additional Preferences */}
      {((preferences.musicGenres?.length ?? 0) > 0 || (preferences.foodPreferences?.length ?? 0) > 0) && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {(preferences.musicGenres?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Music size={18} color="var(--chakra-colors-brand-500)" />
                  <Text fontSize="md" fontWeight="semibold">Music Preferences</Text>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Wrap>
                  {preferences.musicGenres?.map((genre: string) => (
                    <WrapItem key={genre}>
                      <Tag size="sm" colorScheme="green">
                        <TagLabel>{genre}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </CardBody>
            </Card>
          )}
          
          {(preferences.foodPreferences?.length ?? 0) > 0 && (
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Utensils size={18} color="var(--chakra-colors-brand-500)" />
                  <Text fontSize="md" fontWeight="semibold">Food Preferences</Text>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Wrap>
                  {preferences.foodPreferences?.map((food: string) => (
                    <WrapItem key={food}>
                      <Tag size="sm" colorScheme="orange">
                        <TagLabel>{food}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </CardBody>
            </Card>
          )}
        </SimpleGrid>
      )}

      {/* Communication Preferences */}
      {preferences.communicationPreferences && (
        <Card>
          <CardHeader>
            <HStack spacing={2}>
              <MessageCircle size={18} color="var(--chakra-colors-brand-500)" />
              <Text fontSize="md" fontWeight="semibold">Communication Preferences</Text>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Channels</Text>
                <Text fontSize="sm">
                  {preferences.communicationPreferences.preferredChannels?.join(', ') || 'Email'}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Frequency</Text>
                <Text fontSize="sm" textTransform="capitalize">
                  {preferences.communicationPreferences.frequency || 'Regular'}
                </Text>
              </VStack>
              
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color="neutral.600">Urgency Threshold</Text>
                <Text fontSize="sm" textTransform="capitalize">
                  {preferences.communicationPreferences.urgencyThreshold || 'Medium'}
                </Text>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Submit Button */}
      <Card bg="brand.50" borderColor="brand.200">
        <CardBody>
          <VStack spacing={4}>
            <Text textAlign="center" color="brand.800">
              Ready to create your wedding? Our AI will start working immediately to coordinate all aspects of your special day.
            </Text>
            <Button
              size="lg"
              colorScheme="brand"
              onClick={onSubmit}
              isLoading={isSubmitting}
              loadingText="Creating Your Wedding..."
              isDisabled={validationIssues.length > 0}
              px={8}
            >
              Create My Wedding
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
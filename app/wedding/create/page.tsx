'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Progress,
  useToast,
  Container,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WeddingBasicInfo } from '@/components/wedding/WeddingBasicInfo'
import { WeddingTypeSelection } from '@/components/wedding/WeddingTypeSelection'
import { WeddingPhaseSetup } from '@/components/wedding/WeddingPhaseSetup'
import { WeddingBudgetSetup } from '@/components/wedding/WeddingBudgetSetup'
import { WeddingPreferences } from '@/components/wedding/WeddingPreferences'
import { WeddingReview } from '@/components/wedding/WeddingReview'
import { createUserWedding } from '@/lib/wedding-data-service'
import type { UIWeddingPhase, UIBudgetInfo, UIWeddingPreferences } from '@/types'

interface LocalWeddingFormData {
  coupleNames: string[]
  weddingType: 'single-event' | 'multi-phase'
  phases: Partial<UIWeddingPhase>[]
  overallBudget: Partial<UIBudgetInfo>
  culturalTraditions: string[]
  preferences: Partial<UIWeddingPreferences>
}

const STEPS = [
  { id: 1, name: 'Basic Info', description: 'Tell us about yourselves' },
  { id: 2, name: 'Wedding Type', description: 'Single event or multi-phase' },
  { id: 3, name: 'Phases', description: 'Set up your wedding events' },
  { id: 4, name: 'Budget', description: 'Plan your finances' },
  { id: 5, name: 'Preferences', description: 'Your style and preferences' },
  { id: 6, name: 'Review', description: 'Review and create' },
]

export default function CreateWeddingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LocalWeddingFormData>({
    coupleNames: ['', ''],
    weddingType: 'single-event',
    phases: [],
    overallBudget: {
      total: 0,
      allocated: 0,
      spent: 0,
      remaining: 0,
      currency: 'USD',
    },
    culturalTraditions: [],
    preferences: {
      culturalTraditions: [],
      styleKeywords: [],
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const updateFormData = (updates: Partial<LocalWeddingFormData>) => {
    setFormData((prev: LocalWeddingFormData) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev: number) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev: number) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Extract primary date from phases (first phase or first with a date)
      let primaryDate: string | undefined
      if (formData.phases.length > 0) {
        const phaseWithDate = formData.phases.find(phase => phase.date)
        if (phaseWithDate?.date) {
          primaryDate = typeof phaseWithDate.date === 'string' 
            ? phaseWithDate.date 
            : phaseWithDate.date.toISOString().split('T')[0]
        }
      }

      // Create the wedding using real API
      const weddingId = await createUserWedding({
        coupleNames: formData.coupleNames.filter(name => name.trim() !== ''),
        weddingType: formData.weddingType === 'single-event' ? 'SINGLE_EVENT' : 'MULTI_PHASE',
        primaryDate
      })
      

      
      toast({
        title: 'Wedding Created!',
        description: 'Your wedding has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating wedding:', error)
      toast({
        title: 'Error',
        description: 'Failed to create wedding. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WeddingBasicInfo
            coupleNames={formData.coupleNames}
            culturalTraditions={formData.culturalTraditions}
            onUpdate={(data) => updateFormData(data)}
          />
        )
      case 2:
        return (
          <WeddingTypeSelection
            weddingType={formData.weddingType}
            onUpdate={(weddingType) => updateFormData({ weddingType })}
          />
        )
      case 3:
        return (
          <WeddingPhaseSetup
            weddingType={formData.weddingType}
            phases={formData.phases as any}
            onUpdate={(phases) => updateFormData({ phases: phases as any })}
          />
        )
      case 4:
        return (
          <WeddingBudgetSetup
            budget={formData.overallBudget}
            updateBudget={(overallBudget) => updateFormData({ overallBudget })}
            onUpdate={(overallBudget) => updateFormData({ overallBudget })}
          />
        )
      case 5:
        return (
          <WeddingPreferences
            preferences={formData.preferences}
            onUpdate={(preferences) => updateFormData({ preferences })}
          />
        )
      case 6:
        return (
          <WeddingReview
            formData={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.coupleNames.some(name => name.trim().length > 0)
      case 2:
        return formData.weddingType !== undefined
      case 3:
        return formData.phases.length > 0
      case 4:
        return formData.overallBudget?.total && formData.overallBudget.total > 0
      case 5:
        return true // Preferences are optional
      case 6:
        return true
      default:
        return false
    }
  }

  const progressPercentage = (currentStep / STEPS.length) * 100

  return (
    <DashboardLayout
      title="Create Your Wedding"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Create Wedding' },
      ]}
    >
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Progress Header */}
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" color="neutral.600">
                    Step {currentStep} of {STEPS.length}
                  </Text>
                  <Text fontSize="sm" color="neutral.600">
                    {Math.round(progressPercentage)}% Complete
                  </Text>
                </HStack>
                
                <Progress
                  value={progressPercentage}
                  colorScheme="brand"
                  size="sm"
                  w="full"
                  borderRadius="full"
                />
                
                <VStack spacing={1} align="center">
                  <Text fontSize="lg" fontWeight="semibold">
                    {STEPS[currentStep - 1].name}
                  </Text>
                  <Text fontSize="sm" color="neutral.600">
                    {STEPS[currentStep - 1].description}
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Step Content */}
          <Card>
            <CardBody p={8}>
              {renderStepContent()}
            </CardBody>
          </Card>

          {/* Navigation */}
          <HStack justify="space-between">
            <Button
              variant="outline"
              onClick={prevStep}
              isDisabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                isDisabled={!canProceed()}
                colorScheme="brand"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Creating Wedding..."
                colorScheme="brand"
              >
                Create Wedding
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    </DashboardLayout>
  )
}
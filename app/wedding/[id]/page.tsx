'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WeddingOverview } from '@/components/wedding/WeddingOverview'
import { WeddingTimeline } from '@/components/wedding/WeddingTimeline'
import { WeddingPhases } from '@/components/wedding/WeddingPhases'
import { WeddingBudgetTracker } from '@/components/wedding/WeddingBudgetTracker'
import { getWeddingDetailData, type WeddingDetailData } from '@/lib/wedding-data-service'
import { formatDateForDisplay, getDaysUntilDate, formatCurrency } from '@/lib/data-utils'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Settings,
  Edit,
  Heart,
  DollarSign
} from 'lucide-react'

export default function WeddingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const weddingId = params.id as string
  
  const [wedding, setWedding] = useState<WeddingDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    if (weddingId) {
      loadWeddingData()
    }
  }, [weddingId])

  const loadWeddingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the weddingId from URL params directly
      const data = await getWeddingDetailData(weddingId)
      setWedding(data)
    } catch (err) {
      console.error('Error loading wedding data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load wedding data')
      setWedding(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="purple.500" />
          <Text>Loading wedding details...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error && !wedding) {
    const isWeddingNotFound = error.includes('Wedding not found')
    
    return (
      <DashboardLayout>
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isWeddingNotFound ? "warning" : "error"} maxW="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>
                {isWeddingNotFound ? "Wedding Not Found" : "Unable to load wedding details!"}
              </AlertTitle>
              <AlertDescription>
                {isWeddingNotFound 
                  ? "The wedding you're looking for doesn't exist or you don't have access to it."
                  : error
                }
              </AlertDescription>
            </VStack>
          </Alert>
          
          <Button 
            onClick={() => router.push('/dashboard')} 
            colorScheme="brand"
            size="lg"
          >
            Back to Dashboard
          </Button>
        </VStack>
      </DashboardLayout>
    )
  }

  if (!wedding) {
    return (
      <DashboardLayout>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4} py={8}>
              <Text fontSize="lg" color="gray.500">Wedding not found</Text>
              <Button onClick={() => router.push('/dashboard')} colorScheme="purple">
                Back to Dashboard
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Heart size={24} color="purple" />
                  <Text fontSize="2xl" fontWeight="bold">
                    {wedding.coupleNames.join(' & ')} Wedding
                  </Text>
                </HStack>
                <HStack spacing={4}>
                  <Badge colorScheme="purple" variant="subtle" p={2}>
                    {wedding.weddingType.replace('_', ' ')}
                  </Badge>
                  <Badge 
                    colorScheme={wedding.status === 'PLANNING' ? 'blue' : 'green'} 
                    variant="solid" 
                    p={2}
                  >
                    {wedding.status}
                  </Badge>
                </HStack>
                <HStack spacing={6}>
                  <HStack>
                    <Calendar size={16} />
                    <Text color="gray.600">
                      {wedding.phases.length > 0 && formatDateForDisplay(wedding.phases[0].date)}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="purple.600">
                      {wedding.daysUntilWedding} days to go
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
              
              <HStack spacing={2}>
                <Button leftIcon={<Edit size={16} />} variant="outline">
                  Edit Details
                </Button>
                <Button leftIcon={<Settings size={16} />} colorScheme="purple">
                  Manage
                </Button>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Overall Progress</StatLabel>
                <StatNumber>{wedding.overallProgress}%</StatNumber>
                <StatHelpText>
                  <Progress value={wedding.overallProgress} colorScheme="purple" size="sm" mt={2} />
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Budget Status</StatLabel>
                <StatNumber>{Math.round((wedding.overallBudget.spent / wedding.overallBudget.total) * 100)}%</StatNumber>
                <StatHelpText>
                  {formatCurrency(wedding.overallBudget.spent)} of {formatCurrency(wedding.overallBudget.total)}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Phases</StatLabel>
                <StatNumber>{wedding.phases.length}</StatNumber>
                <StatHelpText>
                  {wedding.phases.filter(p => p.status === 'COMPLETED').length} completed
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Guest Count</StatLabel>
                <StatNumber>
                  {wedding.phases.reduce((max, phase) => Math.max(max, phase.guestCount), 0)}
                </StatNumber>
                <StatHelpText>Expected attendees</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Main Content Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Phases ({wedding.phases.length})</Tab>
            <Tab>Budget</Tab>
            <Tab>Timeline</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Phases Overview */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <Text fontSize="lg" fontWeight="bold">Wedding Phases</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {wedding.phases.map((phase) => (
                        <Card key={phase.id} variant="outline">
                          <CardBody>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={2} flex={1}>
                                <HStack>
                                  <Text fontWeight="semibold" fontSize="lg">{phase.name}</Text>
                                  <Badge 
                                    colorScheme={phase.status === 'COMPLETED' ? 'green' : 'blue'} 
                                    variant="subtle"
                                  >
                                    {phase.status}
                                  </Badge>
                                </HStack>
                                <HStack spacing={4}>
                                  <HStack>
                                    <Calendar size={14} />
                                    <Text fontSize="sm" color="gray.600">
                                      {formatDateForDisplay(phase.date)}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Users size={14} />
                                    <Text fontSize="sm" color="gray.600">
                                      {phase.guestCount} guests
                                    </Text>
                                  </HStack>
                                </HStack>
                                {phase.venue && (
                                  <Text fontSize="sm" color="gray.500">
                                    📍 {phase.venue.name}
                                  </Text>
                                )}
                              </VStack>
                              
                              <VStack align="end" spacing={2}>
                                <Text fontSize="sm" fontWeight="semibold">
                                  {phase.progress}% Complete
                                </Text>
                                <Progress 
                                  value={phase.progress} 
                                  size="sm" 
                                  colorScheme="purple"
                                  width="120px"
                                />
                                {phase.budget && (
                                  <Text fontSize="sm" color="gray.600">
                                    {formatCurrency(phase.budget.spent)} / {formatCurrency(phase.budget.total)}
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                            
                            <Divider my={3} />
                            
                            <SimpleGrid columns={3} spacing={4}>
                              <VStack>
                                <Text fontSize="xs" color="gray.500" textAlign="center">VENDORS</Text>
                                <Text fontSize="sm" fontWeight="semibold">
                                  {phase.vendors?.confirmed || 0}/{phase.vendors?.total || 0}
                                </Text>
                              </VStack>
                              <VStack>
                                <Text fontSize="xs" color="gray.500" textAlign="center">TASKS</Text>
                                <Text fontSize="sm" fontWeight="semibold">
                                  {phase.tasks?.completed || 0}/{phase.tasks?.total || 0}
                                </Text>
                              </VStack>
                              <VStack>
                                <Text fontSize="xs" color="gray.500" textAlign="center">BUDGET</Text>
                                <Text fontSize="sm" fontWeight="semibold">
                                  {phase.budget ? Math.round((phase.budget.spent / phase.budget.total) * 100) : 0}%
                                </Text>
                              </VStack>
                            </SimpleGrid>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Budget Overview */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <Text fontSize="lg" fontWeight="bold">Budget Overview</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text>Total Budget:</Text>
                        <Text fontWeight="bold" fontSize="lg">
                          {formatCurrency(wedding.overallBudget.total)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Spent:</Text>
                        <Text color="red.500" fontWeight="semibold">
                          {formatCurrency(wedding.overallBudget.spent)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Remaining:</Text>
                        <Text color="green.500" fontWeight="semibold">
                          {formatCurrency(wedding.overallBudget.remaining)}
                        </Text>
                      </HStack>
                      <Progress 
                        value={(wedding.overallBudget.spent / wedding.overallBudget.total) * 100}
                        colorScheme="purple"
                        size="md"
                      />
                      
                      {wedding.overallBudget.categories && (
                        <>
                          <Divider />
                          <Text fontWeight="semibold">Top Categories:</Text>
                          <VStack spacing={2} align="stretch">
                            {wedding.overallBudget.categories.slice(0, 5).map((category) => (
                              <HStack key={category.name} justify="space-between">
                                <Text fontSize="sm">{category.name}</Text>
                                <HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    {formatCurrency(category.spent)} / {formatCurrency(category.allocated)}
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold" color="purple.600">
                                    {Math.round((category.spent / category.allocated) * 100)}%
                                  </Text>
                                </HStack>
                              </HStack>
                            ))}
                          </VStack>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Phases Tab */}
            <TabPanel px={0}>
              <WeddingPhases phases={wedding?.phases?.map(phase => ({
                ...phase,
                guest_count: phase.guestCount
              })) || []} />
            </TabPanel>

            {/* Budget Tab */}
            <TabPanel px={0}>
              <WeddingBudgetTracker budget={wedding?.overallBudget || { total: 0, spent: 0, remaining: 0, currency: 'USD' }} />
            </TabPanel>

            {/* Timeline Tab */}
            <TabPanel px={0}>
              <WeddingTimeline wedding={wedding as any} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </DashboardLayout>
  )
}
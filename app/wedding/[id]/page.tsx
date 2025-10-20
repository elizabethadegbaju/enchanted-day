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
      
      // Fallback to mock data for development
      setWedding({
        id: weddingId,
        coupleNames: ['Emma', 'James'],
        weddingType: 'MULTI_PHASE',
        status: 'PLANNING',
        overallProgress: 68,
        daysUntilWedding: 127,
        phases: [
          {
            id: '1',
            name: 'Ceremony',
            date: '2024-06-15',
            status: 'PLANNING',
            progress: 75,
            venue: {
              name: 'St. Mary\'s Cathedral',
              location: '123 Church St, City',
              capacity: 200
            },
            guestCount: 150,
            budget: {
              total: 15000,
              spent: 8500,
              remaining: 6500,
              currency: 'USD'
            },
            vendors: { total: 8, confirmed: 5 },
            tasks: { completed: 12, total: 18 }
          },
          {
            id: '2',
            name: 'Reception',
            date: '2024-06-15',
            status: 'PLANNING',
            progress: 60,
            venue: {
              name: 'Grand Ballroom',
              location: '456 Event Ave, City',
              capacity: 180
            },
            guestCount: 150,
            budget: {
              total: 25000,
              spent: 12000,
              remaining: 13000,
              currency: 'USD'
            },
            vendors: { total: 6, confirmed: 3 },
            tasks: { completed: 8, total: 15 }
          }
        ],
        overallBudget: {
          total: 40000,
          allocated: 38000,
          spent: 20500,
          remaining: 19500,
          currency: 'USD',
          categories: [
            { name: 'Venue', allocated: 15000, spent: 10000, percentage: 25 },
            { name: 'Catering', allocated: 12000, spent: 6000, percentage: 20 },
            { name: 'Photography', allocated: 5000, spent: 2500, percentage: 15 },
            { name: 'Florals', allocated: 3000, spent: 1500, percentage: 10 },
            { name: 'Music', allocated: 2000, spent: 500, percentage: 8 }
          ]
        },
        preferences: {
          style: 'Classic Elegant',
          colorPalette: ['#8B5A96', '#F5E6D3', '#E8B4B8'],
          theme: 'Garden Romance'
        }
      })
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
    return (
      <DashboardLayout>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Unable to load wedding details!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
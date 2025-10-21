'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Button,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Plus
} from 'lucide-react'
import { getDashboardData, type DashboardData } from '@/lib/wedding-data-service'
import { formatDateForDisplay, getDaysUntilDate } from '@/lib/data-utils'
import { useWedding } from '@/contexts/WeddingContext'
import type { Wedding } from '@/types'

export default function DashboardPage() {
  const { selectedWeddingId, isLoading: weddingLoading } = useWedding();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    if (selectedWeddingId && !weddingLoading) {
      loadDashboardData()
    }
  }, [selectedWeddingId, weddingLoading])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      

      
      // getCurrentUser() is called inside getDashboardData()
      try {
        const data = await getDashboardData(selectedWeddingId || undefined)
        setDashboardData(data)
      } catch (dataError) {
        console.error('Failed to fetch dashboard data:', dataError)
        
        // Check if user has no weddings and needs to create one
        if (dataError instanceof Error && dataError.message.includes('No weddings found')) {
          setError('No weddings found. Create your first wedding to get started!')
          return
        }
        
        // Re-throw the error to be handled properly
        throw dataError
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading || weddingLoading) {
    return (
      <DashboardLayout title="Wedding Overview">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="brand.500" />
          <Text>Loading your wedding dashboard...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (!selectedWeddingId) {
    return (
      <DashboardLayout title="Wedding Overview">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Text fontSize="xl" textAlign="center">
            Please select a wedding to view the dashboard
          </Text>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            size="lg"
            onClick={() => window.location.href = '/wedding/create'}
          >
            Create Your First Wedding
          </Button>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error) {
    const isNoWeddingsError = error.includes('No weddings found')
    
    return (
      <DashboardLayout title="Wedding Overview">
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isNoWeddingsError ? "info" : "error"} maxW="md">
            <AlertIcon />
            <Box>
              <AlertTitle>
                {isNoWeddingsError ? "Welcome to Enchanted Day!" : "Error"}
              </AlertTitle>
              <AlertDescription>
                {isNoWeddingsError 
                  ? "Let's create your first wedding to get started planning your special day."
                  : error
                }
              </AlertDescription>
            </Box>
          </Alert>
          
          {isNoWeddingsError ? (
            <Button 
              as="a" 
              href="/wedding/create" 
              colorScheme="brand" 
              size="lg"
              leftIcon={<Plus />}
            >
              Create Your Wedding
            </Button>
          ) : (
            <Button onClick={loadDashboardData} colorScheme="brand">
              Retry
            </Button>
          )}
        </VStack>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout title="Welcome to EnchantedDay">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Text fontSize="xl" textAlign="center">
            Welcome to your AI-powered wedding planning journey!
          </Text>
          <Text color="neutral.600" textAlign="center">
            Get started by creating your first wedding.
          </Text>
          <Button
            leftIcon={<Plus size={16} />}
            colorScheme="brand"
            size="lg"
            onClick={() => window.location.href = '/wedding/create'}
          >
            Create Your Wedding
          </Button>
        </VStack>
      </DashboardLayout>
    )
  }

  const { stats } = dashboardData

  // Use real data if available, otherwise fallback to mock data
  const recentActivity = dashboardData.recentActivity || [
    {
      id: 1,
      type: 'vendor',
      message: 'Photographer confirmed availability for June 15th',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'guest',
      message: '12 new RSVP responses received',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'budget',
      message: 'Catering quote updated - $200 under budget',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'alert',
      message: 'Venue requires final headcount by March 1st',
      time: '2 days ago',
      status: 'warning',
    },
  ]

  const upcomingTasks = dashboardData.upcomingTasks || [
    {
      id: 1,
      title: 'Finalize menu with caterer',
      dueDate: 'Due in 3 days',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Send save-the-dates',
      dueDate: 'Due in 1 week',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Book transportation',
      dueDate: 'Due in 2 weeks',
      priority: 'low',
    },
  ]

  return (
    <DashboardLayout title="Wedding Overview">
      <VStack spacing={8} align="stretch">
        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Days Until Wedding</StatLabel>
                <StatNumber color="brand.600" fontSize="2xl">
                  {stats.daysUntilWedding}
                </StatNumber>
                <StatHelpText>{formatDateForDisplay(dashboardData.wedding.weddingDate)}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Vendors</StatLabel>
                <StatNumber fontSize="2xl">
                  {stats.confirmedVendors}/{stats.totalVendors}
                </StatNumber>
                <StatHelpText color="green.500">
                  <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {stats.confirmedVendors} confirmed
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Guest RSVPs</StatLabel>
                <StatNumber fontSize="2xl">
                  {stats.rsvpReceived}/{stats.totalGuests}
                </StatNumber>
                <StatHelpText>
                  {Math.round((stats.rsvpReceived / stats.totalGuests) * 100)}% response rate
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Budget Used</StatLabel>
                <StatNumber fontSize="2xl">{stats.budgetUsed}%</StatNumber>
                <Progress 
                  value={stats.budgetUsed} 
                  colorScheme={stats.budgetUsed > 80 ? 'red' : 'brand'} 
                  size="sm" 
                  mt={2}
                />
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Recent Activity */}
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold">Recent Activity</Text>
                  <Button size="sm" variant="outline">View All</Button>
                </HStack>
                
                <VStack align="stretch" spacing={3}>
                  {recentActivity.map((activity, index) => (
                    <Box key={activity.id}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm">{activity.description}</Text>
                          <Text fontSize="xs" color="neutral.500">{new Date(activity.timestamp).toLocaleDateString()}</Text>
                        </VStack>
                        <Badge
                          colorScheme={
                            activity.priority === 'HIGH' ? 'red' :
                            activity.priority === 'MEDIUM' ? 'orange' : 'blue'
                          }
                          size="sm"
                        >
                          {activity.priority || 'LOW'}
                        </Badge>
                      </HStack>
                      {index < recentActivity.length - 1 && <Divider mt={3} />}
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold">Upcoming Tasks</Text>
                  <Button size="sm" leftIcon={<Plus size={14} />}>Add Task</Button>
                </HStack>
                
                <VStack align="stretch" spacing={3}>
                  {upcomingTasks.map((task, index) => (
                    <Box key={task.id}>
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" fontWeight="medium">{task.title}</Text>
                          <Badge
                            colorScheme={
                              task.priority === 'high' ? 'red' :
                              task.priority === 'medium' ? 'orange' : 'gray'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="neutral.500">{task.dueDate}</Text>
                      </VStack>
                      {index < upcomingTasks.length - 1 && <Divider mt={3} />}
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Text fontSize="lg" fontWeight="semibold">Quick Actions</Text>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                <Button
                  leftIcon={<Plus size={16} />}
                  colorScheme="brand"
                  size="lg"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/wedding/create'}
                >
                  <VStack spacing={1}>
                    <Text>Create Wedding</Text>
                    <Text fontSize="xs" color="brand.100">Start planning your special day</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<Users size={16} />}
                  variant="outline"
                  size="lg"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/vendors'}
                >
                  <VStack spacing={1}>
                    <Text>Manage Vendors</Text>
                    <Text fontSize="xs" color="neutral.500">View and manage your vendors</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<Calendar size={16} />}
                  variant="outline"
                  size="lg"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/timeline'}
                >
                  <VStack spacing={1}>
                    <Text>View Timeline</Text>
                    <Text fontSize="xs" color="neutral.500">Check your wedding timeline</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<CheckCircle size={16} />}
                  variant="outline"
                  size="lg"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/guests'}
                >
                  <VStack spacing={1}>
                    <Text>Manage Guests</Text>
                    <Text fontSize="xs" color="neutral.500">View guest list and RSVPs</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<DollarSign size={16} />}
                  variant="outline"
                  size="lg"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/budget'}
                >
                  <VStack spacing={1}>
                    <Text>Track Budget</Text>
                    <Text fontSize="xs" color="neutral.500">Monitor wedding expenses</Text>
                  </VStack>
                </Button>
              </Grid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </DashboardLayout>
  )
}
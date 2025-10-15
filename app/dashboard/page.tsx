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
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Plus
} from 'lucide-react'
import { amplifyDataClient } from '@/lib/amplify-client'
import type { Wedding } from '@/types'

interface DashboardData {
  wedding: {
    id: string;
    coupleNames: string[];
    weddingDate: string;
    status: string;
  };
  stats: {
    daysUntilWedding: number;
    totalVendors: number;
    confirmedVendors: number;
    totalGuests: number;
    rsvpReceived: number;
    budgetUsed: number;
    tasksCompleted: number;
    totalTasks: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    status: string;
  }>;
  upcomingTasks: Array<{
    id: number;
    title: string;
    dueDate: string;
    priority: string;
  }>;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading dashboard data...')
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL)
      
      // Get user's weddings using authenticated API client
      let weddings
      try {
        weddings = await amplifyDataClient.getWeddings()
        console.log('Weddings fetched:', weddings)
      } catch (weddingError) {
        console.error('Failed to fetch weddings:', weddingError)
        const errorMessage = weddingError instanceof Error ? weddingError.message : 'Unknown error'
        throw new Error(`Failed to fetch weddings: ${errorMessage}`)
      }
      
      if (weddings.length === 0) {
        // No weddings yet - use mock data for now
        setDashboardData({
          wedding: {
            id: '1',
            coupleNames: ['John', 'Jane'],
            weddingDate: '2024-06-15',
            status: 'planning'
          },
          stats: {
            daysUntilWedding: 120,
            totalVendors: 8,
            confirmedVendors: 5,
            totalGuests: 150,
            rsvpReceived: 45,
            budgetUsed: 65,
            tasksCompleted: 12,
            totalTasks: 25
          },
          recentActivity: [],
          upcomingTasks: []
        })
        return
      }

      // Get dashboard data for the first wedding
      const wedding = weddings[0]
      console.log('Fetching dashboard for wedding:', wedding)
      
      // Get the primary wedding date (first phase date)
      const primaryPhase = wedding.phases && wedding.phases.length > 0 ? wedding.phases[0] : null
      const primaryDate = primaryPhase?.date ? new Date(primaryPhase.date) : new Date()
      
      setDashboardData({
        wedding: {
          id: wedding.id,
          coupleNames: wedding.couple_names?.filter(name => name !== null) as string[] || ['John', 'Jane'],
          weddingDate: primaryDate.toISOString().split('T')[0] || '2024-06-15',
          status: wedding.status || 'planning'
        },
        stats: {
          daysUntilWedding: 120,
          totalVendors: 8,
          confirmedVendors: 5,
          totalGuests: 150,
          rsvpReceived: 45,
          budgetUsed: 65,
          tasksCompleted: 12,
          totalTasks: 25
        },
        recentActivity: [],
        upcomingTasks: []
      })
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Wedding Overview">
        <VStack spacing={8} align="center" justify="center" minH="400px">
          <Spinner size="xl" color="brand.500" />
          <Text>Loading your wedding dashboard...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Wedding Overview">
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
          <Button onClick={loadDashboardData} colorScheme="brand">
            Retry
          </Button>
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
                <StatHelpText>June 15, 2024</StatHelpText>
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
                          <Text fontSize="sm">{activity.message}</Text>
                          <Text fontSize="xs" color="neutral.500">{activity.time}</Text>
                        </VStack>
                        <Badge
                          colorScheme={
                            activity.status === 'success' ? 'green' :
                            activity.status === 'warning' ? 'orange' : 'blue'
                          }
                          size="sm"
                        >
                          {activity.status}
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
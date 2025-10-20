'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Progress,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Grid
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Plus
} from 'lucide-react'
import { getTimelineData, type TimelineData } from '@/lib/wedding-data-service'
import { 
  formatDateForDisplay, 
  formatDateTimeForDisplay, 
  isOverdue, 
  getDaysUntilDate 
} from '@/lib/data-utils'

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    loadTimelineData()
  }, [])

  const loadTimelineData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // getCurrentUser() is called inside getTimelineData()
      const data = await getTimelineData()
      setTimelineData(data)
    } catch (err) {
      console.error('Error loading timeline data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load timeline data')
      
      // Fallback to mock data for development
      setTimelineData({
        milestones: [
          {
            id: '1',
            name: 'Save the Date Sent',
            targetDate: '2024-01-15',
            status: 'COMPLETED',
            priority: 'HIGH',
            progress: 100,
            phaseId: 'pre-wedding',
            responsibleParties: ['Emma', 'James']
          },
          {
            id: '2',
            name: 'Invitations Sent',
            targetDate: '2024-03-01',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            progress: 75,
            phaseId: 'pre-wedding',
            responsibleParties: ['Emma']
          },
          {
            id: '3',
            name: 'Final Headcount Confirmed',
            targetDate: '2024-05-15',
            status: 'PENDING',
            priority: 'CRITICAL',
            progress: 0,
            phaseId: 'ceremony',
            responsibleParties: ['Emma', 'James', 'Wedding Planner']
          },
          {
            id: '4',
            name: 'Rehearsal Dinner Setup',
            targetDate: '2024-06-14',
            status: 'PENDING',
            priority: 'MEDIUM',
            progress: 0,
            phaseId: 'pre-wedding',
            responsibleParties: ['Wedding Planner']
          }
        ],
        tasks: [
          {
            id: '1',
            title: 'Book photographer for engagement session',
            dueDate: '2024-02-14',
            status: 'COMPLETED',
            priority: 'HIGH',
            phaseId: 'pre-wedding',
            assignedTo: ['Emma'],
            dependencies: ['photographer-booking']
          },
          {
            id: '2',
            title: 'Finalize wedding cake design',
            dueDate: '2024-03-15',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            phaseId: 'reception',
            assignedTo: ['James', 'Emma'],
            dependencies: ['venue-confirmation']
          },
          {
            id: '3',
            title: 'Order wedding favors',
            dueDate: '2024-04-01',
            status: 'PENDING',
            priority: 'LOW',
            phaseId: 'reception',
            assignedTo: ['Emma']
          },
          {
            id: '4',
            title: 'Schedule hair and makeup trial',
            dueDate: '2024-02-20',
            status: 'OVERDUE',
            priority: 'HIGH',
            phaseId: 'ceremony',
            assignedTo: ['Emma']
          }
        ],
        activities: [
          {
            id: '1',
            type: 'MILESTONE_COMPLETED',
            title: 'Save the Date milestone completed',
            description: 'All save the date cards have been sent to guests',
            timestamp: '2024-01-15T10:30:00Z',
            phaseId: 'pre-wedding',
            performedBy: 'Emma'
          },
          {
            id: '2',
            type: 'TASK_COMPLETED',
            title: 'Photographer booked',
            description: 'Engagement session photographer confirmed for February 14th',
            timestamp: '2024-01-20T14:15:00Z',
            phaseId: 'pre-wedding',
            performedBy: 'Emma'
          },
          {
            id: '3',
            type: 'VENDOR_CONFIRMED',
            title: 'Caterer confirmed',
            description: 'Elegant Catering confirmed for reception service',
            timestamp: '2024-01-25T09:45:00Z',
            phaseId: 'reception',
            performedBy: 'James'
          },
          {
            id: '4',
            type: 'TASK_UPDATED',
            title: 'Wedding cake design in progress',
            description: 'Started working with baker on custom cake design',
            timestamp: '2024-01-28T16:20:00Z',
            phaseId: 'reception',
            performedBy: 'Emma'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'red'
      case 'HIGH': return 'orange'
      case 'MEDIUM': return 'yellow'
      case 'LOW': return 'green'
      default: return 'gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green'
      case 'IN_PROGRESS': return 'blue'
      case 'OVERDUE': return 'red'
      case 'PENDING': return 'gray'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} />
      case 'IN_PROGRESS': return <Clock size={16} />
      case 'OVERDUE': return <AlertTriangle size={16} />
      case 'PENDING': return <Calendar size={16} />
      default: return null
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'MILESTONE_COMPLETED': return <Target size={16} />
      case 'TASK_COMPLETED': return <CheckCircle size={16} />
      case 'VENDOR_CONFIRMED': return <CheckCircle size={16} />
      case 'TASK_UPDATED': return <Activity size={16} />
      default: return <Activity size={16} />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="purple.500" />
          <Text>Loading timeline...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error && !timelineData) {
    return (
      <DashboardLayout>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Unable to load timeline!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  if (!timelineData) {
    return (
      <DashboardLayout>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4} py={8}>
              <Text fontSize="lg" color="gray.500">No timeline data available</Text>
              <Button leftIcon={<Plus size={16} />} colorScheme="purple">
                Create Your First Milestone
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
        <HStack justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">Wedding Timeline</Text>
          <HStack spacing={2}>
            <Button leftIcon={<Target size={16} />} variant="outline">
              Add Milestone
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="purple">
              Add Task
            </Button>
          </HStack>
        </HStack>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Milestones ({timelineData.milestones.length})</Tab>
            <Tab>Tasks ({timelineData.tasks.length})</Tab>
            <Tab>Activity Feed ({timelineData.activities.length})</Tab>
          </TabList>

          <TabPanels>
            {/* Milestones Tab */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {timelineData.milestones.map((milestone) => (
                  <Card key={milestone.id} bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Grid templateColumns={{ base: '1fr', md: '1fr auto auto' }} gap={4} alignItems="center">
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Target size={20} />
                            <Text fontWeight="bold" fontSize="lg">{milestone.name}</Text>
                          </HStack>
                          <HStack spacing={4}>
                            <HStack>
                              <Calendar size={14} />
                              <Text fontSize="sm" color="gray.600">
                                {formatDateForDisplay(milestone.targetDate)}
                              </Text>
                              {getDaysUntilDate(milestone.targetDate) > 0 && (
                                <Text fontSize="sm" color="gray.500">
                                  ({getDaysUntilDate(milestone.targetDate)} days)
                                </Text>
                              )}
                            </HStack>
                            <Badge colorScheme={getPriorityColor(milestone.priority)} variant="subtle">
                              {milestone.priority}
                            </Badge>
                          </HStack>
                          {milestone.responsibleParties.length > 0 && (
                            <Text fontSize="sm" color="gray.500">
                              Responsible: {milestone.responsibleParties.join(', ')}
                            </Text>
                          )}
                        </VStack>

                        <VStack spacing={2} minW="120px">
                          <Progress
                            value={milestone.progress}
                            size="md"
                            colorScheme={getStatusColor(milestone.status)}
                            borderRadius="md"
                            width="100%"
                          />
                          <Text fontSize="sm" color="gray.600">
                            {milestone.progress}% complete
                          </Text>
                        </VStack>

                        <Badge
                          colorScheme={getStatusColor(milestone.status)}
                          variant="solid"
                          p={2}
                          borderRadius="md"
                        >
                          <HStack spacing={1}>
                            {getStatusIcon(milestone.status)}
                            <Text>{milestone.status.replace('_', ' ')}</Text>
                          </HStack>
                        </Badge>
                      </Grid>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>

            {/* Tasks Tab */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {timelineData.tasks.map((task) => (
                  <Card 
                    key={task.id} 
                    bg={cardBg} 
                    borderColor={borderColor}
                    borderLeft={isOverdue(task.dueDate) ? "4px solid" : undefined}
                    borderLeftColor={isOverdue(task.dueDate) ? "red.400" : undefined}
                  >
                    <CardBody>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex={1}>
                          <HStack>
                            <CheckCircle size={16} />
                            <Text fontWeight="semibold">{task.title}</Text>
                            {isOverdue(task.dueDate) && task.status !== 'COMPLETED' && (
                              <Badge colorScheme="red" variant="solid">OVERDUE</Badge>
                            )}
                          </HStack>
                          <HStack spacing={4}>
                            <HStack>
                              <Calendar size={14} />
                              <Text fontSize="sm" color="gray.600">
                                Due: {formatDateForDisplay(task.dueDate)}
                              </Text>
                            </HStack>
                            <Badge colorScheme={getPriorityColor(task.priority)} variant="subtle">
                              {task.priority}
                            </Badge>
                          </HStack>
                          {task.assignedTo.length > 0 && (
                            <Text fontSize="sm" color="gray.500">
                              Assigned to: {task.assignedTo.join(', ')}
                            </Text>
                          )}
                          {task.dependencies && task.dependencies.length > 0 && (
                            <Text fontSize="sm" color="gray.500">
                              Depends on: {task.dependencies.join(', ')}
                            </Text>
                          )}
                        </VStack>

                        <Badge
                          colorScheme={getStatusColor(task.status)}
                          variant="solid"
                          p={2}
                          borderRadius="md"
                        >
                          <HStack spacing={1}>
                            {getStatusIcon(task.status)}
                            <Text>{task.status.replace('_', ' ')}</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>

            {/* Activity Feed Tab */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {timelineData.activities.map((activity) => (
                  <Card key={activity.id} bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <HStack align="start" spacing={4}>
                        <Box color="purple.500" mt={1}>
                          {getActivityIcon(activity.type)}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold">{activity.title}</Text>
                          {activity.description && (
                            <Text fontSize="sm" color="gray.600">{activity.description}</Text>
                          )}
                          <HStack spacing={4}>
                            <Text fontSize="sm" color="gray.500">
                              {formatDateTimeForDisplay(activity.timestamp)}
                            </Text>
                            {activity.performedBy && (
                              <Text fontSize="sm" color="gray.500">
                                by {activity.performedBy}
                              </Text>
                            )}
                            {activity.phaseId && (
                              <Badge size="sm" variant="outline">
                                {activity.phaseId}
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </DashboardLayout>
  )
}
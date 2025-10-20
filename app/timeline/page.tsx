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
      setTimelineData(null)
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
    const isNoWeddingsError = error.includes('No weddings found')
    
    return (
      <DashboardLayout>
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isNoWeddingsError ? "info" : "error"} maxW="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>
                {isNoWeddingsError ? "No Wedding Found" : "Unable to load timeline!"}
              </AlertTitle>
              <AlertDescription>
                {isNoWeddingsError 
                  ? "Please create a wedding first to view your timeline."
                  : error
                }
              </AlertDescription>
            </VStack>
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
            <Button onClick={loadTimelineData} colorScheme="brand">
              Retry
            </Button>
          )}
        </VStack>
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
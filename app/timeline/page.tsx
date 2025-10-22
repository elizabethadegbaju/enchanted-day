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
  Grid,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AddMilestoneModal } from '@/components/timeline/AddMilestoneModal'
import { AddTaskModal } from '@/components/timeline/AddTaskModal'
import { 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Activity,
  Plus,
  Sparkles,
  MessageCircle,
  Camera
} from 'lucide-react'
import { getTimelineData, createMilestone, createTask, type TimelineData } from '@/lib/wedding-data-service'
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
  const toast = useToast()
  
  // Modal state
  const { isOpen: isMilestoneOpen, onOpen: onMilestoneOpen, onClose: onMilestoneClose } = useDisclosure()
  const { isOpen: isTaskOpen, onOpen: onTaskOpen, onClose: onTaskClose } = useDisclosure()

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

  // Handler functions for buttons
  const handleAddMilestone = () => {
    onMilestoneOpen()
  }

  const handleAddTask = () => {
    onTaskOpen()
  }

  const handleCreateFirstMilestone = () => {
    onMilestoneOpen()
  }

  // Save handlers
  const handleSaveMilestone = async (milestoneData: any) => {
    await createMilestone(milestoneData)
    await loadTimelineData() // Refresh data
  }

  const handleSaveTask = async (taskData: any) => {
    await createTask(taskData)
    await loadTimelineData() // Refresh data
  }

  // Helper function to get phases for modals
  const getPhases = () => {
    if (!timelineData?.milestones) return []
    
    // Extract unique phase information from milestones
    const phases = new Map()
    timelineData.milestones.forEach(milestone => {
      if (milestone.phaseId) {
        phases.set(milestone.phaseId, {
          id: milestone.phaseId,
          name: `Phase ${milestone.phaseId}`
        })
      }
    })
    
    return Array.from(phases.values())
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
        <VStack spacing={8} align="center" justify="center" minH="400px">
          {isNoWeddingsError ? (
            <>
              <VStack spacing={4} textAlign="center">
                <Box>
                  <Sparkles size={64} color="var(--chakra-colors-brand-500)" />
                </Box>
                <VStack spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                    Welcome to Your AI Wedding Planner!
                  </Text>
                  <Text fontSize="lg" color="neutral.600" maxW="2xl">
                    Let's start planning your magical day. Our AI assistant is here to help you every step of the way.
                  </Text>
                </VStack>
              </VStack>

              <VStack spacing={4} w="full" maxW="md">
                <Button
                  leftIcon={<Plus size={20} />}
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/wedding/create'}
                >
                  <VStack spacing={1}>
                    <Text fontSize="md" fontWeight="semibold">Create Your Wedding</Text>
                    <Text fontSize="sm" opacity={0.9}>Set up your special day details</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<MessageCircle size={20} />}
                  variant="outline"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  h="auto"
                  py={4}
                  onClick={() => window.location.href = '/chat'}
                >
                  <VStack spacing={1}>
                    <Text fontSize="md" fontWeight="semibold">Chat with AI Assistant</Text>
                    <Text fontSize="sm" color="neutral.600">Get instant planning help</Text>
                  </VStack>
                </Button>
              </VStack>
            </>
          ) : (
            <>
              <Alert status="error" maxW="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
              <Button onClick={loadTimelineData} colorScheme="brand">
                Retry
              </Button>
            </>
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
              <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleCreateFirstMilestone}>
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
            <Button leftIcon={<Target size={16} />} variant="outline" onClick={handleAddMilestone}>
              Add Milestone
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleAddTask}>
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
      
      {/* Modals */}
      <AddMilestoneModal
        isOpen={isMilestoneOpen}
        onClose={onMilestoneClose}
        onSave={handleSaveMilestone}
        phases={getPhases()}
      />
      
      <AddTaskModal
        isOpen={isTaskOpen}
        onClose={onTaskClose}
        onSave={handleSaveTask}
        phases={getPhases()}
        existingTasks={timelineData?.tasks || []}
      />
    </DashboardLayout>
  )
}
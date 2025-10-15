'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Badge,
  Progress,
  Button,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,

} from '@chakra-ui/react'
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Users,
  MapPin,

} from 'lucide-react'

import { WeddingForComponents } from '@/types';

interface WeddingOverviewProps {
  wedding: WeddingForComponents
}

export const WeddingOverview: React.FC<WeddingOverviewProps> = ({ wedding }) => {
  // Mock data for recent activity and upcoming tasks
  const recentActivity = [
    {
      id: 1,
      type: 'vendor',
      message: 'Photographer confirmed availability for Church Wedding',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'guest',
      message: '8 new RSVP responses received',
      time: '4 hours ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'budget',
      message: 'Catering quote updated - $500 under budget',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'alert',
      message: 'Venue requires final headcount by May 1st',
      time: '2 days ago',
      status: 'warning',
    },
    {
      id: 5,
      type: 'task',
      message: 'Completed: Send save-the-dates for Legal Ceremony',
      time: '3 days ago',
      status: 'success',
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      title: 'Finalize menu with caterer',
      dueDate: 'Due in 3 days',
      priority: 'high',
      phase: 'Reception',
    },
    {
      id: 2,
      title: 'Confirm transportation for guests',
      dueDate: 'Due in 1 week',
      priority: 'medium',
      phase: 'Church Wedding',
    },
    {
      id: 3,
      title: 'Order wedding favors',
      dueDate: 'Due in 2 weeks',
      priority: 'low',
      phase: 'Reception',
    },
    {
      id: 4,
      title: 'Schedule final dress fitting',
      dueDate: 'Due in 2 weeks',
      priority: 'medium',
      phase: 'All Phases',
    },
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Venue Deadline Approaching',
      message: 'Grand Ballroom requires final headcount by May 1st (in 12 days)',
      phase: 'Reception',
    },
    {
      id: 2,
      type: 'info',
      title: 'Weather Update',
      message: 'Forecast shows possible rain for June 15th. Backup plan activated.',
      phase: 'Church Wedding',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'info':
        return Clock
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'green.500'
      case 'warning':
        return 'orange.500'
      case 'info':
        return 'blue.500'
      default:
        return 'neutral.500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'gray'
      default:
        return 'gray'
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Alerts */}
      {alerts.length > 0 && (
        <VStack spacing={3} align="stretch">
          {alerts.map((alert) => (
            <Alert key={alert.id} status={alert.type as 'info' | 'warning' | 'success' | 'error'}>
              <AlertIcon />
              <VStack align="start" spacing={1} flex={1}>
                <HStack justify="space-between" w="full">
                  <AlertTitle fontSize="sm">{alert.title}</AlertTitle>
                  <Badge size="sm" colorScheme="brand">{alert.phase}</Badge>
                </HStack>
                <AlertDescription fontSize="sm">
                  {alert.message}
                </AlertDescription>
              </VStack>
            </Alert>
          ))}
        </VStack>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">Recent Activity</Text>
              <Button size="sm" variant="outline">View All</Button>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={4}>
              {recentActivity.map((activity, index) => {
                const StatusIcon = getStatusIcon(activity.status)
                return (
                  <VStack key={activity.id} align="stretch" spacing={2}>
                    <HStack spacing={3} align="start">
                      <StatusIcon 
                        size={16} 
                        color={`var(--chakra-colors-${getStatusColor(activity.status).replace('.', '-')})`}
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm">{activity.message}</Text>
                        <Text fontSize="xs" color="neutral.500">{activity.time}</Text>
                      </VStack>
                    </HStack>
                    {index < recentActivity.length - 1 && <Divider />}
                  </VStack>
                )
              })}
            </VStack>
          </CardBody>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">Upcoming Tasks</Text>
              <Button size="sm" variant="outline">Manage Tasks</Button>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={4}>
              {upcomingTasks.map((task, index) => (
                <VStack key={task.id} align="stretch" spacing={2}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium">{task.title}</Text>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color="neutral.500">{task.dueDate}</Text>
                        <Badge size="xs" colorScheme="brand">{task.phase}</Badge>
                      </HStack>
                    </VStack>
                    <Badge
                      colorScheme={getPriorityColor(task.priority)}
                      size="sm"
                    >
                      {task.priority}
                    </Badge>
                  </HStack>
                  {index < upcomingTasks.length - 1 && <Divider />}
                </VStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Phase Summary */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">Phase Summary</Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {wedding.phases.map((phase, index: number) => (
              <Card key={phase.id} variant="outline">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{phase.name}</Text>
                        <Badge size="sm" colorScheme="brand">
                          Phase {index + 1}
                        </Badge>
                      </VStack>
                      <Badge
                        colorScheme={
                          (phase.progress ?? 0) >= 80 ? 'green' :
                          (phase.progress ?? 0) >= 50 ? 'yellow' : 'red'
                        }
                        size="sm"
                      >
                        {phase.progress ?? 0}%
                      </Badge>
                    </HStack>

                    <Progress
                      value={phase.progress ?? 0}
                      colorScheme={
                        (phase.progress ?? 0) >= 80 ? 'green' :
                        (phase.progress ?? 0) >= 50 ? 'yellow' : 'red'
                      }
                      size="sm"
                      borderRadius="full"
                    />

                    <VStack spacing={2} align="stretch" fontSize="sm">
                      <HStack spacing={2}>
                        <Calendar size={14} color="var(--chakra-colors-neutral-500)" />
                        <Text>{phase.date.toLocaleDateString()}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <MapPin size={14} color="var(--chakra-colors-neutral-500)" />
                        <Text>{phase.venue.name}</Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Users size={14} color="var(--chakra-colors-neutral-500)" />
                        <Text>{phase.guestCount ?? 0} guests</Text>
                      </HStack>
                    </VStack>

                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">Budget Summary</Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Total Budget</Text>
              <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                ${wedding.overallBudget.total.toLocaleString()}
              </Text>
            </VStack>
            
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Allocated</Text>
              <Text fontSize="2xl" fontWeight="bold">
                ${wedding.overallBudget.allocated.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                {Math.round((wedding.overallBudget.allocated / wedding.overallBudget.total) * 100)}% of total
              </Text>
            </VStack>
            
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Spent</Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                ${wedding.overallBudget.spent.toLocaleString()}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                {Math.round((wedding.overallBudget.spent / wedding.overallBudget.total) * 100)}% of total
              </Text>
            </VStack>
            
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="neutral.600">Remaining</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                ${(wedding.overallBudget.total - wedding.overallBudget.spent).toLocaleString()}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                {Math.round(((wedding.overallBudget.total - wedding.overallBudget.spent) / wedding.overallBudget.total) * 100)}% of total
              </Text>
            </VStack>
          </SimpleGrid>
          
          <Progress
            value={(wedding.overallBudget.spent / wedding.overallBudget.total) * 100}
            colorScheme={
              (wedding.overallBudget.spent / wedding.overallBudget.total) > 0.8 ? 'red' : 'brand'
            }
            size="lg"
            borderRadius="full"
            mt={4}
          />
        </CardBody>
      </Card>
    </VStack>
  )
}
'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Button,
  Box,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  MapPin,
  Edit
} from 'lucide-react'

import { Wedding } from '@/types';

interface WeddingTimelineProps {
  wedding: Wedding
}

export const WeddingTimeline: React.FC<WeddingTimelineProps> = () => {
  const borderColor = useColorModeValue('neutral.200', 'gray.600')
  
  // Mock timeline data - will be replaced with real data
  const timelineEvents = [
    {
      id: 1,
      type: 'milestone',
      title: 'Save the Dates Sent',
      description: 'Digital save-the-dates sent to all guests',
      date: new Date('2024-01-15'),
      status: 'completed',
      phase: 'All Phases',
      progress: 100,
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Venue Final Headcount',
      description: 'Submit final guest count to Grand Ballroom',
      date: new Date('2024-05-01'),
      status: 'upcoming',
      phase: 'Reception',
      daysUntil: 12,
      priority: 'high',
    },
    {
      id: 3,
      type: 'milestone',
      title: 'Menu Tasting',
      description: 'Final menu selection with caterer',
      date: new Date('2024-05-15'),
      status: 'upcoming',
      phase: 'Reception',
      daysUntil: 26,
      progress: 75,
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Dress Final Fitting',
      description: 'Final alterations and fitting',
      date: new Date('2024-05-20'),
      status: 'upcoming',
      phase: 'All Phases',
      daysUntil: 31,
      progress: 60,
    },
    {
      id: 5,
      type: 'deadline',
      title: 'RSVP Deadline',
      description: 'Final RSVP responses due',
      date: new Date('2024-05-25'),
      status: 'upcoming',
      phase: 'All Phases',
      daysUntil: 36,
      priority: 'medium',
    },
    {
      id: 6,
      type: 'event',
      title: 'Legal Ceremony',
      description: 'Intimate legal ceremony at City Hall',
      date: new Date('2024-06-10'),
      status: 'upcoming',
      phase: 'Legal Ceremony',
      daysUntil: 52,
      guestCount: 20,
      venue: 'City Hall',
    },
    {
      id: 7,
      type: 'event',
      title: 'Church Wedding',
      description: 'Traditional church ceremony',
      date: new Date('2024-06-15'),
      status: 'upcoming',
      phase: 'Church Wedding',
      daysUntil: 57,
      guestCount: 150,
      venue: "St. Mary's Church",
    },
    {
      id: 8,
      type: 'event',
      title: 'Reception',
      description: 'Wedding reception and celebration',
      date: new Date('2024-06-15'),
      status: 'upcoming',
      phase: 'Reception',
      daysUntil: 57,
      guestCount: 150,
      venue: 'Grand Ballroom',
    },
  ]

  const getStatusColor = (status: string, priority?: string) => {
    if (status === 'completed') return 'green'
    if (status === 'overdue') return 'red'
    if (priority === 'high') return 'red'
    if (priority === 'medium') return 'orange'
    return 'blue'
  }

  const getStatusIcon = (type: string, status: string) => {
    if (status === 'completed') return CheckCircle
    if (status === 'overdue') return AlertTriangle
    if (type === 'event') return Calendar
    if (type === 'deadline') return Clock
    return Calendar
  }

  const sortedEvents = timelineEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <VStack spacing={6} align="stretch">
      {/* Timeline Header */}
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Wedding Timeline</Text>
          <Text fontSize="sm" color="neutral.600">
            Track all important dates and milestones
          </Text>
        </VStack>
        <Button leftIcon={<Edit size={16} />} variant="outline" size="sm">
          Edit Timeline
        </Button>
      </HStack>

      {/* Timeline */}
      <VStack spacing={0} align="stretch" position="relative">
        {/* Timeline Line */}
        <Box
          position="absolute"
          left="20px"
          top="0"
          bottom="0"
          width="2px"
          bg={borderColor}
          zIndex={0}
        />

        {sortedEvents.map((event, index) => {
          const StatusIcon = getStatusIcon(event.type, event.status)
          const statusColor = getStatusColor(event.status, event.priority)
          
          return (
            <Box key={event.id} position="relative" pb={index === sortedEvents.length - 1 ? 0 : 6}>
              {/* Timeline Dot */}
              <Box
                position="absolute"
                left="12px"
                top="20px"
                width="16px"
                height="16px"
                borderRadius="full"
                bg={`${statusColor}.500`}
                border="3px solid"
                borderColor="white"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <StatusIcon size={8} color="white" />
              </Box>

              {/* Event Card */}
              <Card ml="50px" variant="outline">
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="semibold">{event.title}</Text>
                          <Badge colorScheme={statusColor} size="sm" textTransform="capitalize">
                            {event.status}
                          </Badge>
                          {event.priority && (
                            <Badge colorScheme={getStatusColor('', event.priority)} size="sm">
                              {event.priority} priority
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="neutral.600">
                          {event.description}
                        </Text>
                      </VStack>
                      
                      <VStack align="end" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {event.date.toLocaleDateString()}
                        </Text>
                        {event.daysUntil !== undefined && (
                          <Text fontSize="xs" color="neutral.500">
                            {event.daysUntil > 0 ? `in ${event.daysUntil} days` : 'today'}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    {/* Progress Bar (for milestones) */}
                    {event.progress !== undefined && (
                      <VStack spacing={2} align="stretch">
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="neutral.600">Progress</Text>
                          <Text fontSize="xs" color="neutral.600">{event.progress}%</Text>
                        </HStack>
                        <Progress
                          value={event.progress}
                          colorScheme={statusColor}
                          size="sm"
                          borderRadius="full"
                        />
                      </VStack>
                    )}

                    {/* Event Details */}
                    <HStack spacing={6} fontSize="sm" color="neutral.600">
                      <HStack spacing={1}>
                        <Badge colorScheme="brand" size="sm">{event.phase}</Badge>
                      </HStack>
                      
                      {event.venue && (
                        <HStack spacing={1}>
                          <MapPin size={14} />
                          <Text>{event.venue}</Text>
                        </HStack>
                      )}
                      
                      {event.guestCount && (
                        <HStack spacing={1}>
                          <Users size={14} />
                          <Text>{event.guestCount} guests</Text>
                        </HStack>
                      )}
                    </HStack>

                    {/* Actions */}
                    {event.status !== 'completed' && (
                      <HStack spacing={2}>
                        <Button size="xs" variant="outline">
                          View Details
                        </Button>
                        {event.type === 'milestone' && (
                          <Button size="xs" colorScheme="brand">
                            Mark Complete
                          </Button>
                        )}
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          )
        })}
      </VStack>

      {/* Timeline Summary */}
      <Card bg="brand.50" borderColor="brand.200">
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="brand.800">
              Timeline Summary
            </Text>
            <HStack justify="space-between" fontSize="sm">
              <Text color="brand.700">
                {timelineEvents.filter(e => e.status === 'completed').length} completed
              </Text>
              <Text color="brand.700">
                {timelineEvents.filter(e => e.status === 'upcoming').length} upcoming
              </Text>
              <Text color="brand.700">
                {timelineEvents.filter(e => e.priority === 'high').length} high priority
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
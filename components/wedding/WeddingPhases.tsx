'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  SimpleGrid,
  Progress,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

import { WeddingPhase } from '@/types/wedding';

interface WeddingPhasesProps {
  phases: WeddingPhase[]
}

export const WeddingPhases: React.FC<WeddingPhasesProps> = ({ phases }) => {
  // Mock additional phase data
  const phaseDetails = phases.map((phase, index) => ({
    ...phase,
    vendors: {
      total: index === 0 ? 4 : index === 1 ? 8 : 6,
      confirmed: index === 0 ? 3 : index === 1 ? 6 : 4,
    },
    budget: {
      allocated: index === 0 ? 5000 : index === 1 ? 25000 : 20000,
      spent: index === 0 ? 3500 : index === 1 ? 15000 : 8000,
    },
    tasks: {
      completed: index === 0 ? 12 : index === 1 ? 18 : 8,
      total: index === 0 ? 15 : index === 1 ? 25 : 16,
    },
    alerts: index === 1 ? [
      { type: 'warning', message: 'Weather forecast shows possible rain' },
    ] : index === 2 ? [
      { type: 'info', message: 'Venue requires final headcount by May 1st' },
    ] : [],
  }))

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'green'
    if (progress >= 50) return 'yellow'
    return 'red'
  }

  const getProgressStatus = (progress: number) => {
    if (progress >= 80) return 'On Track'
    if (progress >= 50) return 'In Progress'
    return 'Needs Attention'
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Phases Header */}
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Wedding Phases</Text>
          <Text fontSize="sm" color="neutral.600">
            Manage each phase of your wedding celebration
          </Text>
        </VStack>
        <Button leftIcon={<Edit size={16} />} variant="outline" size="sm">
          Edit Phases
        </Button>
      </HStack>

      {/* Phase Cards */}
      <VStack spacing={6} align="stretch">
        {phaseDetails.map((phase, index) => (
          <Card key={phase.id} variant="outline">
            <CardHeader>
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Text fontSize="lg" fontWeight="semibold">{phase.name}</Text>
                    <Badge colorScheme="brand" size="lg">
                      Phase {index + 1}
                    </Badge>
                    <Badge 
                      colorScheme={getProgressColor(phase.progress ?? 0)} 
                      size="lg"
                    >
                      {getProgressStatus(phase.progress ?? 0)}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={6} fontSize="sm" color="neutral.600">
                    <HStack spacing={1}>
                      <Calendar size={14} />
                      <Text>{phase.date.toLocaleDateString()}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <MapPin size={14} />
                      <Text>{phase.venue.name}</Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Users size={14} />
                      <Text>{phase.guestCount ?? 0} guests</Text>
                    </HStack>
                  </HStack>
                </VStack>
                
                <HStack spacing={2}>
                  <Button leftIcon={<Eye size={16} />} variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button leftIcon={<Edit size={16} />} variant="outline" size="sm">
                    Edit
                  </Button>
                </HStack>
              </HStack>
            </CardHeader>
            
            <CardBody pt={0}>
              <VStack spacing={6} align="stretch">
                {/* Progress */}
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">Overall Progress</Text>
                    <Text fontSize="sm" color="neutral.600">
                      {phase.progress ?? 0}% Complete
                    </Text>
                  </HStack>
                  <Progress
                    value={phase.progress ?? 0}
                    colorScheme={getProgressColor(phase.progress ?? 0)}
                    size="md"
                    borderRadius="full"
                  />
                </VStack>

                {/* Alerts */}
                {phase.alerts.length > 0 && (
                  <VStack spacing={2} align="stretch">
                    {phase.alerts.map((alert: { type: string; message: string }, alertIndex: number) => (
                      <HStack key={alertIndex} spacing={2} p={3} bg={`${alert.type === 'warning' ? 'orange' : 'blue'}.50`} borderRadius="md">
                        {alert.type === 'warning' ? (
                          <AlertTriangle size={16} color="var(--chakra-colors-orange-500)" />
                        ) : (
                          <Clock size={16} color="var(--chakra-colors-blue-500)" />
                        )}
                        <Text fontSize="sm" color={`${alert.type === 'warning' ? 'orange' : 'blue'}.800`}>
                          {alert.message}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                )}

                {/* Stats Grid */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                  <Stat>
                    <StatLabel fontSize="xs" color="neutral.600">Vendors</StatLabel>
                    <StatNumber fontSize="lg">
                      {phase.vendors.confirmed}/{phase.vendors.total}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      <CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {phase.vendors.confirmed} confirmed
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel fontSize="xs" color="neutral.600">Budget</StatLabel>
                    <StatNumber fontSize="lg">
                      ${phase.budget.spent.toLocaleString()}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      of ${phase.budget.allocated.toLocaleString()}
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel fontSize="xs" color="neutral.600">Tasks</StatLabel>
                    <StatNumber fontSize="lg">
                      {phase.tasks.completed}/{phase.tasks.total}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      {Math.round((phase.tasks.completed / phase.tasks.total) * 100)}% complete
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel fontSize="xs" color="neutral.600">Days Until</StatLabel>
                    <StatNumber fontSize="lg">
                      {Math.ceil((phase.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      {phase.date.toLocaleDateString()}
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>

                {/* Quick Actions */}
                <Divider />
                <HStack spacing={3} justify="center">
                  <Button size="sm" variant="outline" leftIcon={<Users size={14} />}>
                    Manage Guests
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Users size={14} />}>
                    Manage Vendors
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<DollarSign size={14} />}>
                    View Budget
                  </Button>
                  <Button size="sm" variant="outline" leftIcon={<Calendar size={14} />}>
                    View Timeline
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Phase Summary */}
      <Card bg="accent.50" borderColor="accent.200">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="accent.800">
              Phase Summary
            </Text>
            
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="accent.700">
                  {phases.length}
                </Text>
                <Text fontSize="xs" color="accent.600">Total Phases</Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="accent.700">
                  {Math.round(phases.reduce((sum, phase) => sum + (phase.progress ?? 0), 0) / phases.length)}%
                </Text>
                <Text fontSize="xs" color="accent.600">Avg Progress</Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="accent.700">
                  {phases.reduce((sum, phase) => sum + (phase.guestCount ?? 0), 0)}
                </Text>
                <Text fontSize="xs" color="accent.600">Total Guests</Text>
              </VStack>
              
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="accent.700">
                  {Math.ceil((phases[0]?.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
                <Text fontSize="xs" color="accent.600">Days to First Event</Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
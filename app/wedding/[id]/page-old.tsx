'use client'

import React from 'react'
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
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { WeddingOverview } from '@/components/wedding/WeddingOverview'
import { WeddingTimeline } from '@/components/wedding/WeddingTimeline'
import { WeddingPhases } from '@/components/wedding/WeddingPhases'
import { WeddingBudgetTracker } from '@/components/wedding/WeddingBudgetTracker'
import { createMockUIWedding, UIWedding } from '@/types';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Settings,
  Edit
} from 'lucide-react'

export default function WeddingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const weddingId = params.id as string
  
  // Mock data - will be replaced with real API calls
  const wedding = createMockUIWedding(weddingId)

  const stats = {
    totalVendors: 12,
    confirmedVendors: 8,
    totalGuests: 150,
    rsvpReceived: 89,
    tasksCompleted: 34,
    totalTasks: 56,
    budgetUsed: (wedding.overallBudget.spent / wedding.overallBudget.total) * 100,
  }

  const cardBg = useColorModeValue('white', 'gray.800')

  return (
    <DashboardLayout
      title={`${wedding.coupleNames.join(' & ')}'s Wedding`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Wedding Details' },
      ]}
    >
      <VStack spacing={8} align="stretch">
        {/* Wedding Header */}
        <Card bg={cardBg}>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Info */}
              <HStack justify="space-between" align="start">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Text fontSize="2xl" fontWeight="bold">
                      {wedding.coupleNames.join(' & ')}
                    </Text>
                    <Badge colorScheme="brand" size="lg">
                      {wedding.weddingType === 'multi-phase' ? 'Multi-Phase' : 'Single Event'}
                    </Badge>
                    <Badge 
                      colorScheme={wedding.status === 'planning' ? 'blue' : 'green'} 
                      size="lg"
                      textTransform="capitalize"
                    >
                      {wedding.status}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Calendar size={16} />
                      <Text fontSize="sm" color="neutral.600">
                        {wedding.days_until_wedding} days until wedding
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Users size={16} />
                      <Text fontSize="sm" color="neutral.600">
                        {wedding.phases.length} phases
                      </Text>
                    </HStack>
                    {(wedding.culturalTraditions?.length || 0) > 0 && (
                      <HStack spacing={1}>
                        <Text fontSize="sm" color="neutral.600">
                          Traditions: {wedding.culturalTraditions?.join(', ')}
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                </VStack>
                
                <HStack spacing={2}>
                  <Button leftIcon={<Edit size={16} />} variant="outline" size="sm">
                    Edit Details
                  </Button>
                  <Button leftIcon={<Settings size={16} />} variant="outline" size="sm">
                    Settings
                  </Button>
                </HStack>
              </HStack>

              {/* Overall Progress */}
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="medium">Overall Progress</Text>
                  <Text fontSize="sm" color="neutral.600">
                    {wedding.overall_progress}% Complete
                  </Text>
                </HStack>
                <Progress
                  value={wedding.overall_progress}
                  colorScheme="brand"
                  size="lg"
                  borderRadius="full"
                />
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Key Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          <Card bg={cardBg}>
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

          <Card bg={cardBg}>
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

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Tasks</StatLabel>
                <StatNumber fontSize="2xl">
                  {stats.tasksCompleted}/{stats.totalTasks}
                </StatNumber>
                <StatHelpText>
                  {Math.round((stats.tasksCompleted / stats.totalTasks) * 100)}% complete
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody>
              <Stat>
                <StatLabel color="neutral.600">Budget Used</StatLabel>
                <StatNumber fontSize="2xl">{Math.round(stats.budgetUsed)}%</StatNumber>
                <StatHelpText>
                  ${wedding.overallBudget.spent.toLocaleString()} / ${wedding.overallBudget.total.toLocaleString()}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Phase Progress */}
        <Card bg={cardBg}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">Phase Progress</Text>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {wedding.phases.map((phase, index) => (
                <Box key={phase.id}>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="semibold">{phase.name}</Text>
                          <Badge size="sm" colorScheme="brand">
                            Phase {index + 1}
                          </Badge>
                        </HStack>
                        <HStack spacing={4} fontSize="sm" color="neutral.600">
                          <HStack spacing={1}>
                            <Calendar size={14} />
                            <Text>{(phase.date instanceof Date ? phase.date : new Date(phase.date)).toLocaleDateString()}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Users size={14} />
                            <Text>{phase.guestCount} guests</Text>
                          </HStack>
                          <Text>{phase.venue.name}</Text>
                        </HStack>
                      </VStack>
                      
                      <VStack align="end" spacing={1}>
                        <Text fontSize="sm" color="neutral.600">
                          {phase.progress}% Complete
                        </Text>
                        <Badge 
                          colorScheme={
                            phase.progress >= 80 ? 'green' :
                            phase.progress >= 50 ? 'yellow' : 'red'
                          }
                          size="sm"
                        >
                          {phase.progress >= 80 ? 'On Track' :
                           phase.progress >= 50 ? 'In Progress' : 'Needs Attention'}
                        </Badge>
                      </VStack>
                    </HStack>
                    
                    <Progress
                      value={phase.progress}
                      colorScheme={
                        phase.progress >= 80 ? 'green' :
                        phase.progress >= 50 ? 'yellow' : 'red'
                      }
                      size="sm"
                      borderRadius="full"
                    />
                  </VStack>
                  
                  {index < wedding.phases.length - 1 && <Divider mt={4} />}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Button
            h="auto"
            py={4}
            colorScheme="brand"
            variant="outline"
            onClick={() => router.push(`/wedding/${weddingId}/mood-boards`)}
          >
            <VStack spacing={2}>
              <Text fontSize="lg">🎨</Text>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">Mood Boards</Text>
                <Text fontSize="xs" color="neutral.500">Visual inspiration</Text>
              </VStack>
            </VStack>
          </Button>
          
          <Button
            h="auto"
            py={4}
            variant="outline"
          >
            <VStack spacing={2}>
              <Text fontSize="lg">👥</Text>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">Vendors</Text>
                <Text fontSize="xs" color="neutral.500">Manage vendors</Text>
              </VStack>
            </VStack>
          </Button>
          
          <Button
            h="auto"
            py={4}
            variant="outline"
          >
            <VStack spacing={2}>
              <Text fontSize="lg">🎉</Text>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">Guests</Text>
                <Text fontSize="xs" color="neutral.500">Guest management</Text>
              </VStack>
            </VStack>
          </Button>
          
          <Button
            h="auto"
            py={4}
            variant="outline"
          >
            <VStack spacing={2}>
              <Text fontSize="lg">📅</Text>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">Timeline</Text>
                <Text fontSize="xs" color="neutral.500">Schedule & tasks</Text>
              </VStack>
            </VStack>
          </Button>
        </SimpleGrid>

        {/* Detailed Tabs */}
        <Card bg={cardBg}>
          <CardBody p={0}>
            <Tabs variant="enclosed" colorScheme="brand">
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Timeline</Tab>
                <Tab>Phases</Tab>
                <Tab>Budget</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <WeddingOverview wedding={wedding as any} />
                </TabPanel>
                
                <TabPanel>
                  <WeddingTimeline wedding={wedding as any} />
                </TabPanel>
                
                <TabPanel>
                  <WeddingPhases phases={wedding.phases as any} />
                </TabPanel>
                
                <TabPanel>
                  <WeddingBudgetTracker budget={wedding.overallBudget} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </DashboardLayout>
  )
}
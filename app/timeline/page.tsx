'use client'

import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Flag,
  Target,
  Zap
} from 'lucide-react'
import { useState } from 'react'

// Mock data - will be replaced with real API calls
const mockTimeline = {
  milestones: [
    {
      id: '1',
      name: 'Venue Booking Confirmed',
      date: new Date('2024-02-01'),
      description: 'Final venue contract signed and deposit paid',
      responsible: ['venue-manager'],
      status: 'completed' as const,
      dependencies: [],
      phaseId: 'ceremony'
    },
    {
      id: '2',
      name: 'Catering Menu Finalized',
      date: new Date('2024-03-15'),
      description: 'Menu selection and dietary requirements confirmed',
      responsible: ['caterer'],
      status: 'in-progress' as const,
      dependencies: ['1'],
      phaseId: 'reception'
    },
    {
      id: '3',
      name: 'Photography Contract Signed',
      date: new Date('2024-02-10'),
      description: 'Wedding photography package confirmed',
      responsible: ['photographer'],
      status: 'completed' as const,
      dependencies: [],
      phaseId: 'ceremony'
    },
    {
      id: '4',
      name: 'Guest List Finalized',
      date: new Date('2024-04-01'),
      description: 'Final guest count and RSVP deadline',
      responsible: ['couple'],
      status: 'pending' as const,
      dependencies: ['2'],
      phaseId: null
    }
  ],
  deadlines: [
    {
      id: '1',
      title: 'Final Guest Count',
      description: 'Provide final headcount to caterer',
      dueDate: new Date('2024-05-01'),
      priority: 'critical' as const,
      status: 'pending' as const,
      assignedTo: ['couple'],
      phaseId: 'reception'
    },
    {
      id: '2',
      title: 'Seating Chart Completion',
      description: 'Complete table assignments for all guests',
      dueDate: new Date('2024-05-15'),
      priority: 'high' as const,
      status: 'pending' as const,
      assignedTo: ['couple'],
      phaseId: 'reception'
    },
    {
      id: '3',
      title: 'Music Playlist Submission',
      description: 'Submit must-play and do-not-play lists to DJ',
      dueDate: new Date('2024-05-20'),
      priority: 'medium' as const,
      status: 'pending' as const,
      assignedTo: ['couple'],
      phaseId: 'reception'
    }
  ],
  contingencyPlans: [
    {
      id: '1',
      triggerCondition: 'Rain on wedding day',
      description: 'Move ceremony indoors to backup location',
      actions: [
        {
          id: '1',
          description: 'Contact venue to confirm indoor setup',
          responsible: 'venue-manager',
          estimatedDuration: 2,
          cost: 0,
          status: 'pending' as const
        },
        {
          id: '2',
          description: 'Notify all vendors of location change',
          responsible: 'wedding-coordinator',
          estimatedDuration: 1,
          cost: 50,
          status: 'completed' as const
        }
      ],
      priority: 'high' as const,
      status: 'active' as const
    }
  ]
}

const statusColors: Record<string, string> = {
  pending: 'orange',
  'in-progress': 'blue',
  completed: 'green',
  overdue: 'red'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusIcons: Record<string, any> = {
  pending: Clock,
  'in-progress': Zap,
  completed: CheckCircle,
  overdue: AlertTriangle
}

const priorityColors: Record<string, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const priorityIcons: Record<string, any> = {
  low: Flag,
  medium: Flag,
  high: Flag,
  critical: AlertTriangle
}

export default function TimelinePage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('all')
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const [addType, setAddType] = useState<'milestone' | 'deadline' | 'contingency'>('milestone')

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.200', 'gray.700')

  // Filter items based on selected phase
  const filteredMilestones = selectedPhase === 'all' 
    ? mockTimeline.milestones 
    : mockTimeline.milestones.filter(m => m.phaseId === selectedPhase)

  const filteredDeadlines = selectedPhase === 'all'
    ? mockTimeline.deadlines
    : mockTimeline.deadlines.filter(d => d.phaseId === selectedPhase)

  // Calculate stats
  const stats = {
    totalMilestones: mockTimeline.milestones.length,
    completedMilestones: mockTimeline.milestones.filter(m => m.status === 'completed').length,
    upcomingDeadlines: mockTimeline.deadlines.filter(d => d.status === 'pending' && d.dueDate > new Date()).length,
    overdueDeadlines: mockTimeline.deadlines.filter(d => d.status === 'pending' && d.dueDate <= new Date()).length,
    activePlans: mockTimeline.contingencyPlans.filter(p => p.status === 'active').length
  }

  const completionPercentage = (stats.completedMilestones / stats.totalMilestones) * 100

  return (
    <DashboardLayout 
      title="Wedding Timeline"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Timeline' }
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header Actions */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              maxW="200px"
            >
              <option value="all">All Phases</option>
              <option value="ceremony">Ceremony</option>
              <option value="reception">Reception</option>
              <option value="pre-wedding">Pre-Wedding</option>
            </Select>
          </HStack>
          
          <Button leftIcon={<Plus size={16} />} colorScheme="brand" onClick={onAddOpen}>
            Add Item
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4}>
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Progress</Text>
                <Text fontSize="2xl" fontWeight="bold">{Math.round(completionPercentage)}%</Text>
                <Progress value={completionPercentage} colorScheme="brand" size="sm" w="full" />
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Milestones</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {stats.completedMilestones}/{stats.totalMilestones}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Upcoming</Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {stats.upcomingDeadlines}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Overdue</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {stats.overdueDeadlines}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Contingencies</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {stats.activePlans}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Timeline Content */}
        <Card>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Milestones</Tab>
                <Tab>Deadlines</Tab>
                <Tab>Contingency Plans</Tab>
                <Tab>Calendar View</Tab>
              </TabList>

              <TabPanels>
                {/* Milestones */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {filteredMilestones
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((milestone, index) => {
                        const StatusIcon = statusIcons[milestone.status]
                        const isLast = index === filteredMilestones.length - 1
                        
                        return (
                          <Box key={milestone.id} position="relative">
                            <HStack align="start" spacing={4}>
                              {/* Timeline Line */}
                              <Box position="relative">
                                <Box
                                  w="12px"
                                  h="12px"
                                  borderRadius="full"
                                  bg={`${statusColors[milestone.status]}.500`}
                                  border="3px solid"
                                  borderColor={cardBg}
                                  boxShadow={`0 0 0 2px var(--chakra-colors-${statusColors[milestone.status]}-500)`}
                                />
                                {!isLast && (
                                  <Box
                                    position="absolute"
                                    left="50%"
                                    top="12px"
                                    w="2px"
                                    h="60px"
                                    bg={borderColor}
                                    transform="translateX(-50%)"
                                  />
                                )}
                              </Box>

                              {/* Content */}
                              <Card flex={1} variant="outline">
                                <CardBody>
                                  <HStack justify="space-between" align="start" mb={3}>
                                    <VStack align="start" spacing={2}>
                                      <HStack>
                                        <Text fontSize="lg" fontWeight="semibold">
                                          {milestone.name}
                                        </Text>
                                        <Badge
                                          colorScheme={statusColors[milestone.status]}
                                          variant="subtle"
                                          display="flex"
                                          alignItems="center"
                                          gap={1}
                                        >
                                          <StatusIcon size={12} />
                                          {milestone.status.replace('-', ' ')}
                                        </Badge>
                                        {milestone.phaseId && (
                                          <Badge variant="outline" size="sm">
                                            {milestone.phaseId}
                                          </Badge>
                                        )}
                                      </HStack>
                                      <Text fontSize="sm" color="neutral.600">
                                        {milestone.description}
                                      </Text>
                                    </VStack>

                                    <Menu>
                                      <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                                      <MenuList>
                                        <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                                        <MenuItem icon={<Trash2 size={16} />} color="red.500">Delete</MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </HStack>

                                  <HStack justify="space-between" align="center">
                                    <HStack spacing={4} fontSize="sm" color="neutral.600">
                                      <HStack>
                                        <Calendar size={14} />
                                        <Text>{milestone.date.toLocaleDateString()}</Text>
                                      </HStack>
                                      <HStack>
                                        <Users size={14} />
                                        <Text>{milestone.responsible.join(', ')}</Text>
                                      </HStack>
                                    </HStack>

                                    {milestone.status === 'pending' && (
                                      <Button size="sm" colorScheme="brand">
                                        Mark Complete
                                      </Button>
                                    )}
                                  </HStack>
                                </CardBody>
                              </Card>
                            </HStack>
                          </Box>
                        )
                      })}
                  </VStack>
                </TabPanel>

                {/* Deadlines */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {filteredDeadlines
                      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                      .map(deadline => {
                        const PriorityIcon = priorityIcons[deadline.priority]
                        const isOverdue = deadline.dueDate <= new Date() && deadline.status === 'pending'
                        const daysUntil = Math.ceil((deadline.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                        
                        return (
                          <Card key={deadline.id} variant="outline" borderColor={isOverdue ? 'red.200' : undefined}>
                            <CardBody>
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={3} flex={1}>
                                  <HStack>
                                    <Text fontSize="lg" fontWeight="semibold">
                                      {deadline.title}
                                    </Text>
                                    <Badge
                                      colorScheme={priorityColors[deadline.priority]}
                                      variant="subtle"
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <PriorityIcon size={12} />
                                      {deadline.priority}
                                    </Badge>
                                    {deadline.phaseId && (
                                      <Badge variant="outline" size="sm">
                                        {deadline.phaseId}
                                      </Badge>
                                    )}
                                    {isOverdue && (
                                      <Badge colorScheme="red" variant="solid" size="sm">
                                        OVERDUE
                                      </Badge>
                                    )}
                                  </HStack>
                                  
                                  <Text fontSize="sm" color="neutral.600">
                                    {deadline.description}
                                  </Text>
                                  
                                  <HStack spacing={4} fontSize="sm" color="neutral.600">
                                    <HStack>
                                      <Calendar size={14} />
                                      <Text>{deadline.dueDate.toLocaleDateString()}</Text>
                                      {!isOverdue && daysUntil >= 0 && (
                                        <Text color={daysUntil <= 7 ? 'orange.500' : 'neutral.600'}>
                                          ({daysUntil} days)
                                        </Text>
                                      )}
                                    </HStack>
                                    <HStack>
                                      <Users size={14} />
                                      <Text>{deadline.assignedTo.join(', ')}</Text>
                                    </HStack>
                                  </HStack>
                                </VStack>

                                <VStack spacing={2}>
                                  <Menu>
                                    <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                                    <MenuList>
                                      <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                                      <MenuItem icon={<Trash2 size={16} />} color="red.500">Delete</MenuItem>
                                    </MenuList>
                                  </Menu>
                                  
                                  {deadline.status === 'pending' && (
                                    <Button size="sm" colorScheme="brand">
                                      Complete
                                    </Button>
                                  )}
                                </VStack>
                              </HStack>
                            </CardBody>
                          </Card>
                        )
                      })}
                  </VStack>
                </TabPanel>

                {/* Contingency Plans */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {mockTimeline.contingencyPlans.map(plan => (
                      <Card key={plan.id} variant="outline">
                        <CardHeader>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <Text fontSize="lg" fontWeight="semibold">
                                  {plan.triggerCondition}
                                </Text>
                                <Badge
                                  colorScheme={priorityColors[plan.priority]}
                                  variant="subtle"
                                >
                                  {plan.priority} priority
                                </Badge>
                                <Badge
                                  colorScheme={plan.status === 'active' ? 'green' : 'gray'}
                                  variant="outline"
                                >
                                  {plan.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="neutral.600">
                                {plan.description}
                              </Text>
                            </VStack>

                            <Menu>
                              <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                              <MenuList>
                                <MenuItem icon={<Edit size={16} />}>Edit Plan</MenuItem>
                                <MenuItem icon={<Target size={16} />}>Trigger Plan</MenuItem>
                                <MenuItem icon={<Trash2 size={16} />} color="red.500">Delete</MenuItem>
                              </MenuList>
                            </Menu>
                          </HStack>
                        </CardHeader>
                        
                        <CardBody pt={0}>
                          <VStack align="stretch" spacing={3}>
                            <Text fontSize="md" fontWeight="medium">Action Items:</Text>
                            {plan.actions.map(action => (
                              <HStack key={action.id} justify="space-between" align="start" p={3} bg="neutral.50" borderRadius="md">
                                <VStack align="start" spacing={1} flex={1}>
                                  <Text fontSize="sm" fontWeight="medium">{action.description}</Text>
                                  <HStack fontSize="xs" color="neutral.600">
                                    <Text>Assigned to: {action.responsible}</Text>
                                    <Text>•</Text>
                                    <Text>Est. {action.estimatedDuration}h</Text>
                                    {action.cost && (
                                      <>
                                        <Text>•</Text>
                                        <Text>${action.cost}</Text>
                                      </>
                                    )}
                                  </HStack>
                                </VStack>
                                <Badge
                                  colorScheme={action.status === 'completed' ? 'green' : 'orange'}
                                  size="sm"
                                >
                                  {action.status}
                                </Badge>
                              </HStack>
                            ))}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Calendar View */}
                <TabPanel px={0}>
                  <VStack spacing={4} py={8}>
                    <Text fontSize="lg" color="neutral.600">Calendar View</Text>
                    <Text fontSize="sm" color="neutral.500">
                      Interactive calendar view coming soon. This will show all milestones, deadlines, and events in a visual calendar format.
                    </Text>
                    <Button colorScheme="brand" variant="outline">
                      View in External Calendar
                    </Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Add Item Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New {addType.charAt(0).toUpperCase() + addType.slice(1)}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select value={addType} onChange={(e) => setAddType(e.target.value as 'milestone' | 'deadline' | 'contingency')}>
                    <option value="milestone">Milestone</option>
                    <option value="deadline">Deadline</option>
                    <option value="contingency">Contingency Plan</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input placeholder="Enter title..." />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Enter description..." />
                </FormControl>

                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input type="date" />
                </FormControl>

                <FormControl>
                  <FormLabel>Phase</FormLabel>
                  <Select placeholder="Select phase...">
                    <option value="ceremony">Ceremony</option>
                    <option value="reception">Reception</option>
                    <option value="pre-wedding">Pre-Wedding</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} pt={4}>
                  <Button colorScheme="brand" flex={1}>
                    Create {addType.charAt(0).toUpperCase() + addType.slice(1)}
                  </Button>
                  <Button variant="outline" onClick={onAddClose}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </DashboardLayout>
  )
}
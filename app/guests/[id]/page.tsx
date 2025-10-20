'use client'

import {
  Box,
  Grid,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Link as ChakraLink,
  useToast,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal'
import { SendMessageModal } from '@/components/common/SendMessageModal'
import { EditGuestModal } from '@/components/guests/EditGuestModal'
import { AttendanceStatusUpdateModal } from '@/components/guests/AttendanceStatusUpdateModal'
import { deleteGuest } from '@/lib/wedding-data-service'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Phone,
  Mail,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  Edit,
  X,
  MapPin,
  Car,
  MoreVertical,
  Trash2
} from 'lucide-react'



// Mock data - will be replaced with real API calls
const mockGuestDetails = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  rsvpStatus: 'attending' as const,
  dietaryRestrictions: ['Vegetarian', 'No nuts'],
  accommodationNeeds: [],
  plusOne: {
    id: 'plus-1',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: [],
    accommodationNeeds: [],
    phaseAttendance: [
      { phaseId: 'ceremony', status: 'attending', specialRequests: [] },
      { phaseId: 'reception', status: 'attending', specialRequests: [] }
    ]
  },
  tableAssignment: 'Table 5',
  phaseAttendance: [
    {
      phaseId: 'ceremony',
      status: 'attending',
      specialRequests: [],
      transportationNeeds: {
        required: false,
        type: null,
        location: null,
        time: null
      }
    },
    {
      phaseId: 'reception',
      status: 'attending',
      specialRequests: ['Vegetarian meal'],
      transportationNeeds: {
        required: true,
        type: 'shuttle',
        location: 'Hotel Grand Plaza',
        time: new Date('2024-06-15T17:00:00')
      }
    }
  ],
  communicationHistory: [
    {
      id: '1',
      timestamp: new Date('2024-01-20'),
      type: 'email' as const,
      direction: 'outbound' as const,
      subject: 'Wedding Invitation',
      content: 'We are delighted to invite you to our wedding celebration!',
      status: 'delivered' as const
    },
    {
      id: '2',
      timestamp: new Date('2024-01-25'),
      type: 'email' as const,
      direction: 'inbound' as const,
      subject: 'RSVP Confirmation',
      content: 'Thank you for the invitation! Mike and I are excited to attend.',
      status: 'read' as const
    }
  ],
  relationship: 'Friend',
  side: 'bride' as const,
  inviteGroup: 'College Friends',
  rsvpDate: new Date('2024-01-25'),
  notes: 'Close friend from college. Vegetarian. Will need transportation from hotel.'
}

const rsvpStatusColors: Record<string, string> = {
  pending: 'orange',
  attending: 'green',
  declined: 'red'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rsvpStatusIcons: Record<string, any> = {
  pending: Clock,
  attending: CheckCircle,
  declined: X
}

const phaseStatusColors: Record<string, string> = {
  attending: 'green',
  'not-attending': 'red',
  maybe: 'orange',
  pending: 'gray'
}

export default function GuestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isMessageOpen, onOpen: onMessageOpen, onClose: onMessageClose } = useDisclosure()
  const { isOpen: isStatusOpen, onOpen: onStatusOpen, onClose: onStatusClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<any>(null)
  
  // In a real app, fetch guest data based on useParams().id
  const guest = mockGuestDetails
  const StatusIcon = rsvpStatusIcons[guest.rsvpStatus]

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteGuest(params.id as string)
      
      toast({
        title: 'Guest Deleted',
        description: `${guest.name} has been removed from the wedding`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Navigate back to guests list
      router.push('/guests')
    } catch (error) {
      console.error('Error deleting guest:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete guest. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      onDeleteClose()
    }
  }

  // Handler for add plus one
  const handleAddPlusOne = () => {
    toast({
      title: 'Add Plus One',
      description: 'Plus one management feature will be implemented with backend integration',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleEditGuest = async (updatedGuest: any) => {
    // TODO: Implement actual guest update API call
    console.log('Updating guest:', updatedGuest)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Guest Updated',
      description: `${updatedGuest.name} has been updated successfully`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleSendMessage = async (messageData: any) => {
    // TODO: Implement actual message sending API call
    console.log('Sending message:', messageData)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Message Sent',
      description: `${messageData.type === 'email' ? 'Email' : 'SMS'} sent to ${messageData.recipientName}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleUpdatePhaseStatus = (phaseId: string, currentStatus: string) => {
    const phase = guest.phaseAttendance.find(p => p.phaseId === phaseId)
    if (phase) {
      setSelectedPhase(phase)
      onStatusOpen()
    }
  }

  const handleStatusUpdate = async (newStatus: string, notes?: string) => {
    // TODO: Implement actual status update API call
    console.log('Updating phase status:', { 
      phaseId: selectedPhase.phaseId, 
      newStatus, 
      notes 
    })
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  }



  return (
    <DashboardLayout
      title={guest.name}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Guests', href: '/guests' },
        { label: guest.name }
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card>
          <CardBody>
            <HStack justify="space-between" align="start" wrap="wrap" gap={4}>
              <VStack align="start" spacing={3}>
                <HStack spacing={3}>
                  <Avatar
                    name={guest.name}
                    size="lg"
                    bg="brand.500"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">{guest.name}</Text>
                    <Text color="neutral.600">{guest.relationship} • {guest.side}</Text>
                    <Badge
                      colorScheme={rsvpStatusColors[guest.rsvpStatus]}
                      variant="subtle"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <StatusIcon size={12} />
                      {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
                    </Badge>
                  </VStack>
                </HStack>

                {/* Contact Info */}
                <VStack align="start" spacing={2} fontSize="sm">
                  <HStack>
                    <Mail size={16} />
                    <ChakraLink href={`mailto:${guest.email}`} color="brand.600">
                      {guest.email}
                    </ChakraLink>
                  </HStack>
                  <HStack>
                    <Phone size={16} />
                    <ChakraLink href={`tel:${guest.phone}`} color="brand.600">
                      {guest.phone}
                    </ChakraLink>
                  </HStack>
                  {guest.inviteGroup && (
                    <HStack>
                      <Users size={16} />
                      <Text>Group: {guest.inviteGroup}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              <VStack spacing={3}>
                <Button leftIcon={<Edit size={16} />} variant="outline" onClick={onEditOpen}>
                  Edit Guest
                </Button>
                <Button leftIcon={<MessageSquare size={16} />} colorScheme="brand" onClick={onMessageOpen}>
                  Send Message
                </Button>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<MoreVertical size={16} />}
                    variant="outline"
                    aria-label="More options"
                  />
                  <MenuList>
                    <MenuItem 
                      icon={<Trash2 size={16} />} 
                      onClick={onDeleteOpen}
                      color="red.600"
                    >
                      Delete Guest
                    </MenuItem>
                  </MenuList>
                </Menu>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Quick Stats */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">RSVP Date</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {guest.rsvpDate ? guest.rsvpDate.toLocaleDateString() : 'Not responded'}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Table Assignment</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {guest.tableAssignment || 'Not assigned'}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Plus One</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {guest.plusOne ? guest.plusOne.name : 'None'}
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Special Needs</Text>
                <Text fontSize="lg" fontWeight="bold">
                  {guest.dietaryRestrictions.length + guest.accommodationNeeds.length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Card>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Phase Attendance</Tab>
                <Tab>Special Requirements</Tab>
                <Tab>Communications</Tab>
                <Tab>Plus One Details</Tab>
              </TabList>

              <TabPanels>
                {/* Phase Attendance */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {guest.phaseAttendance.map(attendance => (
                      <Card key={attendance.phaseId} variant="outline">
                        <CardBody>
                          <VStack align="stretch" spacing={4}>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={2}>
                                <HStack>
                                  <Text fontSize="lg" fontWeight="semibold" textTransform="capitalize">
                                    {attendance.phaseId}
                                  </Text>
                                  <Badge colorScheme={phaseStatusColors[attendance.status]} size="sm">
                                    {attendance.status.replace('-', ' ')}
                                  </Badge>
                                </HStack>

                                {attendance.specialRequests.length > 0 && (
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="medium">Special Requests:</Text>
                                    {attendance.specialRequests.map((request, index) => (
                                      <Badge key={index} colorScheme="blue" variant="outline" size="sm">
                                        {request}
                                      </Badge>
                                    ))}
                                  </VStack>
                                )}
                              </VStack>

                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleUpdatePhaseStatus(attendance.phaseId, attendance.status)}
                              >
                                Update Status
                              </Button>
                            </HStack>

                            {attendance.transportationNeeds?.required && (
                              <Box>
                                <Divider mb={3} />
                                <VStack align="start" spacing={2}>
                                  <HStack>
                                    <Car size={16} />
                                    <Text fontSize="sm" fontWeight="medium">Transportation Required</Text>
                                  </HStack>
                                  <HStack spacing={4} fontSize="sm" color="neutral.600">
                                    <HStack>
                                      <Text fontWeight="medium">Type:</Text>
                                      <Text textTransform="capitalize">{attendance.transportationNeeds.type}</Text>
                                    </HStack>
                                    {attendance.transportationNeeds.location && (
                                      <HStack>
                                        <MapPin size={14} />
                                        <Text>{attendance.transportationNeeds.location}</Text>
                                      </HStack>
                                    )}
                                    {attendance.transportationNeeds.time && (
                                      <HStack>
                                        <Calendar size={14} />
                                        <Text>{attendance.transportationNeeds.time.toLocaleString()}</Text>
                                      </HStack>
                                    )}
                                  </HStack>
                                </VStack>
                              </Box>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Special Requirements */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Dietary Restrictions</Text>
                      {guest.dietaryRestrictions.length > 0 ? (
                        <HStack spacing={2} wrap="wrap">
                          {guest.dietaryRestrictions.map(restriction => (
                            <Badge key={restriction} colorScheme="blue" variant="outline">
                              {restriction}
                            </Badge>
                          ))}
                        </HStack>
                      ) : (
                        <Text color="neutral.500">No dietary restrictions</Text>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Accommodation Needs</Text>
                      {guest.accommodationNeeds.length > 0 ? (
                        <HStack spacing={2} wrap="wrap">
                          {guest.accommodationNeeds.map(need => (
                            <Badge key={need} colorScheme="purple" variant="outline">
                              {need}
                            </Badge>
                          ))}
                        </HStack>
                      ) : (
                        <Text color="neutral.500">No special accommodation needs</Text>
                      )}
                    </Box>

                    <Divider />

                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Notes</Text>
                      {guest.notes ? (
                        <Text>{guest.notes}</Text>
                      ) : (
                        <Text color="neutral.500">No notes</Text>
                      )}
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Communications */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {guest.communicationHistory.map(comm => (
                      <Card key={comm.id} variant="outline">
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between">
                              <HStack spacing={3}>
                                <Badge colorScheme={comm.direction === 'inbound' ? 'blue' : 'green'}>
                                  {comm.direction}
                                </Badge>
                                <Badge variant="outline">{comm.type}</Badge>
                                <Text fontSize="sm" color="neutral.600">
                                  {comm.timestamp.toLocaleDateString()} at {comm.timestamp.toLocaleTimeString()}
                                </Text>
                              </HStack>
                              <Badge colorScheme="green" size="sm">{comm.status}</Badge>
                            </HStack>
                            {comm.subject && (
                              <Text fontWeight="medium">{comm.subject}</Text>
                            )}
                            <Text fontSize="sm">{comm.content}</Text>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Plus One Details */}
                <TabPanel px={0}>
                  {guest.plusOne ? (
                    <Card variant="outline">
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <HStack spacing={3}>
                            <Avatar
                              name={guest.plusOne.name}
                              size="md"
                              bg="brand.500"
                            />
                            <VStack align="start" spacing={1}>
                              <Text fontSize="lg" fontWeight="semibold">{guest.plusOne.name}</Text>
                              {guest.plusOne.email && (
                                <Text fontSize="sm" color="neutral.600">{guest.plusOne.email}</Text>
                              )}
                              <Badge
                                colorScheme={rsvpStatusColors[guest.plusOne.rsvpStatus]}
                                variant="subtle"
                                display="flex"
                                alignItems="center"
                                gap={1}
                                size="sm"
                              >
                                <StatusIcon size={10} />
                                {guest.plusOne.rsvpStatus.charAt(0).toUpperCase() + guest.plusOne.rsvpStatus.slice(1)}
                              </Badge>
                            </VStack>
                          </HStack>

                          <Divider />

                          <Box>
                            <Text fontSize="md" fontWeight="medium" mb={3}>Phase Attendance</Text>
                            <VStack align="stretch" spacing={2}>
                              {guest.plusOne.phaseAttendance.map(attendance => (
                                <HStack key={attendance.phaseId} justify="space-between">
                                  <Text fontSize="sm" textTransform="capitalize">{attendance.phaseId}</Text>
                                  <Badge colorScheme={phaseStatusColors[attendance.status]} size="sm">
                                    {attendance.status.replace('-', ' ')}
                                  </Badge>
                                </HStack>
                              ))}
                            </VStack>
                          </Box>

                          {guest.plusOne.dietaryRestrictions.length > 0 && (
                            <Box>
                              <Text fontSize="md" fontWeight="medium" mb={3}>Dietary Restrictions</Text>
                              <HStack spacing={2} wrap="wrap">
                                {guest.plusOne.dietaryRestrictions.map(restriction => (
                                  <Badge key={restriction} colorScheme="blue" variant="outline" size="sm">
                                    {restriction}
                                  </Badge>
                                ))}
                              </HStack>
                            </Box>
                          )}

                          {guest.plusOne.accommodationNeeds.length > 0 && (
                            <Box>
                              <Text fontSize="md" fontWeight="medium" mb={3}>Accommodation Needs</Text>
                              <HStack spacing={2} wrap="wrap">
                                {guest.plusOne.accommodationNeeds.map(need => (
                                  <Badge key={need} colorScheme="purple" variant="outline" size="sm">
                                    {need}
                                  </Badge>
                                ))}
                              </HStack>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : (
                    <VStack spacing={4} py={8}>
                      <Text fontSize="lg" color="neutral.600">No Plus One</Text>
                      <Text fontSize="sm" color="neutral.500">
                        This guest is not bringing a plus one to the wedding.
                      </Text>
                      <Button leftIcon={<Users size={16} />} variant="outline" onClick={handleAddPlusOne}>
                        Add Plus One
                      </Button>
                    </VStack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
      
      {/* Edit Guest Modal */}
      <EditGuestModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        guest={guest}
        onSave={handleEditGuest}
      />

      {/* Send Message Modal */}
      <SendMessageModal
        isOpen={isMessageOpen}
        onClose={onMessageClose}
        recipientName={guest.name}
        recipientEmail={guest.email}
        recipientPhone={guest.phone}
        onSend={handleSendMessage}
      />

      {/* Attendance Status Update Modal */}
      {selectedPhase && (
        <AttendanceStatusUpdateModal
          isOpen={isStatusOpen}
          onClose={onStatusClose}
          guestName={guest.name}
          phaseName={selectedPhase.phaseId}
          currentStatus={selectedPhase.status}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Guest"
        itemName={guest.name}
        itemType="Guest"
        warningMessage="This will permanently remove this guest from your wedding, including their RSVP status, meal preferences, and all communication history."
      />
    </DashboardLayout>
  )
}
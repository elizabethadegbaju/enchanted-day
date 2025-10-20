'use client'

import {
  Grid,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Flex,
  Avatar,
  Divider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Search, 
  Plus,
  Phone,
  Mail,
  Users,
  CheckCircle,
  Clock,
  X,
  Download,
  Upload
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

// Mock data - will be replaced with real API calls
const mockGuests = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: ['Vegetarian'],
    accommodationNeeds: [],
    plusOne: { name: 'Mike Johnson', rsvpStatus: 'attending' },
    phaseAttendance: [
      { phaseId: 'ceremony', status: 'attending', specialRequests: [] },
      { phaseId: 'reception', status: 'attending', specialRequests: ['Vegetarian meal'] }
    ],
    relationship: 'Friend',
    side: 'bride'
  },
  {
    id: '2',
    name: 'Robert Smith',
    email: 'robert.smith@email.com',
    phone: '+1 (555) 987-6543',
    rsvpStatus: 'pending' as const,
    dietaryRestrictions: [],
    accommodationNeeds: ['Wheelchair accessible'],
    plusOne: null,
    phaseAttendance: [
      { phaseId: 'ceremony', status: 'pending', specialRequests: [] },
      { phaseId: 'reception', status: 'pending', specialRequests: [] }
    ],
    relationship: 'Uncle',
    side: 'groom'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 456-7890',
    rsvpStatus: 'declined' as const,
    dietaryRestrictions: [],
    accommodationNeeds: [],
    plusOne: null,
    phaseAttendance: [
      { phaseId: 'ceremony', status: 'not-attending', specialRequests: [] },
      { phaseId: 'reception', status: 'not-attending', specialRequests: [] }
    ],
    relationship: 'Colleague',
    side: 'bride'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1 (555) 321-0987',
    rsvpStatus: 'attending' as const,
    dietaryRestrictions: ['Gluten-free', 'Dairy-free'],
    accommodationNeeds: [],
    plusOne: { name: 'Lisa Wilson', rsvpStatus: 'attending' },
    phaseAttendance: [
      { phaseId: 'ceremony', status: 'attending', specialRequests: [] },
      { phaseId: 'reception', status: 'attending', specialRequests: ['Gluten-free meal'] }
    ],
    relationship: 'Cousin',
    side: 'groom'
  }
]

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

export default function GuestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [rsvpFilter, setRsvpFilter] = useState('')
  const [sideFilter, setSideFilter] = useState('')
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure()

  const filteredGuests = mockGuests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.relationship.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRsvp = !rsvpFilter || guest.rsvpStatus === rsvpFilter
    const matchesSide = !sideFilter || guest.side === sideFilter
    
    return matchesSearch && matchesRsvp && matchesSide
  })

  const rsvpStatuses = [...new Set(mockGuests.map(g => g.rsvpStatus))]
  const sides = [...new Set(mockGuests.map(g => g.side))]

  const stats = {
    total: mockGuests.length,
    attending: mockGuests.filter(g => g.rsvpStatus === 'attending').length,
    pending: mockGuests.filter(g => g.rsvpStatus === 'pending').length,
    declined: mockGuests.filter(g => g.rsvpStatus === 'declined').length,
    plusOnes: mockGuests.filter(g => g.plusOne).length,
    specialNeeds: mockGuests.filter(g => g.dietaryRestrictions.length > 0 || g.accommodationNeeds.length > 0).length
  }

  const responseRate = ((stats.attending + stats.declined) / stats.total) * 100

  const handleSelectGuest = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId) 
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    )
  }

  const handleSelectAll = () => {
    if (selectedGuests.length === filteredGuests.length) {
      setSelectedGuests([])
    } else {
      setSelectedGuests(filteredGuests.map(g => g.id))
    }
  }

  return (
    <DashboardLayout 
      title="Guest Management"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Guests' }
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header Actions */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <HStack spacing={4} flex={1}>
            <InputGroup maxW="300px">
              <InputLeftElement>
                <Search size={16} />
              </InputLeftElement>
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select
              placeholder="All RSVP Status"
              maxW="150px"
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
            >
              {rsvpStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Select>
            
            <Select
              placeholder="All Sides"
              maxW="120px"
              value={sideFilter}
              onChange={(e) => setSideFilter(e.target.value)}
            >
              {sides.map(side => (
                <option key={side} value={side}>
                  {side.charAt(0).toUpperCase() + side.slice(1)}
                </option>
              ))}
            </Select>
          </HStack>
          
          <HStack spacing={2}>
            <Button leftIcon={<Upload size={16} />} variant="outline" onClick={onImportOpen}>
              Import
            </Button>
            <Button leftIcon={<Download size={16} />} variant="outline">
              Export
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="brand">
              Add Guest
            </Button>
          </HStack>
        </Flex>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={4}>
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Total Guests</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.total}</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Attending</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {stats.attending}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Pending</Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {stats.pending}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Declined</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {stats.declined}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Plus Ones</Text>
                <Text fontSize="2xl" fontWeight="bold">{stats.plusOnes}</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Response Rate</Text>
                <Text fontSize="2xl" fontWeight="bold">{Math.round(responseRate)}%</Text>
                <Progress value={responseRate} colorScheme="brand" size="sm" w="full" />
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* View Toggle and Bulk Actions */}
        <HStack justify="space-between" align="center">
          <HStack spacing={4}>
            <Tabs size="sm" onChange={(index) => setViewMode(index === 0 ? 'cards' : 'table')}>
              <TabList>
                <Tab>Card View</Tab>
                <Tab>Table View</Tab>
              </TabList>
            </Tabs>
            
            {selectedGuests.length > 0 && (
              <HStack spacing={2}>
                <Text fontSize="sm" color="neutral.600">
                  {selectedGuests.length} selected
                </Text>
                <Button size="sm" variant="outline">
                  Send Reminder
                </Button>
                <Button size="sm" variant="outline">
                  Export Selected
                </Button>
              </HStack>
            )}
          </HStack>
        </HStack>

        {/* Guests List */}
        {viewMode === 'cards' ? (
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
            {filteredGuests.map((guest) => {
              const StatusIcon = rsvpStatusIcons[guest.rsvpStatus]
              const isSelected = selectedGuests.includes(guest.id)
              
              return (
                <Card 
                  key={guest.id} 
                  _hover={{ shadow: 'md' }} 
                  cursor="pointer"
                  borderColor={isSelected ? 'brand.500' : undefined}
                  borderWidth={isSelected ? '2px' : '1px'}
                >
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      {/* Header */}
                      <HStack justify="space-between" align="start">
                        <HStack spacing={3}>
                          <Checkbox
                            isChecked={isSelected}
                            onChange={() => handleSelectGuest(guest.id)}
                          />
                          <Avatar
                            name={guest.name}
                            size="md"
                            bg="brand.500"
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <Link href={`/guests/${guest.id}`}>
                              <Text fontSize="lg" fontWeight="semibold" _hover={{ color: 'brand.600' }}>
                                {guest.name}
                              </Text>
                            </Link>
                            <Text fontSize="sm" color="neutral.600">
                              {guest.relationship} • {guest.side}
                            </Text>
                          </VStack>
                        </HStack>
                        
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
                      </HStack>

                      <Divider />

                      {/* Contact Info */}
                      <VStack align="start" spacing={2} fontSize="sm" color="neutral.600">
                        <HStack>
                          <Mail size={14} />
                          <Text>{guest.email}</Text>
                        </HStack>
                        <HStack>
                          <Phone size={14} />
                          <Text>{guest.phone}</Text>
                        </HStack>
                      </VStack>

                      {/* Plus One */}
                      {guest.plusOne && (
                        <HStack spacing={2}>
                          <Users size={14} />
                          <Text fontSize="sm">Plus One: {guest.plusOne.name}</Text>
                        </HStack>
                      )}

                      {/* Special Needs */}
                      {(guest.dietaryRestrictions.length > 0 || guest.accommodationNeeds.length > 0) && (
                        <VStack align="start" spacing={2}>
                          {guest.dietaryRestrictions.length > 0 && (
                            <HStack spacing={2} wrap="wrap">
                              <Text fontSize="sm" color="neutral.600">Dietary:</Text>
                              {guest.dietaryRestrictions.map(restriction => (
                                <Badge key={restriction} size="sm" colorScheme="blue" variant="outline">
                                  {restriction}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                          {guest.accommodationNeeds.length > 0 && (
                            <HStack spacing={2} wrap="wrap">
                              <Text fontSize="sm" color="neutral.600">Needs:</Text>
                              {guest.accommodationNeeds.map(need => (
                                <Badge key={need} size="sm" colorScheme="purple" variant="outline">
                                  {need}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                        </VStack>
                      )}

                      {/* Phase Attendance */}
                      <HStack spacing={2} wrap="wrap">
                        <Text fontSize="sm" color="neutral.600">Phases:</Text>
                        {guest.phaseAttendance.map(attendance => (
                          <Badge 
                            key={attendance.phaseId} 
                            size="sm" 
                            colorScheme={attendance.status === 'attending' ? 'green' : attendance.status === 'pending' ? 'orange' : 'red'}
                            variant="outline"
                          >
                            {attendance.phaseId} - {attendance.status}
                          </Badge>
                        ))}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </Grid>
        ) : (
          <Card>
            <CardBody p={0}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        isChecked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                        isIndeterminate={selectedGuests.length > 0 && selectedGuests.length < filteredGuests.length}
                        onChange={handleSelectAll}
                      />
                    </Th>
                    <Th>Name</Th>
                    <Th>Contact</Th>
                    <Th>RSVP Status</Th>
                    <Th>Plus One</Th>
                    <Th>Special Needs</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredGuests.map(guest => {
                    const StatusIcon = rsvpStatusIcons[guest.rsvpStatus]
                    const isSelected = selectedGuests.includes(guest.id)
                    
                    return (
                      <Tr key={guest.id}>
                        <Td>
                          <Checkbox
                            isChecked={isSelected}
                            onChange={() => handleSelectGuest(guest.id)}
                          />
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Link href={`/guests/${guest.id}`}>
                              <Text fontWeight="medium" _hover={{ color: 'brand.600' }}>
                                {guest.name}
                              </Text>
                            </Link>
                            <Text fontSize="sm" color="neutral.600">
                              {guest.relationship} • {guest.side}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1} fontSize="sm">
                            <Text>{guest.email}</Text>
                            <Text color="neutral.600">{guest.phone}</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={rsvpStatusColors[guest.rsvpStatus]}
                            variant="subtle"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            w="fit-content"
                          >
                            <StatusIcon size={12} />
                            {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
                          </Badge>
                        </Td>
                        <Td>
                          {guest.plusOne ? (
                            <Text fontSize="sm">{guest.plusOne.name}</Text>
                          ) : (
                            <Text fontSize="sm" color="neutral.500">None</Text>
                          )}
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            {guest.dietaryRestrictions.map(restriction => (
                              <Badge key={restriction} size="sm" colorScheme="blue" variant="outline">
                                {restriction}
                              </Badge>
                            ))}
                            {guest.accommodationNeeds.map(need => (
                              <Badge key={need} size="sm" colorScheme="purple" variant="outline">
                                {need}
                              </Badge>
                            ))}
                          </VStack>
                        </Td>
                        <Td>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {filteredGuests.length === 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text fontSize="lg" color="neutral.600">No guests found</Text>
                <Text fontSize="sm" color="neutral.500">
                  {searchTerm || rsvpFilter || sideFilter 
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first guest'
                  }
                </Text>
                <Button leftIcon={<Plus size={16} />} colorScheme="brand">
                  Add Guest
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Import Modal */}
        <Modal isOpen={isImportOpen} onClose={onImportClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Import Guest List</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="neutral.600">
                  Upload a CSV file with guest information. The file should include columns for name, email, phone, relationship, and side.
                </Text>
                <Button leftIcon={<Upload size={16} />} variant="outline">
                  Choose File
                </Button>
                <Button colorScheme="brand">
                  Import Guests
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </DashboardLayout>
  )
}
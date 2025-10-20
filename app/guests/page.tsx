'use client'

import React, { useState, useEffect } from 'react'
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
  TabPanels,
  TabPanel,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AddGuestModal } from '@/components/guests/AddGuestModal'
import { ImportGuestsModal } from '@/components/guests/ImportGuestsModal'
import { ExportGuestsModal } from '@/components/guests/ExportGuestsModal'
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
import { getGuestsData, createGuest, importGuests, type GuestListData } from '@/lib/wedding-data-service'
import { 
  searchGuests, 
  sortGuests, 
  calculateRSVPStats,
  type GuestFilters,
  type SortConfig 
} from '@/lib/data-utils'

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestListData[]>([])
  const [filteredGuests, setFilteredGuests] = useState<GuestListData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState('')
  const [rsvpFilter, setRsvpFilter] = useState('')
  const [relationshipFilter, setRelationshipFilter] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' })
  
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure()
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure()
  const toast = useToast()

  // Handler functions for buttons
  const handleImportGuests = () => {
    onImportOpen()
  }

  const handleExportGuests = () => {
    onExportOpen()
  }

  const handleAddGuest = () => {
    onAddOpen()
  }

  const handleSaveGuest = async (guestData: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
    side: 'BRIDE' | 'GROOM';
    inviteGroup: string;
    dietaryRestrictions: string[];
    plusOneName: string;
    plusOneEmail: string;
    plusOnePhone: string;
    hasPlusOne: boolean;
    notes: string;
  }) => {
    await createGuest(guestData)
    await loadGuestsData() // Refresh the guest list
  }

  const handleImportGuestsData = async (importedGuests: Array<{
    name: string;
    email: string;
    phone: string;
    relationship: string;
    side: 'BRIDE' | 'GROOM';
    inviteGroup: string;
    dietaryRestrictions: string[];
    plusOneName: string;
  }>) => {
    const result = await importGuests(importedGuests)
    
    if (result.failed > 0) {
      toast({
        title: 'Import Completed with Issues',
        description: `${result.successful} guests imported successfully, ${result.failed} failed`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
    
    await loadGuestsData() // Refresh the guest list
  }

  useEffect(() => {
    loadGuestsData()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [guests, searchQuery, sideFilter, rsvpFilter, relationshipFilter, sortConfig])

  const loadGuestsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // getCurrentUser() is called inside getGuestsData()
      const data = await getGuestsData()
      setGuests(data)
    } catch (err) {
      console.error('Error loading guests data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load guests data')
      setGuests([])
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...guests]
    
    // Apply search
    if (searchQuery) {
      filtered = searchGuests(filtered, searchQuery)
    }
    
    // Apply side filter
    if (sideFilter) {
      filtered = filtered.filter(guest => guest.side === sideFilter)
    }
    
    // Apply RSVP filter
    if (rsvpFilter) {
      filtered = filtered.filter(guest => guest.rsvpStatus === rsvpFilter)
    }
    
    // Apply relationship filter
    if (relationshipFilter) {
      filtered = filtered.filter(guest => guest.relationship === relationshipFilter)
    }
    
    // Apply sorting
    filtered = sortGuests(filtered, sortConfig)
    
    setFilteredGuests(filtered)
  }

  const getRSVPColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'green'
      case 'DECLINED': return 'red'
      case 'PENDING': return 'yellow'
      default: return 'gray'
    }
  }

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle size={16} />
      case 'DECLINED': return <X size={16} />
      case 'PENDING': return <Clock size={16} />
      default: return null
    }
  }

  const rsvpStats = calculateRSVPStats(filteredGuests)

  if (loading) {
    return (
      <DashboardLayout>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="purple.500" />
          <Text>Loading guests...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error && guests.length === 0) {
    const isNoWeddingsError = error.includes('No weddings found')
    
    return (
      <DashboardLayout>
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isNoWeddingsError ? "info" : "error"} maxW="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>
                {isNoWeddingsError ? "No Wedding Found" : "Unable to load guests!"}
              </AlertTitle>
              <AlertDescription>
                {isNoWeddingsError 
                  ? "Please create a wedding first to manage your guest list."
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
            <Button onClick={loadGuestsData} colorScheme="brand">
              Retry
            </Button>
          )}
        </VStack>

        {/* Modals */}
        <AddGuestModal
          isOpen={isAddOpen}
          onClose={onAddClose}
          onSave={handleSaveGuest}
        />

        <ImportGuestsModal
          isOpen={isImportOpen}
          onClose={onImportClose}
          onImport={handleImportGuestsData}
        />

        <ExportGuestsModal
          isOpen={isExportOpen}
          onClose={onExportClose}
          guests={filteredGuests}
        />
      </DashboardLayout>
    )
  }    return (
      <DashboardLayout>
        <VStack spacing={6} align="stretch">
          {/* ... existing JSX content remains the same ... */}
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold">Guest List</Text>
            <HStack spacing={2}>
              <Button leftIcon={<Upload size={16} />} variant="outline" onClick={handleImportGuests}>
                Import
              </Button>
              <Button leftIcon={<Download size={16} />} variant="outline" onClick={handleExportGuests}>
                Export
              </Button>
              <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleAddGuest}>
                Add Guest
              </Button>
            </HStack>
          </Flex>        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  {rsvpStats.totalGuests}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Total Invited
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {rsvpStats.confirmedGuests}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Confirmed
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                  {rsvpStats.pendingGuests}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Pending
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {rsvpStats.responseRate}%
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Response Rate
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Filters */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Search guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              
              <Select
                placeholder="All Sides"
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value)}
              >
                <option value="BRIDE">Bride&apos;s Side</option>
                <option value="GROOM">Groom&apos;s Side</option>
              </Select>
              
              <Select
                placeholder="All RSVP Status"
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
              >
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="DECLINED">Declined</option>
              </Select>
              
              <Select
                placeholder="All Relationships"
                value={relationshipFilter}
                onChange={(e) => setRelationshipFilter(e.target.value)}
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Guest List */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox />
                  </Th>
                  <Th>Guest</Th>
                  <Th>Contact</Th>
                  <Th>RSVP Status</Th>
                  <Th>Side/Group</Th>
                  <Th>Table</Th>
                  <Th>Plus One</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGuests.map((guest) => (
                  <Tr key={guest.id}>
                    <Td>
                      <Checkbox />
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{guest.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {guest.relationship}
                        </Text>
                        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
                          <HStack spacing={1}>
                            {guest.dietaryRestrictions.map((restriction) => (
                              <Badge key={restriction} size="sm" colorScheme="orange" variant="outline">
                                {restriction}
                              </Badge>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        {guest.email && (
                          <HStack>
                            <Mail size={12} />
                            <Text fontSize="sm">{guest.email}</Text>
                          </HStack>
                        )}
                        {guest.phone && (
                          <HStack>
                            <Phone size={12} />
                            <Text fontSize="sm">{guest.phone}</Text>
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={getRSVPColor(guest.rsvpStatus)} 
                        variant="solid"
                        p={2}
                        borderRadius="md"
                      >
                        <HStack spacing={1}>
                          {getRSVPIcon(guest.rsvpStatus)}
                          <Text>{guest.rsvpStatus}</Text>
                        </HStack>
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="semibold">
                          {guest.side === 'BRIDE' ? "Bride&apos;s Side" : "Groom&apos;s Side"}
                        </Text>
                        {guest.inviteGroup && (
                          <Text fontSize="sm" color="gray.500">
                            {guest.inviteGroup}
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {guest.tableAssignment || '-'}
                      </Text>
                    </Td>
                    <Td>
                      {guest.plusOne ? (
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="semibold">
                            {guest.plusOne.name}
                          </Text>
                          <Badge 
                            size="sm" 
                            colorScheme={getRSVPColor(guest.plusOne.rsvpStatus)}
                            variant="outline"
                          >
                            {guest.plusOne.rsvpStatus}
                          </Badge>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">-</Text>
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline">
                          Remove
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {filteredGuests.length === 0 && !loading && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Users size={48} color="gray" />
                <Text fontSize="lg" color="gray.500">No guests found</Text>
                <Text color="gray.400" textAlign="center">
                  {searchQuery || sideFilter || rsvpFilter || relationshipFilter
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first guest'
                  }
                </Text>
                <Button leftIcon={<Plus size={16} />} colorScheme="purple">
                  Add Your First Guest
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </DashboardLayout>
  )
}
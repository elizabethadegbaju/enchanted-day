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
  Progress,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
import { deleteVendor } from '@/lib/wedding-data-service'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Edit,
  ExternalLink,
  MoreVertical,
  Trash2
} from 'lucide-react'

// Mock data - will be replaced with real API calls
const mockVendorDetails = {
  id: '1',
  name: 'Elegant Photography Studio',
  category: { primary: 'Photography', secondary: 'Wedding Photography' },
  contactInfo: {
    email: 'contact@elegantphoto.com',
    phone: '+1 (555) 123-4567',
    address: '123 Creative Ave, Photo City, PC 12345',
    website: 'https://elegantphoto.com',
    preferredContactMethod: 'email' as const
  },
  status: 'confirmed' as const,
  services: [
    {
      id: '1',
      name: 'Wedding Photography Package',
      description: '8-hour coverage with 2 photographers',
      price: 3500,
      currency: 'USD'
    },
    {
      id: '2',
      name: 'Engagement Session',
      description: '2-hour engagement photo session',
      price: 500,
      currency: 'USD'
    }
  ],
  contract: {
    id: '1',
    signedDate: new Date('2024-01-15'),
    paymentSchedule: [
      {
        amount: 1000,
        dueDate: new Date('2024-02-01'),
        description: 'Booking deposit',
        status: 'paid' as const
      },
      {
        amount: 1500,
        dueDate: new Date('2024-05-01'),
        description: 'Mid-payment',
        status: 'pending' as const
      },
      {
        amount: 1000,
        dueDate: new Date('2024-06-01'),
        description: 'Final payment',
        status: 'pending' as const
      }
    ]
  },
  deadlines: [
    {
      id: '1',
      name: 'Shot list submission',
      date: new Date('2024-05-15'),
      description: 'Submit detailed shot list and timeline',
      priority: 'high' as const,
      status: 'pending' as const
    },
    {
      id: '2',
      name: 'Final meeting',
      date: new Date('2024-06-10'),
      description: 'Final coordination meeting',
      priority: 'medium' as const,
      status: 'completed' as const
    }
  ],
  communicationHistory: [
    {
      id: '1',
      timestamp: new Date('2024-01-20'),
      type: 'email' as const,
      direction: 'outbound' as const,
      subject: 'Contract confirmation',
      content: 'Thank you for signing the contract. Looking forward to your special day!',
      status: 'delivered' as const
    },
    {
      id: '2',
      timestamp: new Date('2024-01-18'),
      type: 'phone' as const,
      direction: 'inbound' as const,
      content: 'Discussed timeline and special requests',
      status: 'completed' as const
    }
  ],
  phases: ['Ceremony', 'Reception'],
  budget: {
    allocated: 3500,
    spent: 1000,
    remaining: 2500
  }
}

const statusColors: Record<string, string> = {
  pending: 'orange',
  confirmed: 'green',
  completed: 'blue',
  issue: 'red'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  issue: AlertTriangle
}

const priorityColors: Record<string, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  critical: 'red'
}

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)
  
  // In a real app, fetch vendor data based on useParams().id
  const vendor = mockVendorDetails
  const StatusIcon = statusIcons[vendor.status]
  const budgetPercentage = (vendor.budget.spent / vendor.budget.allocated) * 100

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteVendor(params.id as string)
      
      toast({
        title: 'Vendor Deleted',
        description: `${vendor.name} has been removed from the wedding`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Navigate back to vendors list
      router.push('/vendors')
    } catch (error) {
      console.error('Error deleting vendor:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete vendor. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      onDeleteClose()
    }
  }
  


  return (
    <DashboardLayout 
      title={vendor.name}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Vendors', href: '/vendors' },
        { label: vendor.name }
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
                    name={vendor.name}
                    size="lg"
                    bg="brand.500"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold">{vendor.name}</Text>
                    <Text color="neutral.600">{vendor.category.secondary || vendor.category.primary}</Text>
                    <Badge
                      colorScheme={statusColors[vendor.status]}
                      variant="subtle"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <StatusIcon size={12} />
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </Badge>
                  </VStack>
                </HStack>

                {/* Contact Info */}
                <VStack align="start" spacing={2} fontSize="sm">
                  <HStack>
                    <Mail size={16} />
                    <ChakraLink href={`mailto:${vendor.contactInfo.email}`} color="brand.600">
                      {vendor.contactInfo.email}
                    </ChakraLink>
                  </HStack>
                  <HStack>
                    <Phone size={16} />
                    <ChakraLink href={`tel:${vendor.contactInfo.phone}`} color="brand.600">
                      {vendor.contactInfo.phone}
                    </ChakraLink>
                  </HStack>
                  {vendor.contactInfo.website && (
                    <HStack>
                      <Globe size={16} />
                      <ChakraLink href={vendor.contactInfo.website} isExternal color="brand.600">
                        Visit Website <ExternalLink size={12} />
                      </ChakraLink>
                    </HStack>
                  )}
                  {vendor.contactInfo.address && (
                    <HStack>
                      <MapPin size={16} />
                      <Text>{vendor.contactInfo.address}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              <VStack spacing={3}>
                <Button leftIcon={<Edit size={16} />} variant="outline">
                  Edit Vendor
                </Button>
                <Button leftIcon={<MessageSquare size={16} />} colorScheme="brand">
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
                      Delete Vendor
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
                <Text fontSize="sm" color="neutral.600">Budget Progress</Text>
                <Text fontSize="xl" fontWeight="bold">
                  ${vendor.budget.spent.toLocaleString()} / ${vendor.budget.allocated.toLocaleString()}
                </Text>
                <Progress
                  value={budgetPercentage}
                  colorScheme={budgetPercentage > 90 ? 'red' : budgetPercentage > 75 ? 'orange' : 'brand'}
                  size="sm"
                  w="full"
                />
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Upcoming Deadlines</Text>
                <Text fontSize="xl" fontWeight="bold" color="orange.500">
                  {vendor.deadlines.filter(d => d.status === 'pending').length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Services</Text>
                <Text fontSize="xl" fontWeight="bold">
                  {vendor.services.length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Wedding Phases</Text>
                <HStack spacing={1} wrap="wrap">
                  {vendor.phases.map(phase => (
                    <Badge key={phase} size="sm" variant="outline">
                      {phase}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Card>
          <CardBody>
            <Tabs>
              <TabList>
                <Tab>Services & Contract</Tab>
                <Tab>Deadlines</Tab>
                <Tab>Communications</Tab>
                <Tab>Payments</Tab>
              </TabList>

              <TabPanels>
                {/* Services & Contract */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Services</Text>
                      <VStack align="stretch" spacing={3}>
                        {vendor.services.map(service => (
                          <Card key={service.id} variant="outline">
                            <CardBody>
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="medium">{service.name}</Text>
                                  <Text fontSize="sm" color="neutral.600">{service.description}</Text>
                                </VStack>
                                <Text fontWeight="bold" color="brand.600">
                                  ${service.price.toLocaleString()} {service.currency}
                                </Text>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </Box>

                    <Divider />

                    <Box>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Contract Information</Text>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Text fontWeight="medium" minW="120px">Contract ID:</Text>
                          <Text>{vendor.contract.id}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="medium" minW="120px">Signed Date:</Text>
                          <Text>{vendor.contract.signedDate?.toLocaleDateString()}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="medium" minW="120px">Total Value:</Text>
                          <Text fontWeight="bold" color="brand.600">
                            ${vendor.contract.paymentSchedule.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>

                {/* Deadlines */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {vendor.deadlines.map(deadline => (
                      <Card key={deadline.id} variant="outline">
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <Text fontWeight="medium">{deadline.name}</Text>
                                <Badge colorScheme={priorityColors[deadline.priority]} size="sm">
                                  {deadline.priority}
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="neutral.600">{deadline.description}</Text>
                              <HStack spacing={4} fontSize="sm" color="neutral.600">
                                <HStack>
                                  <Calendar size={14} />
                                  <Text>{deadline.date.toLocaleDateString()}</Text>
                                </HStack>
                                <Badge colorScheme={deadline.status === 'completed' ? 'green' : 'orange'} size="sm">
                                  {deadline.status}
                                </Badge>
                              </HStack>
                            </VStack>
                            <Button size="sm" variant="outline">
                              Mark Complete
                            </Button>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Communications */}
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {vendor.communicationHistory.map(comm => (
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

                {/* Payments */}
                <TabPanel px={0}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Description</Th>
                        <Th>Amount</Th>
                        <Th>Due Date</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {vendor.contract.paymentSchedule.map(payment => (
                        <Tr key={payment.description}>
                          <Td>{payment.description}</Td>
                          <Td fontWeight="medium">${payment.amount.toLocaleString()}</Td>
                          <Td>{payment.dueDate.toLocaleDateString()}</Td>
                          <Td>
                            <Badge colorScheme={payment.status === 'paid' ? 'green' : 'orange'}>
                              {payment.status}
                            </Badge>
                          </Td>
                          <Td>
                            {payment.status === 'pending' && (
                              <Button size="sm" colorScheme="brand">
                                Mark Paid
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Vendor"
        itemName={vendor.name}
        itemType="Vendor"
        warningMessage="This will permanently remove this vendor from your wedding, including all contracts, communications, and payment schedules."
      />
    </DashboardLayout>
  )
}
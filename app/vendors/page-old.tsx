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
  Progress,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Search, 
  Plus,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

// Mock data - will be replaced with real API calls
const mockVendors = [
  {
    id: '1',
    name: 'Elegant Photography Studio',
    category: { primary: 'Photography', secondary: 'Wedding Photography' },
    contactInfo: {
      email: 'contact@elegantphoto.com',
      phone: '+1 (555) 123-4567',
      preferredContactMethod: 'email' as const
    },
    status: 'confirmed' as const,
    upcomingDeadlines: 2,
    lastContact: '2 days ago',
    budget: { allocated: 3500, spent: 1000 },
    phases: ['Ceremony', 'Reception']
  },
  {
    id: '2',
    name: 'Gourmet Catering Co.',
    category: { primary: 'Catering', secondary: 'Fine Dining' },
    contactInfo: {
      email: 'events@gourmetcatering.com',
      phone: '+1 (555) 987-6543',
      preferredContactMethod: 'phone' as const
    },
    status: 'pending' as const,
    upcomingDeadlines: 1,
    lastContact: '1 week ago',
    budget: { allocated: 8000, spent: 2000 },
    phases: ['Reception']
  },
  {
    id: '3',
    name: 'Blooming Gardens Florist',
    category: { primary: 'Florals', secondary: 'Wedding Flowers' },
    contactInfo: {
      email: 'hello@bloominggardens.com',
      phone: '+1 (555) 456-7890',
      preferredContactMethod: 'email' as const
    },
    status: 'issue' as const,
    upcomingDeadlines: 3,
    lastContact: '3 days ago',
    budget: { allocated: 2500, spent: 500 },
    phases: ['Ceremony', 'Reception']
  },
  {
    id: '4',
    name: 'Harmony Wedding Band',
    category: { primary: 'Entertainment', secondary: 'Live Music' },
    contactInfo: {
      email: 'bookings@harmonywedding.com',
      phone: '+1 (555) 321-0987',
      preferredContactMethod: 'email' as const
    },
    status: 'confirmed' as const,
    upcomingDeadlines: 0,
    lastContact: '5 days ago',
    budget: { allocated: 4000, spent: 4000 },
    phases: ['Reception']
  }
]

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

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.category.primary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || vendor.category.primary === categoryFilter
    const matchesStatus = !statusFilter || vendor.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(mockVendors.map(v => v.category.primary))]
  const statuses = [...new Set(mockVendors.map(v => v.status))]

  return (
    <DashboardLayout 
      title="Vendor Management"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Vendors' }
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
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select
              placeholder="All Categories"
              maxW="200px"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            
            <Select
              placeholder="All Statuses"
              maxW="150px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Select>
          </HStack>
          
          <Button leftIcon={<Plus size={16} />} colorScheme="brand">
            Add Vendor
          </Button>
        </Flex>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Total Vendors</Text>
                <Text fontSize="2xl" fontWeight="bold">{mockVendors.length}</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Confirmed</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {mockVendors.filter(v => v.status === 'confirmed').length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Pending</Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {mockVendors.filter(v => v.status === 'pending').length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="neutral.600">Issues</Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {mockVendors.filter(v => v.status === 'issue').length}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Vendors List */}
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
          {filteredVendors.map((vendor) => {
            const StatusIcon = statusIcons[vendor.status]
            const budgetPercentage = (vendor.budget.spent / vendor.budget.allocated) * 100
            
            return (
              <Card key={vendor.id} _hover={{ shadow: 'md' }} cursor="pointer">
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <Link href={`/vendors/${vendor.id}`}>
                          <Text fontSize="lg" fontWeight="semibold" _hover={{ color: 'brand.600' }}>
                            {vendor.name}
                          </Text>
                        </Link>
                        <Text fontSize="sm" color="neutral.600">
                          {vendor.category.secondary || vendor.category.primary}
                        </Text>
                      </VStack>
                      
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
                    </HStack>

                    <Divider />

                    {/* Contact Info */}
                    <HStack spacing={4} fontSize="sm" color="neutral.600">
                      <HStack>
                        <Mail size={14} />
                        <Text>{vendor.contactInfo.email}</Text>
                      </HStack>
                      <HStack>
                        <Phone size={14} />
                        <Text>{vendor.contactInfo.phone}</Text>
                      </HStack>
                    </HStack>

                    {/* Phases */}
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="neutral.600">Phases:</Text>
                      {vendor.phases.map(phase => (
                        <Badge key={phase} size="sm" variant="outline">
                          {phase}
                        </Badge>
                      ))}
                    </HStack>

                    {/* Budget Progress */}
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between" fontSize="sm">
                        <Text color="neutral.600">Budget</Text>
                        <Text>
                          ${vendor.budget.spent.toLocaleString()} / ${vendor.budget.allocated.toLocaleString()}
                        </Text>
                      </HStack>
                      <Progress
                        value={budgetPercentage}
                        colorScheme={budgetPercentage > 90 ? 'red' : budgetPercentage > 75 ? 'orange' : 'brand'}
                        size="sm"
                      />
                    </VStack>

                    {/* Footer */}
                    <HStack justify="space-between" align="center" pt={2}>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="neutral.500">Last Contact</Text>
                        <Text fontSize="sm">{vendor.lastContact}</Text>
                      </VStack>
                      
                      {vendor.upcomingDeadlines > 0 && (
                        <HStack spacing={1} color="orange.500">
                          <Calendar size={14} />
                          <Text fontSize="sm">{vendor.upcomingDeadlines} deadline{vendor.upcomingDeadlines > 1 ? 's' : ''}</Text>
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )
          })}
        </Grid>

        {filteredVendors.length === 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text fontSize="lg" color="neutral.600">No vendors found</Text>
                <Text fontSize="sm" color="neutral.500">
                  {searchTerm || categoryFilter || statusFilter 
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first vendor'
                  }
                </Text>
                <Button leftIcon={<Plus size={16} />} colorScheme="brand">
                  Add Vendor
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </DashboardLayout>
  )
}
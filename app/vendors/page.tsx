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
  Progress,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  Flex,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  useToast
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
import Link from 'next/link'
import { getVendorsData, type VendorListData } from '@/lib/wedding-data-service'
import { 
  searchVendors, 
  sortVendors, 
  type VendorFilters,
  type SortConfig 
} from '@/lib/data-utils'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorListData[]>([])
  const [filteredVendors, setFilteredVendors] = useState<VendorListData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: 'asc' })
  
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const toast = useToast()

  // Handler functions for buttons
  const handleAddVendor = () => {
    toast({
      title: 'Add Vendor',
      description: 'Add vendor modal will be implemented with backend integration',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleViewVendorDetails = (vendorId: string) => {
    // Navigate to vendor detail page
    window.location.href = `/vendors/${vendorId}`
  }

  const handleContactVendor = (vendorName: string) => {
    toast({
      title: 'Contact Vendor',
      description: `Contact functionality for ${vendorName} will be implemented`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  useEffect(() => {
    loadVendorsData()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [vendors, searchQuery, categoryFilter, statusFilter, sortConfig])

  const loadVendorsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // getCurrentUser() is called inside getVendorsData()
      const data = await getVendorsData()
      setVendors(data)
    } catch (err) {
      console.error('Error loading vendors data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load vendors data')
      setVendors([])
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...vendors]
    
    // Apply search
    if (searchQuery) {
      filtered = searchVendors(filtered, searchQuery)
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(vendor => 
        vendor.category.primary === categoryFilter || vendor.category.secondary === categoryFilter
      )
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(vendor => vendor.status === statusFilter)
    }
    
    // Apply sorting
    filtered = sortVendors(filtered, sortConfig)
    
    setFilteredVendors(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'green'
      case 'PENDING': return 'yellow'
      case 'DECLINED': return 'red'
      case 'CONTACTED': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle size={16} />
      case 'PENDING': return <Clock size={16} />
      case 'DECLINED': return <AlertTriangle size={16} />
      case 'CONTACTED': return <Mail size={16} />
      default: return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="purple.500" />
          <Text>Loading vendors...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error && vendors.length === 0) {
    const isNoWeddingsError = error.includes('No weddings found')
    
    return (
      <DashboardLayout>
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isNoWeddingsError ? "info" : "error"} maxW="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>
                {isNoWeddingsError ? "No Wedding Found" : "Unable to load vendors!"}
              </AlertTitle>
              <AlertDescription>
                {isNoWeddingsError 
                  ? "Please create a wedding first to manage vendors."
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
            <Button onClick={loadVendorsData} colorScheme="brand">
              Retry
            </Button>
          )}
        </VStack>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">Vendors</Text>
          <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleAddVendor}>
            Add Vendor
          </Button>
        </Flex>

        {/* Filters */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              
              <Select
                placeholder="All Categories"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="Photography">Photography</option>
                <option value="Catering">Catering</option>
                <option value="Florals">Florals</option>
                <option value="Venue">Venue</option>
                <option value="Music">Music</option>
                <option value="Transportation">Transportation</option>
              </Select>
              
              <Select
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="CONTACTED">Contacted</option>
                <option value="DECLINED">Declined</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Vendors Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} bg={cardBg} borderColor={borderColor} _hover={{ shadow: 'md' }}>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {/* Header */}
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">{vendor.name}</Text>
                      <Text color="gray.500" fontSize="sm">
                        {vendor.category.primary}
                        {vendor.category.secondary && ` • ${vendor.category.secondary}`}
                      </Text>
                    </VStack>
                    <Badge colorScheme={getStatusColor(vendor.status)} variant="subtle">
                      <HStack spacing={1}>
                        {getStatusIcon(vendor.status)}
                        <Text>{vendor.status}</Text>
                      </HStack>
                    </Badge>
                  </HStack>

                  <Divider />

                  {/* Contact Info */}
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Mail size={14} />
                      <Text fontSize="sm">{vendor.contactInfo.email}</Text>
                    </HStack>
                    <HStack>
                      <Phone size={14} />
                      <Text fontSize="sm">{vendor.contactInfo.phone}</Text>
                    </HStack>
                    {vendor.lastContact && (
                      <HStack>
                        <Calendar size={14} />
                        <Text fontSize="sm" color="gray.500">Last contact: {vendor.lastContact}</Text>
                      </HStack>
                    )}
                  </VStack>

                  {/* Cost and Rating */}
                  {(vendor.totalCost || vendor.rating) && (
                    <>
                      <Divider />
                      <HStack justify="space-between">
                        {vendor.totalCost && (
                          <Text fontWeight="semibold" color="green.500">
                            {formatCurrency(vendor.totalCost)}
                          </Text>
                        )}
                        {vendor.rating && (
                          <HStack>
                            <Text fontSize="sm">⭐ {vendor.rating}</Text>
                          </HStack>
                        )}
                      </HStack>
                    </>
                  )}

                  {/* Services */}
                  {vendor.services && vendor.services.length > 0 && (
                    <>
                      <Divider />
                      <VStack align="stretch" spacing={1}>
                        <Text fontSize="sm" fontWeight="semibold">Services:</Text>
                        {vendor.services.slice(0, 3).map((service) => (
                          <HStack key={service.id} justify="space-between">
                            <Text fontSize="sm" color="gray.600">{service.name}</Text>
                            <Text fontSize="sm" fontWeight="semibold">
                              {formatCurrency(service.price)}
                            </Text>
                          </HStack>
                        ))}
                        {vendor.services.length > 3 && (
                          <Text fontSize="xs" color="gray.500">
                            +{vendor.services.length - 3} more services
                          </Text>
                        )}
                      </VStack>
                    </>
                  )}

                  {/* Actions */}
                  <HStack spacing={2}>
                    <Button size="sm" variant="outline" flex={1} onClick={() => handleViewVendorDetails(vendor.id)}>
                      View Details
                    </Button>
                    <Button size="sm" colorScheme="purple" flex={1} onClick={() => handleContactVendor(vendor.name)}>
                      Contact
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </Grid>

        {filteredVendors.length === 0 && !loading && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text fontSize="lg" color="gray.500">No vendors found</Text>
                <Text color="gray.400" textAlign="center">
                  {searchQuery || categoryFilter || statusFilter
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first vendor'
                  }
                </Text>
                <Button leftIcon={<Plus size={16} />} colorScheme="purple">
                  Add Your First Vendor
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </DashboardLayout>
  )
}
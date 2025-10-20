'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Avatar,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { Plus, Search, Filter, Phone, Mail, MoreVertical, MessageCircle, DollarSign, CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AddVendorModal } from '@/components/vendors/AddVendorModal';
import { ContactVendorModal } from '@/components/vendors/ContactVendorModal';
import { MarkPaidModal } from '@/components/vendors/MarkPaidModal';
import { 
  getVendorsData, 
  createVendor, 
  recordVendorCommunication, 
  recordVendorPayment,
  getVendorCommunicationHistory,
  getVendorPaymentHistory,
  type VendorListData,
  type VendorFormData,
  type CommunicationData,
  type PaymentData
} from '@/lib/wedding-data-service';

export default function VendorsPage() {
  const toast = useToast();
  const [vendors, setVendors] = useState<VendorListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isContactModalOpen, onOpen: onContactModalOpen, onClose: onContactModalClose } = useDisclosure();
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure();
  
  // Selected vendor states
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [vendorCommunicationHistory, setVendorCommunicationHistory] = useState<any[]>([]);
  const [vendorPaymentHistory, setVendorPaymentHistory] = useState<any[]>([]);
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const loadVendors = async () => {
    try {
      setLoading(true);
      const vendorsData = await getVendorsData();
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vendors. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleAddVendor = async (vendorData: VendorFormData) => {
    try {
      await createVendor(vendorData);
      await loadVendors();
    } catch (error) {
      console.error('Error adding vendor:', error);
      throw error;
    }
  };

  const handleContactVendor = async (vendor: VendorListData) => {
    try {
      setSelectedVendor(vendor);
      const history = await getVendorCommunicationHistory(vendor.id);
      setVendorCommunicationHistory(history);
      onContactModalOpen();
    } catch (error) {
      console.error('Error loading vendor communication history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load communication history.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSendCommunication = async (vendorId: string, communicationData: CommunicationData) => {
    try {
      await recordVendorCommunication(vendorId, communicationData);
      await loadVendors();
    } catch (error) {
      console.error('Error sending communication:', error);
      throw error;
    }
  };

  const handleMarkPaid = async (vendor: VendorListData) => {
    try {
      setSelectedVendor(vendor);
      const paymentHistory = await getVendorPaymentHistory(vendor.id);
      setVendorPaymentHistory(paymentHistory);
      onPaymentModalOpen();
    } catch (error) {
      console.error('Error loading vendor payment history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment history.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRecordPayment = async (vendorId: string, paymentData: PaymentData) => {
    try {
      await recordVendorPayment(vendorId, paymentData);
      await loadVendors();
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = !searchQuery || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.primary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.contactInfo.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || vendor.category.primary === categoryFilter;
    const matchesStatus = !statusFilter || vendor.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle size={16} />;
      case 'PENDING': return <Clock size={16} />;
      case 'DECLINED': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'yellow';
      case 'DECLINED': return 'red';
      case 'INQUIRED': return 'blue';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxW="7xl" py={8}>
          <VStack spacing={8} align="center" justify="center" minH="400px">
            <Spinner size="xl" color="purple.500" />
            <Text>Loading vendors...</Text>
          </VStack>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="2xl" fontWeight="bold">Vendors</Text>
              <Text color="gray.600">Manage your wedding vendors and communications</Text>
            </Box>
            <Button leftIcon={<Plus size={20} />} colorScheme="purple" onClick={onAddModalOpen}>
              Add Vendor
            </Button>
          </HStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Text fontSize="2xl" fontWeight="bold">{vendors.length}</Text>
                <Text fontSize="sm" color="gray.600">Total Vendors</Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {vendors.filter(v => v.status === 'CONFIRMED').length}
                </Text>
                <Text fontSize="sm" color="gray.600">Confirmed</Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {vendors.filter(v => v.status === 'INQUIRED').length}
                </Text>
                <Text fontSize="sm" color="gray.600">In Progress</Text>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                  ${vendors.reduce((sum, v) => sum + (v.totalCost || 0), 0).toLocaleString()}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Budget</Text>
              </CardBody>
            </Card>
          </Grid>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} alignItems="end">
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>Search Vendors</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Search color="gray.400" size={16} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by name, category, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>Category</Text>
                  <Select 
                    placeholder="All Categories"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="Photography">Photography</option>
                    <option value="Catering">Catering</option>
                    <option value="Florals">Florals</option>
                    <option value="Venue">Venue</option>
                    <option value="Music/DJ">Music/DJ</option>
                    <option value="Hair & Makeup">Hair & Makeup</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb={2}>Status</Text>
                  <Select 
                    placeholder="All Statuses"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="INQUIRED">Inquired</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="DECLINED">Declined</option>
                  </Select>
                </Box>

                <Button
                  leftIcon={<Filter size={16} />}
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('');
                    setStatusFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </CardBody>
          </Card>

          {filteredVendors.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>No vendors found!</AlertTitle>
                <AlertDescription>
                  {vendors.length === 0 
                    ? "You haven't added any vendors yet. Click 'Add Vendor' to get started."
                    : "No vendors match your current filters. Try adjusting your search criteria."
                  }
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} bg={cardBg} borderColor={borderColor} _hover={{ shadow: 'md' }}>
                  <CardHeader pb={2}>
                    <HStack justify="space-between" align="start">
                      <HStack>
                        <Avatar name={vendor.name} size="sm" />
                        <Box>
                          <Text fontWeight="bold" fontSize="lg">{vendor.name}</Text>
                          <HStack spacing={1}>
                            <Badge colorScheme={getStatusColor(vendor.status)} variant="subtle">
                              {getStatusIcon(vendor.status)}
                              <Text ml={1}>{vendor.status.toLowerCase().replace('_', ' ')}</Text>
                            </Badge>
                            <Badge variant="outline">{vendor.category.primary}</Badge>
                          </HStack>
                        </Box>
                      </HStack>
                      <Menu>
                        <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                        <MenuList>
                          <MenuItem icon={<MessageCircle size={16} />} onClick={() => handleContactVendor(vendor)}>
                            Contact Vendor
                          </MenuItem>
                          <MenuItem icon={<DollarSign size={16} />} onClick={() => handleMarkPaid(vendor)}>
                            Record Payment
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    <VStack align="stretch" spacing={3}>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>Contact Information</Text>
                        <VStack align="stretch" spacing={1}>
                          <HStack>
                            <Mail size={14} />
                            <Text fontSize="sm">{vendor.contactInfo.email}</Text>
                          </HStack>
                          <HStack>
                            <Phone size={14} />
                            <Text fontSize="sm">{vendor.contactInfo.phone}</Text>
                          </HStack>
                        </VStack>
                      </Box>

                      {vendor.totalCost && (
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Investment</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.500">
                            ${vendor.totalCost.toLocaleString()}
                          </Text>
                        </Box>
                      )}

                      {vendor.lastContact && (
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Last Contact</Text>
                          <HStack>
                            <Calendar size={14} />
                            <Text fontSize="sm">{new Date(vendor.lastContact).toLocaleDateString()}</Text>
                          </HStack>
                        </Box>
                      )}

                      <Divider />

                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          leftIcon={<MessageCircle size={14} />}
                          onClick={() => handleContactVendor(vendor)}
                          flex={1}
                        >
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          leftIcon={<DollarSign size={14} />}
                          onClick={() => handleMarkPaid(vendor)}
                          flex={1}
                        >
                          Payment
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </VStack>

        <AddVendorModal
          isOpen={isAddModalOpen}
          onClose={onAddModalClose}
          onSave={handleAddVendor}
        />

        <ContactVendorModal
          isOpen={isContactModalOpen}
          onClose={onContactModalClose}
          vendor={selectedVendor}
          communicationHistory={vendorCommunicationHistory}
          onSendCommunication={handleSendCommunication}
        />

        <MarkPaidModal
          isOpen={isPaymentModalOpen}
          onClose={onPaymentModalClose}
          vendor={selectedVendor}
          paymentHistory={vendorPaymentHistory}
          onRecordPayment={handleRecordPayment}
        />
      </Container>
    </DashboardLayout>
  );
}
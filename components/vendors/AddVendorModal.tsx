'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Divider,
  useToast,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Checkbox,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';

interface VendorService {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

interface VendorFormData {
  name: string;
  primaryCategory: string;
  secondaryCategory: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  preferredContactMethod: 'EMAIL' | 'PHONE';
  services: VendorService[];
  totalCost: number;
  depositRequired: number;
  contractSigned: boolean;
  contractDate: string;
  finalPaymentDue: string;
  requirements: string[];
  deliverables: string[];
  notes: string;
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendorData: VendorFormData) => Promise<void>;
}

const VENDOR_CATEGORIES = [
  'Photography',
  'Videography', 
  'Catering',
  'Venue',
  'Florals',
  'Music/DJ',
  'Band/Live Music',
  'Hair & Makeup',
  'Wedding Dress',
  'Suits/Tuxedos',
  'Transportation',
  'Wedding Cake',
  'Decorations',
  'Wedding Planner',
  'Officiants',
  'Lighting',
  'Security',
  'Rentals',
  'Stationery',
  'Other'
];

export function AddVendorModal({ isOpen, onClose, onSave }: AddVendorModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    primaryCategory: '',
    secondaryCategory: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    preferredContactMethod: 'EMAIL',
    services: [],
    totalCost: 0,
    depositRequired: 0,
    contractSigned: false,
    contractDate: '',
    finalPaymentDue: '',
    requirements: [],
    deliverables: [],
    notes: ''
  });

  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');

  const handleInputChange = (field: keyof VendorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addService = () => {
    if (newService.name && newService.price > 0) {
      const service: VendorService = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        price: newService.price,
        currency: 'USD'
      };
      
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      
      setNewService({ name: '', description: '', price: 0 });
    }
  };

  const removeService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()]
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Vendor name is required';
    }
    
    if (!formData.primaryCategory) {
      return 'Primary category is required';
    }

    if (!formData.email.trim()) {
      return 'Email address is required';
    }

    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      return 'Phone number is required';
    }

    return null;
  };

  const handleSave = async () => {
    try {
      const validationError = validateForm();
      if (validationError) {
        toast({
          title: 'Validation Error',
          description: validationError,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);
      await onSave(formData);
      
      toast({
        title: 'Vendor Added',
        description: `${formData.name} has been successfully added to your vendor list`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to add vendor. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        primaryCategory: '',
        secondaryCategory: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        preferredContactMethod: 'EMAIL',
        services: [],
        totalCost: 0,
        depositRequired: 0,
        contractSigned: false,
        contractDate: '',
        finalPaymentDue: '',
        requirements: [],
        deliverables: [],
        notes: ''
      });
      setActiveTab(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Vendor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>Services</Tab>
              <Tab>Contract & Payment</Tab>
              <Tab>Requirements</Tab>
            </TabList>

            <TabPanels>
              {/* Basic Information Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Vendor Name</FormLabel>
                    <Input
                      placeholder="Enter vendor business name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </FormControl>

                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Primary Category</FormLabel>
                      <Select
                        placeholder="Select primary category"
                        value={formData.primaryCategory}
                        onChange={(e) => handleInputChange('primaryCategory', e.target.value)}
                      >
                        {VENDOR_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Secondary Category</FormLabel>
                      <Select
                        placeholder="Select secondary category (optional)"
                        value={formData.secondaryCategory}
                        onChange={(e) => handleInputChange('secondaryCategory', e.target.value)}
                      >
                        {VENDOR_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Divider />

                  <Text fontWeight="bold">Contact Information</Text>

                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        placeholder="contact@vendor.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </FormControl>
                  </Grid>

                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl>
                      <FormLabel>Website</FormLabel>
                      <Input
                        type="url"
                        placeholder="https://vendor-website.com"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Preferred Contact Method</FormLabel>
                      <Select
                        value={formData.preferredContactMethod}
                        onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                      >
                        <option value="EMAIL">Email</option>
                        <option value="PHONE">Phone</option>
                      </Select>
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel>Business Address</FormLabel>
                    <Textarea
                      placeholder="Enter full business address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      placeholder="Any additional notes about this vendor"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Services Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Card variant="outline">
                    <CardHeader>
                      <Text fontWeight="bold">Add Service</Text>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3}>
                        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={3} width="100%">
                          <Input
                            placeholder="Service name"
                            value={newService.name}
                            onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                          />
                          <NumberInput
                            value={newService.price}
                            onChange={(_, value) => setNewService(prev => ({ ...prev, price: value || 0 }))}
                            min={0}
                          >
                            <NumberInputField placeholder="Price ($)" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Grid>
                        <Input
                          placeholder="Service description (optional)"
                          value={newService.description}
                          onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                        />
                        <Button
                          leftIcon={<Plus size={16} />}
                          onClick={addService}
                          isDisabled={!newService.name || newService.price <= 0}
                          size="sm"
                          colorScheme="purple"
                        >
                          Add Service
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  {formData.services.length > 0 && (
                    <Card variant="outline">
                      <CardHeader>
                        <Text fontWeight="bold">Services ({formData.services.length})</Text>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={3}>
                          {formData.services.map((service) => (
                            <HStack key={service.id} justify="space-between" width="100%" p={3} bg="gray.50" borderRadius="md">
                              <VStack align="start" spacing={1} flex={1}>
                                <Text fontWeight="semibold">{service.name}</Text>
                                {service.description && (
                                  <Text fontSize="sm" color="gray.600">{service.description}</Text>
                                )}
                              </VStack>
                              <HStack>
                                <Text fontWeight="bold" color="green.600">
                                  ${service.price.toLocaleString()}
                                </Text>
                                <IconButton
                                  aria-label="Remove service"
                                  icon={<Trash2 size={16} />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeService(service.id)}
                                />
                              </HStack>
                            </HStack>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>

              {/* Contract & Payment Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl>
                      <FormLabel>Total Cost</FormLabel>
                      <NumberInput
                        value={formData.totalCost}
                        onChange={(_, value) => handleInputChange('totalCost', value || 0)}
                        min={0}
                      >
                        <NumberInputField placeholder="Total cost ($)" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Deposit Required</FormLabel>
                      <NumberInput
                        value={formData.depositRequired}
                        onChange={(_, value) => handleInputChange('depositRequired', value || 0)}
                        min={0}
                      >
                        <NumberInputField placeholder="Deposit amount ($)" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Grid>

                  <Divider />

                  <FormControl>
                    <Checkbox
                      isChecked={formData.contractSigned}
                      onChange={(e) => handleInputChange('contractSigned', e.target.checked)}
                    >
                      Contract has been signed
                    </Checkbox>
                  </FormControl>

                  {formData.contractSigned && (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <FormControl>
                        <FormLabel>Contract Date</FormLabel>
                        <Input
                          type="date"
                          value={formData.contractDate}
                          onChange={(e) => handleInputChange('contractDate', e.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Final Payment Due Date</FormLabel>
                        <Input
                          type="date"
                          value={formData.finalPaymentDue}
                          onChange={(e) => handleInputChange('finalPaymentDue', e.target.value)}
                        />
                      </FormControl>
                    </Grid>
                  )}

                  {formData.totalCost > 0 && formData.depositRequired > 0 && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">Payment Summary</Text>
                        <Text fontSize="sm">
                          Deposit: ${formData.depositRequired.toLocaleString()} | 
                          Remaining: ${(formData.totalCost - formData.depositRequired).toLocaleString()}
                        </Text>
                      </VStack>
                    </Alert>
                  )}
                </VStack>
              </TabPanel>

              {/* Requirements Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Card variant="outline">
                    <CardHeader>
                      <Text fontWeight="bold">Requirements</Text>
                    </CardHeader>
                    <CardBody>
                      <HStack>
                        <Input
                          placeholder="Add a requirement"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addRequirement();
                            }
                          }}
                        />
                        <Button
                          onClick={addRequirement}
                          isDisabled={!newRequirement.trim()}
                          leftIcon={<Plus size={16} />}
                        >
                          Add
                        </Button>
                      </HStack>
                      
                      {formData.requirements.length > 0 && (
                        <VStack align="stretch" spacing={2} mt={3}>
                          {formData.requirements.map((requirement, index) => (
                            <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                              <Text flex={1}>{requirement}</Text>
                              <IconButton
                                aria-label="Remove requirement"
                                icon={<Trash2 size={16} />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeRequirement(index)}
                              />
                            </HStack>
                          ))}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardHeader>
                      <Text fontWeight="bold">Deliverables</Text>
                    </CardHeader>
                    <CardBody>
                      <HStack>
                        <Input
                          placeholder="Add a deliverable"
                          value={newDeliverable}
                          onChange={(e) => setNewDeliverable(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addDeliverable();
                            }
                          }}
                        />
                        <Button
                          onClick={addDeliverable}
                          isDisabled={!newDeliverable.trim()}
                          leftIcon={<Plus size={16} />}
                        >
                          Add
                        </Button>
                      </HStack>
                      
                      {formData.deliverables.length > 0 && (
                        <VStack align="stretch" spacing={2} mt={3}>
                          {formData.deliverables.map((deliverable, index) => (
                            <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                              <Text flex={1}>{deliverable}</Text>
                              <IconButton
                                aria-label="Remove deliverable"
                                icon={<Trash2 size={16} />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeDeliverable(index)}
                              />
                            </HStack>
                          ))}
                        </VStack>
                      )}
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSave} isLoading={loading}>
            Add Vendor
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
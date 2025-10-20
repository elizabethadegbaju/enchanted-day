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
  Checkbox,
  Text,
  Divider,
  Alert,
  AlertIcon,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
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
} from '@chakra-ui/react';

interface GuestFormData {
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
}

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guestData: GuestFormData) => Promise<void>;
}

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut Allergies',
  'Shellfish Allergy',
  'Kosher',
  'Halal',
  'Low Sodium',
  'Diabetic Friendly'
];

const RELATIONSHIP_OPTIONS = [
  'Immediate Family',
  'Extended Family',
  'Close Friend',
  'Friend',
  'Colleague',
  'Neighbor',
  'Childhood Friend',
  'College Friend',
  'Work Friend',
  'Family Friend',
  'Other'
];

export function AddGuestModal({ isOpen, onClose, onSave }: AddGuestModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    side: 'BRIDE',
    inviteGroup: '',
    dietaryRestrictions: [],
    plusOneName: '',
    plusOneEmail: '',
    plusOnePhone: '',
    hasPlusOne: false,
    notes: ''
  });

  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  const handleInputChange = (field: keyof GuestFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddDietaryRestriction = (restriction: string) => {
    if (restriction && !formData.dietaryRestrictions.includes(restriction)) {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction]
      }));
    }
    setNewDietaryRestriction('');
  };

  const handleRemoveDietaryRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Guest name is required';
    }
    
    if (!formData.relationship) {
      return 'Relationship is required';
    }

    if (formData.email && !formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }

    if (formData.hasPlusOne && !formData.plusOneName.trim()) {
      return 'Plus one name is required when adding a plus one';
    }

    if (formData.hasPlusOne && formData.plusOneEmail && !formData.plusOneEmail.includes('@')) {
      return 'Please enter a valid plus one email address';
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
        title: 'Guest Added',
        description: `${formData.name} has been successfully added to your guest list`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: 'Error',
        description: 'Failed to add guest. Please try again.',
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
        email: '',
        phone: '',
        relationship: '',
        side: 'BRIDE',
        inviteGroup: '',
        dietaryRestrictions: [],
        plusOneName: '',
        plusOneEmail: '',
        plusOnePhone: '',
        hasPlusOne: false,
        notes: ''
      });
      setActiveTab(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Guest</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>Basic Info</Tab>
              <Tab>Plus One</Tab>
              <Tab>Preferences</Tab>
            </TabList>

            <TabPanels>
              {/* Basic Information Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        placeholder="Enter guest's full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Relationship</FormLabel>
                      <Select
                        placeholder="Select relationship"
                        value={formData.relationship}
                        onChange={(e) => handleInputChange('relationship', e.target.value)}
                      >
                        {RELATIONSHIP_OPTIONS.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl>
                      <FormLabel>Email Address</FormLabel>
                      <Input
                        type="email"
                        placeholder="guest@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
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
                    <FormControl isRequired>
                      <FormLabel>Side</FormLabel>
                      <Select
                        value={formData.side}
                        onChange={(e) => handleInputChange('side', e.target.value)}
                      >
                        <option value="BRIDE">Bride's Side</option>
                        <option value="GROOM">Groom's Side</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Invite Group</FormLabel>
                      <Input
                        placeholder="e.g., College Friends, Work Team"
                        value={formData.inviteGroup}
                        onChange={(e) => handleInputChange('inviteGroup', e.target.value)}
                      />
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Input
                      placeholder="Any special notes about this guest"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>

              {/* Plus One Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <Checkbox
                      isChecked={formData.hasPlusOne}
                      onChange={(e) => handleInputChange('hasPlusOne', e.target.checked)}
                    >
                      <Text fontWeight="semibold">This guest will bring a plus one</Text>
                    </Checkbox>
                  </FormControl>

                  {formData.hasPlusOne && (
                    <>
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="sm">
                          Fill in the plus one details if known, or leave blank if they haven't been specified yet.
                        </Text>
                      </Alert>

                      <Card variant="outline">
                        <CardHeader>
                          <Text fontWeight="bold">Plus One Information</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <FormControl>
                              <FormLabel>Plus One Name</FormLabel>
                              <Input
                                placeholder="Enter plus one's name"
                                value={formData.plusOneName}
                                onChange={(e) => handleInputChange('plusOneName', e.target.value)}
                              />
                            </FormControl>

                            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                              <FormControl>
                                <FormLabel>Plus One Email</FormLabel>
                                <Input
                                  type="email"
                                  placeholder="plusone@example.com"
                                  value={formData.plusOneEmail}
                                  onChange={(e) => handleInputChange('plusOneEmail', e.target.value)}
                                />
                              </FormControl>

                              <FormControl>
                                <FormLabel>Plus One Phone</FormLabel>
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  value={formData.plusOnePhone}
                                  onChange={(e) => handleInputChange('plusOnePhone', e.target.value)}
                                />
                              </FormControl>
                            </Grid>
                          </VStack>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </VStack>
              </TabPanel>

              {/* Preferences Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <FormControl>
                    <FormLabel>Dietary Restrictions</FormLabel>
                    <VStack spacing={3} align="stretch">
                      {/* Quick Add Buttons */}
                      <Text fontSize="sm" color="gray.600">Quick add common restrictions:</Text>
                      <Wrap spacing={2}>
                        {DIETARY_RESTRICTIONS.filter(restriction => 
                          !formData.dietaryRestrictions.includes(restriction)
                        ).map(restriction => (
                          <Button
                            key={restriction}
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddDietaryRestriction(restriction)}
                          >
                            + {restriction}
                          </Button>
                        ))}
                      </Wrap>

                      {/* Custom restriction input */}
                      <HStack>
                        <Input
                          placeholder="Add custom dietary restriction"
                          value={newDietaryRestriction}
                          onChange={(e) => setNewDietaryRestriction(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddDietaryRestriction(newDietaryRestriction);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleAddDietaryRestriction(newDietaryRestriction)}
                          isDisabled={!newDietaryRestriction.trim()}
                        >
                          Add
                        </Button>
                      </HStack>

                      {/* Selected restrictions */}
                      {formData.dietaryRestrictions.length > 0 && (
                        <>
                          <Divider />
                          <Text fontSize="sm" fontWeight="semibold">Selected restrictions:</Text>
                          <Wrap spacing={2}>
                            {formData.dietaryRestrictions.map(restriction => (
                              <Tag key={restriction} size="md" colorScheme="purple" variant="solid">
                                <TagLabel>{restriction}</TagLabel>
                                <TagCloseButton 
                                  onClick={() => handleRemoveDietaryRestriction(restriction)}
                                />
                              </Tag>
                            ))}
                          </Wrap>
                        </>
                      )}
                    </VStack>
                  </FormControl>
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
            Add Guest
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
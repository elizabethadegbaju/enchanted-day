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
  Switch,
  useToast,
} from '@chakra-ui/react';

interface VendorData {
  id: string;
  name: string;
  category: { primary: string; secondary?: string };
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
    website?: string;
    preferredContactMethod: 'email' | 'phone';
  };
  status: 'pending' | 'confirmed' | 'completed' | 'issue';
}

interface EditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorData;
  onSave: (updatedVendor: VendorData) => Promise<void>;
}

export function EditVendorModal({ isOpen, onClose, vendor, onSave }: EditVendorModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VendorData>({ ...vendor });

  const vendorCategories = [
    'Photography',
    'Videography',
    'Catering',
    'Venue',
    'Florist',
    'Music/DJ',
    'Transportation',
    'Wedding Planner',
    'Makeup Artist',
    'Hair Stylist',
    'Officiant',
    'Decorator',
    'Baker',
    'Other'
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'issue', label: 'Issue' },
  ];

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a vendor name',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!formData.contactInfo.email.trim() && !formData.contactInfo.phone.trim()) {
      toast({
        title: 'Contact Required',
        description: 'Please provide at least an email or phone number',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      toast({
        title: 'Vendor Updated',
        description: `${formData.name} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Vendor: {vendor.name}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Basic Info */}
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Vendor Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            {/* Categories */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Primary Category</FormLabel>
                <Select
                  value={formData.category.primary}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    category: { ...formData.category, primary: e.target.value }
                  })}
                >
                  {vendorCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Secondary Category (Optional)</FormLabel>
                <Input
                  value={formData.category.secondary || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    category: { ...formData.category, secondary: e.target.value }
                  })}
                  placeholder="e.g., Wedding Photography"
                />
              </FormControl>
            </HStack>

            {/* Contact Info */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contactInfo: { ...formData.contactInfo, email: e.target.value }
                  })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.contactInfo.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contactInfo: { ...formData.contactInfo, phone: e.target.value }
                  })}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={formData.contactInfo.address || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, address: e.target.value }
                })}
                placeholder="Business address"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                value={formData.contactInfo.website || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { ...formData.contactInfo, website: e.target.value }
                })}
                placeholder="https://vendor-website.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Preferred Contact Method</FormLabel>
              <Select
                value={formData.contactInfo.preferredContactMethod}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  contactInfo: { 
                    ...formData.contactInfo, 
                    preferredContactMethod: e.target.value as 'email' | 'phone'
                  }
                })}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            colorScheme="purple" 
            onClick={handleSave}
            isLoading={loading}
            loadingText="Saving..."
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditVendorModal;
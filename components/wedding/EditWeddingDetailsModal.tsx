'use client';

import React, { useState, useEffect } from 'react';
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
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  useToast,
} from '@chakra-ui/react';

interface WeddingDetailsData {
  coupleNames: string[];
  weddingType: 'SINGLE_EVENT' | 'MULTI_PHASE';
  status: 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

interface EditWeddingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wedding: {
    id: string;
    coupleNames: string[];
    weddingType: string;
    status: string;
    notes?: string;
  };
  onSave: (updatedData: WeddingDetailsData) => Promise<void>;
}

export function EditWeddingDetailsModal({ isOpen, onClose, wedding, onSave }: EditWeddingDetailsModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<WeddingDetailsData>({
    coupleNames: [],
    weddingType: 'SINGLE_EVENT',
    status: 'PLANNING',
    notes: ''
  });

  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (wedding) {
      setFormData({
        coupleNames: wedding.coupleNames || [],
        weddingType: (wedding.weddingType as WeddingDetailsData['weddingType']) || 'SINGLE_EVENT',
        status: (wedding.status as WeddingDetailsData['status']) || 'PLANNING',
        notes: wedding.notes || ''
      });
    }
  }, [wedding]);

  const handleInputChange = (field: keyof WeddingDetailsData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCoupleName = () => {
    if (newName.trim() && !formData.coupleNames.includes(newName.trim())) {
      handleInputChange('coupleNames', [...formData.coupleNames, newName.trim()]);
      setNewName('');
    }
  };

  const removeCoupleName = (name: string) => {
    handleInputChange('coupleNames', formData.coupleNames.filter(n => n !== name));
  };

  const handleSubmit = async () => {
    if (formData.coupleNames.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please add at least one name for the couple',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.coupleNames.length > 2) {
      toast({
        title: 'Too Many Names',
        description: 'Please add no more than 2 names for the couple',
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
        title: 'Wedding Updated',
        description: 'Wedding details have been successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating wedding:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wedding details. Please try again.',
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
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Wedding Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Couple Names</FormLabel>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter name"
                    onKeyPress={(e) => e.key === 'Enter' && addCoupleName()}
                  />
                  <Button onClick={addCoupleName} variant="outline" size="md">
                    Add
                  </Button>
                </HStack>
                {formData.coupleNames.length > 0 && (
                  <Wrap>
                    {formData.coupleNames.map((name) => (
                      <Tag key={name} size="lg" colorScheme="purple" variant="solid">
                        <TagLabel>{name}</TagLabel>
                        <TagCloseButton onClick={() => removeCoupleName(name)} />
                      </Tag>
                    ))}
                  </Wrap>
                )}
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel>Wedding Type</FormLabel>
              <Select
                value={formData.weddingType}
                onChange={(e) => handleInputChange('weddingType', e.target.value as WeddingDetailsData['weddingType'])}
              >
                <option value="SINGLE_EVENT">Single Event</option>
                <option value="MULTI_PHASE">Multi-Phase Celebration</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as WeddingDetailsData['status'])}
              >
                <option value="PLANNING">Planning</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Notes (Optional)</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional details about your wedding"
                rows={4}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSubmit} isLoading={loading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
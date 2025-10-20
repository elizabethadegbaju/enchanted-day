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
  Switch,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  useToast,
} from '@chakra-ui/react';

interface GuestData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: 'pending' | 'attending' | 'declined';
  relationship: string;
  side: 'bride' | 'groom';
  inviteGroup?: string;
  tableAssignment?: string;
  dietaryRestrictions: string[];
  accommodationNeeds: string[];
  notes?: string;
}

interface EditGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: GuestData;
  onSave: (updatedGuest: GuestData) => Promise<void>;
}

export function EditGuestModal({ isOpen, onClose, guest, onSave }: EditGuestModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GuestData>({ ...guest });
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');
  const [newAccommodationNeed, setNewAccommodationNeed] = useState('');

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      toast({
        title: 'Guest Updated',
        description: `${formData.name} has been updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: 'Error',
        description: 'Failed to update guest. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const addDietaryRestriction = () => {
    if (newDietaryRestriction.trim()) {
      setFormData({
        ...formData,
        dietaryRestrictions: [...formData.dietaryRestrictions, newDietaryRestriction.trim()]
      });
      setNewDietaryRestriction('');
    }
  };

  const removeDietaryRestriction = (index: number) => {
    setFormData({
      ...formData,
      dietaryRestrictions: formData.dietaryRestrictions.filter((_, i) => i !== index)
    });
  };

  const addAccommodationNeed = () => {
    if (newAccommodationNeed.trim()) {
      setFormData({
        ...formData,
        accommodationNeeds: [...formData.accommodationNeeds, newAccommodationNeed.trim()]
      });
      setNewAccommodationNeed('');
    }
  };

  const removeAccommodationNeed = (index: number) => {
    setFormData({
      ...formData,
      accommodationNeeds: formData.accommodationNeeds.filter((_, i) => i !== index)
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Guest: {guest.name}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Basic Info */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Relationship</FormLabel>
                <Input
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </FormControl>
            </HStack>

            {/* RSVP and Assignment */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>RSVP Status</FormLabel>
                <Select
                  value={formData.rsvpStatus}
                  onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value as any })}
                >
                  <option value="pending">Pending</option>
                  <option value="attending">Attending</option>
                  <option value="declined">Declined</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Side</FormLabel>
                <Select
                  value={formData.side}
                  onChange={(e) => setFormData({ ...formData, side: e.target.value as any })}
                >
                  <option value="bride">Bride</option>
                  <option value="groom">Groom</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Invite Group</FormLabel>
                <Input
                  value={formData.inviteGroup || ''}
                  onChange={(e) => setFormData({ ...formData, inviteGroup: e.target.value })}
                  placeholder="e.g., College Friends"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Table Assignment</FormLabel>
                <Input
                  value={formData.tableAssignment || ''}
                  onChange={(e) => setFormData({ ...formData, tableAssignment: e.target.value })}
                  placeholder="e.g., Table 5"
                />
              </FormControl>
            </HStack>

            {/* Dietary Restrictions */}
            <FormControl>
              <FormLabel>Dietary Restrictions</FormLabel>
              <HStack>
                <Input
                  value={newDietaryRestriction}
                  onChange={(e) => setNewDietaryRestriction(e.target.value)}
                  placeholder="Add dietary restriction"
                  onKeyPress={(e) => e.key === 'Enter' && addDietaryRestriction()}
                />
                <Button onClick={addDietaryRestriction} size="sm">Add</Button>
              </HStack>
              <Wrap mt={2}>
                {formData.dietaryRestrictions.map((restriction, index) => (
                  <Tag key={index} colorScheme="blue" variant="subtle">
                    <TagLabel>{restriction}</TagLabel>
                    <TagCloseButton onClick={() => removeDietaryRestriction(index)} />
                  </Tag>
                ))}
              </Wrap>
            </FormControl>

            {/* Accommodation Needs */}
            <FormControl>
              <FormLabel>Accommodation Needs</FormLabel>
              <HStack>
                <Input
                  value={newAccommodationNeed}
                  onChange={(e) => setNewAccommodationNeed(e.target.value)}
                  placeholder="Add accommodation need"
                  onKeyPress={(e) => e.key === 'Enter' && addAccommodationNeed()}
                />
                <Button onClick={addAccommodationNeed} size="sm">Add</Button>
              </HStack>
              <Wrap mt={2}>
                {formData.accommodationNeeds.map((need, index) => (
                  <Tag key={index} colorScheme="purple" variant="subtle">
                    <TagLabel>{need}</TagLabel>
                    <TagCloseButton onClick={() => removeAccommodationNeed(index)} />
                  </Tag>
                ))}
              </Wrap>
            </FormControl>

            {/* Notes */}
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this guest..."
                rows={3}
              />
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

export default EditGuestModal;
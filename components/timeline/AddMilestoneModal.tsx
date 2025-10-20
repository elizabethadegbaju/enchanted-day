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

interface MilestoneData {
  name: string;
  targetDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  phaseId?: string;
  responsibleParties: string[];
  description?: string;
}

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestoneData: MilestoneData) => Promise<void>;
  phases?: Array<{id: string; name: string}>;
}

export function AddMilestoneModal({ isOpen, onClose, onSave, phases = [] }: AddMilestoneModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<MilestoneData>({
    name: '',
    targetDate: '',
    priority: 'MEDIUM',
    phaseId: '',
    responsibleParties: [],
    description: ''
  });

  const [newResponsibleParty, setNewResponsibleParty] = useState('');

  const handleInputChange = (field: keyof MilestoneData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addResponsibleParty = () => {
    if (newResponsibleParty.trim() && !formData.responsibleParties.includes(newResponsibleParty.trim())) {
      handleInputChange('responsibleParties', [...formData.responsibleParties, newResponsibleParty.trim()]);
      setNewResponsibleParty('');
    }
  };

  const removeResponsibleParty = (party: string) => {
    handleInputChange('responsibleParties', formData.responsibleParties.filter(p => p !== party));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.targetDate) {
      toast({
        title: 'Missing Information',
        description: 'Please provide milestone name and target date',
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
        title: 'Milestone Created',
        description: 'The milestone has been successfully added to your timeline',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        name: '',
        targetDate: '',
        priority: 'MEDIUM',
        phaseId: '',
        responsibleParties: [],
        description: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to create milestone. Please try again.',
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
        targetDate: '',
        priority: 'MEDIUM',
        phaseId: '',
        responsibleParties: [],
        description: ''
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Milestone</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Milestone Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Venue Booking Confirmed"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Target Date</FormLabel>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as MilestoneData['priority'])}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
            </FormControl>

            {phases.length > 0 && (
              <FormControl>
                <FormLabel>Wedding Phase (Optional)</FormLabel>
                <Select
                  value={formData.phaseId}
                  onChange={(e) => handleInputChange('phaseId', e.target.value)}
                >
                  <option value="">Select phase (optional)</option>
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Responsible Parties</FormLabel>
              <VStack align="stretch" spacing={2}>
                <Input
                  value={newResponsibleParty}
                  onChange={(e) => setNewResponsibleParty(e.target.value)}
                  placeholder="Enter person's name"
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibleParty()}
                />
                <Button size="sm" onClick={addResponsibleParty} variant="outline">
                  Add Person
                </Button>
                {formData.responsibleParties.length > 0 && (
                  <Wrap>
                    {formData.responsibleParties.map((party) => (
                      <Tag key={party} size="md" colorScheme="purple" variant="solid">
                        <TagLabel>{party}</TagLabel>
                        <TagCloseButton onClick={() => removeResponsibleParty(party)} />
                      </Tag>
                    ))}
                  </Wrap>
                )}
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel>Description (Optional)</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add any additional details about this milestone"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSubmit} isLoading={loading}>
            Create Milestone
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
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
  Select,
  Textarea,
  Switch,
  Text,
  useToast,
  Badge,
} from '@chakra-ui/react';

interface AttendanceStatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  phaseName: string;
  currentStatus: string;
  onUpdate: (newStatus: string, notes?: string) => Promise<void>;
}

export function AttendanceStatusUpdateModal({
  isOpen,
  onClose,
  guestName,
  phaseName,
  currentStatus,
  onUpdate,
}: AttendanceStatusUpdateModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'gray' },
    { value: 'attending', label: 'Attending', color: 'green' },
    { value: 'not-attending', label: 'Not Attending', color: 'red' },
    { value: 'maybe', label: 'Maybe', color: 'orange' },
  ];

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onUpdate(newStatus, notes.trim() || undefined);
      
      toast({
        title: 'Status Updated',
        description: `${guestName}'s attendance status for ${phaseName} has been updated`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      setNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attendance status. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);
  const newStatusOption = statusOptions.find(option => option.value === newStatus);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Attendance Status</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold">Guest: {guestName}</Text>
              <Text color="gray.600">Event: {phaseName}</Text>
              <HStack>
                <Text fontSize="sm">Current Status:</Text>
                <Badge colorScheme={currentStatusOption?.color}>
                  {currentStatusOption?.label}
                </Badge>
              </HStack>
            </VStack>

            <FormControl>
              <FormLabel>New Status</FormLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {newStatus !== currentStatus && (
                <HStack mt={2}>
                  <Text fontSize="sm">New Status:</Text>
                  <Badge colorScheme={newStatusOption?.color}>
                    {newStatusOption?.label}
                  </Badge>
                </HStack>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Notes (Optional)</FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this status change..."
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
            onClick={handleUpdate}
            isLoading={loading}
            loadingText="Updating..."
            disabled={newStatus === currentStatus}
          >
            Update Status
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AttendanceStatusUpdateModal;
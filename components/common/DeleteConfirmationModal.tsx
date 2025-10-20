'use client';

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue
} from '@chakra-ui/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  itemName: string;
  itemType: string;
  warningMessage?: string;
  customWarning?: React.ReactNode;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  itemName,
  itemType,
  warningMessage,
  customWarning
}: DeleteConfirmationModalProps) {
  const alertBg = useColorModeValue('red.50', 'red.900');
  const alertBorder = useColorModeValue('red.200', 'red.700');

  const handleConfirm = () => {
    onConfirm();
  };

  const defaultWarning = `This will permanently delete "${itemName}" and all associated data. This action cannot be undone.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="red.600">{title}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="warning" bg={alertBg} border="1px" borderColor={alertBorder}>
              <AlertIcon />
              <AlertDescription>
                {customWarning || (
                  <Text>
                    {warningMessage || defaultWarning}
                  </Text>
                )}
              </AlertDescription>
            </Alert>
            
            <Text>
              Are you sure you want to delete <strong>{itemName}</strong>?
            </Text>
            
            <Text fontSize="sm" color="gray.600">
              Type of item: {itemType}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            colorScheme="red" 
            onClick={handleConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteConfirmationModal;
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
  useToast,
} from '@chakra-ui/react';

interface ExpenseData {
  description: string;
  amount: number;
  categoryId: string;
  vendorName?: string;
  date: string;
  notes?: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: ExpenseData) => Promise<void>;
  categories: Array<{id: string; name: string}>;
}

export function AddExpenseModal({ isOpen, onClose, onSave, categories = [] }: AddExpenseModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ExpenseData>({
    description: '',
    amount: 0,
    categoryId: '',
    vendorName: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleInputChange = (field: keyof ExpenseData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.description.trim() || !formData.amount || !formData.categoryId) {
      toast({
        title: 'Missing Information',
        description: 'Please provide description, amount, and category',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (formData.amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a positive amount',
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
        title: 'Expense Added',
        description: 'The expense has been successfully added to your budget',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        description: '',
        amount: 0,
        categoryId: '',
        vendorName: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
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
        description: '',
        amount: 0,
        categoryId: '',
        vendorName: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Expense</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="e.g., Photography deposit payment"
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl isRequired flex={1}>
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  value={formData.amount}
                  onChange={(value) => handleInputChange('amount', parseFloat(value) || 0)}
                  min={0}
                  precision={2}
                >
                  <NumberInputField placeholder="0.00" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired flex={1}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </FormControl>
            </HStack>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                placeholder="Select a category"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Vendor/Supplier (Optional)</FormLabel>
              <Input
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                placeholder="e.g., Johnson Photography"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes (Optional)</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional details about this expense"
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
            Add Expense
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
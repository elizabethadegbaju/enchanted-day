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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Box,
  Progress,
  useToast,
} from '@chakra-ui/react';

interface BudgetCategory {
  name: string;
  allocated: number;
  percentage: number;
}

interface BudgetSetupData {
  totalBudget: number;
  currency: string;
  categories: BudgetCategory[];
}

interface BudgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgetData: BudgetSetupData) => Promise<void>;
}

const DEFAULT_CATEGORIES = [
  { name: 'Venue', percentage: 40 },
  { name: 'Catering', percentage: 25 },
  { name: 'Photography/Videography', percentage: 10 },
  { name: 'Attire', percentage: 8 },
  { name: 'Flowers/Decorations', percentage: 8 },
  { name: 'Music/Entertainment', percentage: 5 },
  { name: 'Transportation', percentage: 2 },
  { name: 'Miscellaneous', percentage: 2 }
];

export function BudgetSetupModal({ isOpen, onClose, onSave }: BudgetSetupModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<BudgetSetupData>({
    totalBudget: 0,
    currency: 'USD',
    categories: DEFAULT_CATEGORIES.map(cat => ({
      name: cat.name,
      allocated: 0,
      percentage: cat.percentage
    }))
  });

  const handleTotalBudgetChange = (value: number) => {
    const newCategories = formData.categories.map(cat => ({
      ...cat,
      allocated: Math.round((value * cat.percentage) / 100)
    }));
    
    setFormData(prev => ({
      ...prev,
      totalBudget: value,
      categories: newCategories
    }));
  };

  const handleCategoryAllocationChange = (index: number, value: number) => {
    const newCategories = [...formData.categories];
    newCategories[index].allocated = value;
    newCategories[index].percentage = formData.totalBudget > 0 ? 
      Math.round((value / formData.totalBudget) * 100) : 0;
    
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
  };

  const getTotalAllocated = () => {
    return formData.categories.reduce((sum, cat) => sum + cat.allocated, 0);
  };

  const getRemainingBudget = () => {
    return formData.totalBudget - getTotalAllocated();
  };

  const handleSubmit = async () => {
    if (formData.totalBudget <= 0) {
      toast({
        title: 'Invalid Budget',
        description: 'Please enter a total budget amount',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const totalAllocated = getTotalAllocated();
    if (Math.abs(totalAllocated - formData.totalBudget) > 1) {
      toast({
        title: 'Budget Mismatch',
        description: 'The allocated amounts should equal your total budget',
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
        title: 'Budget Setup Complete',
        description: 'Your wedding budget has been successfully configured',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Error setting up budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to setup budget. Please try again.',
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
      setStep(1);
      setFormData({
        totalBudget: 0,
        currency: 'USD',
        categories: DEFAULT_CATEGORIES.map(cat => ({
          name: cat.name,
          allocated: 0,
          percentage: cat.percentage
        }))
      });
      onClose();
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.totalBudget <= 0) {
      toast({
        title: 'Missing Total Budget',
        description: 'Please enter your total budget amount',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setStep(2);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" closeOnOverlayClick={!loading}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Budget Setup - Step {step} of 2
          <Progress value={(step / 2) * 100} size="sm" mt={2} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 ? (
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  What's your total wedding budget?
                </Text>
                <Text color="gray.600" mb={4}>
                  This will help us create recommended budget categories for your wedding expenses.
                </Text>
              </Box>
              
              <HStack spacing={4}>
                <FormControl flex={2}>
                  <FormLabel>Total Budget</FormLabel>
                  <NumberInput
                    value={formData.totalBudget}
                    onChange={(value) => handleTotalBudgetChange(parseFloat(value) || 0)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField placeholder="50000.00" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  Budget Category Allocation
                </Text>
                <Text color="gray.600" mb={4}>
                  Adjust the amounts for each category based on your priorities.
                </Text>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="semibold">
                    Total Allocated: ${getTotalAllocated().toLocaleString()}
                  </Text>
                  <Text 
                    fontWeight="semibold"
                    color={getRemainingBudget() === 0 ? 'green.500' : 
                           getRemainingBudget() > 0 ? 'blue.500' : 'red.500'}
                  >
                    Remaining: ${getRemainingBudget().toLocaleString()}
                  </Text>
                </HStack>
              </Box>

              <VStack spacing={3} align="stretch">
                {formData.categories.map((category, index) => (
                  <HStack key={category.name} spacing={4}>
                    <Text minW="150px" fontSize="sm" fontWeight="medium">
                      {category.name}
                    </Text>
                    <NumberInput
                      value={category.allocated}
                      onChange={(value) => handleCategoryAllocationChange(index, parseFloat(value) || 0)}
                      min={0}
                      max={formData.totalBudget}
                      size="sm"
                      flex={1}
                    >
                      <NumberInputField />
                    </NumberInput>
                    <Text minW="40px" fontSize="sm" color="gray.500">
                      {category.percentage}%
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {step === 2 && (
            <Button variant="ghost" mr={3} onClick={() => setStep(1)} isDisabled={loading}>
              Back
            </Button>
          )}
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button colorScheme="purple" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button colorScheme="purple" onClick={handleSubmit} isLoading={loading}>
              Setup Budget
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
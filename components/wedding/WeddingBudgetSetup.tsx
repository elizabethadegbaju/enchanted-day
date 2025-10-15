'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  Button,
  IconButton,
  Progress,
  Badge,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Plus, Trash2, DollarSign } from 'lucide-react'
import type { BudgetInfo, BudgetCategory } from '@/types'

interface WeddingBudgetSetupProps {
  budget: Partial<BudgetInfo>
  onUpdate: (budget: Partial<BudgetInfo>) => void
}

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
]

const DEFAULT_CATEGORIES = [
  { name: 'Venue', percentage: 40 },
  { name: 'Catering', percentage: 25 },
  { name: 'Photography/Videography', percentage: 10 },
  { name: 'Music/Entertainment', percentage: 8 },
  { name: 'Flowers/Decorations', percentage: 8 },
  { name: 'Attire', percentage: 5 },
  { name: 'Transportation', percentage: 2 },
  { name: 'Miscellaneous', percentage: 2 },
]

export const WeddingBudgetSetup: React.FC<WeddingBudgetSetupProps> = ({
  budget,
  onUpdate,
}) => {
  const toast = useToast()
  const [useDefaultCategories, setUseDefaultCategories] = useState(true)

  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === budget.currency) || CURRENCY_OPTIONS[0]

  const updateBudget = (updates: Partial<BudgetInfo>) => {
    onUpdate({ ...budget, ...updates })
  }

  const updateCategory = (index: number, updates: Partial<BudgetCategory>) => {
    const categories = [...(budget.categories || [])]
    categories[index] = { ...categories[index], ...updates }
    updateBudget({ categories })
  }

  const addCategory = () => {
    const categories = budget.categories || []
    if (categories.length >= 15) {
      toast({
        title: 'Maximum reached',
        description: 'You can have up to 15 budget categories.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const newCategory: BudgetCategory = {
      name: '',
      allocated: 0,
      spent: 0,
    }
    updateBudget({ categories: [...categories, newCategory] })
  }

  const removeCategory = (index: number) => {
    const categories = budget.categories || []
    if (categories.length > 1) {
      updateBudget({ categories: categories.filter((_, i) => i !== index) })
    }
  }

  const applyDefaultCategories = () => {
    const total = budget.total || 0
    const categories: BudgetCategory[] = DEFAULT_CATEGORIES.map(cat => ({
      name: cat.name,
      allocated: Math.round((total * cat.percentage) / 100),
      spent: 0,
    }))
    
    updateBudget({ 
      categories,
      allocated: total,
    })
    setUseDefaultCategories(false)
  }

  const totalAllocated = (budget.categories || []).reduce((sum, cat) => sum + (cat.allocated || 0), 0)
  // const totalSpent = (budget.categories || []).reduce((sum, cat) => sum + (cat.spent || 0), 0)
  const allocationPercentage = budget.total ? (totalAllocated / budget.total) * 100 : 0

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          Set your wedding budget
        </Text>
        <Text color="neutral.600">
          Define your overall budget and how you&apos;d like to allocate it across different categories
        </Text>
      </VStack>

      {/* Overall Budget */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack spacing={2}>
              <DollarSign size={16} color="var(--chakra-colors-brand-500)" />
              <Text fontSize="lg" fontWeight="semibold">Overall Budget</Text>
            </HStack>
            
            <HStack spacing={4}>
              <FormControl flex={2}>
                <FormLabel fontSize="sm">Total Budget</FormLabel>
                <NumberInput
                  min={0}
                  value={budget.total || 0}
                  onChange={(_, value) => updateBudget({ total: value || 0 })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl flex={1}>
                <FormLabel fontSize="sm">Currency</FormLabel>
                <Select
                  value={budget.currency || 'USD'}
                  onChange={(e) => updateBudget({ currency: e.target.value })}
                >
                  {CURRENCY_OPTIONS.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>

            {/* Budget Summary */}
            {budget.total && budget.total > 0 && (
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="neutral.600">Budget Allocation</Text>
                  <Text fontSize="sm" color="neutral.600">
                    {selectedCurrency.symbol}{totalAllocated.toLocaleString()} / {selectedCurrency.symbol}{budget.total.toLocaleString()}
                  </Text>
                </HStack>
                <Progress
                  value={allocationPercentage}
                  colorScheme={allocationPercentage > 100 ? 'red' : 'brand'}
                  size="sm"
                  borderRadius="full"
                />
                {allocationPercentage > 100 && (
                  <Text fontSize="xs" color="red.500">
                    ⚠️ You&apos;ve allocated more than your total budget
                  </Text>
                )}
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Budget Categories */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">Budget Categories</Text>
              {useDefaultCategories && budget.total && budget.total > 0 && (
                <Button
                  size="sm"
                  colorScheme="brand"
                  onClick={applyDefaultCategories}
                >
                  Use Recommended Categories
                </Button>
              )}
            </HStack>

            {(!budget.categories || budget.categories.length === 0) && useDefaultCategories && (
              <Card bg="accent.50" borderColor="accent.200">
                <CardBody>
                  <VStack spacing={3} align="start">
                    <Text fontSize="sm" fontWeight="semibold" color="accent.800">
                      Recommended Budget Breakdown:
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <HStack key={cat.name} justify="space-between">
                          <Text fontSize="sm">{cat.name}</Text>
                          <Badge colorScheme="accent" size="sm">
                            {cat.percentage}%
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                    <Text fontSize="xs" color="accent.700">
                      These are typical allocations. You can customize them after applying.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {budget.categories && budget.categories.length > 0 && (
              <VStack spacing={4} align="stretch">
                {budget.categories.map((category, index) => (
                  <Card key={index} variant="outline">
                    <CardBody p={4}>
                      <VStack spacing={4} align="stretch">
                        <HStack justify="space-between">
                          <FormControl flex={2}>
                            <FormLabel fontSize="sm">Category Name</FormLabel>
                            <Input
                              placeholder="e.g., Venue, Catering"
                              value={category.name}
                              onChange={(e) => updateCategory(index, { name: e.target.value })}
                            />
                          </FormControl>
                          
                          {budget.categories!.length > 1 && (
                            <IconButton
                              aria-label="Remove category"
                              icon={<Trash2 size={16} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => removeCategory(index)}
                              mt={6}
                            />
                          )}
                        </HStack>
                        
                        <HStack spacing={4}>
                          <FormControl>
                            <FormLabel fontSize="sm">Allocated ({selectedCurrency.symbol})</FormLabel>
                            <NumberInput
                              min={0}
                              value={category.allocated}
                              onChange={(_, value) => updateCategory(index, { allocated: value || 0 })}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel fontSize="sm">Spent ({selectedCurrency.symbol})</FormLabel>
                            <NumberInput
                              min={0}
                              max={category.allocated}
                              value={category.spent}
                              onChange={(_, value) => updateCategory(index, { spent: value || 0 })}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          
                          <VStack spacing={1} minW="80px">
                            <Text fontSize="xs" color="neutral.600">Remaining</Text>
                            <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                              {selectedCurrency.symbol}{(category.allocated - category.spent).toLocaleString()}
                            </Text>
                          </VStack>
                        </HStack>
                        
                        {category.allocated > 0 && (
                          <Progress
                            value={(category.spent / category.allocated) * 100}
                            colorScheme={category.spent > category.allocated ? 'red' : 'brand'}
                            size="sm"
                            borderRadius="full"
                          />
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}

            <Button
              leftIcon={<Plus size={16} />}
              variant="outline"
              onClick={addCategory}
              alignSelf="start"
              isDisabled={(budget.categories?.length || 0) >= 15}
            >
              Add Category
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Flex,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AddExpenseModal } from '@/components/budget/AddExpenseModal'
import { BudgetSetupModal } from '@/components/budget/BudgetSetupModal'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  AlertTriangle
} from 'lucide-react'
import { getBudgetData, setupWeddingBudget, addBudgetExpense, type BudgetData } from '@/lib/wedding-data-service'
import { calculateBudgetUsage, formatDateForDisplay } from '@/lib/data-utils'

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const toast = useToast()

  // Modal states
  const { isOpen: isExpenseOpen, onOpen: onExpenseOpen, onClose: onExpenseClose } = useDisclosure()
  const { isOpen: isSetupOpen, onOpen: onSetupOpen, onClose: onSetupClose } = useDisclosure()

  useEffect(() => {
    loadBudgetData()
  }, [])

  const loadBudgetData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // getCurrentUser() is called inside getBudgetData()
      const data = await getBudgetData()
      setBudgetData(data)
    } catch (err) {
      console.error('Error loading budget data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load budget data')
      setBudgetData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    const currency = budgetData?.overallBudget.currency || 'USD'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount))
  }

  const getCategoryStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'green'
      case 'UNDER_BUDGET': return 'blue'
      case 'OVER_BUDGET': return 'red'
      case 'AT_RISK': return 'orange'
      default: return 'gray'
    }
  }

  const getCategoryStatusIcon = (status: string) => {
    switch (status) {
      case 'UNDER_BUDGET': return <TrendingDown size={16} />
      case 'OVER_BUDGET': return <TrendingUp size={16} />
      case 'AT_RISK': return <AlertTriangle size={16} />
      default: return null
    }
  }

  // Handler functions for buttons
  const handleExportBudget = () => {
    toast({
      title: 'Export Budget',
      description: 'Budget export feature will be implemented - PDF/Excel export functionality',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleAddExpense = () => {
    onExpenseOpen()
  }

  const handleSetupBudget = () => {
    onSetupOpen()
  }

  const handleViewAllTransactions = () => {
    toast({
      title: 'View All Transactions',
      description: 'Navigate to detailed transactions page - will be implemented',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  // Save handlers
  const handleSaveBudgetSetup = async (budgetSetupData: any) => {
    await setupWeddingBudget(budgetSetupData)
    await loadBudgetData() // Refresh data
  }

  const handleSaveExpense = async (expenseData: any) => {
    await addBudgetExpense(expenseData)
    await loadBudgetData() // Refresh data
  }

  // Helper to get categories for expense modal
  const getCategories = () => {
    if (!budgetData?.categories) return []
    return budgetData.categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <VStack spacing={4} py={8}>
          <Spinner size="xl" color="purple.500" />
          <Text>Loading budget data...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (error && !budgetData) {
    const isNoWeddingsError = error.includes('No weddings found')
    
    return (
      <DashboardLayout>
        <VStack spacing={6} align="center" py={12}>
          <Alert status={isNoWeddingsError ? "info" : "error"} maxW="md">
            <AlertIcon />
            <VStack spacing={2} align="start">
              <AlertTitle>
                {isNoWeddingsError ? "No Wedding Found" : "Unable to load budget!"}
              </AlertTitle>
              <AlertDescription>
                {isNoWeddingsError 
                  ? "Please create a wedding first to manage your budget."
                  : error
                }
              </AlertDescription>
            </VStack>
          </Alert>
          
          {isNoWeddingsError ? (
            <Button 
              as="a" 
              href="/wedding/create" 
              colorScheme="brand" 
              size="lg"
              leftIcon={<Plus />}
            >
              Create Your Wedding
            </Button>
          ) : (
            <Button onClick={loadBudgetData} colorScheme="brand">
              Retry
            </Button>
          )}
        </VStack>
      </DashboardLayout>
    )
  }

  if (!budgetData) {
    return (
      <DashboardLayout>
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4} py={8}>
              <DollarSign size={48} color="gray" />
              <Text fontSize="lg" color="gray.500">No budget data available</Text>
              <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleSetupBudget}>
                Set Up Your Budget
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </DashboardLayout>
    )
  }

  const budgetUsage = calculateBudgetUsage(budgetData.overallBudget)

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">Wedding Budget</Text>
          <HStack spacing={2}>
            <Button leftIcon={<Download size={16} />} variant="outline" onClick={handleExportBudget}>
              Export
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={handleAddExpense}>
              Add Expense
            </Button>
          </HStack>
        </Flex>

        {/* Budget Overview */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Budget</StatLabel>
                <StatNumber color="purple.500">
                  {formatCurrency(budgetData.overallBudget.total)}
                </StatNumber>
                <StatHelpText>Set budget amount</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Spent</StatLabel>
                <StatNumber color="red.500">
                  {formatCurrency(budgetData.overallBudget.spent)}
                </StatNumber>
                <StatHelpText>
                  {budgetUsage.usagePercentage}% of total budget
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Remaining</StatLabel>
                <StatNumber color={budgetUsage.isOverBudget ? 'red.500' : 'green.500'}>
                  {formatCurrency(budgetUsage.remainingAmount)}
                </StatNumber>
                <StatHelpText>
                  {budgetUsage.isOverBudget ? 'Over budget' : 'Available to spend'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Budget Progress</StatLabel>
                <StatNumber>{budgetUsage.usagePercentage}%</StatNumber>
                <StatHelpText>
                  <Progress 
                    value={budgetUsage.usagePercentage} 
                    colorScheme={budgetUsage.isOverBudget ? 'red' : 'purple'} 
                    size="md" 
                    mt={2} 
                  />
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Budget Alert */}
        {budgetUsage.isOverBudget && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Budget Alert!</AlertTitle>
            <AlertDescription>
              You have exceeded your total budget by {formatCurrency(Math.abs(budgetUsage.remainingAmount))}.
              Consider adjusting your spending or increasing your budget.
            </AlertDescription>
          </Alert>
        )}

        {/* Category Breakdown */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">Budget Categories</Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {budgetData.categories.map((category) => (
                <Card key={category.id} variant="outline">
                  <CardBody>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack>
                          <Text fontWeight="semibold" fontSize="lg">{category.name}</Text>
                          <Badge 
                            colorScheme={getCategoryStatusColor(category.status)} 
                            variant="solid"
                            p={1}
                          >
                            <HStack spacing={1}>
                              {getCategoryStatusIcon(category.status)}
                              <Text>{category.status.replace('_', ' ')}</Text>
                            </HStack>
                          </Badge>
                        </HStack>
                        <HStack spacing={6}>
                          <Text fontSize="sm" color="gray.600">
                            Allocated: <strong>{formatCurrency(category.allocated)}</strong>
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Spent: <strong>{formatCurrency(category.spent)}</strong>
                          </Text>
                          <Text fontSize="sm" color={category.remaining >= 0 ? 'green.600' : 'red.600'}>
                            Remaining: <strong>{formatCurrency(category.remaining)}</strong>
                          </Text>
                        </HStack>
                      </VStack>
                      
                      <VStack align="end" spacing={2} minW="120px">
                        <Text fontSize="sm" fontWeight="semibold">
                          {category.percentage}%
                        </Text>
                        <Progress 
                          value={category.percentage} 
                          size="md" 
                          colorScheme={getCategoryStatusColor(category.status)}
                          width="100%"
                        />
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Transactions */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold">Recent Transactions</Text>
              <Button size="sm" variant="outline" onClick={handleViewAllTransactions}>
                View All
              </Button>
            </HStack>
          </CardHeader>
          <CardBody p={0}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Category</Th>
                  <Th>Vendor</Th>
                  <Th>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {budgetData.transactions.slice(0, 10).map((transaction) => {
                  const category = budgetData.categories.find(c => c.id === transaction.categoryId)
                  return (
                    <Tr key={transaction.id}>
                      <Td>
                        <Text fontSize="sm">
                          {formatDateForDisplay(transaction.date)}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{transaction.description}</Text>
                      </Td>
                      <Td>
                        <Badge variant="outline" colorScheme="purple">
                          {category?.name || 'Unknown'}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{transaction.vendorName || '-'}</Text>
                      </Td>
                      <Td>
                        <Text 
                          fontSize="sm" 
                          fontWeight="semibold"
                          color={transaction.amount < 0 ? 'red.500' : 'green.500'}
                        >
                          {transaction.amount < 0 ? '-' : '+'}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseOpen}
        onClose={onExpenseClose}
        onSave={handleSaveExpense}
        categories={getCategories()}
      />
      
      <BudgetSetupModal
        isOpen={isSetupOpen}
        onClose={onSetupClose}
        onSave={handleSaveBudgetSetup}
      />
    </DashboardLayout>
  )
}
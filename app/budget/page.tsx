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
  Flex
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  AlertTriangle
} from 'lucide-react'
import { getBudgetData, type BudgetData } from '@/lib/wedding-data-service'
import { calculateBudgetUsage, formatDateForDisplay } from '@/lib/data-utils'

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

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
      
      // Fallback to mock data for development
      setBudgetData({
        overallBudget: {
          total: 50000,
          allocated: 48000,
          spent: 32500,
          remaining: 17500,
          currency: 'USD',
          categories: [
            { name: 'Venue', allocated: 15000, spent: 12000, percentage: 30 },
            { name: 'Catering', allocated: 12000, spent: 8500, percentage: 25 },
            { name: 'Photography', allocated: 5000, spent: 3500, percentage: 10 },
            { name: 'Florals', allocated: 4000, spent: 2800, percentage: 8 },
            { name: 'Music/DJ', allocated: 3000, spent: 1500, percentage: 6 }
          ]
        },
        categories: [
          {
            id: '1',
            name: 'Venue',
            allocated: 15000,
            spent: 12000,
            remaining: 3000,
            percentage: 80,
            status: 'ON_TRACK',
            vendorIds: ['venue-1'],
            phaseIds: ['ceremony', 'reception']
          },
          {
            id: '2',
            name: 'Catering',
            allocated: 12000,
            spent: 8500,
            remaining: 3500,
            percentage: 71,
            status: 'ON_TRACK',
            vendorIds: ['caterer-1'],
            phaseIds: ['reception']
          },
          {
            id: '3',
            name: 'Photography',
            allocated: 5000,
            spent: 3500,
            remaining: 1500,
            percentage: 70,
            status: 'ON_TRACK',
            vendorIds: ['photographer-1'],
            phaseIds: ['ceremony', 'reception']
          },
          {
            id: '4',
            name: 'Florals',
            allocated: 4000,
            spent: 2800,
            remaining: 1200,
            percentage: 70,
            status: 'ON_TRACK',
            vendorIds: ['florist-1'],
            phaseIds: ['ceremony', 'reception']
          },
          {
            id: '5',
            name: 'Music/DJ',
            allocated: 3000,
            spent: 1500,
            remaining: 1500,
            percentage: 50,
            status: 'UNDER_BUDGET',
            vendorIds: ['dj-1'],
            phaseIds: ['reception']
          },
          {
            id: '6',
            name: 'Transportation',
            allocated: 2000,
            spent: 2200,
            remaining: -200,
            percentage: 110,
            status: 'OVER_BUDGET',
            vendorIds: ['transport-1'],
            phaseIds: ['ceremony', 'reception']
          }
        ],
        transactions: [
          {
            id: '1',
            date: '2024-01-28',
            description: 'Venue deposit payment',
            amount: -5000,
            type: 'PAYMENT',
            categoryId: '1',
            vendorName: 'Grand Ballroom',
            phaseId: 'reception'
          },
          {
            id: '2',
            date: '2024-01-25',
            description: 'Photography contract signing',
            amount: -1500,
            type: 'PAYMENT',
            categoryId: '3',
            vendorName: 'Elegant Photography'
          },
          {
            id: '3',
            date: '2024-01-20',
            description: 'Catering deposit',
            amount: -3000,
            type: 'PAYMENT',
            categoryId: '2',
            vendorName: 'Gourmet Catering Co.'
          },
          {
            id: '4',
            date: '2024-01-15',
            description: 'Floral arrangement deposit',
            amount: -800,
            type: 'PAYMENT',
            categoryId: '4',
            vendorName: 'Blooming Gardens'
          },
          {
            id: '5',
            date: '2024-01-12',
            description: 'Transportation booking',
            amount: -1200,
            type: 'PAYMENT',
            categoryId: '6',
            vendorName: 'Luxury Limos'
          }
        ]
      })
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
    return (
      <DashboardLayout>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Unable to load budget!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
              <Button leftIcon={<Plus size={16} />} colorScheme="purple">
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
            <Button leftIcon={<Download size={16} />} variant="outline">
              Export
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="purple">
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
              <Button size="sm" variant="outline">
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
    </DashboardLayout>
  )
}
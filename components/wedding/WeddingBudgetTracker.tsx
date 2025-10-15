'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { 
  Edit,
  Plus,
  AlertTriangle
} from 'lucide-react'

import { BudgetInfo } from '@/types';

interface WeddingBudgetTrackerProps {
  budget: BudgetInfo
}

export const WeddingBudgetTracker: React.FC<WeddingBudgetTrackerProps> = ({ budget }) => {
  // Mock budget categories data
  const categories = [
    { name: 'Venue', allocated: 20000, spent: 18000, remaining: 2000 },
    { name: 'Catering', allocated: 12000, spent: 8000, remaining: 4000 },
    { name: 'Photography/Videography', allocated: 5000, spent: 2500, remaining: 2500 },
    { name: 'Music/Entertainment', allocated: 3000, spent: 1500, remaining: 1500 },
    { name: 'Flowers/Decorations', allocated: 2500, spent: 800, remaining: 1700 },
    { name: 'Attire', allocated: 2000, spent: 1200, remaining: 800 },
    { name: 'Transportation', allocated: 500, spent: 0, remaining: 500 },
    { name: 'Miscellaneous', allocated: 1000, spent: 200, remaining: 800 },
  ]

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)


  const budgetUtilization = (totalSpent / budget.total) * 100
  const allocationUtilization = (totalAllocated / budget.total) * 100

  const getUtilizationColor = (percentage: number) => {
    if (percentage > 90) return 'red'
    if (percentage > 75) return 'orange'
    return 'green'
  }

  const getCategoryStatus = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100
    if (percentage > 90) return { color: 'red', status: 'Over Budget' }
    if (percentage > 75) return { color: 'orange', status: 'High Usage' }
    return { color: 'green', status: 'On Track' }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Budget Header */}
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text fontSize="lg" fontWeight="semibold">Budget Tracker</Text>
          <Text fontSize="sm" color="neutral.600">
            Monitor your wedding expenses and allocations
          </Text>
        </VStack>
        <HStack spacing={2}>
          <Button leftIcon={<Plus size={16} />} variant="outline" size="sm">
            Add Expense
          </Button>
          <Button leftIcon={<Edit size={16} />} variant="outline" size="sm">
            Edit Budget
          </Button>
        </HStack>
      </HStack>

      {/* Budget Overview */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="neutral.600">Total Budget</StatLabel>
              <StatNumber fontSize="2xl" color="brand.600">
                ${budget.total.toLocaleString()}
              </StatNumber>
              <StatHelpText>Your overall budget</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="neutral.600">Allocated</StatLabel>
              <StatNumber fontSize="2xl">
                ${totalAllocated.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                {Math.round(allocationUtilization)}% of total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="neutral.600">Spent</StatLabel>
              <StatNumber fontSize="2xl" color="orange.600">
                ${totalSpent.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                {Math.round(budgetUtilization)}% of total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel color="neutral.600">Remaining</StatLabel>
              <StatNumber fontSize="2xl" color="green.600">
                ${(budget.total - totalSpent).toLocaleString()}
              </StatNumber>
              <StatHelpText>
                {Math.round(((budget.total - totalSpent) / budget.total) * 100)}% of total
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <Text fontSize="md" fontWeight="semibold">Budget Utilization</Text>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm">Spent vs Total Budget</Text>
                <Text fontSize="sm" color="neutral.600">
                  {Math.round(budgetUtilization)}%
                </Text>
              </HStack>
              <Progress
                value={budgetUtilization}
                colorScheme={getUtilizationColor(budgetUtilization)}
                size="lg"
                borderRadius="full"
              />
            </VStack>

            <VStack spacing={2} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm">Allocated vs Total Budget</Text>
                <Text fontSize="sm" color="neutral.600">
                  {Math.round(allocationUtilization)}%
                </Text>
              </HStack>
              <Progress
                value={allocationUtilization}
                colorScheme={getUtilizationColor(allocationUtilization)}
                size="md"
                borderRadius="full"
              />
            </VStack>

            {budgetUtilization > 75 && (
              <HStack spacing={2} p={3} bg="orange.50" borderRadius="md">
                <AlertTriangle size={16} color="var(--chakra-colors-orange-500)" />
                <Text fontSize="sm" color="orange.800">
                  You&apos;ve used {Math.round(budgetUtilization)}% of your budget. Consider reviewing remaining expenses.
                </Text>
              </HStack>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <Text fontSize="md" fontWeight="semibold">Category Breakdown</Text>
        </CardHeader>
        <CardBody pt={0}>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Category</Th>
                  <Th isNumeric>Allocated</Th>
                  <Th isNumeric>Spent</Th>
                  <Th isNumeric>Remaining</Th>
                  <Th>Progress</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.map((category) => {
                  const percentage = (category.spent / category.allocated) * 100
                  const status = getCategoryStatus(category.spent, category.allocated)
                  
                  return (
                    <Tr key={category.name}>
                      <Td fontWeight="medium">{category.name}</Td>
                      <Td isNumeric>${category.allocated.toLocaleString()}</Td>
                      <Td isNumeric>${category.spent.toLocaleString()}</Td>
                      <Td isNumeric color={category.remaining < 0 ? 'red.500' : 'green.500'}>
                        ${category.remaining.toLocaleString()}
                      </Td>
                      <Td>
                        <VStack spacing={1} align="stretch" minW="100px">
                          <Progress
                            value={percentage}
                            colorScheme={status.color}
                            size="sm"
                            borderRadius="full"
                          />
                          <Text fontSize="xs" color="neutral.600">
                            {Math.round(percentage)}%
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={status.color} size="sm">
                          {status.status}
                        </Badge>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="semibold">Recent Expenses</Text>
            <Button size="sm" variant="outline">View All</Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            {[
              { description: 'Venue deposit payment', amount: 5000, category: 'Venue', date: '2024-04-15' },
              { description: 'Wedding dress purchase', amount: 800, category: 'Attire', date: '2024-04-12' },
              { description: 'Photography booking fee', amount: 1000, category: 'Photography/Videography', date: '2024-04-10' },
              { description: 'Catering tasting fee', amount: 150, category: 'Catering', date: '2024-04-08' },
              { description: 'Flower consultation', amount: 50, category: 'Flowers/Decorations', date: '2024-04-05' },
            ].map((expense, index) => (
              <HStack key={index} justify="space-between" p={3} bg="neutral.50" borderRadius="md">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">{expense.description}</Text>
                  <HStack spacing={2}>
                    <Badge size="xs" colorScheme="brand">{expense.category}</Badge>
                    <Text fontSize="xs" color="neutral.500">{expense.date}</Text>
                  </HStack>
                </VStack>
                <Text fontSize="sm" fontWeight="semibold" color="red.600">
                  -${expense.amount.toLocaleString()}
                </Text>
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Budget Tips */}
      <Card bg="blue.50" borderColor="blue.200">
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="blue.800">
              Budget Management Tips
            </Text>
            <VStack spacing={2} align="start" fontSize="sm" color="blue.700">
              <Text>• Track expenses regularly to avoid overspending</Text>
              <Text>• Keep 5-10% of your budget as a contingency fund</Text>
              <Text>• Review and adjust allocations as needed</Text>
              <Text>• Get multiple quotes for major expenses</Text>
              <Text>• Consider DIY options for decorations and favors</Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
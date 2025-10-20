'use client'

import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Progress,
  Divider,
  Tabs,
  TabList,
  Tab,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
  Receipt
} from 'lucide-react'
import { useState } from 'react'

// Mock data - will be replaced with real API calls
const mockBudgetData = {
  overall: {
    total: 50000,
    allocated: 45000,
    spent: 28500,
    remaining: 21500,
    currency: 'USD'
  },
  categories: [
    {
      id: '1',
      name: 'Venue',
      allocated: 15000,
      spent: 15000,
      remaining: 0,
      percentage: 30,
      status: 'on-budget' as const,
      vendors: ['Grand Ballroom']
    },
    {
      id: '2',
      name: 'Catering',
      allocated: 12000,
      spent: 6000,
      remaining: 6000,
      percentage: 24,
      status: 'on-budget' as const,
      vendors: ['Gourmet Catering Co.']
    },
    {
      id: '3',
      name: 'Photography',
      allocated: 4000,
      spent: 1000,
      remaining: 3000,
      percentage: 8,
      status: 'under-budget' as const,
      vendors: ['Elegant Photography Studio']
    },
    {
      id: '4',
      name: 'Florals',
      allocated: 3000,
      spent: 3500,
      remaining: -500,
      percentage: 6,
      status: 'over-budget' as const,
      vendors: ['Blooming Gardens Florist']
    },
    {
      id: '5',
      name: 'Entertainment',
      allocated: 4000,
      spent: 0,
      remaining: 4000,
      percentage: 8,
      status: 'not-started' as const,
      vendors: ['Harmony Wedding Band']
    },
    {
      id: '6',
      name: 'Attire',
      allocated: 2500,
      spent: 1800,
      remaining: 700,
      percentage: 5,
      status: 'on-budget' as const,
      vendors: ['Bridal Boutique', 'Men\'s Wearhouse']
    },
    {
      id: '7',
      name: 'Transportation',
      allocated: 1500,
      spent: 0,
      remaining: 1500,
      percentage: 3,
      status: 'not-started' as const,
      vendors: []
    },
    {
      id: '8',
      name: 'Miscellaneous',
      allocated: 3000,
      spent: 1200,
      remaining: 1800,
      percentage: 6,
      status: 'on-budget' as const,
      vendors: []
    }
  ],
  recentTransactions: [
    {
      id: '1',
      date: new Date('2024-01-20'),
      description: 'Venue deposit payment',
      category: 'Venue',
      amount: 5000,
      type: 'expense' as const,
      vendor: 'Grand Ballroom'
    },
    {
      id: '2',
      date: new Date('2024-01-18'),
      description: 'Photography booking deposit',
      category: 'Photography',
      amount: 1000,
      type: 'expense' as const,
      vendor: 'Elegant Photography Studio'
    },
    {
      id: '3',
      date: new Date('2024-01-15'),
      description: 'Wedding dress purchase',
      category: 'Attire',
      amount: 1200,
      type: 'expense' as const,
      vendor: 'Bridal Boutique'
    },
    {
      id: '4',
      date: new Date('2024-01-10'),
      description: 'Floral arrangement deposit',
      category: 'Florals',
      amount: 800,
      type: 'expense' as const,
      vendor: 'Blooming Gardens Florist'
    }
  ],
  phases: [
    {
      id: 'ceremony',
      name: 'Ceremony',
      allocated: 20000,
      spent: 12000,
      remaining: 8000
    },
    {
      id: 'reception',
      name: 'Reception',
      allocated: 25000,
      spent: 16500,
      remaining: 8500
    }
  ]
}

const statusColors: Record<string, string> = {
  'on-budget': 'green',
  'under-budget': 'blue',
  'over-budget': 'red',
  'not-started': 'gray'
}

const statusLabels: Record<string, string> = {
  'on-budget': 'On Budget',
  'under-budget': 'Under Budget',
  'over-budget': 'Over Budget',
  'not-started': 'Not Started'
}

export default function BudgetPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'phases'>('overview')
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const [addType, setAddType] = useState<'expense' | 'category'>('expense')


  
  const overallPercentage = (mockBudgetData.overall.spent / mockBudgetData.overall.allocated) * 100
  const remainingPercentage = ((mockBudgetData.overall.allocated - mockBudgetData.overall.spent) / mockBudgetData.overall.allocated) * 100

  return (
    <DashboardLayout 
      title="Budget Management"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Budget' }
      ]}
    >
      <VStack spacing={6} align="stretch">
        {/* Header Actions */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <HStack spacing={4}>
            <Tabs size="sm" onChange={(index) => {
              const views = ['overview', 'categories', 'phases'] as const
              setSelectedView(views[index])
            }}>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Categories</Tab>
                <Tab>Phases</Tab>
              </TabList>
            </Tabs>
          </HStack>
          
          <HStack spacing={2}>
            <Button leftIcon={<Receipt size={16} />} variant="outline">
              Export Report
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="brand" onClick={onAddOpen}>
              Add Expense
            </Button>
          </HStack>
        </Flex>

        {/* Budget Overview Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Budget</StatLabel>
                <StatNumber>${mockBudgetData.overall.total.toLocaleString()}</StatNumber>
                <StatHelpText>Allocated: ${mockBudgetData.overall.allocated.toLocaleString()}</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Spent</StatLabel>
                <StatNumber color="red.500">${mockBudgetData.overall.spent.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {Math.round(overallPercentage)}% of allocated
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Remaining</StatLabel>
                <StatNumber color="green.500">${mockBudgetData.overall.remaining.toLocaleString()}</StatNumber>
                <StatHelpText>
                  {Math.round(remainingPercentage)}% of allocated
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Budget Health</StatLabel>
                <StatNumber fontSize="lg">
                  {overallPercentage > 90 ? 'Critical' : overallPercentage > 75 ? 'Warning' : 'Good'}
                </StatNumber>
                <Progress 
                  value={overallPercentage} 
                  colorScheme={overallPercentage > 90 ? 'red' : overallPercentage > 75 ? 'orange' : 'green'}
                  size="sm"
                  mt={2}
                />
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Main Content */}
        {selectedView === 'overview' && (
          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            {/* Budget Breakdown */}
            <Card>
              <CardHeader>
                <Text fontSize="lg" fontWeight="semibold">Budget Breakdown by Category</Text>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {mockBudgetData.categories.map(category => {
                    const percentage = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0
                    
                    return (
                      <Box key={category.id}>
                        <HStack justify="space-between" mb={2}>
                          <HStack>
                            <Text fontWeight="medium">{category.name}</Text>
                            <Badge colorScheme={statusColors[category.status]} size="sm">
                              {statusLabels[category.status]}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="neutral.600">
                            ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                          </Text>
                        </HStack>
                        <Progress
                          value={percentage}
                          colorScheme={
                            category.status === 'over-budget' ? 'red' :
                            category.status === 'under-budget' ? 'blue' :
                            category.status === 'on-budget' ? 'green' : 'gray'
                          }
                          size="sm"
                        />
                        {category.status === 'over-budget' && (
                          <HStack mt={1} fontSize="xs" color="red.500">
                            <AlertTriangle size={12} />
                            <Text>Over budget by ${Math.abs(category.remaining).toLocaleString()}</Text>
                          </HStack>
                        )}
                      </Box>
                    )
                  })}
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold">Recent Transactions</Text>
                  <Button size="sm" variant="outline">View All</Button>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  {mockBudgetData.recentTransactions.map(transaction => (
                    <Box key={transaction.id}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">{transaction.description}</Text>
                          <Text fontSize="xs" color="neutral.500">
                            {transaction.vendor} • {transaction.date.toLocaleDateString()}
                          </Text>
                          <Badge size="xs" variant="outline">{transaction.category}</Badge>
                        </VStack>
                        <Text fontSize="sm" fontWeight="bold" color="red.500">
                          -${transaction.amount.toLocaleString()}
                        </Text>
                      </HStack>
                      <Divider mt={3} />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Grid>
        )}

        {selectedView === 'categories' && (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">Budget Categories</Text>
                <Button leftIcon={<Plus size={16} />} size="sm" variant="outline">
                  Add Category
                </Button>
              </HStack>
            </CardHeader>
            <CardBody p={0}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Category</Th>
                    <Th>Allocated</Th>
                    <Th>Spent</Th>
                    <Th>Remaining</Th>
                    <Th>Status</Th>
                    <Th>Vendors</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {mockBudgetData.categories.map(category => (
                    <Tr key={category.id}>
                      <Td>
                        <Text fontWeight="medium">{category.name}</Text>
                      </Td>
                      <Td>${category.allocated.toLocaleString()}</Td>
                      <Td color="red.500">${category.spent.toLocaleString()}</Td>
                      <Td color={category.remaining < 0 ? 'red.500' : 'green.500'}>
                        ${category.remaining.toLocaleString()}
                      </Td>
                      <Td>
                        <Badge colorScheme={statusColors[category.status]} size="sm">
                          {statusLabels[category.status]}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          {category.vendors.map(vendor => (
                            <Text key={vendor} fontSize="sm">{vendor}</Text>
                          ))}
                          {category.vendors.length === 0 && (
                            <Text fontSize="sm" color="neutral.500">No vendors</Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                          <MenuList>
                            <MenuItem icon={<Edit size={16} />}>Edit</MenuItem>
                            <MenuItem icon={<Receipt size={16} />}>View Expenses</MenuItem>
                            <MenuItem icon={<Trash2 size={16} />} color="red.500">Delete</MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        )}

        {selectedView === 'phases' && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {mockBudgetData.phases.map(phase => {
              const percentage = (phase.spent / phase.allocated) * 100
              
              return (
                <Card key={phase.id}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="semibold">{phase.name}</Text>
                      <Badge colorScheme={percentage > 90 ? 'red' : percentage > 75 ? 'orange' : 'green'}>
                        {Math.round(percentage)}%
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4} textAlign="center">
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="neutral.600">Allocated</Text>
                          <Text fontSize="lg" fontWeight="bold">${phase.allocated.toLocaleString()}</Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="neutral.600">Spent</Text>
                          <Text fontSize="lg" fontWeight="bold" color="red.500">${phase.spent.toLocaleString()}</Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="neutral.600">Remaining</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.500">${phase.remaining.toLocaleString()}</Text>
                        </VStack>
                      </Grid>
                      
                      <Progress
                        value={percentage}
                        colorScheme={percentage > 90 ? 'red' : percentage > 75 ? 'orange' : 'green'}
                        size="lg"
                      />
                      
                      <Button variant="outline" size="sm">
                        View Phase Details
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </Grid>
        )}

        {/* Add Expense Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New {addType === 'expense' ? 'Expense' : 'Category'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select value={addType} onChange={(e) => setAddType(e.target.value as 'expense' | 'category')}>
                    <option value="expense">Expense</option>
                    <option value="category">Budget Category</option>
                  </Select>
                </FormControl>

                {addType === 'expense' ? (
                  <>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Input placeholder="Enter expense description..." />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Amount</FormLabel>
                      <NumberInput>
                        <NumberInputField placeholder="0.00" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Select placeholder="Select category...">
                        {mockBudgetData.categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Vendor</FormLabel>
                      <Input placeholder="Enter vendor name..." />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Date</FormLabel>
                      <Input type="date" />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl>
                      <FormLabel>Category Name</FormLabel>
                      <Input placeholder="Enter category name..." />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Allocated Amount</FormLabel>
                      <NumberInput>
                        <NumberInputField placeholder="0.00" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </>
                )}

                <HStack spacing={4} pt={4}>
                  <Button colorScheme="brand" flex={1}>
                    Add {addType === 'expense' ? 'Expense' : 'Category'}
                  </Button>
                  <Button variant="outline" onClick={onAddClose}>
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </DashboardLayout>
  )
}
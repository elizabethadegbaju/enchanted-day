'use client'

import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { 
  Heart, 
  Calendar, 
  Users, 
  Camera, 
  Settings, 
  Bell,
  ChevronRight,
  LogOut,
  MessageCircle
} from 'lucide-react'
import { WeddingSelector } from '@/components/wedding/WeddingSelector'
import { UserDisplayName } from '@/components/user/UserDisplayName'
import { useWedding } from '@/contexts/WeddingContext'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
}

const navigation = [
  { name: 'AI Chat', href: '/chat', icon: MessageCircle },
  { name: 'Overview', href: '/dashboard', icon: Heart },
  { name: 'Timeline', href: '/timeline', icon: Calendar },
  { name: 'Vendors', href: '/vendors', icon: Users },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Budget', href: '/budget', icon: Settings },
  { name: 'Mood Boards', href: '/wedding/1/mood-boards', icon: Camera },
]

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
}) => {
  const { user, signOut } = useAuthenticator()
  const { weddings } = useWedding()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.200', 'gray.700')

  // Show sidebar only if user has more than one wedding
  const showSidebar = weddings.length > 1

  return (
    <Box minH="100vh" bg="neutral.50">
      {/* Header */}
      <Box
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={6}
        py={4}
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={8}>
              <Text fontSize="xl" fontWeight="bold" color="brand.600">
                EnchantedDay
              </Text>
              
              <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      variant="ghost"
                      leftIcon={<Icon size={16} />}
                      size="sm"
                      color="neutral.600"
                      _hover={{ color: 'brand.600', bg: 'brand.50' }}
                    >
                      {item.name}
                    </Button>
                  )
                })}
              </HStack>
            </HStack>

            <HStack spacing={4}>
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
              
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user?.username || 'User'}
                    bg="brand.500"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <VStack align="start" spacing={0}>
                      <UserDisplayName 
                        fontWeight="semibold"
                        fallback={user?.username || 'User'}
                      />
                      <Text fontSize="sm" color="neutral.600">
                        {user?.signInDetails?.loginId || 'user@example.com'}
                      </Text>
                    </VStack>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => signOut()}>
                    <HStack>
                      <LogOut size={16} />
                      <Text>Sign out</Text>
                    </HStack>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <Grid 
          templateColumns={showSidebar ? { base: '1fr', lg: '250px 1fr' } : '1fr'} 
          gap={8}
        >
          {/* Sidebar - only show if user has multiple weddings */}
          {showSidebar && (
            <VStack align="stretch" spacing={4} display={{ base: 'none', lg: 'flex' }}>
              <WeddingSelector />
            </VStack>
          )}

          {/* Main Content Area */}
          <VStack align="stretch" spacing={6}>
            {/* Mobile Wedding Selector - only show if user has multiple weddings */}
            {showSidebar && (
              <Box display={{ base: 'block', lg: 'none' }}>
                <WeddingSelector />
              </Box>
            )}

            {/* Breadcrumbs and Title */}
            {(breadcrumbs.length > 0 || title) && (
              <Box>
                {breadcrumbs.length > 0 && (
                  <Breadcrumb
                    spacing={2}
                    separator={<ChevronRight size={12} />}
                    fontSize="sm"
                    color="neutral.600"
                    mb={2}
                  >
                    {breadcrumbs.map((crumb, index) => (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                )}
                
                {title && (
                  <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
                    {title}
                  </Text>
                )}
              </Box>
            )}

            {/* Page Content */}
            <Box>{children}</Box>
          </VStack>
        </Grid>
      </Container>
    </Box>
  )
}
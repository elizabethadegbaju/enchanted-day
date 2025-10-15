"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Box, Container, VStack, Text, Button, HStack, Spinner, Center } from '@chakra-ui/react'
import { Heart, Sparkles, MessageCircle, Zap } from 'lucide-react'
import Link from 'next/link'

export default function App() {
  const { user } = useAuthenticator()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
    if (user) {
      router.push('/chat')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    )
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <Box minH="100vh" bg="gradient-to-br from-brand.50 to-purple.50">
        <Container maxW="4xl" py={20}>
          <VStack spacing={8} textAlign="center">
            <HStack spacing={3}>
              <Heart size={48} color="var(--chakra-colors-brand-500)" />
              <Text fontSize="4xl" fontWeight="bold" color="brand.600">
                EnchantedDay
              </Text>
            </HStack>
            
            <VStack spacing={4}>
              <Text fontSize="xl" color="neutral.600" maxW="2xl">
                Your AI-powered wedding planner that transforms wedding planning from stressful coordination into a seamless, magical journey.
              </Text>
              <HStack spacing={2}>
                <Sparkles size={20} color="var(--chakra-colors-brand-500)" />
                <Text fontSize="md" color="brand.600" fontWeight="medium">
                  Autonomous • Intelligent • Magical
                </Text>
              </HStack>
            </VStack>

            <VStack spacing={4}>
              <Button
                as={Link}
                href="/auth/login"
                size="lg"
                colorScheme="brand"
                leftIcon={<MessageCircle size={20} />}
              >
                Start Chatting with Your AI Planner
              </Button>
              
              <Button
                as={Link}
                href="/dashboard"
                variant="outline"
                size="lg"
                leftIcon={<Zap size={20} />}
              >
                View Dashboard Demo
              </Button>
            </VStack>

            <VStack spacing={6} pt={12}>
              <Text fontSize="lg" fontWeight="semibold" color="neutral.700">
                Experience AI-Powered Wedding Planning
              </Text>
              
              <VStack spacing={4} maxW="3xl">
                <Text color="neutral.600">
                  💬 <strong>Conversational AI:</strong> Simply chat with your AI wedding planner - no complex forms or menus to navigate.
                </Text>
                <Text color="neutral.600">
                  🤖 <strong>Multi-Agent Intelligence:</strong> Specialized AI agents for vendors, timeline, guests, budget, and crisis management work together seamlessly.
                </Text>
                <Text color="neutral.600">
                  🎨 <strong>Cultural & Personal:</strong> Supports multi-phase weddings and cultural traditions while learning your unique preferences.
                </Text>
                <Text color="neutral.600">
                  ⚡ <strong>Proactive Automation:</strong> Anticipates issues, manages deadlines, and coordinates vendors automatically.
                </Text>
                <Text color="neutral.600">
                  💝 <strong>Stress-Free Experience:</strong> Focus on the joy and celebration while AI handles all the logistics behind the scenes.
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  return null
}
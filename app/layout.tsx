'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from '@/theme'
import { useState } from 'react'
import AuthWrapper from './AuthWrapper';
import outputs from "@/amplify_outputs.json";
import { Amplify } from 'aws-amplify'

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  }))

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </ChakraProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
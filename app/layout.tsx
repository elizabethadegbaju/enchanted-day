'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from '@/theme'
import { amplifyTheme } from '@/theme/amplify-theme'
import { useState, useEffect } from 'react'
import AuthWrapper from './AuthWrapper';
import { ThemeProvider } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import outputs from '@/amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css'
import './amplify-ui-custom.css'
import './globals.css'

Amplify.configure(outputs)

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
          <ThemeProvider theme={amplifyTheme}>
            <ChakraProvider theme={theme}>
              <AuthWrapper>
                {children}
              </AuthWrapper>
            </ChakraProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
'use client';

import React from 'react';
import {
  Box,
  Select,
  HStack,
  Text,
  Badge,
  VStack,
  Button,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { Plus, Calendar } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';

export function WeddingSelector() {
  const { 
    selectedWeddingId, 
    weddings, 
    isLoading, 
    error, 
    selectWedding 
  } = useWedding();

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isLoading) {
    return (
      <HStack spacing={3} p={3} bg={bg} borderRadius="md" border="1px" borderColor={borderColor}>
        <Spinner size="sm" />
        <Text fontSize="sm">Loading weddings...</Text>
      </HStack>
    );
  }

  if (error || weddings.length === 0) {
    return (
      <Alert status="info" size="sm" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="semibold">
            {weddings.length === 0 ? 'No weddings found' : 'Error loading weddings'}
          </Text>
          <Button
            as="a"
            href="/wedding/create"
            size="xs"
            leftIcon={<Plus size={12} />}
            colorScheme="purple"
          >
            Create Wedding
          </Button>
        </VStack>
      </Alert>
    );
  }

  const selectedWedding = weddings.find(w => w.id === selectedWeddingId);

  return (
    <Box p={3} bg={bg} borderRadius="md" border="1px" borderColor={borderColor}>
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="semibold" color="gray.600">
            Current Wedding
          </Text>
          {weddings.length > 1 && (
            <Badge colorScheme="purple" size="sm">
              {weddings.length} weddings
            </Badge>
          )}
        </HStack>

        {weddings.length === 1 ? (
          // Single wedding - just display it
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold">
              {selectedWedding?.coupleNames.join(' & ') || 'Unnamed Wedding'}
            </Text>
            <HStack spacing={2}>
              <Calendar size={14} />
              <Text fontSize="sm" color="gray.600">
                {selectedWedding?.weddingDate ? 
                  new Date(selectedWedding.weddingDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 
                  'Date not set'
                }
              </Text>
            </HStack>
          </VStack>
        ) : (
          // Multiple weddings - show selector
          <VStack align="stretch" spacing={2}>
            <Select
              value={selectedWeddingId || ''}
              onChange={(e) => selectWedding(e.target.value)}
              placeholder="Select a wedding"
              size="sm"
            >
              {weddings.map((wedding) => (
                <option key={wedding.id} value={wedding.id}>
                  {wedding.coupleNames.join(' & ') || 'Unnamed Wedding'} - {
                    wedding.weddingDate ? 
                      new Date(wedding.weddingDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 
                      'No date'
                  }
                </option>
              ))}
            </Select>

            {selectedWedding && (
              <HStack justify="space-between" align="center">
                <Badge 
                  colorScheme={
                    selectedWedding.status === 'COMPLETED' ? 'green' :
                    selectedWedding.status === 'CONFIRMED' ? 'blue' : 'orange'
                  }
                  size="sm"
                >
                  {selectedWedding.status}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {selectedWedding.overallProgress}% complete
                </Text>
              </HStack>
            )}
          </VStack>
        )}

        <Button
          as="a"
          href="/wedding/create"
          size="sm"
          variant="outline"
          leftIcon={<Plus size={14} />}
        >
          Add Wedding
        </Button>
      </VStack>
    </Box>
  );
}
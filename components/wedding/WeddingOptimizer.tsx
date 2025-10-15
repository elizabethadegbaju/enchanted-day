import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  Progress,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { Zap, TrendingUp, DollarSign } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface WeddingOptimizerProps {
  weddingId: string;
}

interface OptimizationChange {
  description: string;
  savings?: number;
  impact?: string;
  benefit?: string;
}

interface OptimizationResult {
  budget: { savings: number; changes: OptimizationChange[] };
  timeline: { optimized: Record<string, unknown>; changes: OptimizationChange[] };
  vendors: { changes: OptimizationChange[] };
  validation: { risks: string[]; confidence: number };
}

export const WeddingOptimizer: React.FC<WeddingOptimizerProps> = ({ weddingId }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev: number) => Math.min(prev + 20, 90));
      }, 500);

      const optimization = await apiClient.optimizeWedding(weddingId, {
        goals: ['reduce_cost', 'improve_timeline', 'enhance_quality']
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      // Type assertion since we know the expected structure from StrandsWorkflowResponse
      const optimizationData = optimization.data as OptimizationResult;
      setResult(optimizationData);

      toast({
        title: 'Wedding Optimized!',
        description: 'Optimization complete with savings opportunities identified',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Optimization Failed',
        description: 'Unable to optimize wedding plan',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <Zap color="#4299E1" />
            <Text fontSize="xl" fontWeight="bold">AI Wedding Optimizer</Text>
          </HStack>
          <Button
            onClick={handleOptimize}
            isLoading={isOptimizing}
            loadingText="Optimizing..."
            colorScheme="blue"
            leftIcon={<TrendingUp size={16} />}
          >
            Optimize Wedding
          </Button>
        </HStack>

        {isOptimizing && (
          <Box>
            <Text mb={2} fontSize="sm" color="gray.600">
              AI agents analyzing your wedding plan...
            </Text>
            <Progress value={progress} colorScheme="blue" />
          </Box>
        )}

        {result && (
          <VStack spacing={4} align="stretch">
            <HStack spacing={6}>
              <Stat>
                <StatLabel>Potential Savings</StatLabel>
                <StatNumber color="green.500">
                  ${result.budget.savings.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <DollarSign size={14} />
                    <Text>Budget optimization</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Confidence Score</StatLabel>
                <StatNumber>{Math.round(result.validation.confidence * 100)}%</StatNumber>
                <StatHelpText>
                  <Badge colorScheme={result.validation.confidence > 0.8 ? 'green' : 'yellow'}>
                    {result.validation.confidence > 0.8 ? 'High' : 'Medium'} Confidence
                  </Badge>
                </StatHelpText>
              </Stat>
            </HStack>

            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="semibold">Budget Optimizations</Text>
                      <Badge colorScheme="green">{result.budget.changes.length} changes</Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={2}>
                    {result.budget.changes.map((change, index) => (
                      <Box key={index} p={3} bg="green.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="medium">{change.description}</Text>
                        <Text fontSize="xs" color="green.600">
                          Saves: ${change.savings}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="semibold">Timeline Improvements</Text>
                      <Badge colorScheme="blue">{result.timeline.changes.length} changes</Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={2}>
                    {result.timeline.changes.map((change, index) => (
                      <Box key={index} p={3} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="medium">{change.description}</Text>
                        <Text fontSize="xs" color="blue.600">
                          Impact: {change.impact}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="semibold">Vendor Recommendations</Text>
                      <Badge colorScheme="purple">{result.vendors.changes.length} changes</Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack align="stretch" spacing={2}>
                    {result.vendors.changes.map((change, index) => (
                      <Box key={index} p={3} bg="purple.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="medium">{change.description}</Text>
                        <Text fontSize="xs" color="purple.600">
                          Benefit: {change.benefit}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            {result.validation.risks.length > 0 && (
              <Box p={4} bg="yellow.50" borderRadius="md" borderLeft="4px" borderColor="yellow.400">
                <Text fontWeight="semibold" mb={2}>Considerations:</Text>
                <VStack align="stretch" spacing={1}>
                  {result.validation.risks.map((risk, index) => (
                    <Text key={index} fontSize="sm" color="yellow.700">
                      • {risk}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Textarea,
  Badge,
  useToast,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { MessageSquare, TrendingDown, CheckCircle } from 'lucide-react';
import { ChatService } from '@/lib/chat-service';

interface ContractTerms {
  totalCost: number;
  [key: string]: unknown;
}

interface VendorNegotiatorProps {
  vendorId: string;
  weddingId: string;
  originalTerms: ContractTerms;
}

interface NegotiationResult {
  analysis: { insights: string[]; leverage: string };
  strategy: { approach: string; keyPoints: string[] };
  counterOffer: { terms: Record<string, unknown>; savings: number; message: string };
}

export const VendorNegotiator: React.FC<VendorNegotiatorProps> = ({
  vendorId,
  weddingId,
  originalTerms
}) => {
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [result, setResult] = useState<NegotiationResult | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const toast = useToast();

  const handleNegotiate = async () => {
    setIsNegotiating(true);

    try {
      const negotiation = await ChatService.negotiateContract(vendorId, {
        weddingId,
        terms: { totalCost: originalTerms.totalCost },
        budget: originalTerms.totalCost
      });      // Type assertion since we know the expected structure from StrandsWorkflowResponse
      const negotiationData = negotiation.data as NegotiationResult;
      setResult(negotiationData);

      toast({
        title: 'Negotiation Strategy Ready!',
        description: `Potential savings available`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: unknown) {
      toast({
        title: 'Negotiation Failed',
        description: 'Unable to generate negotiation strategy',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsNegotiating(false);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack>
            <MessageSquare color="#4299E1" />
            <Text fontSize="xl" fontWeight="bold">AI Contract Negotiator</Text>
          </HStack>
          <Button
            onClick={handleNegotiate}
            isLoading={isNegotiating}
            loadingText="Analyzing..."
            colorScheme="blue"
            leftIcon={<TrendingDown size={16} />}
          >
            Generate Strategy
          </Button>
        </HStack>

        {result && (
          <VStack spacing={6} align="stretch">
            <HStack spacing={6}>
              <Stat>
                <StatLabel>Potential Savings</StatLabel>
                <StatNumber color="green.500">
                  ${result.counterOffer.savings.toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <TrendingDown size={14} />
                    <Text>Cost reduction</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel>Negotiation Leverage</StatLabel>
                <StatNumber fontSize="lg">{result.analysis.leverage}</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="blue">AI Assessment</Badge>
                </StatHelpText>
              </Stat>
            </HStack>

            <Divider />

            <Box>
              <Text fontWeight="semibold" mb={3}>Market Analysis & Insights</Text>
              <VStack align="stretch" spacing={2}>
                {result.analysis.insights.map((insight, index) => (
                  <Box key={index} p={3} bg="blue.50" borderRadius="md">
                    <HStack>
                      <CheckCircle size={16} color="#4299E1" />
                      <Text fontSize="sm">{insight}</Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={3}>Negotiation Strategy</Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" mb={3} fontWeight="medium">
                  Recommended Approach: {result.strategy.approach}
                </Text>
                <VStack align="stretch" spacing={2}>
                  {result.strategy.keyPoints.map((point, index) => (
                    <Text key={index} fontSize="sm">
                      • {point}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Box>

            <Box>
              <Text fontWeight="semibold" mb={3}>AI-Generated Message</Text>
              <Textarea
                value={customMessage || result.counterOffer.message}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Customize your negotiation message..."
                rows={6}
                bg="white"
                border="2px"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400" }}
              />
            </Box>

            <Box p={4} bg="green.50" borderRadius="md" borderLeft="4px" borderColor="green.400">
              <Text fontWeight="semibold" mb={2} color="green.700">
                Expected Outcome:
              </Text>
              <Text fontSize="sm" color="green.600">
                Based on market analysis and vendor patterns, this approach has a high probability 
                of achieving ${result.counterOffer.savings} in savings while maintaining a positive 
                vendor relationship.
              </Text>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
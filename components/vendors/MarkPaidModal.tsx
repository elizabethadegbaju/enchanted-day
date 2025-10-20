'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Avatar,
  Alert,
  AlertIcon,
  Box,
  Flex,
  Progress,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  IconButton,
  Checkbox,
} from '@chakra-ui/react';
import { DollarSign, Receipt, Calendar, CreditCard, FileText, Plus } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  primaryCategory: string;
  totalCost: number;
  depositRequired: number;
  contractSigned: boolean;
  paymentStatus: 'PENDING' | 'DEPOSIT_PAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
}

interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  paymentType: 'DEPOSIT' | 'PARTIAL' | 'FINAL' | 'ADDITIONAL';
}

interface PaymentData {
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'VENMO' | 'PAYPAL' | 'ZELLE' | 'OTHER';
  paymentType: 'DEPOSIT' | 'PARTIAL' | 'FINAL' | 'ADDITIONAL';
  transactionId: string;
  notes: string;
  receiptUploaded: boolean;
  sendConfirmation: boolean;
}

interface MarkPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  paymentHistory?: PaymentRecord[];
  onRecordPayment: (vendorId: string, paymentData: PaymentData) => Promise<void>;
}

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash', icon: DollarSign },
  { value: 'CHECK', label: 'Check', icon: FileText },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: CreditCard },
  { value: 'VENMO', label: 'Venmo', icon: CreditCard },
  { value: 'PAYPAL', label: 'PayPal', icon: CreditCard },
  { value: 'ZELLE', label: 'Zelle', icon: CreditCard },
  { value: 'OTHER', label: 'Other', icon: DollarSign },
];

const PAYMENT_TYPE_COLORS = {
  DEPOSIT: 'blue',
  PARTIAL: 'orange',
  FINAL: 'green',
  ADDITIONAL: 'purple'
};

export function MarkPaidModal({ 
  isOpen, 
  onClose, 
  vendor, 
  paymentHistory = [],
  onRecordPayment
}: MarkPaidModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CREDIT_CARD',
    paymentType: 'DEPOSIT',
    transactionId: '',
    notes: '',
    receiptUploaded: false,
    sendConfirmation: true
  });

  const handleInputChange = (field: keyof PaymentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePaymentSummary = () => {
    if (!vendor) return { totalPaid: 0, remainingBalance: 0, percentPaid: 0 };
    
    const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingBalance = vendor.totalCost - totalPaid;
    const percentPaid = vendor.totalCost > 0 ? (totalPaid / vendor.totalCost) * 100 : 0;
    
    return { totalPaid, remainingBalance, percentPaid };
  };

  const suggestPaymentAmount = (type: string) => {
    if (!vendor) return 0;
    
    const { totalPaid, remainingBalance } = calculatePaymentSummary();
    
    switch (type) {
      case 'DEPOSIT':
        return vendor.depositRequired;
      case 'FINAL':
        return remainingBalance;
      case 'PARTIAL':
        return Math.max(0, remainingBalance / 2);
      default:
        return 0;
    }
  };

  const handlePaymentTypeChange = (type: string) => {
    handleInputChange('paymentType', type);
    const suggestedAmount = suggestPaymentAmount(type);
    if (suggestedAmount > 0) {
      handleInputChange('amount', suggestedAmount);
    }
  };

  const validateForm = (): string | null => {
    if (formData.amount <= 0) {
      return 'Payment amount must be greater than 0';
    }

    const { remainingBalance } = calculatePaymentSummary();
    if (formData.paymentType !== 'ADDITIONAL' && formData.amount > remainingBalance) {
      return 'Payment amount cannot exceed remaining balance';
    }

    if (!formData.paymentDate) {
      return 'Payment date is required';
    }

    if (formData.paymentMethod === 'CHECK' && !formData.transactionId.trim()) {
      return 'Check number is required for check payments';
    }

    return null;
  };

  const handleSave = async () => {
    try {
      if (!vendor) return;

      const validationError = validateForm();
      if (validationError) {
        toast({
          title: 'Validation Error',
          description: validationError,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);
      await onRecordPayment(vendor.id, formData);
      
      toast({
        title: 'Payment Recorded',
        description: `Payment of $${formData.amount.toLocaleString()} has been recorded for ${vendor.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'CREDIT_CARD',
        paymentType: 'DEPOSIT',
        transactionId: '',
        notes: '',
        receiptUploaded: false,
        sendConfirmation: true
      });
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPaymentMethod = (method: string) => {
    const methodConfig = PAYMENT_METHODS.find(m => m.value === method);
    return methodConfig?.label || method;
  };

  if (!vendor) return null;

  const { totalPaid, remainingBalance, percentPaid } = calculatePaymentSummary();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Avatar name={vendor.name} size="sm" />
            <Box>
              <Text>Record Payment - {vendor.name}</Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.600">
                {vendor.primaryCategory}
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Payment Summary */}
            <Card variant="outline">
              <CardHeader>
                <Text fontWeight="bold">Payment Overview</Text>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={4}>
                  <Stat>
                    <StatLabel>Total Contract</StatLabel>
                    <StatNumber>${vendor.totalCost.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      {vendor.contractSigned ? 'Contract Signed' : 'Contract Pending'}
                    </StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Paid to Date</StatLabel>
                    <StatNumber color="green.500">${totalPaid.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      {percentPaid.toFixed(1)}% complete
                    </StatHelpText>
                  </Stat>
                  
                  <Stat>
                    <StatLabel>Remaining Balance</StatLabel>
                    <StatNumber color={remainingBalance > 0 ? "orange.500" : "green.500"}>
                      ${remainingBalance.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>
                      {remainingBalance <= 0 ? 'Fully Paid' : 'Outstanding'}
                    </StatHelpText>
                  </Stat>
                </Grid>
                
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="semibold">Payment Progress</Text>
                    <Text fontSize="sm" color="gray.600">
                      {percentPaid.toFixed(1)}% Complete
                    </Text>
                  </HStack>
                  <Progress 
                    value={percentPaid} 
                    colorScheme={percentPaid >= 100 ? "green" : "blue"} 
                    size="lg" 
                    borderRadius="md"
                  />
                </Box>
              </CardBody>
            </Card>

            <Divider />

            {/* New Payment Form */}
            <Card variant="outline">
              <CardHeader>
                <Text fontWeight="bold">Record New Payment</Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Payment Type</FormLabel>
                      <Select
                        value={formData.paymentType}
                        onChange={(e) => handlePaymentTypeChange(e.target.value)}
                      >
                        <option value="DEPOSIT">Deposit Payment</option>
                        <option value="PARTIAL">Partial Payment</option>
                        <option value="FINAL">Final Payment</option>
                        <option value="ADDITIONAL">Additional/Extra Payment</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Amount</FormLabel>
                      <NumberInput
                        value={formData.amount}
                        onChange={(_, value) => handleInputChange('amount', value || 0)}
                        min={0}
                      >
                        <NumberInputField placeholder="Payment amount ($)" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </Grid>

                  {/* Quick Amount Buttons */}
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>Quick Amount Options:</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {vendor.depositRequired > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInputChange('amount', vendor.depositRequired)}
                        >
                          Deposit: ${vendor.depositRequired.toLocaleString()}
                        </Button>
                      )}
                      {remainingBalance > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInputChange('amount', remainingBalance)}
                        >
                          Full Balance: ${remainingBalance.toLocaleString()}
                        </Button>
                      )}
                      {remainingBalance > 100 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInputChange('amount', Math.round(remainingBalance / 2))}
                        >
                          Half Balance: ${Math.round(remainingBalance / 2).toLocaleString()}
                        </Button>
                      )}
                    </HStack>
                  </Box>

                  <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Payment Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      >
                        {PAYMENT_METHODS.map(method => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel>
                      {formData.paymentMethod === 'CHECK' ? 'Check Number' : 
                       formData.paymentMethod === 'BANK_TRANSFER' ? 'Transaction Reference' :
                       'Transaction ID / Reference'}
                    </FormLabel>
                    <Input
                      placeholder={
                        formData.paymentMethod === 'CHECK' ? 'Enter check number' :
                        formData.paymentMethod === 'CASH' ? 'Receipt number (optional)' :
                        'Enter transaction ID or reference'
                      }
                      value={formData.transactionId}
                      onChange={(e) => handleInputChange('transactionId', e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Payment Notes</FormLabel>
                    <Textarea
                      placeholder="Add any notes about this payment (optional)"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                    />
                  </FormControl>

                  <VStack spacing={2} align="stretch">
                    <Checkbox
                      isChecked={formData.receiptUploaded}
                      onChange={(e) => handleInputChange('receiptUploaded', e.target.checked)}
                    >
                      I have uploaded/saved the receipt for this payment
                    </Checkbox>

                    <Checkbox
                      isChecked={formData.sendConfirmation}
                      onChange={(e) => handleInputChange('sendConfirmation', e.target.checked)}
                    >
                      Send payment confirmation to vendor
                    </Checkbox>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Payment History */}
            {paymentHistory.length > 0 && (
              <Card variant="outline">
                <CardHeader>
                  <Text fontWeight="bold">Payment History</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {paymentHistory.map((payment) => (
                      <HStack key={payment.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                        <Box flex={1}>
                          <HStack spacing={2} mb={1}>
                            <Badge colorScheme={PAYMENT_TYPE_COLORS[payment.paymentType]}>
                              {payment.paymentType}
                            </Badge>
                            <Text fontWeight="semibold" color="green.600">
                              ${payment.amount.toLocaleString()}
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {formatPaymentMethod(payment.paymentMethod)} • {formatDate(payment.paymentDate)}
                          </Text>
                          {payment.transactionId && (
                            <Text fontSize="xs" color="gray.500">
                              Ref: {payment.transactionId}
                            </Text>
                          )}
                          {payment.notes && (
                            <Text fontSize="sm" mt={1}>
                              {payment.notes}
                            </Text>
                          )}
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Payment Calculation Alert */}
            {formData.amount > 0 && (
              <Alert 
                status={formData.amount > remainingBalance ? "warning" : "info"} 
                borderRadius="md"
              >
                <AlertIcon />
                <Box>
                  <Text fontWeight="semibold">Payment Impact</Text>
                  <Text fontSize="sm">
                    {formData.amount > remainingBalance ? (
                      <>This payment exceeds the remaining balance by ${(formData.amount - remainingBalance).toLocaleString()}</>
                    ) : remainingBalance - formData.amount <= 0 ? (
                      <>This payment will mark the vendor as fully paid</>
                    ) : (
                      <>After this payment, ${(remainingBalance - formData.amount).toLocaleString()} will remain</>
                    )}
                  </Text>
                </Box>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button 
            colorScheme="green" 
            onClick={handleSave} 
            isLoading={loading}
            leftIcon={<Receipt size={16} />}
          >
            Record Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
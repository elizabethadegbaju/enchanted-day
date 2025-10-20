'use client';

import React, { useState, useCallback } from 'react';
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
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Code,
  Link,
} from '@chakra-ui/react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ImportedGuest {
  name: string;
  email: string;
  phone: string;
  relationship: string;
  side: 'BRIDE' | 'GROOM';
  inviteGroup: string;
  dietaryRestrictions: string[];
  plusOneName: string;
  isValid: boolean;
  errors: string[];
}

interface ImportGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (guests: ImportedGuest[]) => Promise<void>;
}

export function ImportGuestsModal({ isOpen, onClose, onImport }: ImportGuestsModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Processing
  const [importedGuests, setImportedGuests] = useState<ImportedGuest[]>([]);
  const [validGuests, setValidGuests] = useState<ImportedGuest[]>([]);
  const [invalidGuests, setInvalidGuests] = useState<ImportedGuest[]>([]);

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const validateGuest = (guest: Partial<ImportedGuest>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!guest.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!guest.relationship?.trim()) {
      errors.push('Relationship is required');
    }
    
    if (!guest.side || !['BRIDE', 'GROOM'].includes(guest.side)) {
      errors.push('Side must be either BRIDE or GROOM');
    }
    
    if (guest.email && !guest.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const parseCSVContent = (content: string): ImportedGuest[] => {
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map((line, index) => {
      const columns = parseCSVLine(line);
      
      const guest: Partial<ImportedGuest> = {
        name: columns[0]?.replace(/"/g, '') || '',
        email: columns[1]?.replace(/"/g, '') || '',
        phone: columns[2]?.replace(/"/g, '') || '',
        relationship: columns[3]?.replace(/"/g, '') || '',
        side: (columns[4]?.replace(/"/g, '').toUpperCase() as 'BRIDE' | 'GROOM') || 'BRIDE',
        inviteGroup: columns[5]?.replace(/"/g, '') || '',
        dietaryRestrictions: columns[6] ? columns[6].replace(/"/g, '').split(';').filter(Boolean) : [],
        plusOneName: columns[7]?.replace(/"/g, '') || ''
      };
      
      const validation = validateGuest(guest);
      
      return {
        ...guest,
        isValid: validation.isValid,
        errors: validation.errors
      } as ImportedGuest;
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a CSV file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const guests = parseCSVContent(content);
        
        setImportedGuests(guests);
        setValidGuests(guests.filter(g => g.isValid));
        setInvalidGuests(guests.filter(g => !g.isValid));
        setStep(2);
        
        toast({
          title: 'File Parsed Successfully',
          description: `Found ${guests.length} guests in the file`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error parsing CSV:', error);
        toast({
          title: 'Parse Error',
          description: error instanceof Error ? error.message : 'Failed to parse CSV file',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    reader.readAsText(file);
  }, [toast]);

  const handleImport = async () => {
    try {
      setLoading(true);
      setStep(3);
      
      await onImport(validGuests);
      
      toast({
        title: 'Import Successful',
        description: `Successfully imported ${validGuests.length} guests`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error importing guests:', error);
      toast({
        title: 'Import Error',
        description: 'Failed to import guests. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setStep(2); // Go back to preview
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `Name,Email,Phone,Relationship,Side,InviteGroup,DietaryRestrictions,PlusOneName
John Doe,john@example.com,(555) 123-4567,Close Friend,BRIDE,College Friends,Vegetarian;Gluten-Free,Jane Doe
Mary Smith,mary@example.com,(555) 987-6543,Cousin,GROOM,Family,,
Bob Johnson,bob@example.com,(555) 456-7890,Colleague,BRIDE,Work Team,Nut Allergies,`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'guest_list_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Template Downloaded',
      description: 'CSV template has been downloaded to your device',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClose = () => {
    if (!loading) {
      setStep(1);
      setImportedGuests([]);
      setValidGuests([]);
      setInvalidGuests([]);
      onClose();
    }
  };

  const renderUploadStep = () => (
    <VStack spacing={6} align="stretch">
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <AlertDescription>
          Import your guest list from a CSV file. Make sure your file follows the required format.
        </AlertDescription>
      </Alert>

      <Card variant="outline">
        <CardHeader>
          <Text fontWeight="bold">Required CSV Format</Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Text fontSize="sm">Your CSV file should have these columns in order:</Text>
            <Code p={3} borderRadius="md" fontSize="sm">
              Name, Email, Phone, Relationship, Side, InviteGroup, DietaryRestrictions, PlusOneName
            </Code>
            <VStack align="stretch" spacing={2} fontSize="sm">
              <Text><strong>Side:</strong> Must be either "BRIDE" or "GROOM"</Text>
              <Text><strong>DietaryRestrictions:</strong> Separate multiple restrictions with semicolons (;)</Text>
              <Text><strong>Required fields:</strong> Name, Relationship, Side</Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      <Button
        leftIcon={<Download size={16} />}
        variant="outline"
        onClick={handleDownloadTemplate}
      >
        Download CSV Template
      </Button>

      <Divider />

      <VStack spacing={4}>
        <Text fontWeight="semibold">Upload Your Guest List</Text>
        <Box
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          textAlign="center"
          position="relative"
          _hover={{ borderColor: 'purple.400' }}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <VStack spacing={2}>
            <Upload size={32} color="gray" />
            <Text>Click to upload or drag and drop</Text>
            <Text fontSize="sm" color="gray.500">CSV files only</Text>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );

  const renderPreviewStep = () => (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="bold">Import Preview</Text>
        <HStack spacing={2}>
          <Badge colorScheme="green" p={2}>
            {validGuests.length} Valid
          </Badge>
          {invalidGuests.length > 0 && (
            <Badge colorScheme="red" p={2}>
              {invalidGuests.length} Invalid
            </Badge>
          )}
        </HStack>
      </HStack>

      {invalidGuests.length > 0 && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertDescription>
            Some guests have validation errors and will not be imported. Please fix the issues in your CSV file and try again.
          </AlertDescription>
        </Alert>
      )}

      <Box maxH="400px" overflowY="auto">
        <Table size="sm" variant="simple">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th>Status</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Relationship</Th>
              <Th>Side</Th>
              <Th>Issues</Th>
            </Tr>
          </Thead>
          <Tbody>
            {importedGuests.map((guest, index) => (
              <Tr key={index}>
                <Td>
                  {guest.isValid ? (
                    <CheckCircle2 size={16} color="green" />
                  ) : (
                    <X size={16} color="red" />
                  )}
                </Td>
                <Td>{guest.name}</Td>
                <Td>{guest.email || '-'}</Td>
                <Td>{guest.relationship}</Td>
                <Td>
                  <Badge colorScheme={guest.side === 'BRIDE' ? 'pink' : 'blue'} variant="subtle">
                    {guest.side}
                  </Badge>
                </Td>
                <Td>
                  {guest.errors.length > 0 ? (
                    <VStack align="start" spacing={1}>
                      {guest.errors.map((error, idx) => (
                        <Text key={idx} fontSize="xs" color="red.500">
                          {error}
                        </Text>
                      ))}
                    </VStack>
                  ) : (
                    <Badge colorScheme="green" variant="subtle">Valid</Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );

  const renderProcessingStep = () => (
    <VStack spacing={6} align="center" py={8}>
      <FileSpreadsheet size={48} color="purple" />
      <Text fontSize="lg" fontWeight="bold">Importing Guests...</Text>
      <Progress value={85} width="300px" colorScheme="purple" />
      <Text color="gray.600">Adding {validGuests.length} guests to your wedding</Text>
    </VStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import Guest List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 && renderUploadStep()}
          {step === 2 && renderPreviewStep()}
          {step === 3 && renderProcessingStep()}
        </ModalBody>

        <ModalFooter>
          {step === 1 && (
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          )}
          
          {step === 2 && (
            <>
              <Button variant="ghost" mr={3} onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                colorScheme="purple" 
                onClick={handleImport}
                isDisabled={validGuests.length === 0}
              >
                Import {validGuests.length} Guests
              </Button>
            </>
          )}
          
          {step === 3 && (
            <Button variant="ghost" isDisabled>
              Importing...
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
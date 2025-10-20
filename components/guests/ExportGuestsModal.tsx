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
  Text,
  Checkbox,
  Select,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
  useToast,
  Card,
  CardBody,
  Badge,
  Grid,
  Box,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import { Download, FileText, FileSpreadsheet, Users } from 'lucide-react';
import type { GuestListData } from '@/lib/wedding-data-service';

interface ExportGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: GuestListData[];
}

type ExportFormat = 'csv' | 'pdf' | 'excel';

interface ExportOptions {
  format: ExportFormat;
  includeFields: string[];
  rsvpFilter: 'all' | 'confirmed' | 'pending' | 'declined';
  sideFilter: 'all' | 'bride' | 'groom';
  includePlusOnes: boolean;
  groupByTable: boolean;
  includeContactInfo: boolean;
  includeDietaryRestrictions: boolean;
}

const EXPORT_FIELDS = [
  { id: 'name', label: 'Name', required: true },
  { id: 'email', label: 'Email Address' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'relationship', label: 'Relationship' },
  { id: 'side', label: 'Bride/Groom Side' },
  { id: 'rsvpStatus', label: 'RSVP Status' },
  { id: 'inviteGroup', label: 'Invite Group' },
  { id: 'tableAssignment', label: 'Table Assignment' },
  { id: 'dietaryRestrictions', label: 'Dietary Restrictions' },
  { id: 'plusOne', label: 'Plus One Information' },
  { id: 'notes', label: 'Notes' }
];

export function ExportGuestsModal({ isOpen, onClose, guests }: ExportGuestsModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeFields: ['name', 'email', 'phone', 'relationship', 'side', 'rsvpStatus'],
    rsvpFilter: 'all',
    sideFilter: 'all',
    includePlusOnes: true,
    groupByTable: false,
    includeContactInfo: true,
    includeDietaryRestrictions: false
  });

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filterGuests = (): GuestListData[] => {
    let filtered = [...guests];

    // Apply RSVP filter
    if (exportOptions.rsvpFilter !== 'all') {
      const statusMap = {
        'confirmed': 'ATTENDING',
        'pending': 'PENDING',
        'declined': 'DECLINED'
      };
      filtered = filtered.filter(guest => 
        guest.rsvpStatus === statusMap[exportOptions.rsvpFilter as keyof typeof statusMap]
      );
    }

    // Apply side filter
    if (exportOptions.sideFilter !== 'all') {
      const side = exportOptions.sideFilter.toUpperCase();
      filtered = filtered.filter(guest => guest.side === side);
    }

    return filtered;
  };

  const generateCSV = (filteredGuests: GuestListData[]): string => {
    const headers = exportOptions.includeFields
      .map(fieldId => EXPORT_FIELDS.find(f => f.id === fieldId)?.label)
      .filter(Boolean);

    const rows = filteredGuests.map(guest => {
      return exportOptions.includeFields.map(fieldId => {
        switch (fieldId) {
          case 'name':
            return `"${guest.name}"`;
          case 'email':
            return `"${guest.email || ''}"`;
          case 'phone':
            return `"${guest.phone || ''}"`;
          case 'relationship':
            return `"${guest.relationship}"`;
          case 'side':
            return `"${guest.side === 'BRIDE' ? "Bride's Side" : "Groom's Side"}"`;
          case 'rsvpStatus':
            return `"${guest.rsvpStatus}"`;
          case 'inviteGroup':
            return `"${guest.inviteGroup || ''}"`;
          case 'tableAssignment':
            return `"${guest.tableAssignment || ''}"`;
          case 'dietaryRestrictions':
            return `"${guest.dietaryRestrictions?.join('; ') || ''}"`;
          case 'plusOne':
            return exportOptions.includePlusOnes && guest.plusOne
              ? `"${guest.plusOne.name} (${guest.plusOne.rsvpStatus})"`
              : '""';
          default:
            return '""';
        }
      }).join(',');
    });

    // Add plus one rows if enabled
    if (exportOptions.includePlusOnes) {
      filteredGuests.forEach(guest => {
        if (guest.plusOne) {
          const plusOneRow = exportOptions.includeFields.map(fieldId => {
            switch (fieldId) {
              case 'name':
                return `"${guest.plusOne!.name} (Plus One of ${guest.name})"`;
              case 'rsvpStatus':
                return `"${guest.plusOne!.rsvpStatus}"`;
              case 'side':
                return `"${guest.side === 'BRIDE' ? "Bride's Side" : "Groom's Side"}"`;
              case 'relationship':
                return `"Plus One"`;
              case 'inviteGroup':
                return `"${guest.inviteGroup || ''}"`;
              case 'tableAssignment':
                return `"${guest.tableAssignment || ''}"`;
              default:
                return '""';
            }
          }).join(',');
          rows.push(plusOneRow);
        }
      });
    }

    return [headers.join(','), ...rows].join('\n');
  };

  const generatePDFContent = (filteredGuests: GuestListData[]): string => {
    // This would typically use a PDF library like jsPDF
    // For now, we'll return formatted text content
    const title = 'Wedding Guest List Export\n\n';
    const stats = `Total Guests: ${filteredGuests.length}\n`;
    const confirmed = filteredGuests.filter(g => g.rsvpStatus === 'ATTENDING').length;
    const pending = filteredGuests.filter(g => g.rsvpStatus === 'PENDING').length;
    const declined = filteredGuests.filter(g => g.rsvpStatus === 'DECLINED').length;
    
    const rsvpStats = `RSVP Stats: ${confirmed} Confirmed, ${pending} Pending, ${declined} Declined\n\n`;
    
    const guestList = filteredGuests.map(guest => {
      let guestInfo = `${guest.name} - ${guest.relationship} (${guest.side === 'BRIDE' ? "Bride's Side" : "Groom's Side"})`;
      guestInfo += `\n  RSVP: ${guest.rsvpStatus}`;
      
      if (guest.email) guestInfo += `\n  Email: ${guest.email}`;
      if (guest.phone) guestInfo += `\n  Phone: ${guest.phone}`;
      if (guest.tableAssignment) guestInfo += `\n  Table: ${guest.tableAssignment}`;
      if (guest.dietaryRestrictions?.length) guestInfo += `\n  Dietary: ${guest.dietaryRestrictions.join(', ')}`;
      if (guest.plusOne && exportOptions.includePlusOnes) {
        guestInfo += `\n  Plus One: ${guest.plusOne.name} (${guest.plusOne.rsvpStatus})`;
      }
      
      return guestInfo;
    }).join('\n\n');

    return title + stats + rsvpStats + guestList;
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      
      const filteredGuests = filterGuests();
      
      if (filteredGuests.length === 0) {
        toast({
          title: 'No Guests to Export',
          description: 'No guests match your current filter criteria',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      let content = '';
      let filename = '';
      let mimeType = '';

      switch (exportOptions.format) {
        case 'csv':
          content = generateCSV(filteredGuests);
          filename = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv;charset=utf-8;';
          break;
        
        case 'pdf':
          content = generatePDFContent(filteredGuests);
          filename = `guest-list-${new Date().toISOString().split('T')[0]}.txt`;
          mimeType = 'text/plain;charset=utf-8;';
          break;
        
        case 'excel':
          // For Excel, we'll use CSV with .xlsx extension as a simple approach
          content = generateCSV(filteredGuests);
          filename = `guest-list-${new Date().toISOString().split('T')[0]}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: `${filteredGuests.length} guests exported to ${filename}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error exporting guests:', error);
      toast({
        title: 'Export Error',
        description: 'Failed to export guest list. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCount = () => {
    return filterGuests().length;
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
      case 'excel':
        return <FileSpreadsheet size={16} />;
      case 'pdf':
        return <FileText size={16} />;
      default:
        return <Download size={16} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export Guest List</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Export Summary */}
            <Card variant="outline">
              <CardBody>
                <HStack justify="space-between" align="center">
                  <HStack>
                    <Users size={20} />
                    <Text fontWeight="semibold">Export Summary</Text>
                  </HStack>
                  <Badge colorScheme="purple" p={2} fontSize="sm">
                    {getFilteredCount()} guests selected
                  </Badge>
                </HStack>
              </CardBody>
            </Card>

            {/* Export Format */}
            <FormControl>
              <FormLabel fontWeight="semibold">Export Format</FormLabel>
              <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                {(['csv', 'pdf', 'excel'] as ExportFormat[]).map(format => (
                  <Card
                    key={format}
                    variant={exportOptions.format === format ? 'solid' : 'outline'}
                    bg={exportOptions.format === format ? 'purple.50' : 'transparent'}
                    borderColor={exportOptions.format === format ? 'purple.200' : 'gray.200'}
                    cursor="pointer"
                    onClick={() => handleOptionChange('format', format)}
                    _hover={{ borderColor: 'purple.300' }}
                  >
                    <CardBody textAlign="center" py={3}>
                      <VStack spacing={2}>
                        {getFormatIcon(format)}
                        <Text fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                          {format}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </FormControl>

            {/* Filters */}
            <VStack spacing={4} align="stretch">
              <Text fontWeight="semibold">Filter Options</Text>
              
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm">RSVP Status</FormLabel>
                  <Select
                    size="sm"
                    value={exportOptions.rsvpFilter}
                    onChange={(e) => handleOptionChange('rsvpFilter', e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="declined">Declined Only</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Wedding Side</FormLabel>
                  <Select
                    size="sm"
                    value={exportOptions.sideFilter}
                    onChange={(e) => handleOptionChange('sideFilter', e.target.value)}
                  >
                    <option value="all">Both Sides</option>
                    <option value="bride">Bride's Side Only</option>
                    <option value="groom">Groom's Side Only</option>
                  </Select>
                </FormControl>
              </Grid>
            </VStack>

            {/* Include Fields */}
            <FormControl>
              <FormLabel fontWeight="semibold">Include Fields</FormLabel>
              <CheckboxGroup
                value={exportOptions.includeFields}
                onChange={(values) => handleOptionChange('includeFields', values)}
              >
                <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                  {EXPORT_FIELDS.map(field => (
                    <Checkbox
                      key={field.id}
                      value={field.id}
                      isDisabled={field.required}
                      size="sm"
                    >
                      <Text fontSize="sm">{field.label}</Text>
                      {field.required && (
                        <Badge ml={1} size="xs" colorScheme="red">Required</Badge>
                      )}
                    </Checkbox>
                  ))}
                </Grid>
              </CheckboxGroup>
            </FormControl>

            <Divider />

            {/* Additional Options */}
            <VStack spacing={3} align="stretch">
              <Text fontWeight="semibold">Additional Options</Text>
              
              <Checkbox
                isChecked={exportOptions.includePlusOnes}
                onChange={(e) => handleOptionChange('includePlusOnes', e.target.checked)}
                size="sm"
              >
                Include Plus One information
              </Checkbox>

              <Checkbox
                isChecked={exportOptions.groupByTable}
                onChange={(e) => handleOptionChange('groupByTable', e.target.checked)}
                size="sm"
              >
                Group guests by table assignment
              </Checkbox>
            </VStack>

            {getFilteredCount() === 0 && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <AlertDescription>
                  No guests match your current filter criteria. Please adjust your filters.
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleExport}
            isLoading={loading}
            isDisabled={getFilteredCount() === 0}
            leftIcon={<Download size={16} />}
          >
            Export {getFilteredCount()} Guests
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
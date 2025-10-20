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
  Text,
  Divider,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Alert,
  AlertIcon,
  Box,
  Flex,
} from '@chakra-ui/react';
import { Phone, Mail, MessageCircle, Calendar, Send, ExternalLink } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  primaryCategory: string;
  email: string;
  phone: string;
  website?: string;
  preferredContactMethod: 'EMAIL' | 'PHONE';
}

interface CommunicationLog {
  id: string;
  date: string;
  type: 'EMAIL' | 'PHONE' | 'MEETING' | 'TEXT';
  subject?: string;
  summary: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: 'SENT' | 'RECEIVED' | 'COMPLETED';
}

interface CommunicationData {
  type: 'EMAIL' | 'PHONE' | 'MEETING' | 'TEXT';
  subject?: string;
  message: string;
  followUpRequired: boolean;
  followUpDate?: string;
  scheduledDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface ContactVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSendCommunication: (vendorId: string, communicationData: CommunicationData) => Promise<void>;
  communicationHistory?: CommunicationLog[];
}

const COMMUNICATION_TYPES = [
  { value: 'EMAIL', label: 'Email', icon: Mail },
  { value: 'PHONE', label: 'Phone Call', icon: Phone },
  { value: 'MEETING', label: 'Meeting', icon: Calendar },
  { value: 'TEXT', label: 'Text Message', icon: MessageCircle },
];

const PRIORITY_COLORS = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  URGENT: 'red'
};

export function ContactVendorModal({ 
  isOpen, 
  onClose, 
  vendor, 
  onSendCommunication,
  communicationHistory = []
}: ContactVendorModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState<CommunicationData>({
    type: vendor?.preferredContactMethod || 'EMAIL',
    subject: '',
    message: '',
    followUpRequired: false,
    followUpDate: '',
    scheduledDate: '',
    priority: 'MEDIUM'
  });

  const handleInputChange = (field: keyof CommunicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.message.trim()) {
      return 'Message content is required';
    }

    if (formData.type === 'EMAIL' && !formData.subject?.trim()) {
      return 'Email subject is required';
    }

    if (formData.followUpRequired && !formData.followUpDate) {
      return 'Follow-up date is required when follow-up is requested';
    }

    if (formData.type === 'MEETING' && !formData.scheduledDate) {
      return 'Meeting date and time is required';
    }

    return null;
  };

  const handleSend = async () => {
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
      await onSendCommunication(vendor.id, formData);
      
      toast({
        title: 'Communication Sent',
        description: `Your ${formData.type.toLowerCase()} to ${vendor.name} has been recorded`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      handleClose();
    } catch (error) {
      console.error('Error sending communication:', error);
      toast({
        title: 'Error',
        description: 'Failed to send communication. Please try again.',
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
        type: vendor?.preferredContactMethod || 'EMAIL',
        subject: '',
        message: '',
        followUpRequired: false,
        followUpDate: '',
        scheduledDate: '',
        priority: 'MEDIUM'
      });
      setActiveTab(0);
      onClose();
    }
  };

  const getQuickTemplate = (template: string) => {
    const templates = {
      'availability': {
        subject: 'Wedding Service Availability Inquiry',
        message: `Hi ${vendor?.name || ''},\n\nI hope this message finds you well. I'm reaching out to inquire about your availability for our upcoming wedding.\n\nWedding Date: [Please insert your wedding date]\nVenue: [Please insert venue name and location]\nGuest Count: [Please insert estimated guest count]\n\nWe're particularly interested in your ${vendor?.primaryCategory?.toLowerCase()} services and would love to discuss the details with you.\n\nCould we schedule a time to chat about our requirements and your availability?\n\nLooking forward to hearing from you!\n\nBest regards,`
      },
      'pricing': {
        subject: 'Wedding Service Pricing Information',
        message: `Hello ${vendor?.name || ''},\n\nThank you for your time yesterday. Following up on our conversation about ${vendor?.primaryCategory?.toLowerCase()} services for our wedding.\n\nCould you please provide:\n- Detailed pricing for your packages\n- What's included in each package\n- Any additional costs we should be aware of\n- Payment schedule and terms\n\nWe're planning to make our final decisions by [insert date], so any information you can provide would be greatly appreciated.\n\nThank you for your assistance!\n\nBest regards,`
      },
      'followup': {
        subject: 'Following Up on Our Wedding Discussion',
        message: `Hi ${vendor?.name || ''},\n\nI wanted to follow up on our recent conversation about ${vendor?.primaryCategory?.toLowerCase()} services for our wedding.\n\nHave you had a chance to review the details we discussed? We're still very interested in working with you and would appreciate any updates you might have.\n\nPlease let me know if you need any additional information from our end.\n\nThank you for your time!\n\nBest regards,`
      },
      'contract': {
        subject: 'Contract and Next Steps Discussion',
        message: `Hello ${vendor?.name || ''},\n\nWe're excited to move forward with your ${vendor?.primaryCategory?.toLowerCase()} services for our wedding!\n\nCould we please discuss the next steps:\n- Contract terms and signing process\n- Deposit amount and payment schedule\n- Timeline for deliverables\n- Any preparations needed from our side\n\nWhen would be a good time for you to walk us through these details?\n\nLooking forward to working with you!\n\nBest regards,`
      }
    };
    
    return templates[template as keyof typeof templates];
  };

  const applyTemplate = (template: string) => {
    const templateData = getQuickTemplate(template);
    if (templateData) {
      setFormData(prev => ({
        ...prev,
        subject: templateData.subject,
        message: templateData.message
      }));
    }
  };

  const formatCommunicationType = (type: string) => {
    const typeConfig = COMMUNICATION_TYPES.find(t => t.value === type);
    return typeConfig?.label || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!vendor) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Avatar name={vendor.name} size="sm" />
            <Box>
              <Text>Contact {vendor.name}</Text>
              <Text fontSize="sm" fontWeight="normal" color="gray.600">
                {vendor.primaryCategory}
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>New Communication</Tab>
              <Tab>History ({communicationHistory.length})</Tab>
              <Tab>Contact Info</Tab>
            </TabList>

            <TabPanels>
              {/* New Communication Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="semibold">Preferred Contact Method</Text>
                      <Text fontSize="sm">
                        {vendor.name} prefers to be contacted via {' '}
                        <Badge colorScheme="purple">
                          {vendor.preferredContactMethod === 'EMAIL' ? 'Email' : 'Phone'}
                        </Badge>
                      </Text>
                    </Box>
                  </Alert>

                  <FormControl>
                    <FormLabel>Communication Type</FormLabel>
                    <Select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      {COMMUNICATION_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </FormControl>

                  {(formData.type === 'EMAIL') && (
                    <FormControl isRequired>
                      <FormLabel>Subject</FormLabel>
                      <Input
                        placeholder="Enter email subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </FormControl>
                  )}

                  {formData.type === 'MEETING' && (
                    <FormControl isRequired>
                      <FormLabel>Meeting Date & Time</FormLabel>
                      <Input
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                      />
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel>Quick Templates</FormLabel>
                    <HStack spacing={2} flexWrap="wrap">
                      <Button size="sm" variant="outline" onClick={() => applyTemplate('availability')}>
                        Availability Inquiry
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyTemplate('pricing')}>
                        Pricing Request
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyTemplate('followup')}>
                        Follow-up
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => applyTemplate('contract')}>
                        Contract Discussion
                      </Button>
                    </HStack>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>
                      {formData.type === 'EMAIL' ? 'Email Content' : 
                       formData.type === 'PHONE' ? 'Call Notes/Agenda' :
                       formData.type === 'MEETING' ? 'Meeting Agenda' : 'Message Content'}
                    </FormLabel>
                    <Textarea
                      placeholder={
                        formData.type === 'EMAIL' ? 'Enter your email message...' :
                        formData.type === 'PHONE' ? 'Enter call notes or agenda...' :
                        formData.type === 'MEETING' ? 'Enter meeting agenda and discussion points...' :
                        'Enter your message...'
                      }
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={8}
                    />
                  </FormControl>

                  <Divider />

                  <FormControl display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      checked={formData.followUpRequired}
                      onChange={(e) => handleInputChange('followUpRequired', e.target.checked)}
                    />
                    <FormLabel htmlFor="followUpRequired" ml={2} mb={0}>
                      Schedule follow-up reminder
                    </FormLabel>
                  </FormControl>

                  {formData.followUpRequired && (
                    <FormControl>
                      <FormLabel>Follow-up Date</FormLabel>
                      <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                      />
                    </FormControl>
                  )}
                </VStack>
              </TabPanel>

              {/* Communication History Tab */}
              <TabPanel px={0}>
                <VStack spacing={3} align="stretch">
                  {communicationHistory.length === 0 ? (
                    <Alert status="info">
                      <AlertIcon />
                      No communication history with this vendor yet.
                    </Alert>
                  ) : (
                    communicationHistory.map((comm) => (
                      <Card key={comm.id} variant="outline">
                        <CardBody>
                          <HStack justify="space-between" align="start">
                            <Box flex={1}>
                              <HStack spacing={2} mb={2}>
                                <Badge colorScheme="blue">{formatCommunicationType(comm.type)}</Badge>
                                <Badge colorScheme={comm.status === 'COMPLETED' ? 'green' : 'gray'}>
                                  {comm.status}
                                </Badge>
                                {comm.followUpRequired && (
                                  <Badge colorScheme="orange">Follow-up Required</Badge>
                                )}
                              </HStack>
                              
                              {comm.subject && (
                                <Text fontWeight="semibold" mb={1}>{comm.subject}</Text>
                              )}
                              
                              <Text fontSize="sm" color="gray.600" mb={2}>
                                {comm.summary}
                              </Text>
                              
                              <Text fontSize="xs" color="gray.500">
                                {formatDate(comm.date)}
                              </Text>
                              
                              {comm.followUpDate && (
                                <Text fontSize="xs" color="orange.500">
                                  Follow-up: {new Date(comm.followUpDate).toLocaleDateString()}
                                </Text>
                              )}
                            </Box>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))
                  )}
                </VStack>
              </TabPanel>

              {/* Contact Information Tab */}
              <TabPanel px={0}>
                <VStack spacing={4} align="stretch">
                  <Card variant="outline">
                    <CardHeader>
                      <Text fontWeight="bold">Contact Details</Text>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack>
                          <Mail size={16} />
                          <Text flex={1}>{vendor.email}</Text>
                          <Button size="sm" leftIcon={<ExternalLink size={14} />}>
                            Email
                          </Button>
                        </HStack>
                        
                        <HStack>
                          <Phone size={16} />
                          <Text flex={1}>{vendor.phone}</Text>
                          <Button size="sm" leftIcon={<ExternalLink size={14} />}>
                            Call
                          </Button>
                        </HStack>
                        
                        {vendor.website && (
                          <HStack>
                            <ExternalLink size={16} />
                            <Text flex={1}>{vendor.website}</Text>
                            <Button 
                              size="sm" 
                              leftIcon={<ExternalLink size={14} />}
                              onClick={() => window.open(vendor.website, '_blank')}
                            >
                              Visit
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardHeader>
                      <Text fontWeight="bold">Communication Preferences</Text>
                    </CardHeader>
                    <CardBody>
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="semibold">Preferred Method</Text>
                          <Text fontSize="sm">
                            {vendor.preferredContactMethod === 'EMAIL' 
                              ? 'This vendor prefers email communication' 
                              : 'This vendor prefers phone communication'
                            }
                          </Text>
                        </Box>
                      </Alert>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button 
            colorScheme="purple" 
            onClick={handleSend} 
            isLoading={loading}
            leftIcon={<Send size={16} />}
            isDisabled={activeTab !== 0}
          >
            Send {formData.type === 'EMAIL' ? 'Email' : 
                  formData.type === 'PHONE' ? 'Log Call' :
                  formData.type === 'MEETING' ? 'Schedule Meeting' : 'Send Message'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
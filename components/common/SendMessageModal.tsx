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
  Textarea,
  Select,
  useToast,
  Text,
  Badge,
} from '@chakra-ui/react';

interface MessageData {
  recipientName: string;
  recipientEmail?: string;
  subject: string;
  message: string;
  type: 'email' | 'sms';
}

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  onSend: (messageData: MessageData) => Promise<void>;
}

export function SendMessageModal({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientEmail, 
  recipientPhone,
  onSend 
}: SendMessageModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Predefined message templates
  const templates = {
    email: {
      rsvp_reminder: {
        subject: 'RSVP Reminder - Our Wedding',
        message: `Dear ${recipientName},\n\nWe hope you're as excited as we are about our upcoming wedding! We wanted to reach out as we haven't received your RSVP yet.\n\nPlease let us know if you'll be able to join us for our special day. You can RSVP through our wedding website or simply reply to this email.\n\nWe can't wait to celebrate with you!\n\nWith love,\n[Couple Names]`
      },
      save_the_date: {
        subject: 'Save the Date - We\'re Getting Married!',
        message: `Dear ${recipientName},\n\nWe're thrilled to announce that we're getting married!\n\nPlease save the date and we'll send you a formal invitation with all the details soon.\n\nWe can't wait to share this special moment with you!\n\nWith excitement,\n[Couple Names]`
      },
      thank_you: {
        subject: 'Thank You!',
        message: `Dear ${recipientName},\n\nThank you so much for celebrating our special day with us! Your presence made our wedding even more meaningful.\n\nWe're so grateful to have you in our lives and appreciate all the love and support you've shown us.\n\nWith gratitude,\n[Couple Names]`
      }
    },
    sms: {
      rsvp_reminder: `Hi ${recipientName}! Just a friendly reminder to RSVP for our wedding. Please let us know if you can make it! 💕`,
      quick_update: `Hi ${recipientName}! Quick wedding update: [Add your update here]. Looking forward to seeing you! 💒`,
      thank_you: `Thank you for being part of our special day, ${recipientName}! Your presence meant the world to us! 💕`
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter a message to send',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (messageType === 'email' && !subject.trim()) {
      toast({
        title: 'Subject Required',
        description: 'Please enter a subject for the email',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await onSend({
        recipientName,
        recipientEmail,
        subject: subject.trim(),
        message: message.trim(),
        type: messageType
      });
      
      toast({
        title: 'Message Sent',
        description: `${messageType === 'email' ? 'Email' : 'SMS'} sent to ${recipientName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = (templateKey: string) => {
    if (messageType === 'email') {
      const template = templates.email[templateKey as keyof typeof templates.email];
      if (template) {
        setSubject(template.subject);
        setMessage(template.message);
      }
    } else {
      const template = templates.sms[templateKey as keyof typeof templates.sms];
      if (template) {
        setMessage(template);
      }
    }
  };

  const canSendEmail = recipientEmail && recipientEmail.length > 0;
  const canSendSMS = recipientPhone && recipientPhone.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Message to {recipientName}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Message Type Selection */}
            <FormControl>
              <FormLabel>Message Type</FormLabel>
              <HStack spacing={4}>
                <Button
                  variant={messageType === 'email' ? 'solid' : 'outline'}
                  colorScheme="purple"
                  onClick={() => setMessageType('email')}
                  disabled={!canSendEmail}
                  size="sm"
                >
                  Email
                  {!canSendEmail && <Badge ml={2} colorScheme="red" variant="subtle">No email</Badge>}
                </Button>
                <Button
                  variant={messageType === 'sms' ? 'solid' : 'outline'}
                  colorScheme="purple"
                  onClick={() => setMessageType('sms')}
                  disabled={!canSendSMS}
                  size="sm"
                >
                  SMS
                  {!canSendSMS && <Badge ml={2} colorScheme="red" variant="subtle">No phone</Badge>}
                </Button>
              </HStack>
            </FormControl>

            {/* Template Selection */}
            <FormControl>
              <FormLabel>Quick Templates</FormLabel>
              <HStack spacing={2} wrap="wrap">
                {messageType === 'email' ? (
                  <>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('rsvp_reminder')}>
                      RSVP Reminder
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('save_the_date')}>
                      Save the Date
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('thank_you')}>
                      Thank You
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('rsvp_reminder')}>
                      RSVP Reminder
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('quick_update')}>
                      Quick Update
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => loadTemplate('thank_you')}>
                      Thank You
                    </Button>
                  </>
                )}
              </HStack>
            </FormControl>

            {/* Recipient Info */}
            <FormControl>
              <FormLabel>Sending To</FormLabel>
              <Text fontSize="sm" color="gray.600">
                {messageType === 'email' 
                  ? `${recipientName} (${recipientEmail})` 
                  : `${recipientName} (${recipientPhone})`
                }
              </Text>
            </FormControl>

            {/* Subject (Email only) */}
            {messageType === 'email' && (
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </FormControl>
            )}

            {/* Message */}
            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={messageType === 'email' ? "Enter your email message..." : "Enter your SMS message..."}
                rows={messageType === 'email' ? 8 : 4}
                maxLength={messageType === 'sms' ? 160 : undefined}
              />
              {messageType === 'sms' && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {message.length}/160 characters
                </Text>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            colorScheme="purple" 
            onClick={handleSend}
            isLoading={loading}
            loadingText="Sending..."
          >
            Send {messageType === 'email' ? 'Email' : 'SMS'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SendMessageModal;
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
  Card,
  CardBody,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';

interface WeddingSettings {
  publicVisibility: boolean;
  guestCanViewBudget: boolean;
  allowGuestRSVP: boolean;
  allowVendorAccess: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface ManageWeddingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wedding: {
    id: string;
    coupleNames: string[];
    status: string;
  };
  onUpdateSettings: (settings: WeddingSettings) => Promise<void>;
}

export function ManageWeddingModal({ isOpen, onClose, wedding, onUpdateSettings }: ManageWeddingModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState<WeddingSettings>({
    publicVisibility: false,
    guestCanViewBudget: false,
    allowGuestRSVP: true,
    allowVendorAccess: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleSettingChange = (setting: keyof WeddingSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await onUpdateSettings(settings);
      
      toast({
        title: 'Settings Updated',
        description: 'Wedding management settings have been successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: 'Export Wedding Data',
      description: 'Wedding data export feature will be implemented with backend integration',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: 'Generate Report',
      description: 'Wedding planning report generation will be implemented',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Wedding - {wedding.coupleNames.join(' & ')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Wedding Status */}
            <Card variant="outline">
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text fontWeight="bold" fontSize="lg">Wedding Status</Text>
                  <HStack justify="space-between">
                    <Text>Current Status:</Text>
                    <Badge 
                      colorScheme={wedding.status === 'PLANNING' ? 'blue' : 'green'} 
                      variant="solid"
                      size="lg"
                    >
                      {wedding.status}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Privacy & Sharing Settings */}
            <Card variant="outline">
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">Privacy & Sharing</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="public-visibility" mb="0" flex={1}>
                      Public Visibility
                      <Text fontSize="sm" color="gray.500">Allow others to find your wedding publicly</Text>
                    </FormLabel>
                    <Switch
                      id="public-visibility"
                      isChecked={settings.publicVisibility}
                      onChange={(e) => handleSettingChange('publicVisibility', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="guest-budget" mb="0" flex={1}>
                      Guest Budget Access
                      <Text fontSize="sm" color="gray.500">Allow guests to view budget information</Text>
                    </FormLabel>
                    <Switch
                      id="guest-budget"
                      isChecked={settings.guestCanViewBudget}
                      onChange={(e) => handleSettingChange('guestCanViewBudget', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Guest Management Settings */}
            <Card variant="outline">
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">Guest Management</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="guest-rsvp" mb="0" flex={1}>
                      Allow Guest RSVP
                      <Text fontSize="sm" color="gray.500">Let guests respond to invitations online</Text>
                    </FormLabel>
                    <Switch
                      id="guest-rsvp"
                      isChecked={settings.allowGuestRSVP}
                      onChange={(e) => handleSettingChange('allowGuestRSVP', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="vendor-access" mb="0" flex={1}>
                      Vendor Access
                      <Text fontSize="sm" color="gray.500">Allow vendors to access relevant information</Text>
                    </FormLabel>
                    <Switch
                      id="vendor-access"
                      isChecked={settings.allowVendorAccess}
                      onChange={(e) => handleSettingChange('allowVendorAccess', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Notification Settings */}
            <Card variant="outline">
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">Notifications</Text>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-notifications" mb="0" flex={1}>
                      Email Notifications
                      <Text fontSize="sm" color="gray.500">Receive updates via email</Text>
                    </FormLabel>
                    <Switch
                      id="email-notifications"
                      isChecked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="sms-notifications" mb="0" flex={1}>
                      SMS Notifications
                      <Text fontSize="sm" color="gray.500">Receive updates via text message</Text>
                    </FormLabel>
                    <Switch
                      id="sms-notifications"
                      isChecked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card variant="outline">
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">Quick Actions</Text>
                  
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={handleExportData} flex={1}>
                      Export Data
                    </Button>
                    <Button variant="outline" onClick={handleGenerateReport} flex={1}>
                      Generate Report
                    </Button>
                  </HStack>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                      Changes to privacy settings may take a few minutes to take effect.
                    </AlertDescription>
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSaveSettings} isLoading={loading}>
            Save Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
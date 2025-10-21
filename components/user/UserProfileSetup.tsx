import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { createUserProfile, type CreateUserProfileInput } from "../../lib/user-profile-service";

interface UserProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated?: () => void;
}

export function UserProfileSetup({ isOpen, onClose, onProfileCreated }: UserProfileSetupProps) {
  const [formData, setFormData] = useState<CreateUserProfileInput>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof CreateUserProfileInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "First name and last name are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const profile = await createUserProfile(formData);
      if (profile) {
        toast({
          title: "Profile created successfully!",
          description: "Your profile has been saved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onProfileCreated?.();
        onClose();
      } else {
        throw new Error("Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error creating profile",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Complete Your Profile</Heading>
          <Text fontSize="sm" fontWeight="normal" color="gray.600" mt={2}>
            Help us personalize your wedding planning experience
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                  placeholder="Enter your first name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                  placeholder="Enter your last name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="pink"
                width="full"
                isLoading={isLoading}
                loadingText="Creating Profile..."
              >
                Create Profile
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
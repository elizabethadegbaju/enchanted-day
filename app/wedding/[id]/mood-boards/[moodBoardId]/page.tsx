'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Image,
  Link,
  Flex,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Divider,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { EditMoodBoardModal } from '@/components/wedding/EditMoodBoardModal';
import { getMoodBoardDetail, deleteMoodBoard, updateMoodBoard } from '@/lib/wedding-data-service';
import type { UIMoodBoard } from '@/types';
import { MoreVertical, Trash2 } from 'lucide-react';

export default function MoodBoardDetailPage({
  params,
}: {
  params: { id: string; moodBoardId: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [moodBoard, setMoodBoard] = useState<UIMoodBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchMoodBoard() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMoodBoardDetail(params.moodBoardId);
        setMoodBoard(data);
      } catch (err) {
        console.error('Error fetching mood board:', err);
        setError(err instanceof Error ? err.message : 'Failed to load mood board');
        toast({
          title: 'Error',
          description: 'Failed to load mood board details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMoodBoard();
  }, [params.moodBoardId, toast]);

  const handleEdit = () => {
    onEditOpen();
  };

  const handleUpdateMoodBoard = async (updateData: Partial<UIMoodBoard>) => {
    try {
      await updateMoodBoard(params.moodBoardId, updateData);
      
      // Refresh the mood board data
      const updatedMoodBoard = await getMoodBoardDetail(params.moodBoardId);
      setMoodBoard(updatedMoodBoard);
      
      toast({
        title: 'Mood Board Updated',
        description: 'Your changes have been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating mood board:', error);
      throw error; // Let the modal handle the error display
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Mood board link copied to clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteMoodBoard(params.moodBoardId)
      
      toast({
        title: 'Mood Board Deleted',
        description: `"${moodBoard?.name}" has been deleted`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Navigate back to mood boards list
      router.push(`/wedding/${params.id}/mood-boards`)
    } catch (error) {
      console.error('Error deleting mood board:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete mood board. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
      onDeleteClose()
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxW="6xl" py={8}>
          <Flex justify="center" align="center" minH="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color="purple.500" />
              <Text>Loading mood board...</Text>
            </VStack>
          </Flex>
        </Container>
      </DashboardLayout>
    );
  }

  if (error || !moodBoard) {
    return (
      <DashboardLayout>
        <Container maxW="6xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <AlertTitle>Error Loading Mood Board</AlertTitle>
              <Text>{error || 'Mood board not found'}</Text>
              <Button
                size="sm"
                onClick={() => router.push(`/wedding/${params.id}/mood-boards`)}
              >
                Back to Mood Boards
              </Button>
            </VStack>
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Button
                variant="ghost"
                onClick={() => router.push(`/wedding/${params.id}/mood-boards`)}
                aria-label="Back to mood boards"
              >
                ← Back
              </Button>
              <VStack align="start" spacing={1}>
                <Heading size="lg">{moodBoard.name}</Heading>
                <Text color="gray.600">{moodBoard.description}</Text>
              </VStack>
            </HStack>
            
            <HStack>
              <Badge colorScheme={moodBoard.isFinalized ? 'green' : 'yellow'}>
                {moodBoard.isFinalized ? 'Finalized' : 'Draft'}
              </Badge>
              <Badge colorScheme={moodBoard.isPublic ? 'blue' : 'gray'}>
                {moodBoard.isPublic ? 'Public' : 'Private'}
              </Badge>
              <Button size="sm" onClick={handleShare}>
                Share
              </Button>
              <Button size="sm" colorScheme="purple" onClick={handleEdit}>
                Edit
              </Button>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MoreVertical size={16} />}
                  variant="outline"
                  size="sm"
                  aria-label="More options"
                />
                <MenuList>
                  <MenuItem 
                    icon={<Trash2 size={16} />} 
                    onClick={onDeleteOpen}
                    color="red.600"
                  >
                    Delete Mood Board
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>

          {/* Style Keywords */}
          {moodBoard.styleKeywords && moodBoard.styleKeywords.length > 0 && (
            <Box>
              <Text fontWeight="semibold" mb={3}>Style Keywords</Text>
              <Flex wrap="wrap" gap={2}>
                {moodBoard.styleKeywords.map((keyword, index) => (
                  <Badge key={index} variant="subtle" colorScheme="purple">
                    {keyword}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}

          {/* Color Palette */}
          {moodBoard.colorPalette && (
            <Box>
              <Text fontWeight="semibold" mb={3}>Color Palette</Text>
              <VStack spacing={3} align="stretch">
                {Object.entries(moodBoard.colorPalette).map(([category, colors]) => {
                  if (!colors || colors.length === 0) return null;
                  return (
                    <HStack key={category} spacing={3}>
                      <Text minW="80px" textTransform="capitalize" fontWeight="medium">
                        {category}:
                      </Text>
                      <HStack spacing={2}>
                        {colors.map((color, index) => (
                          <Box
                            key={index}
                            w={8}
                            h={8}
                            borderRadius="md"
                            bg={color}
                            border="1px solid"
                            borderColor="gray.200"
                            title={color}
                          />
                        ))}
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>
            </Box>
          )}

          {/* Content Tabs */}
          <Tabs>
            <TabList>
              <Tab>Images ({moodBoard.images?.length || 0})</Tab>
              <Tab>Videos ({moodBoard.videos?.length || 0})</Tab>
              <Tab>Links ({moodBoard.inspirationLinks?.length || 0})</Tab>
            </TabList>

            <TabPanels>
              {/* Images Tab */}
              <TabPanel px={0}>
                {moodBoard.images && moodBoard.images.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {moodBoard.images.map((image) => (
                      <Box
                        key={image.id}
                        borderRadius="lg"
                        overflow="hidden"
                        shadow="md"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.02)' }}
                      >
                        <Image
                          src={image.url}
                          alt={image.filename}
                          objectFit="cover"
                          w="100%"
                          h="250px"
                        />
                        <Box p={3} bg="white">
                          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                            {image.filename}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={12}>
                    <Text color="gray.500">No images added yet</Text>
                  </Box>
                )}
              </TabPanel>

              {/* Videos Tab */}
              <TabPanel px={0}>
                {moodBoard.videos && moodBoard.videos.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    {moodBoard.videos.map((video) => (
                      <Box
                        key={video.id}
                        borderRadius="lg"
                        overflow="hidden"
                        shadow="md"
                      >
                        <Box position="relative">
                          <video
                            src={video.url}
                            controls
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <Box p={3} bg="white">
                          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                            {video.filename}
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={12}>
                    <Text color="gray.500">No videos added yet</Text>
                  </Box>
                )}
              </TabPanel>

              {/* Links Tab */}
              <TabPanel px={0}>
                {moodBoard.inspirationLinks && moodBoard.inspirationLinks.length > 0 ? (
                  <VStack spacing={4} align="stretch">
                    {moodBoard.inspirationLinks.map((link) => (
                      <Box
                        key={link.id}
                        p={4}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300', shadow: 'sm' }}
                        transition="all 0.2s"
                      >
                        <VStack align="start" spacing={2}>
                          <HStack justify="space-between" w="100%">
                            <Text fontWeight="semibold" color="purple.600">
                              {link.title}
                            </Text>
                            <IconButton
                              size="xs"
                              variant="ghost"
                              aria-label="Open link"
                              as={Link}
                              href={link.url}
                              isExternal
                            >
                              ↗
                            </IconButton>
                          </HStack>
                          {link.description && (
                            <Text fontSize="sm" color="gray.600">
                              {link.description}
                            </Text>
                          )}
                          <Text fontSize="xs" color="gray.400" fontFamily="mono">
                            {link.url}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py={12}>
                    <Text color="gray.500">No inspiration links added yet</Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Divider />

          {/* Footer Info */}
          <HStack justify="space-between" fontSize="sm" color="gray.500">
            <Text>
              Created: {moodBoard.createdAt ? new Date(moodBoard.createdAt).toLocaleDateString() : 'Unknown'}
            </Text>
            {moodBoard.updatedAt && (
              <Text>
                Last updated: {new Date(moodBoard.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </HStack>
        </VStack>
      </Container>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Mood Board"
        itemName={moodBoard?.name || 'this mood board'}
        itemType="Mood Board"
        warningMessage="This will permanently delete this mood board and all its images, videos, and inspiration links."
      />

      {/* Edit Mood Board Modal */}
      {moodBoard && (
        <EditMoodBoardModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleUpdateMoodBoard}
          moodBoard={moodBoard}
        />
      )}
    </DashboardLayout>
  );
}
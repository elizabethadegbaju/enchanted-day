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
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  useToast,
} from '@chakra-ui/react';

interface TaskData {
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  phaseId?: string;
  assignedTo: string[];
  dependencies?: string[];
  description?: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => Promise<void>;
  phases?: Array<{id: string; name: string}>;
  existingTasks?: Array<{id: string; title: string}>;
}

export function AddTaskModal({ isOpen, onClose, onSave, phases = [], existingTasks = [] }: AddTaskModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<TaskData>({
    title: '',
    dueDate: '',
    priority: 'MEDIUM',
    phaseId: '',
    assignedTo: [],
    dependencies: [],
    description: ''
  });

  const [newAssignee, setNewAssignee] = useState('');
  const [selectedDependency, setSelectedDependency] = useState('');

  const handleInputChange = (field: keyof TaskData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAssignee = () => {
    if (newAssignee.trim() && !formData.assignedTo.includes(newAssignee.trim())) {
      handleInputChange('assignedTo', [...formData.assignedTo, newAssignee.trim()]);
      setNewAssignee('');
    }
  };

  const removeAssignee = (assignee: string) => {
    handleInputChange('assignedTo', formData.assignedTo.filter(a => a !== assignee));
  };

  const addDependency = () => {
    if (selectedDependency && !formData.dependencies?.includes(selectedDependency)) {
      const existingDeps = formData.dependencies || [];
      handleInputChange('dependencies', [...existingDeps, selectedDependency]);
      setSelectedDependency('');
    }
  };

  const removeDependency = (dependency: string) => {
    handleInputChange('dependencies', formData.dependencies?.filter(d => d !== dependency) || []);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.dueDate) {
      toast({
        title: 'Missing Information',
        description: 'Please provide task title and due date',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      
      toast({
        title: 'Task Created',
        description: 'The task has been successfully added to your timeline',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        title: '',
        dueDate: '',
        priority: 'MEDIUM',
        phaseId: '',
        assignedTo: [],
        dependencies: [],
        description: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
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
        title: '',
        dueDate: '',
        priority: 'MEDIUM',
        phaseId: '',
        assignedTo: [],
        dependencies: [],
        description: ''
      });
      onClose();
    }
  };

  const availableDependencies = existingTasks.filter(task => 
    !formData.dependencies?.includes(task.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Task Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Book photographer for ceremony"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskData['priority'])}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
            </FormControl>

            {phases.length > 0 && (
              <FormControl>
                <FormLabel>Wedding Phase (Optional)</FormLabel>
                <Select
                  value={formData.phaseId}
                  onChange={(e) => handleInputChange('phaseId', e.target.value)}
                >
                  <option value="">Select phase (optional)</option>
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Assigned To</FormLabel>
              <VStack align="stretch" spacing={2}>
                <Input
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  placeholder="Enter person's name"
                  onKeyPress={(e) => e.key === 'Enter' && addAssignee()}
                />
                <Button size="sm" onClick={addAssignee} variant="outline">
                  Add Assignee
                </Button>
                {formData.assignedTo.length > 0 && (
                  <Wrap>
                    {formData.assignedTo.map((assignee) => (
                      <Tag key={assignee} size="md" colorScheme="blue" variant="solid">
                        <TagLabel>{assignee}</TagLabel>
                        <TagCloseButton onClick={() => removeAssignee(assignee)} />
                      </Tag>
                    ))}
                  </Wrap>
                )}
              </VStack>
            </FormControl>

            {availableDependencies.length > 0 && (
              <FormControl>
                <FormLabel>Task Dependencies (Optional)</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Select
                    value={selectedDependency}
                    onChange={(e) => setSelectedDependency(e.target.value)}
                  >
                    <option value="">Select a task this depends on</option>
                    {availableDependencies.map(task => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </Select>
                  {selectedDependency && (
                    <Button size="sm" onClick={addDependency} variant="outline">
                      Add Dependency
                    </Button>
                  )}
                  {formData.dependencies && formData.dependencies.length > 0 && (
                    <Wrap>
                      {formData.dependencies.map((depId) => {
                        const depTask = existingTasks.find(t => t.id === depId);
                        return depTask ? (
                          <Tag key={depId} size="md" colorScheme="orange" variant="solid">
                            <TagLabel>{depTask.title}</TagLabel>
                            <TagCloseButton onClick={() => removeDependency(depId)} />
                          </Tag>
                        ) : null;
                      })}
                    </Wrap>
                  )}
                </VStack>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Description (Optional)</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Add any additional details about this task"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button colorScheme="purple" onClick={handleSubmit} isLoading={loading}>
            Create Task
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
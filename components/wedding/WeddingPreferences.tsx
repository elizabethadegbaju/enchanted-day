'use client'

import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Card,
  CardBody,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { WeddingPreferences as WeddingPrefs } from '@/types'

interface WeddingPreferencesProps {
  preferences: any
  onUpdate: (preferences: any) => void
}

const STYLE_OPTIONS = [
  'Classic/Traditional',
  'Modern/Contemporary',
  'Rustic/Country',
  'Bohemian/Boho',
  'Vintage/Retro',
  'Minimalist',
  'Glamorous/Luxury',
  'Garden/Outdoor',
  'Beach/Coastal',
  'Industrial/Urban',
  'Romantic',
  'Elegant',
  'Casual',
  'Formal',
]

const COLOR_OPTIONS = [
  'White', 'Ivory', 'Blush', 'Pink', 'Rose Gold', 'Gold',
  'Silver', 'Navy', 'Royal Blue', 'Dusty Blue', 'Sage Green',
  'Emerald', 'Burgundy', 'Wine', 'Maroon', 'Purple', 'Lavender',
  'Yellow', 'Orange', 'Coral', 'Peach', 'Gray', 'Black',
  'Champagne', 'Taupe', 'Mauve', 'Teal', 'Mint', 'Cream',
]

const THEME_OPTIONS = [
  'Fairy Tale',
  'Garden Party',
  'Vintage Romance',
  'Modern Chic',
  'Rustic Charm',
  'Beach Paradise',
  'Winter Wonderland',
  'Spring Bloom',
  'Autumn Harvest',
  'Cultural Heritage',
  'Travel/Destination',
  'Music/Concert',
  'Art/Gallery',
  'Literary/Books',
  'Nature/Eco-Friendly',
]

const MUSIC_GENRES = [
  'Pop', 'Rock', 'Jazz', 'Classical', 'R&B/Soul', 'Hip Hop',
  'Country', 'Folk', 'Electronic/Dance', 'Reggae', 'Latin',
  'World Music', 'Gospel', 'Blues', 'Indie', 'Alternative',
]

const FOOD_PREFERENCES = [
  'Traditional/Classic',
  'International Cuisine',
  'Vegetarian Options',
  'Vegan Options',
  'Gluten-Free Options',
  'Halal',
  'Kosher',
  'Organic/Farm-to-Table',
  'Comfort Food',
  'Fine Dining',
  'Buffet Style',
  'Family Style',
  'Cocktail Reception',
  'Brunch',
  'BBQ/Grilled',
]

const COMMUNICATION_CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text Messages' },
  { value: 'push', label: 'App Notifications' },
]

export const WeddingPreferences: React.FC<WeddingPreferencesProps> = ({
  preferences,
  onUpdate,
}) => {
  const [customStyle, setCustomStyle] = useState('')
  const [customColor, setCustomColor] = useState('')
  const [customTheme, setCustomTheme] = useState('')
  const [customMusic, setCustomMusic] = useState('')
  const [customFood, setCustomFood] = useState('')

  const updatePreferences = (updates: any) => {
    onUpdate({ ...preferences, ...updates })
  }

  const addCustomItem = (category: string, value: string) => {
    if (!value.trim()) return
    
    const currentItems = (preferences[category] as string[]) || []
    if (!currentItems.includes(value.trim())) {
      updatePreferences({
        [category]: [...currentItems, value.trim()]
      })
    }
    
    // Clear the input
    switch (category) {
      case 'style': setCustomStyle(''); break
      case 'colors': setCustomColor(''); break
      case 'themes': setCustomTheme(''); break
      case 'musicGenres': setCustomMusic(''); break
      case 'foodPreferences': setCustomFood(''); break
    }
  }

  const removeItem = (category: string, value: string) => {
    const currentItems = (preferences[category] as string[]) || []
    updatePreferences({
      [category]: currentItems.filter(item => item !== value)
    })
  }

  const toggleItem = (category: string, value: string) => {
    const currentItems = (preferences[category] as string[]) || []
    if (currentItems.includes(value)) {
      removeItem(category, value)
    } else {
      updatePreferences({
        [category]: [...currentItems, value]
      })
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} align="start">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.800">
          Your wedding preferences
        </Text>
        <Text color="neutral.600">
          Help us understand your style and preferences so we can make better recommendations
        </Text>
      </VStack>

      {/* Style Preferences */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Style & Aesthetic</Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Wedding Styles (select all that apply)</FormLabel>
              <Wrap spacing={2} mb={4}>
                {(preferences.style || []).map((style: string) => (
                  <WrapItem key={style}>
                    <Tag size="md" colorScheme="brand" variant="solid">
                      <TagLabel>{style}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('style', style)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Wrap spacing={2} mb={4}>
                {STYLE_OPTIONS
                  .filter(style => !(preferences.style || []).includes(style))
                  .map((style: string) => (
                    <WrapItem key={style}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleItem('style', style)}
                      >
                        {style}
                      </Button>
                    </WrapItem>
                  ))}
              </Wrap>
              
              <HStack>
                <Input
                  placeholder="Add custom style"
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('style', customStyle)}
                />
                <Button
                  onClick={() => addCustomItem('style', customStyle)}
                  isDisabled={!customStyle.trim()}
                  leftIcon={<Plus size={16} />}
                >
                  Add
                </Button>
              </HStack>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Color Preferences */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Color Palette</Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Preferred Colors</FormLabel>
              <Wrap spacing={2} mb={4}>
                {(preferences.colors || []).map((color: string) => (
                  <WrapItem key={color}>
                    <Tag size="md" colorScheme="brand" variant="solid">
                      <TagLabel>{color}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('colors', color)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Wrap spacing={2} mb={4}>
                {COLOR_OPTIONS
                  .filter(color => !(preferences.colors || []).includes(color))
                  .map((color: string) => (
                    <WrapItem key={color}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleItem('colors', color)}
                      >
                        {color}
                      </Button>
                    </WrapItem>
                  ))}
              </Wrap>
              
              <HStack>
                <Input
                  placeholder="Add custom color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('colors', customColor)}
                />
                <Button
                  onClick={() => addCustomItem('colors', customColor)}
                  isDisabled={!customColor.trim()}
                  leftIcon={<Plus size={16} />}
                >
                  Add
                </Button>
              </HStack>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Theme Preferences */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Themes & Concepts</Text>
            
            <FormControl>
              <FormLabel fontSize="sm">Wedding Themes</FormLabel>
              <Wrap spacing={2} mb={4}>
                {(preferences.themes || []).map((theme: string) => (
                  <WrapItem key={theme}>
                    <Tag size="md" colorScheme="brand" variant="solid">
                      <TagLabel>{theme}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('themes', theme)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Wrap spacing={2} mb={4}>
                {THEME_OPTIONS
                  .filter(theme => !(preferences.themes || []).includes(theme))
                  .map((theme: string) => (
                    <WrapItem key={theme}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleItem('themes', theme)}
                      >
                        {theme}
                      </Button>
                    </WrapItem>
                  ))}
              </Wrap>
              
              <HStack>
                <Input
                  placeholder="Add custom theme"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('themes', customTheme)}
                />
                <Button
                  onClick={() => addCustomItem('themes', customTheme)}
                  isDisabled={!customTheme.trim()}
                  leftIcon={<Plus size={16} />}
                >
                  Add
                </Button>
              </HStack>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Music & Food Preferences */}
      <HStack spacing={6} align="start">
        <Card flex={1}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">Music Preferences</Text>
              
              <Wrap spacing={2} mb={3}>
                {(preferences.musicGenres || []).map((genre: string) => (
                  <WrapItem key={genre}>
                    <Tag size="sm" colorScheme="accent" variant="solid">
                      <TagLabel>{genre}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('musicGenres', genre)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Wrap spacing={1} mb={3}>
                {MUSIC_GENRES
                  .filter(genre => !(preferences.musicGenres || []).includes(genre))
                  .slice(0, 8)
                  .map((genre: string) => (
                    <WrapItem key={genre}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => toggleItem('musicGenres', genre)}
                      >
                        {genre}
                      </Button>
                    </WrapItem>
                  ))}
              </Wrap>
              
              <HStack>
                <Input
                  placeholder="Custom genre"
                  value={customMusic}
                  onChange={(e) => setCustomMusic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('musicGenres', customMusic)}
                  size="sm"
                />
                <Button
                  onClick={() => addCustomItem('musicGenres', customMusic)}
                  isDisabled={!customMusic.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card flex={1}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">Food Preferences</Text>
              
              <Wrap spacing={2} mb={3}>
                {(preferences.foodPreferences || []).map((food: string) => (
                  <WrapItem key={food}>
                    <Tag size="sm" colorScheme="accent" variant="solid">
                      <TagLabel>{food}</TagLabel>
                      <TagCloseButton onClick={() => removeItem('foodPreferences', food)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              
              <Wrap spacing={1} mb={3}>
                {FOOD_PREFERENCES
                  .filter(food => !(preferences.foodPreferences || []).includes(food))
                  .slice(0, 8)
                  .map((food: string) => (
                    <WrapItem key={food}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => toggleItem('foodPreferences', food)}
                      >
                        {food}
                      </Button>
                    </WrapItem>
                  ))}
              </Wrap>
              
              <HStack>
                <Input
                  placeholder="Custom preference"
                  value={customFood}
                  onChange={(e) => setCustomFood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomItem('foodPreferences', customFood)}
                  size="sm"
                />
                <Button
                  onClick={() => addCustomItem('foodPreferences', customFood)}
                  isDisabled={!customFood.trim()}
                  size="sm"
                >
                  Add
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </HStack>

      {/* Communication Preferences */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Communication Preferences</Text>
            
            <HStack spacing={8} align="start">
              <FormControl>
                <FormLabel fontSize="sm">Preferred Communication Channels</FormLabel>
                <CheckboxGroup
                  value={preferences.communicationPreferences?.preferredChannels || ['email']}
                  onChange={(values) => updatePreferences({
                    communicationPreferences: {
                      ...preferences.communicationPreferences!,
                      preferredChannels: values as ('email' | 'sms' | 'push')[]
                    }
                  })}
                >
                  <VStack align="start" spacing={2}>
                    {COMMUNICATION_CHANNELS.map((channel) => (
                      <Checkbox key={channel.value} value={channel.value}>
                        {channel.label}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Update Frequency</FormLabel>
                <RadioGroup
                  value={preferences.communicationPreferences?.frequency || 'regular'}
                  onChange={(value) => updatePreferences({
                    communicationPreferences: {
                      ...preferences.communicationPreferences!,
                      frequency: value as 'minimal' | 'regular' | 'frequent'
                    }
                  })}
                >
                  <VStack align="start" spacing={2}>
                    <Radio value="minimal">Minimal (only urgent updates)</Radio>
                    <Radio value="regular">Regular (weekly summaries)</Radio>
                    <Radio value="frequent">Frequent (daily updates)</Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Urgency Threshold</FormLabel>
                <RadioGroup
                  value={preferences.communicationPreferences?.urgencyThreshold || 'medium'}
                  onChange={(value) => updatePreferences({
                    communicationPreferences: {
                      ...preferences.communicationPreferences!,
                      urgencyThreshold: value as 'low' | 'medium' | 'high'
                    }
                  })}
                >
                  <VStack align="start" spacing={2}>
                    <Radio value="low">Low (notify about everything)</Radio>
                    <Radio value="medium">Medium (important issues only)</Radio>
                    <Radio value="high">High (critical issues only)</Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
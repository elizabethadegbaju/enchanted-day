// Re-export types from the Amplify schema
import type { Schema } from "@/amplify/data/enhanced-resource";

// Extract the generated types from the schema
export type Wedding = Schema["Wedding"]["type"];
export type BudgetCategory = Schema["BudgetCategory"]["type"];
export type Transaction = Schema["Transaction"]["type"];
export type Guest = Schema["Guest"]["type"];
export type PlusOne = Schema["PlusOne"]["type"];
export type Communication = Schema["Communication"]["type"];
export type MoodBoard = Schema["MoodBoard"]["type"];
export type Milestone = Schema["Milestone"]["type"];
export type Vendor = Schema["Vendor"]["type"];
export type VendorCommunication = Schema["VendorCommunication"]["type"];
export type Activity = Schema["Activity"]["type"];
export type Task = Schema["Task"]["type"];

// Extract custom types and enums
export type BudgetStatus = Schema["BudgetStatus"]["type"];
export type TransactionType = Schema["TransactionType"]["type"];
export type RSVPStatus = Schema["RSVPStatus"]["type"];
export type PhaseAttendanceStatus = Schema["PhaseAttendanceStatus"]["type"];
export type Side = Schema["Side"]["type"];
export type MediaType = Schema["MediaType"]["type"];
export type MilestoneStatus = Schema["MilestoneStatus"]["type"];
export type DeadlineStatus = Schema["DeadlineStatus"]["type"];
export type Priority = Schema["Priority"]["type"];
export type ContingencyStatus = Schema["ContingencyStatus"]["type"];
export type ActionStatus = Schema["ActionStatus"]["type"];
export type VendorStatus = Schema["VendorStatus"]["type"];
export type ContactMethod = Schema["ContactMethod"]["type"];
export type WeddingStatus = Schema["WeddingStatus"]["type"];
export type WeddingType = Schema["WeddingType"]["type"];

// Enhanced schema custom types
export type VendorCategory = Schema["VendorCategory"]["type"];
export type ContactInfo = Schema["ContactInfo"]["type"];
export type MediaAsset = Schema["MediaAsset"]["type"];
export type InspirationLink = Schema["InspirationLink"]["type"];
export type PhaseAttendance = Schema["PhaseAttendance"]["type"];
export type WeddingPhase = Schema["WeddingPhase"]["type"];
export type Venue = Schema["Venue"]["type"];
export type BudgetInfo = Schema["BudgetInfo"]["type"];
export type PhaseRequirements = Schema["PhaseRequirements"]["type"];
export type ScheduleItem = Schema["ScheduleItem"]["type"];
export type TimelineInfo = Schema["TimelineInfo"]["type"];
export type WeddingPreferences = Schema["WeddingPreferences"]["type"];
export type OverallBudget = Schema["OverallBudget"]["type"];
export type OverallBudgetCategory = Schema["OverallBudgetCategory"]["type"];
export type PaymentScheduleItem = Schema["PaymentScheduleItem"]["type"];
export type SubTask = Schema["SubTask"]["type"];
export type VendorService = Schema["VendorService"]["type"];

// Additional types for compatibility (not in enhanced schema but needed by components)
export interface ColorPalette {
  primary?: string[];
  secondary?: string[];
  accent?: string[];
  neutral?: string[];
}

// ============================================================================
// COMPONENT-FRIENDLY INTERFACES
// These interfaces are designed to work perfectly with the UI components
// ============================================================================

// Enhanced Wedding Phase for UI components
export interface UIWeddingPhase {
  id: string | number;
  name: string;
  date: Date | string;
  status: string;
  progress: number;
  
  // Venue information
  venue: {
    id?: string;
    name: string;
    address?: string;
    capacity?: number;
    type?: string;
    amenities?: string[];
    restrictions?: string[];
    notes?: string;
  };
  
  // Guest information
  guestCount: number;
  guest_count: number; // Schema compatibility
  
  // Budget breakdown
  budget?: {
    total: number;
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
    categories: Array<{
      name: string;
      allocated: number;
      spent: number;
      percentage?: number;
    }>;
  };
  
  // Phase requirements
  specificRequirements?: {
    guestCount: number;
    duration: number;
    specialNeeds?: string[];
    culturalRequirements?: string[];
    dietaryRestrictions?: string[];
    accessibilityNeeds?: string[];
    entertainmentType?: string;
    photographyStyle?: string;
    additionalNotes?: string;
  };
  
  // Timeline information
  timeline?: {
    startTime?: string;
    endTime?: string;
    schedule?: Array<{
      time: string;
      activity: string;
      durationMinutes?: number;
    }>;
    setupTime?: string;
    breakdownTime?: string;
  };
  
  // Related entities
  vendorIds?: string[];
  guestIds?: string[];
  moodBoardIds?: string[];
  milestoneIds?: string[];
  taskIds?: string[];
  
  // UI-specific computed fields
  vendors?: {
    total: number;
    confirmed: number;
  };
  
  tasks?: {
    completed: number;
    total: number;
  };
  
  alerts?: Array<{
    type: 'info' | 'warning' | 'error';
    message: string;
  }>;
  
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Enhanced Wedding Preferences for UI
export interface UIWeddingPreferences {
  // Style preferences (what UI expects)
  style?: string[];
  colors?: string[];
  themes?: string[];
  musicGenres?: string[];
  foodPreferences?: string[];
  
  // Additional style details
  weddingStyles?: string[];
  colorThemes?: string[];
  overallThemes?: string[];
  entertainmentTypes?: string[];
  dietaryConsiderations?: string[];
  barPreferences?: string[];
  
  // Cultural and religious
  culturalTraditions?: string[];
  religiousRequirements?: string[];
  
  // Photography and videography
  photographyStyles?: string[];
  mustHaveShots?: string[];
  
  // Communication preferences
  preferredCommunicationMethods?: string[];
  
  // Color palette details
  colorPalette?: {
    primary?: string[];
    secondary?: string[];
    accent?: string[];
    neutral?: string[];
  };
  
  // Style keywords for mood boards
  styleKeywords?: string[];
  inspirationSources?: string[];
}

// Enhanced Budget Info for UI
export interface UIBudgetInfo {
  total: number;
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
  contingencyPercentage?: number;
  
  categories?: Array<{
    name: string;
    allocated: number;
    spent: number;
    percentage?: number;
    vendors?: string[];
    phases?: string[];
  }>;
  
  paymentSchedule?: Array<{
    vendorName: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    phaseId?: string;
  }>;
}

// Enhanced Wedding for UI components
export interface UIWedding {
  id: string;
  userId?: string;
  
  // Basic information
  coupleNames: string[];
  couple_names?: string[]; // Schema compatibility
  weddingType: 'single-event' | 'multi-phase';
  wedding_type?: WeddingType; // Schema compatibility
  status: 'planning' | 'confirmed' | 'completed';
  
  // Dates
  weddingDate?: Date;
  planningStartDate?: Date;
  
  // Core data
  phases: UIWeddingPhase[];
  overallBudget: UIBudgetInfo;
  preferences: UIWeddingPreferences;
  
  // Progress tracking
  daysUntilWedding?: number;
  days_until_wedding?: number; // Schema compatibility
  overallProgress: number;
  overall_progress?: number; // Schema compatibility
  
  // Additional information
  culturalTraditions?: string[];
  cultural_traditions?: string[]; // Schema compatibility
  weddingWebsite?: string;
  hashtag?: string;
  registryLinks?: string[];
  emergencyContacts?: any;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

// Enhanced Guest for UI
export interface UIGuest {
  id: string;
  weddingId: string;
  name: string;
  email?: string;
  phone?: string;
  
  // RSVP information
  rsvpStatus: 'pending' | 'attending' | 'declined';
  rsvp_status?: RSVPStatus; // Schema compatibility
  rsvpDate?: Date;
  
  // Personal details
  relationship: string;
  side: 'bride' | 'groom';
  inviteGroup?: string;
  tableAssignment?: string;
  
  // Special needs
  dietaryRestrictions?: string[];
  accommodationNeeds?: string[];
  accessibilityNeeds?: string[];
  
  // Plus one
  plusOne?: {
    id?: string;
    name?: string;
    email?: string;
    rsvpStatus?: 'pending' | 'attending' | 'declined';
    dietaryRestrictions?: string[];
  };
  
  // Phase attendance
  phaseAttendance?: Array<{
    phaseId: string;
    status: 'pending' | 'attending' | 'not-attending' | 'maybe';
    specialRequests?: string[];
    transportationNeeds?: any;
    mealPreference?: string;
    plusOneAttending?: boolean;
  }>;
  
  // Additional information
  address?: string;
  notes?: string;
  giftReceived?: boolean;
  thankYouSent?: boolean;
}

// Enhanced Vendor for UI
export interface UIVendor {
  id: string;
  weddingId: string;
  name: string;
  
  category: {
    primary: string;
    secondary?: string;
  };
  
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
    website?: string;
    preferredContactMethod: 'email' | 'phone';
  };
  
  status: 'pending' | 'confirmed' | 'completed' | 'issue';
  
  services?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
  }>;
  
  // Contract and payment
  contractSigned?: boolean;
  contractDate?: Date;
  totalCost?: number;
  depositPaid?: number;
  finalPaymentDue?: Date;
  
  // Planning details
  phaseIds?: string[];
  requirements?: string[];
  deliverables?: string[];
  timeline?: any;
  
  // Reviews and notes
  rating?: number; // 1-5 stars
  reviews?: string[];
  internalNotes?: string;
  
  lastContact?: Date;
  nextFollowup?: Date;
}

// Enhanced Mood Board for UI
export interface UIMoodBoard {
  id: string;
  weddingId: string;
  phaseId?: string;
  name: string;
  description?: string;
  
  images?: Array<{
    id: string;
    url: string;
    filename: string;
    tags?: string[];
    uploadedAt: Date;
  }>;
  
  videos?: Array<{
    id: string;
    url: string;
    filename: string;
    tags?: string[];
    uploadedAt: Date;
  }>;
  
  inspirationLinks?: Array<{
    id: string;
    url: string;
    title: string;
    description?: string;
    source: string;
    tags?: string[];
    addedAt: Date;
  }>;
  
  colorPalette?: {
    primary?: string[];
    secondary?: string[];
    accent?: string[];
    neutral?: string[];
  };
  
  styleKeywords?: string[];
  themes?: string[];
  
  isPublic?: boolean;
  isFinalized?: boolean;
  vendorSharedWith?: string[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Form data interfaces for create/edit flows
export interface WeddingFormData {
  coupleNames: string[];
  weddingType: 'single-event' | 'multi-phase';
  phases: Partial<UIWeddingPhase>[];
  overallBudget: Partial<UIBudgetInfo>;
  culturalTraditions: string[];
  preferences: Partial<UIWeddingPreferences>;
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

export function transformSchemaWeddingToUI(schemaWedding: any): UIWedding {
  return {
    id: schemaWedding.id,
    userId: String(schemaWedding.user_id),
    coupleNames: (schemaWedding.couple_names || []).filter((name: any) => name !== null),
    couple_names: (schemaWedding.couple_names || []).filter((name: any) => name !== null),
    weddingType: schemaWedding.wedding_type === 'MULTI_PHASE' ? 'multi-phase' : 'single-event',
    wedding_type: schemaWedding.wedding_type,
    status: schemaWedding.status?.toLowerCase() || 'planning',
    
    phases: (schemaWedding.phases || [])
      .map((phase: any) => transformSchemaPhaseToUI(phase))
      .filter(Boolean),
    
    overallBudget: transformSchemaBudgetToUI(schemaWedding.overall_budget),
    preferences: transformSchemaPreferencesToUI(schemaWedding.cultural_traditions),
    
    daysUntilWedding: schemaWedding.days_until_wedding,
    days_until_wedding: schemaWedding.days_until_wedding,
    overallProgress: schemaWedding.overall_progress || 0,
    overall_progress: schemaWedding.overall_progress || 0,
    
    culturalTraditions: schemaWedding.cultural_traditions || [],
    cultural_traditions: schemaWedding.cultural_traditions || [],
  };
}

export function transformSchemaPhaseToUI(schemaPhase: any): UIWeddingPhase | null {
  if (!schemaPhase) return null;
  
  return {
    id: schemaPhase.id,
    name: schemaPhase.name,
    date: typeof schemaPhase.date === 'string' ? new Date(schemaPhase.date) : schemaPhase.date,
    status: schemaPhase.status,
    progress: schemaPhase.progress || 0,
    
    venue: typeof schemaPhase.venue === 'object' && schemaPhase.venue !== null
      ? {
          name: (schemaPhase.venue as any).name || 'TBD',
          address: (schemaPhase.venue as any).address,
          capacity: (schemaPhase.venue as any).capacity,
          type: (schemaPhase.venue as any).type,
        }
      : { name: String(schemaPhase.venue) || 'TBD' },
    
    guestCount: schemaPhase.guest_count || 0,
    guest_count: schemaPhase.guest_count || 0,
    
    // Add mock data for UI components that expect it
    specificRequirements: {
      guestCount: schemaPhase.guest_count || 0,
      duration: 4, // Default duration
    },
    
    // Mock vendor and task data for UI
    vendors: {
      total: 6,
      confirmed: 4,
    },
    
    tasks: {
      completed: 8,
      total: 12,
    },
  };
}

export function transformSchemaBudgetToUI(schemaBudget: any): UIBudgetInfo {
  if (!schemaBudget || typeof schemaBudget !== 'object') {
    return {
      total: 50000,
      allocated: 45000,
      spent: 15000,
      remaining: 35000,
      currency: 'USD',
    };
  }
  
  return {
    total: schemaBudget.total || 50000,
    allocated: schemaBudget.allocated || 45000,
    spent: schemaBudget.spent || 15000,
    remaining: schemaBudget.remaining || 35000,
    currency: schemaBudget.currency || 'USD',
  };
}

export function transformSchemaPreferencesToUI(culturalTraditions: string[] = []): UIWeddingPreferences {
  return {
    culturalTraditions,
    style: ['Classic/Traditional', 'Elegant'],
    colors: ['Navy', 'Gold', 'Ivory'],
    themes: ['Romantic', 'Timeless'],
    musicGenres: ['Classical', 'Jazz'],
    foodPreferences: ['Italian', 'Mediterranean'],
    
    colorPalette: {
      primary: ['#1a365d', '#2d5aa0'],
      secondary: ['#d69e2e', '#f7fafc'],
      accent: ['#e53e3e'],
      neutral: ['#718096', '#f7fafc'],
    },
    
    styleKeywords: ['elegant', 'classic', 'romantic', 'timeless'],
  };
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

export function createMockUIWedding(id: string): UIWedding {
  return {
    id,
    userId: 'user123',
    coupleNames: ['Sarah Johnson', 'Michael Chen'],
    couple_names: ['Sarah Johnson', 'Michael Chen'],
    weddingType: 'multi-phase',
    wedding_type: 'MULTI_PHASE',
    status: 'planning',
    
    phases: [
      {
        id: '1',
        name: 'Legal Ceremony',
        date: new Date('2024-06-10'),
        status: 'planning',
        progress: 75,
        venue: {
          name: 'City Hall',
          address: '123 Main St',
          capacity: 30,
          type: 'Government Building',
        },
        guestCount: 20,
        guest_count: 20,
        specificRequirements: {
          guestCount: 20,
          duration: 2,
          culturalRequirements: ['Legal requirements'],
        },
        budget: {
          total: 5000,
          allocated: 4500,
          spent: 2500,
          remaining: 2000,
          currency: 'USD',
          categories: [
            { name: 'Venue', allocated: 2000, spent: 2000 },
            { name: 'Photography', allocated: 1500, spent: 500 },
            { name: 'Flowers', allocated: 1000, spent: 0 },
          ],
        },
        vendors: { total: 4, confirmed: 3 },
        tasks: { completed: 12, total: 15 },
      },
      {
        id: '2',
        name: 'Church Wedding',
        date: new Date('2024-06-15'),
        status: 'planning',
        progress: 60,
        venue: {
          name: "St. Mary's Church",
          address: '456 Oak Ave',
          capacity: 200,
          type: 'Church/Religious Venue',
        },
        guestCount: 150,
        guest_count: 150,
        specificRequirements: {
          guestCount: 150,
          duration: 4,
          culturalRequirements: ['Catholic ceremony'],
        },
        budget: {
          total: 20000,
          allocated: 18000,
          spent: 10000,
          remaining: 8000,
          currency: 'USD',
          categories: [
            { name: 'Venue', allocated: 5000, spent: 5000 },
            { name: 'Music', allocated: 3000, spent: 1500 },
            { name: 'Flowers', allocated: 4000, spent: 2000 },
            { name: 'Photography', allocated: 6000, spent: 1500 },
          ],
        },
        vendors: { total: 8, confirmed: 6 },
        tasks: { completed: 18, total: 25 },
        alerts: [
          { type: 'warning', message: 'Weather forecast shows possible rain' },
        ],
      },
      {
        id: '3',
        name: 'Reception',
        date: new Date('2024-06-15'),
        status: 'planning',
        progress: 45,
        venue: {
          name: 'Grand Ballroom',
          address: '789 Pine St',
          capacity: 200,
          type: 'Banquet Hall',
        },
        guestCount: 150,
        guest_count: 150,
        specificRequirements: {
          guestCount: 150,
          duration: 6,
          entertainmentType: 'DJ and Live Band',
        },
        budget: {
          total: 25000,
          allocated: 22500,
          spent: 12500,
          remaining: 10000,
          currency: 'USD',
          categories: [
            { name: 'Catering', allocated: 15000, spent: 8000 },
            { name: 'DJ/Entertainment', allocated: 3000, spent: 1500 },
            { name: 'Decorations', allocated: 4500, spent: 3000 },
          ],
        },
        vendors: { total: 6, confirmed: 4 },
        tasks: { completed: 8, total: 16 },
        alerts: [
          { type: 'info', message: 'Venue requires final headcount by May 1st' },
        ],
      },
    ],
    
    overallBudget: {
      total: 50000,
      allocated: 45000,
      spent: 25000,
      remaining: 25000,
      currency: 'USD',
      categories: [
        { name: 'Venues', allocated: 12000, spent: 12000, percentage: 24 },
        { name: 'Catering', allocated: 15000, spent: 8000, percentage: 30 },
        { name: 'Photography', allocated: 7500, spent: 2000, percentage: 15 },
        { name: 'Entertainment', allocated: 3000, spent: 1500, percentage: 6 },
        { name: 'Flowers/Decorations', allocated: 5500, spent: 1500, percentage: 11 },
        { name: 'Attire', allocated: 2000, spent: 0, percentage: 4 },
      ],
    },
    
    preferences: {
      style: ['Classic/Traditional', 'Elegant'],
      colors: ['Navy', 'Gold', 'Ivory'],
      themes: ['Romantic', 'Timeless'],
      musicGenres: ['Classical', 'Jazz', 'Contemporary'],
      foodPreferences: ['Italian', 'Mediterranean'],
      culturalTraditions: ['Catholic traditions', 'Family unity ceremony'],
      
      colorPalette: {
        primary: ['#1a365d', '#2d5aa0'],
        secondary: ['#d69e2e', '#f7fafc'],
        accent: ['#e53e3e'],
        neutral: ['#718096', '#f7fafc'],
      },
      
      styleKeywords: ['elegant', 'classic', 'romantic', 'timeless'],
    },
    
    daysUntilWedding: 45,
    days_until_wedding: 45,
    overallProgress: 60,
    overall_progress: 60,
    culturalTraditions: ['Catholic traditions', 'Family unity ceremony'],
    cultural_traditions: ['Catholic traditions', 'Family unity ceremony'],
  };
}

// Legacy compatibility exports
export type WeddingForComponents = UIWedding;
export type WeddingPhaseForComponents = UIWeddingPhase;

// Transform function alias for legacy compatibility
export const transformWeddingForComponents = transformSchemaWeddingToUI;

// Client type for data operations
export type { Schema };
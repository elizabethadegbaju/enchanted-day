// Re-export types from the Amplify schema
import type { Schema } from "@/amplify/data/resource";

// Extract the generated types from the schema
export type Wedding = Schema["Wedding"]["type"];
export type BudgetCategory = Schema["BudgetCategory"]["type"];
export type Transaction = Schema["Transaction"]["type"];
export type OverallBudget = Schema["OverallBudget"]["type"];
export type Guest = Schema["Guest"]["type"];
export type PlusOne = Schema["PlusOne"]["type"];
export type Communication = Schema["Communication"]["type"];
export type MoodBoard = Schema["MoodBoard"]["type"];
export type Milestone = Schema["Milestone"]["type"];
export type ProjectDeadline = Schema["ProjectDeadline"]["type"];
export type ContingencyPlan = Schema["ContingencyPlan"]["type"];
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

export type VendorCategory = Schema["VendorCategory"]["type"];
export type ContactInfo = Schema["ContactInfo"]["type"];
export type Budget = Schema["Budget"]["type"];
export type Service = Schema["Service"]["type"];
export type PaymentSchedule = Schema["PaymentSchedule"]["type"];
export type Contract = Schema["Contract"]["type"];
export type Deadline = Schema["Deadline"]["type"];
export type ColorPalette = Schema["ColorPalette"]["type"];
export type MediaAsset = Schema["MediaAsset"]["type"];
export type InspirationLink = Schema["InspirationLink"]["type"];
export type PhaseAttendance = Schema["PhaseAttendance"]["type"];
export type WeddingPhase = Schema["WeddingPhase"]["type"];
export type ContingencyAction = Schema["ContingencyAction"]["type"];

// Enhanced types for component compatibility
export interface WeddingForComponents {
  id: string;
  couple_names: string[];
  coupleNames: string[]; // Legacy compatibility
  wedding_type: WeddingType;
  status: WeddingStatus;
  phases: WeddingPhaseForComponents[];
  overall_budget: any;
  overallBudget: BudgetInfo; // Legacy compatibility
  cultural_traditions: string[];
  days_until_wedding: number;
  overall_progress: number;
}

export interface WeddingPhaseForComponents {
  id: number;
  name: string;
  date: Date;
  status: string;
  progress: number;
  venue: {
    name: string;
    address?: string;
  };
  guestCount: number;
  guest_count: number; // Schema field
}

// Helper types for components (derived from schema types)
export type BudgetInfo = {
  total: number;
  allocated: number;
  spent: number;
  remaining: number;
  currency?: string;
};

export type WeddingPreferences = {
  cultural_traditions: string[];
  color_palette?: ColorPalette;
  style_keywords?: string[];
};

// Utility functions to transform schema data for components
export function transformWeddingForComponents(wedding: Wedding, overallBudget?: OverallBudget): WeddingForComponents {
  const validPhases = wedding.phases?.filter(phase => phase !== null && phase !== undefined) || [];
  
  return {
    id: wedding.id,
    couple_names: wedding.couple_names?.filter(name => name !== null) as string[] || [],
    coupleNames: wedding.couple_names?.filter(name => name !== null) as string[] || [],
    wedding_type: wedding.wedding_type,
    status: wedding.status,
    phases: validPhases.map(phase => {
      if (!phase) return null;
      return {
        id: phase.id,
        name: phase.name,
        date: new Date(phase.date),
        status: phase.status,
        progress: phase.progress,
        venue: typeof phase.venue === 'object' && phase.venue !== null ? 
          { name: (phase.venue as any).name || 'TBD' } : 
          { name: String(phase.venue) || 'TBD' },
        guestCount: phase.guest_count,
        guest_count: phase.guest_count,
      };
    }).filter(phase => phase !== null) as WeddingPhaseForComponents[],
    overall_budget: wedding.overall_budget,
    overallBudget: overallBudget ? {
      total: overallBudget.total,
      allocated: overallBudget.allocated,
      spent: overallBudget.spent,
      remaining: overallBudget.remaining,
      currency: overallBudget.currency || 'USD',
    } : {
      total: 50000,
      allocated: 45000,
      spent: 15000,
      remaining: 35000,
      currency: 'USD',
    },
    cultural_traditions: wedding.cultural_traditions?.filter(tradition => tradition !== null) as string[] || [],
    days_until_wedding: wedding.days_until_wedding,
    overall_progress: wedding.overall_progress,
  };
}

// Client type for data operations
export type { Schema };
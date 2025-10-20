import type { Schema } from '@/amplify/data/resource';

// ============================================================================
// TYPE TRANSFORMATIONS
// ============================================================================

export function transformWeddingForUI(wedding: Schema['Wedding']['type']) {
  return {
    id: wedding.id,
    coupleNames: wedding.couple_names?.filter(name => name) || [],
    weddingType: wedding.wedding_type,
    status: wedding.status,
    preferences: wedding.preferences,
    overallBudget: wedding.overall_budget,
    createdAt: wedding.createdAt,
    updatedAt: wedding.updatedAt
  };
}

export function transformPhaseForUI(phase: Schema['WeddingPhase']['type']) {
  return {
    id: phase.id,
    name: phase.name,
    date: phase.date,
    status: phase.status,
    progress: phase.progress || 0,
    venue: phase.venue,
    requirements: phase.requirements,
    budget: phase.budget,
    timeline: phase.timeline
  };
}

export function transformVendorForUI(vendor: Schema['Vendor']['type']) {
  return {
    id: vendor.id,
    name: vendor.name,
    category: vendor.category,
    contactInfo: vendor.contact_info,
    status: vendor.status,
    totalCost: vendor.total_cost,
    rating: vendor.rating,
    lastContact: vendor.last_contact,
    nextFollowup: vendor.next_followup,
    services: vendor.services,
    notes: vendor.internal_notes,
    documents: [], // No documents field in schema, using empty array
    isContracted: vendor.contract_signed,
    contractDetails: {
      signed: vendor.contract_signed,
      date: vendor.contract_date,
      finalPaymentDue: vendor.final_payment_due
    }
  };
}

export function transformGuestForUI(guest: Schema['Guest']['type']) {
  return {
    id: guest.id,
    name: guest.name,
    email: guest.email,
    phone: guest.phone,
    rsvpStatus: guest.rsvp_status,
    relationship: guest.relationship,
    side: guest.side,
    inviteGroup: guest.invite_group,
    tableAssignment: guest.table_assignment,
    dietaryRestrictions: guest.dietary_restrictions,
    plusOne: guest.plus_one, // This is a lazy loader relation
    phaseAttendance: guest.phase_attendance,
    notes: guest.notes
  };
}

// ============================================================================
// FILTER UTILITIES
// ============================================================================

export interface VendorFilters {
  categories?: string[];
  statuses?: string[];
  phaseIds?: string[];
  priceRange?: [number, number];
  rating?: number;
  isContracted?: boolean;
  searchQuery?: string;
}

export interface GuestFilters {
  sides?: string[];
  rsvpStatuses?: string[];
  relationships?: string[];
  inviteGroups?: string[];
  tableAssignments?: string[];
  dietaryRestrictions?: string[];
  searchQuery?: string;
}

export interface TaskFilters {
  statuses?: string[];
  priorities?: string[];
  phaseIds?: string[];
  assignedTo?: string[];
  dateRange?: [string, string];
  overdue?: boolean;
}

// ============================================================================
// SORTING UTILITIES
// ============================================================================

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export function sortVendors(vendors: any[], sortConfig: SortConfig) {
  return [...vendors].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.field);
    const bValue = getNestedValue(b, sortConfig.field);
    
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

export function sortGuests(guests: any[], sortConfig: SortConfig) {
  return [...guests].sort((a, b) => {
    const aValue = getNestedValue(a, sortConfig.field);
    const bValue = getNestedValue(b, sortConfig.field);
    
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export interface PaginationConfig {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function paginateResults<T>(
  items: T[],
  config: PaginationConfig
): PaginatedResult<T> {
  const { page, limit } = config;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);
  
  return {
    items: paginatedItems,
    totalItems: items.length,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

// ============================================================================
// STATISTICS UTILITIES
// ============================================================================

export function calculatePhaseProgress(phase: any): number {
  if (!phase.tasks) return 0;
  
  const completedTasks = phase.tasks.filter((task: any) => task.status === 'COMPLETED').length;
  const totalTasks = phase.tasks.length;
  
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}

export function calculateBudgetUsage(budget: any): {
  usagePercentage: number;
  isOverBudget: boolean;
  remainingAmount: number;
} {
  if (!budget || !budget.total) {
    return {
      usagePercentage: 0,
      isOverBudget: false,
      remainingAmount: 0
    };
  }
  
  const spent = budget.spent || 0;
  const total = budget.total;
  const usagePercentage = Math.round((spent / total) * 100);
  const isOverBudget = spent > total;
  const remainingAmount = total - spent;
  
  return {
    usagePercentage,
    isOverBudget,
    remainingAmount
  };
}

export function calculateRSVPStats(guests: any[]): {
  totalGuests: number;
  confirmedGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  responseRate: number;
} {
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(g => g.rsvpStatus === 'CONFIRMED').length;
  const declinedGuests = guests.filter(g => g.rsvpStatus === 'DECLINED').length;
  const pendingGuests = guests.filter(g => g.rsvpStatus === 'PENDING').length;
  const responseRate = totalGuests > 0 ? Math.round(((confirmedGuests + declinedGuests) / totalGuests) * 100) : 0;
  
  return {
    totalGuests,
    confirmedGuests,
    declinedGuests,
    pendingGuests,
    responseRate
  };
}

export function calculateVendorStats(vendors: any[]): {
  totalVendors: number;
  confirmedVendors: number;
  pendingVendors: number;
  contractedVendors: number;
  averageRating: number;
} {
  const totalVendors = vendors.length;
  const confirmedVendors = vendors.filter(v => v.status === 'CONFIRMED').length;
  const pendingVendors = vendors.filter(v => v.status === 'PENDING').length;
  const contractedVendors = vendors.filter(v => v.isContracted).length;
  
  const ratingsSum = vendors
    .filter(v => v.rating !== undefined && v.rating !== null)
    .reduce((sum, v) => sum + v.rating, 0);
  const ratedVendorsCount = vendors.filter(v => v.rating !== undefined && v.rating !== null).length;
  const averageRating = ratedVendorsCount > 0 ? Math.round((ratingsSum / ratedVendorsCount) * 10) / 10 : 0;
  
  return {
    totalVendors,
    confirmedVendors,
    pendingVendors,
    contractedVendors,
    averageRating
  };
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

export function getDaysUntilDate(targetDate: string): number {
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTimeForDisplay(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function isOverdue(dueDate: string): boolean {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function getUpcomingTasks(tasks: any[], daysAhead: number = 7): any[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);
  
  return tasks.filter(task => {
    if (task.status === 'COMPLETED') return false;
    
    const dueDate = new Date(task.dueDate);
    return dueDate <= cutoffDate;
  });
}

// ============================================================================
// SEARCH UTILITIES
// ============================================================================

export function searchVendors(vendors: any[], query: string): any[] {
  if (!query.trim()) return vendors;
  
  const searchTerm = query.toLowerCase();
  
  return vendors.filter(vendor => {
    return (
      vendor.name?.toLowerCase().includes(searchTerm) ||
      vendor.category?.primary?.toLowerCase().includes(searchTerm) ||
      vendor.category?.secondary?.toLowerCase().includes(searchTerm) ||
      vendor.contactInfo?.email?.toLowerCase().includes(searchTerm) ||
      vendor.services?.some((service: any) => 
        service.name?.toLowerCase().includes(searchTerm)
      )
    );
  });
}

export function searchGuests(guests: any[], query: string): any[] {
  if (!query.trim()) return guests;
  
  const searchTerm = query.toLowerCase();
  
  return guests.filter(guest => {
    return (
      guest.name?.toLowerCase().includes(searchTerm) ||
      guest.email?.toLowerCase().includes(searchTerm) ||
      guest.relationship?.toLowerCase().includes(searchTerm) ||
      guest.side?.toLowerCase().includes(searchTerm) ||
      guest.inviteGroup?.toLowerCase().includes(searchTerm) ||
      guest.plusOne?.name?.toLowerCase().includes(searchTerm)
    );
  });
}

export function searchTasks(tasks: any[], query: string): any[] {
  if (!query.trim()) return tasks;
  
  const searchTerm = query.toLowerCase();
  
  return tasks.filter(task => {
    return (
      task.title?.toLowerCase().includes(searchTerm) ||
      task.description?.toLowerCase().includes(searchTerm) ||
      task.assignedTo?.some((person: string) => 
        person?.toLowerCase().includes(searchTerm)
      )
    );
  });
}
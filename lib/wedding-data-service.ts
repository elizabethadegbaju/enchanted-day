import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { getCurrentUserId, getCurrentUserDisplayName } from './auth-utils';
import { amplifyDataClient } from './amplify-client';

const client = generateClient<Schema>();

// Helper function to get user's primary wedding
async function getUserPrimaryWedding(userId?: string): Promise<string> {
  const currentUserId = userId || await getCurrentUserId();
  
  const { data: weddings } = await client.models.Wedding.list({
    filter: { user_id: { eq: currentUserId } },
    limit: 1
  });
  
  if (!weddings || weddings.length === 0) {
    throw new Error('No weddings found for user');
  }
  
  return weddings[0].id;
}

// ============================================================================
// USER WEDDING MANAGEMENT
// ============================================================================

export async function getUserWeddings(userId?: string): Promise<Array<{
  id: string;
  coupleNames: string[];
  weddingDate: string;
  status: string;
  overallProgress: number;
}>> {
  try {
    const currentUserId = userId || await getCurrentUserId();
    
    const { data: weddings } = await client.models.Wedding.list({
      filter: { user_id: { eq: currentUserId } }
    });

    if (!weddings) return [];

    // Get primary dates for each wedding
    const weddingsWithDates = await Promise.all(
      weddings.map(async (wedding) => {
        const { data: phases } = await client.models.WeddingPhase.list({
          filter: { wedding_id: { eq: wedding.id } },
          limit: 1
        });

        const primaryDate = phases?.[0]?.date || new Date().toISOString().split('T')[0];

        return {
          id: wedding.id,
          coupleNames: wedding.couple_names?.filter((name): name is string => name !== null && name !== undefined && name !== '') || [],
          weddingDate: primaryDate,
          status: wedding.status || 'PLANNING',
          overallProgress: wedding.overall_progress || 0
        };
      })
    );

    return weddingsWithDates;
  } catch (error) {
    console.error('Error fetching user weddings:', error);
    throw error;
  }
}

export async function createUserWedding(weddingData: {
  coupleNames: string[];
  weddingType: 'SINGLE_EVENT' | 'MULTI_PHASE';
  primaryDate?: string;
  userId?: string;
}): Promise<string> {
  try {
    const currentUserId = weddingData.userId || await getCurrentUserId();
    
    const newWedding = await client.models.Wedding.create({
      user_id: currentUserId,
      couple_names: weddingData.coupleNames,
      wedding_type: weddingData.weddingType,
      status: 'PLANNING',
      overall_progress: 0,
      overall_budget: {
        total: 0,
        allocated: 0,
        spent: 0,
        remaining: 0,
        currency: 'USD'
      }
    });

    if (!newWedding.data) {
      throw new Error('Failed to create wedding');
    }

    // Create initial phase if primary date provided
    if (weddingData.primaryDate) {
      await client.models.WeddingPhase.create({
        wedding_id: newWedding.data.id,
        name: weddingData.weddingType === 'SINGLE_EVENT' ? 'Wedding Day' : 'Ceremony',
        date: weddingData.primaryDate,
        status: 'PLANNING',
        progress: 0,
        requirements: {
          guest_count: 0,
          duration_hours: 4
        }
      });
    }

    // Log the wedding creation activity
    await createActivity({
      weddingId: newWedding.data.id,
      type: 'WEDDING_CREATED',
      title: 'Wedding Planning Started',
      description: `Started planning wedding for ${weddingData.coupleNames.join(' & ')}`,
      priority: 'HIGH',
      isPublic: true
    });

    return newWedding.data.id;
  } catch (error) {
    console.error('Error creating wedding:', error);
    throw error;
  }
}

// ============================================================================
// DASHBOARD DATA SERVICE
// ============================================================================

export interface DashboardData {
  wedding: {
    id: string;
    coupleNames: string[];
    weddingDate: string;
    status: string;
  };
  stats: {
    daysUntilWedding: number;
    totalVendors: number;
    confirmedVendors: number;
    totalGuests: number;
    rsvpReceived: number;
    budgetUsed: number;
    tasksCompleted: number;
    totalTasks: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    priority?: string;
  }>;
  upcomingTasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    priority: string;
    phase?: string;
  }>;
}

export async function getDashboardData(userId?: string): Promise<DashboardData> {
  try {
    // Get current user ID if not provided
    const currentUserId = userId || await getCurrentUserId();
    
    // Get user's weddings
    const { data: weddings } = await client.models.Wedding.list({
      filter: { user_id: { eq: currentUserId } }
    });

    if (!weddings || weddings.length === 0) {
      throw new Error('No weddings found');
    }

    const wedding = weddings[0];

    // Get wedding phases to determine primary date
    const { data: phases } = await client.models.WeddingPhase.list({
      filter: { wedding_id: { eq: wedding.id } }
    });

    // Get vendors count
    const { data: vendors } = await client.models.Vendor.list({
      filter: { wedding_id: { eq: wedding.id } }
    });

    // Get guests count and RSVP stats
    const { data: guests } = await client.models.Guest.list({
      filter: { wedding_id: { eq: wedding.id } }
    });

    // Get tasks for completion stats
    const { data: tasks } = await client.models.Task.list({
      filter: { wedding_id: { eq: wedding.id } }
    });

    // Get recent activities
    const { data: activities } = await client.models.Activity.list({
      filter: { wedding_id: { eq: wedding.id } },
      limit: 10
    });

    // Get upcoming tasks (due in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: upcomingTasks } = await client.models.Task.list({
      filter: {
        and: [
          { wedding_id: { eq: wedding.id } },
          { due_date: { le: thirtyDaysFromNow.toISOString().split('T')[0] } },
          { status: { ne: 'COMPLETED' } }
        ]
      },
      limit: 5
    });

    // Calculate stats
    const primaryDate = phases?.[0]?.date ? new Date(phases[0].date) : new Date();
    const today = new Date();
    const daysUntilWedding = Math.ceil((primaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const confirmedVendors = vendors?.filter(v => v.status === 'CONFIRMED').length || 0;
    const rsvpReceived = guests?.filter(g => g.rsvp_status !== 'PENDING').length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'COMPLETED').length || 0;

    // Calculate budget usage (mock for now - would need transactions)
    const budgetUsed = wedding.overall_budget?.spent && wedding.overall_budget?.total 
      ? Math.round((wedding.overall_budget.spent / wedding.overall_budget.total) * 100)
      : 0;

    return {
      wedding: {
        id: wedding.id,
        coupleNames: wedding.couple_names?.filter((name): name is string => name !== null && name !== undefined && name !== '') || [],
        weddingDate: primaryDate.toISOString().split('T')[0],
        status: wedding.status || 'PLANNING'
      },
      stats: {
        daysUntilWedding,
        totalVendors: vendors?.length || 0,
        confirmedVendors,
        totalGuests: guests?.length || 0,
        rsvpReceived,
        budgetUsed,
        tasksCompleted: completedTasks,
        totalTasks: tasks?.length || 0
      },
      recentActivity: activities?.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description || '',
        timestamp: activity.timestamp,
        priority: activity.priority || undefined
      })) || [],
      upcomingTasks: upcomingTasks?.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        priority: task.priority,
        phase: task.phase_id || undefined
      })) || []
    };

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

// ============================================================================
// WEDDING DETAIL DATA SERVICE
// ============================================================================

export interface WeddingDetailData {
  id: string;
  coupleNames: string[];
  weddingType: 'SINGLE_EVENT' | 'MULTI_PHASE';
  status: string;
  overallProgress: number;
  daysUntilWedding: number;
  notes?: string;
  settings?: {
    privacy?: {
      public_visibility: boolean;
      guest_can_view_budget: boolean;
      allow_guest_rsvp: boolean;
      allow_vendor_access: boolean;
    };
    notifications?: {
      email_notifications: boolean;
      sms_notifications: boolean;
      push_notifications?: boolean;
      weekly_summaries?: boolean;
    };
    last_updated?: string;
  };
  phases: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
    progress: number;
    venue: any;
    guestCount: number;
    budget?: any;
    vendors?: { total: number; confirmed: number };
    tasks?: { completed: number; total: number };
  }>;
  overallBudget: {
    total: number;
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
    categories?: Array<{
      name: string;
      allocated: number;
      spent: number;
      percentage?: number;
    }>;
  };
  preferences?: any;
}

export async function getWeddingDetailData(weddingId: string): Promise<WeddingDetailData> {
  try {
    // Get wedding details
    const { data: wedding } = await client.models.Wedding.get({ id: weddingId });
    if (!wedding) throw new Error('Wedding not found');

    // Get wedding phases
    const { data: phases } = await client.models.WeddingPhase.list({
      filter: { wedding_id: { eq: weddingId } }
    });

    // Get enhanced phase data with related counts
    const enhancedPhases = await Promise.all(
      (phases || []).map(async (phase) => {
        // Get vendors for this phase
        const { data: phaseVendors } = await client.models.Vendor.list({
          filter: {
            and: [
              { wedding_id: { eq: weddingId } },
              { phase_ids: { contains: phase.id } }
            ]
          }
        });

        // Get tasks for this phase
        const { data: phaseTasks } = await client.models.Task.list({
          filter: { phase_id: { eq: phase.id } }
        });

        const confirmedVendors = phaseVendors?.filter(v => v.status === 'CONFIRMED').length || 0;
        const completedTasks = phaseTasks?.filter(t => t.status === 'COMPLETED').length || 0;

        return {
          id: phase.id,
          name: phase.name,
          date: phase.date,
          status: phase.status,
          progress: phase.progress || 0,
          venue: phase.venue,
          guestCount: phase.requirements?.guest_count || 0,
          budget: phase.budget,
          vendors: {
            total: phaseVendors?.length || 0,
            confirmed: confirmedVendors
          },
          tasks: {
            completed: completedTasks,
            total: phaseTasks?.length || 0
          }
        };
      })
    );

    // Calculate overall progress
    const totalProgress = enhancedPhases.reduce((sum, phase) => sum + phase.progress, 0);
    const overallProgress = enhancedPhases.length > 0 ? Math.round(totalProgress / enhancedPhases.length) : 0;

    // Calculate days until wedding
    const primaryDate = enhancedPhases[0]?.date ? new Date(enhancedPhases[0].date) : new Date();
    const today = new Date();
    const daysUntilWedding = Math.ceil((primaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      id: wedding.id,
      coupleNames: wedding.couple_names?.filter((name): name is string => name !== null && name !== undefined && name !== '') || [],
      weddingType: wedding.wedding_type,
      status: wedding.status,
      overallProgress,
      daysUntilWedding,
      notes: wedding.notes || undefined,
      settings: wedding.settings ? {
        privacy: wedding.settings.privacy ? {
          public_visibility: wedding.settings.privacy.public_visibility,
          guest_can_view_budget: wedding.settings.privacy.guest_can_view_budget,
          allow_guest_rsvp: wedding.settings.privacy.allow_guest_rsvp,
          allow_vendor_access: wedding.settings.privacy.allow_vendor_access
        } : undefined,
        notifications: wedding.settings.notifications ? {
          email_notifications: wedding.settings.notifications.email_notifications,
          sms_notifications: wedding.settings.notifications.sms_notifications,
          push_notifications: wedding.settings.notifications.push_notifications || undefined,
          weekly_summaries: wedding.settings.notifications.weekly_summaries || undefined
        } : undefined,
        last_updated: wedding.settings.last_updated || undefined
      } : undefined,
      phases: enhancedPhases,
      overallBudget: wedding.overall_budget ? {
        total: wedding.overall_budget.total,
        allocated: wedding.overall_budget.allocated,
        spent: wedding.overall_budget.spent,
        remaining: wedding.overall_budget.remaining,
        currency: wedding.overall_budget.currency,
        categories: wedding.overall_budget.categories?.map(cat => cat ? {
          name: cat.name,
          allocated: cat.allocated,
          spent: cat.spent,
          percentage: cat.percentage_of_total || undefined
        } : {
          name: '',
          allocated: 0,
          spent: 0,
          percentage: 0
        }).filter(Boolean) || []
      } : {
        total: 0,
        allocated: 0,
        spent: 0,
        remaining: 0,
        currency: 'USD',
        categories: []
      },
      preferences: wedding.preferences
    };

  } catch (error) {
    console.error('Error fetching wedding detail data:', error);
    throw error;
  }
}

// ============================================================================
// VENDOR LIST DATA SERVICE
// ============================================================================

export interface VendorListData {
  id: string;
  name: string;
  category: {
    primary: string;
    secondary?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    preferredContactMethod: string;
  };
  status: string;
  totalCost?: number;
  rating?: number;
  lastContact?: string;
  nextFollowup?: string;
  services?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
  }>;
}

export async function getVendorsData(weddingId?: string): Promise<VendorListData[]> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      const currentUserId = await getCurrentUserId();
      const { data: weddings } = await client.models.Wedding.list({
        filter: { user_id: { eq: currentUserId } },
        limit: 1
      });
      
      if (!weddings || weddings.length === 0) {
        throw new Error('No weddings found for user');
      }
      
      targetWeddingId = weddings[0].id;
    }

    const { data: vendors } = await client.models.Vendor.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    return vendors?.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      category: {
        primary: vendor.category.primary,
        secondary: vendor.category.secondary || undefined
      },
      contactInfo: {
        email: vendor.contact_info.email,
        phone: vendor.contact_info.phone,
        preferredContactMethod: vendor.contact_info.preferred_contact_method,
        address: vendor.contact_info.address || undefined,
        website: vendor.contact_info.website || undefined
      },
      status: vendor.status,
      totalCost: vendor.total_cost || undefined,
      rating: vendor.rating || undefined,
      lastContact: vendor.last_contact || undefined,
      nextFollowup: vendor.next_followup || undefined,
      services: vendor.services?.map(service => service ? {
        id: service.id,
        name: service.name,
        price: service.price,
        currency: service.currency
      } : null).filter((service): service is { id: string; name: string; price: number; currency: string; } => service !== null) || undefined
    })) || [];

  } catch (error) {
    console.error('Error fetching vendors data:', error);
    throw error;
  }
}

// ============================================================================
// GUEST LIST DATA SERVICE
// ============================================================================

export interface GuestListData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: string;
  relationship: string;
  side: string;
  inviteGroup?: string;
  tableAssignment?: string;
  dietaryRestrictions?: string[];
  plusOne?: {
    name: string;
    rsvpStatus: string;
  };
  phaseAttendance?: Array<{
    phaseId: string;
    status: string;
  }>;
}

export async function getGuestsData(weddingId?: string): Promise<GuestListData[]> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      const currentUserId = await getCurrentUserId();
      const { data: weddings } = await client.models.Wedding.list({
        filter: { user_id: { eq: currentUserId } },
        limit: 1
      });
      
      if (!weddings || weddings.length === 0) {
        throw new Error('No weddings found for user');
      }
      
      targetWeddingId = weddings[0].id;
    }

    const { data: guests } = await client.models.Guest.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    // Get plus one IDs that exist
    const plusOneIds = guests?.map(guest => guest.plus_one_id).filter((id): id is string => id !== null && id !== undefined) || [];
    
    // Load plus one data separately
    const plusOneMap = new Map();
    if (plusOneIds.length > 0) {
      const { data: plusOnes } = await client.models.PlusOne.list({
        filter: {
          or: plusOneIds.map(id => ({ id: { eq: id } }))
        }
      });
      
      plusOnes?.forEach(plusOne => {
        plusOneMap.set(plusOne.id, {
          name: plusOne.name,
          rsvpStatus: plusOne.rsvp_status
        });
      });
    }

    return guests?.map(guest => ({
      id: guest.id,
      name: guest.name,
      email: guest.email || undefined,
      phone: guest.phone || undefined,
      rsvpStatus: guest.rsvp_status,
      relationship: guest.relationship,
      side: guest.side,
      inviteGroup: guest.invite_group || undefined,
      tableAssignment: guest.table_assignment || undefined,
      dietaryRestrictions: guest.dietary_restrictions?.filter((restriction): restriction is string => restriction !== null && restriction !== undefined) || undefined,
      plusOne: guest.plus_one_id ? plusOneMap.get(guest.plus_one_id) : undefined,
      phaseAttendance: guest.phase_attendance?.filter((attendance): attendance is NonNullable<typeof attendance> => attendance !== null && attendance !== undefined)
        .map(attendance => ({
          phaseId: attendance.phase_id,
          status: attendance.status
        })) || undefined
    })) || [];

  } catch (error) {
    console.error('Error fetching guests data:', error);
    throw error;
  }
}

// ============================================================================
// MOOD BOARDS DATA SERVICE
// ============================================================================

export interface MoodBoardListData {
  id: string;
  name: string;
  description?: string;
  phaseId?: string;
  images?: Array<{
    id: string;
    url: string;
    filename: string;
  }>;
  videos?: Array<{
    id: string;
    url: string;
    filename: string;
  }>;
  inspirationLinks?: Array<{
    id: string;
    url: string;
    title: string;
  }>;
  isPublic?: boolean;
  isFinalized?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getMoodBoardsData(weddingId?: string): Promise<MoodBoardListData[]> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      const currentUserId = await getCurrentUserId();
      const { data: weddings } = await client.models.Wedding.list({
        filter: { user_id: { eq: currentUserId } },
        limit: 1
      });
      
      if (!weddings || weddings.length === 0) {
        throw new Error('No weddings found for user');
      }
      
      targetWeddingId = weddings[0].id;
    }

    const { data: moodBoards } = await client.models.MoodBoard.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    return moodBoards?.map(board => ({
      id: board.id,
      name: board.name,
      description: board.description || undefined,
      phaseId: board.phase_id || undefined,
      images: board.images?.filter((img): img is NonNullable<typeof img> => img !== null && img !== undefined)
        .slice(0, 3)
        .map(img => ({
          id: img.id,
          url: img.url,
          filename: img.filename
        })) || undefined,
      videos: board.videos?.filter((vid): vid is NonNullable<typeof vid> => vid !== null && vid !== undefined)
        .slice(0, 3)
        .map(vid => ({
          id: vid.id,
          url: vid.url,
          filename: vid.filename
        })) || undefined,
      inspirationLinks: board.inspiration_links?.filter((link): link is NonNullable<typeof link> => link !== null && link !== undefined)
        .slice(0, 3)
        .map(link => ({
          id: link.id,
          url: link.url,
          title: link.title
        })) || undefined,
      isPublic: board.is_public || undefined,
      isFinalized: board.is_finalized || undefined,
      createdAt: board.created_at || undefined,
      updatedAt: board.updated_at || undefined
    })) || [];

  } catch (error) {
    console.error('Error fetching mood boards data:', error);
    throw error;
  }
}

// ============================================================================
// TIMELINE DATA SERVICE
// ============================================================================

export interface TimelineData {
  milestones: Array<{
    id: string;
    name: string;
    targetDate: string;
    status: string;
    priority: string;
    progress: number;
    phaseId?: string;
    responsibleParties: string[];
  }>;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: string;
    priority: string;
    phaseId?: string;
    assignedTo: string[];
    dependencies?: string[];
  }>;
  activities: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    timestamp: string;
    phaseId?: string;
    performedBy?: string;
  }>;
}

export async function getTimelineData(weddingId?: string): Promise<TimelineData> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      const currentUserId = await getCurrentUserId();
      const { data: weddings } = await client.models.Wedding.list({
        filter: { user_id: { eq: currentUserId } },
        limit: 1
      });
      
      if (!weddings || weddings.length === 0) {
        throw new Error('No weddings found for user');
      }
      
      targetWeddingId = weddings[0].id;
    }

    // Get milestones
    const { data: milestones } = await client.models.Milestone.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    // Get tasks
    const { data: tasks } = await client.models.Task.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    // Get activities
    const { data: activities } = await client.models.Activity.list({
      filter: { wedding_id: { eq: targetWeddingId } },
      limit: 50
    });

    return {
      milestones: milestones?.map(milestone => ({
        id: milestone.id,
        name: milestone.name,
        targetDate: milestone.target_date,
        status: milestone.status,
        priority: milestone.priority,
        progress: milestone.progress_percentage || 0,
        phaseId: milestone.phase_id || undefined,
        responsibleParties: milestone.responsible_parties?.filter((party): party is string => party !== null && party !== undefined) || []
      })) || [],
      tasks: tasks?.map(task => ({
        id: task.id,
        title: task.title,
        dueDate: task.due_date,
        status: task.status,
        priority: task.priority,
        phaseId: task.phase_id || undefined,
        assignedTo: task.assigned_to?.filter((person): person is string => person !== null && person !== undefined) || [],
        dependencies: task.dependencies?.filter((dep): dep is string => dep !== null && dep !== undefined) || undefined
      })) || [],
      activities: activities?.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description || undefined,
        timestamp: activity.timestamp,
        phaseId: activity.phase_id || undefined,
        performedBy: activity.performed_by || undefined
      })) || []
    };

  } catch (error) {
    console.error('Error fetching timeline data:', error);
    throw error;
  }
}

// ============================================================================
// BUDGET DATA SERVICE
// ============================================================================

export interface BudgetData {
  overallBudget: {
    total: number;
    allocated: number;
    spent: number;
    remaining: number;
    currency: string;
    categories?: Array<{
      name: string;
      allocated: number;
      spent: number;
      percentage?: number;
    }>;
  };
  categories: Array<{
    id: string;
    name: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentage: number;
    status: string;
    vendorIds?: string[];
    phaseIds?: string[];
  }>;
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    type: string;
    categoryId: string;
    vendorName?: string;
    phaseId?: string;
  }>;
}

export async function getBudgetData(weddingId?: string): Promise<BudgetData> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      const currentUserId = await getCurrentUserId();
      const { data: weddings } = await client.models.Wedding.list({
        filter: { user_id: { eq: currentUserId } },
        limit: 1
      });
      
      if (!weddings || weddings.length === 0) {
        throw new Error('No weddings found for user');
      }
      
      targetWeddingId = weddings[0].id;
    }

    // Get wedding with budget info
    const { data: wedding } = await client.models.Wedding.get({ id: targetWeddingId });
    if (!wedding) throw new Error('Wedding not found');

    // Get budget categories
    const { data: categories } = await client.models.BudgetCategory.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    // Get transactions
    const { data: transactions } = await client.models.Transaction.list({
      filter: { wedding_id: { eq: targetWeddingId } }
    });

    return {
      overallBudget: wedding.overall_budget ? {
        total: wedding.overall_budget.total,
        allocated: wedding.overall_budget.allocated,
        spent: wedding.overall_budget.spent,
        remaining: wedding.overall_budget.remaining,
        currency: wedding.overall_budget.currency,
        categories: wedding.overall_budget.categories?.map(cat => cat ? {
          name: cat.name,
          allocated: cat.allocated,
          spent: cat.spent,
          percentage: cat.percentage_of_total || undefined
        } : {
          name: '',
          allocated: 0,
          spent: 0,
          percentage: 0
        }).filter(Boolean) || []
      } : {
        total: 0,
        allocated: 0,
        spent: 0,
        remaining: 0,
        currency: 'USD',
        categories: []
      },
      categories: categories?.map(category => ({
        id: category.id,
        name: category.name,
        allocated: category.allocated,
        spent: category.spent,
        remaining: category.remaining,
        percentage: category.percentage,
        status: category.status,
        vendorIds: category.vendor_ids?.filter((id): id is string => id !== null && id !== undefined) || undefined,
        phaseIds: category.phase_ids?.filter((id): id is string => id !== null && id !== undefined) || undefined
      })) || [],
      transactions: transactions?.map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.category_id,
        vendorName: transaction.vendor_name || undefined,
        phaseId: transaction.phase_id || undefined
      })) || []
    };

  } catch (error) {
    console.error('Error fetching budget data:', error);
    throw error;
  }
}

// ============================================================================
// MOOD BOARD MANAGEMENT
// ============================================================================

export async function createMoodBoard(moodBoardData: {
  name: string;
  description?: string;
  phaseId?: string;
  weddingId?: string;
}): Promise<string> {
  try {
    let targetWeddingId = moodBoardData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    const newMoodBoard = await client.models.MoodBoard.create({
      wedding_id: targetWeddingId,
      name: moodBoardData.name,
      description: moodBoardData.description || '',
      phase_id: moodBoardData.phaseId || undefined,
      images: [],
      videos: [],
      inspiration_links: [],
      color_palette: {
        primary: [],
        secondary: [],
        accent: [],
        neutral: []
      },
      style_keywords: [],
      is_public: true,
      is_finalized: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (!newMoodBoard.data) {
      throw new Error('Failed to create mood board');
    }

    // Log the mood board creation activity
    await createActivity({
      weddingId: targetWeddingId,
      type: 'MOOD_BOARD_CREATED',
      title: 'New Mood Board Created',
      description: `Created mood board "${moodBoardData.name}"`,
      phaseId: moodBoardData.phaseId,
      relatedEntityType: 'MOOD_BOARD',
      relatedEntityId: newMoodBoard.data.id,
      priority: 'MEDIUM',
      isPublic: true
    });

    return newMoodBoard.data.id;
  } catch (error) {
    console.error('Error creating mood board:', error);
    throw error;
  }
}

export async function getMoodBoardDetail(moodBoardId: string): Promise<any> {
  try {
    const { data: moodBoard } = await client.models.MoodBoard.get({ id: moodBoardId });
    
    if (!moodBoard) {
      throw new Error('Mood board not found');
    }

    return {
      id: moodBoard.id,
      name: moodBoard.name,
      description: moodBoard.description || '',
      phaseId: moodBoard.phase_id || undefined,
      weddingId: moodBoard.wedding_id,
      images: moodBoard.images?.filter((img): img is NonNullable<typeof img> => img !== null && img !== undefined)
        .map(img => ({
          id: img.id,
          url: img.url,
          filename: img.filename
        })) || [],
      videos: moodBoard.videos?.filter((vid): vid is NonNullable<typeof vid> => vid !== null && vid !== undefined)
        .map(vid => ({
          id: vid.id,
          url: vid.url,
          filename: vid.filename
        })) || [],
      inspirationLinks: moodBoard.inspiration_links?.filter((link): link is NonNullable<typeof link> => link !== null && link !== undefined)
        .map(link => ({
          id: link.id,
          url: link.url,
          title: link.title,
          description: link.description || ''
        })) || [],
      colorPalette: moodBoard.color_palette ? {
        primary: moodBoard.color_palette.primary || [],
        secondary: moodBoard.color_palette.secondary || [],
        accent: moodBoard.color_palette.accent || [],
        neutral: moodBoard.color_palette.neutral || []
      } : {
        primary: [],
        secondary: [],
        accent: [],
        neutral: []
      },
      styleKeywords: moodBoard.style_keywords?.filter((keyword): keyword is string => keyword !== null && keyword !== undefined) || [],
      isPublic: moodBoard.is_public ?? true,
      isFinalized: moodBoard.is_finalized ?? false,
      createdAt: moodBoard.created_at || new Date().toISOString(),
      updatedAt: moodBoard.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching mood board detail:', error);
    throw error;
  }
}

// ============================================================================
// ACTIVITY LOGGING HELPERS
// ============================================================================

// Helper function to create activity logs with proper user attribution
export async function createActivity(activityData: {
  weddingId: string;
  type: string;
  title: string;
  description?: string;
  phaseId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isPublic?: boolean;
}): Promise<void> {
  try {
    const currentUserId = await getCurrentUserId();
    const currentUserName = await getCurrentUserDisplayName();
    
    await client.models.Activity.create({
      wedding_id: activityData.weddingId,
      type: activityData.type,
      title: activityData.title,
      description: activityData.description || '',
      timestamp: new Date().toISOString(),
      phase_id: activityData.phaseId || undefined,
      related_entity_type: activityData.relatedEntityType || undefined,
      related_entity_id: activityData.relatedEntityId || undefined,
      performed_by: currentUserName,
      priority: activityData.priority || 'LOW',
      is_public: activityData.isPublic ?? true
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
    // Don't throw here as activity logging is not critical for main functionality
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

// Delete a guest
export async function deleteGuest(guestId: string): Promise<void> {
  try {
    const { data: guest } = await client.models.Guest.get({ id: guestId });
    if (!guest) {
      throw new Error('Guest not found');
    }

    // Delete associated plus one if exists
    if (guest.plus_one_id) {
      await client.models.PlusOne.delete({ id: guest.plus_one_id });
    }

    // Delete guest
    await client.models.Guest.delete({ id: guestId });

    // Log activity
    await createActivity({
      weddingId: guest.wedding_id,
      type: 'GUEST_DELETED',
      title: 'Guest Removed',
      description: `Guest ${guest.name} has been removed from the wedding`,
      relatedEntityType: 'GUEST',
      relatedEntityId: guestId,
      priority: 'MEDIUM'
    });
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw error;
  }
}

// Delete a vendor
export async function deleteVendor(vendorId: string): Promise<void> {
  try {
    const { data: vendor } = await client.models.Vendor.get({ id: vendorId });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Delete vendor
    await client.models.Vendor.delete({ id: vendorId });

    // Log activity
    await createActivity({
      weddingId: vendor.wedding_id,
      type: 'VENDOR_DELETED',
      title: 'Vendor Removed',
      description: `Vendor ${vendor.name} has been removed from the wedding`,
      relatedEntityType: 'VENDOR',
      relatedEntityId: vendorId,
      priority: 'MEDIUM'
    });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
}

// Delete a mood board
export async function deleteMoodBoard(moodBoardId: string): Promise<void> {
  try {
    const { data: moodBoard } = await client.models.MoodBoard.get({ id: moodBoardId });
    if (!moodBoard) {
      throw new Error('Mood board not found');
    }

    // Delete mood board
    await client.models.MoodBoard.delete({ id: moodBoardId });

    // Log activity
    await createActivity({
      weddingId: moodBoard.wedding_id,
      type: 'MOOD_BOARD_DELETED',
      title: 'Mood Board Removed',
      description: `Mood board "${moodBoard.name}" has been deleted`,
      relatedEntityType: 'MOOD_BOARD',
      relatedEntityId: moodBoardId,
      priority: 'MEDIUM'
    });
  } catch (error) {
    console.error('Error deleting mood board:', error);
    throw error;
  }
}

// Delete a wedding (with all associated data)
export async function deleteWedding(weddingId: string): Promise<void> {
  try {
    const { data: wedding } = await client.models.Wedding.get({ id: weddingId });
    if (!wedding) {
      throw new Error('Wedding not found');
    }

    // Delete all associated data
    // Note: In a real implementation, you might want to do this in a transaction
    // or have cascade deletes configured in your database schema

    // Delete guests
    const { data: guests } = await client.models.Guest.list({
      filter: { wedding_id: { eq: weddingId } }
    });
    if (guests) {
      for (const guest of guests) {
        await deleteGuest(guest.id);
      }
    }

    // Delete vendors
    const { data: vendors } = await client.models.Vendor.list({
      filter: { wedding_id: { eq: weddingId } }
    });
    if (vendors) {
      for (const vendor of vendors) {
        await deleteVendor(vendor.id);
      }
    }

    // Delete mood boards
    const { data: moodBoards } = await client.models.MoodBoard.list({
      filter: { wedding_id: { eq: weddingId } }
    });
    if (moodBoards) {
      for (const moodBoard of moodBoards) {
        await deleteMoodBoard(moodBoard.id);
      }
    }

    // Delete phases
    const { data: phases } = await client.models.WeddingPhase.list({
      filter: { wedding_id: { eq: weddingId } }
    });
    if (phases) {
      for (const phase of phases) {
        await client.models.WeddingPhase.delete({ id: phase.id });
      }
    }

    // Finally, delete the wedding
    await client.models.Wedding.delete({ id: weddingId });
  } catch (error) {
    console.error('Error deleting wedding:', error);
    throw error;
  }
}

// ============================================================================
// TIMELINE MANAGEMENT FUNCTIONS
// ============================================================================

export async function createMilestone(milestoneData: {
  name: string;
  targetDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  phaseId?: string;
  responsibleParties: string[];
  description?: string;
  weddingId?: string;
}): Promise<string> {
  try {
    let targetWeddingId = milestoneData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    const newMilestone = await client.models.Milestone.create({
      wedding_id: targetWeddingId,
      name: milestoneData.name,
      target_date: milestoneData.targetDate,
      priority: milestoneData.priority,
      status: 'PENDING',
      progress_percentage: 0,
      phase_id: milestoneData.phaseId || null,
      responsible_parties: milestoneData.responsibleParties,
      description: milestoneData.description || null
    });

    if (!newMilestone.data) {
      throw new Error('Failed to create milestone');
    }

    // Log activity
    await client.models.Activity.create({
      wedding_id: targetWeddingId,
      type: 'MILESTONE_CREATED',
      title: `Milestone created: ${milestoneData.name}`,
      description: `New milestone "${milestoneData.name}" has been added to the timeline`,
      timestamp: new Date().toISOString(),
      phase_id: milestoneData.phaseId || null,
      performed_by: await getCurrentUserDisplayName()
    });

    return newMilestone.data.id;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
}

export async function createTask(taskData: {
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  phaseId?: string;
  assignedTo: string[];
  dependencies?: string[];
  description?: string;
  weddingId?: string;
}): Promise<string> {
  try {
    let targetWeddingId = taskData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    const newTask = await client.models.Task.create({
      wedding_id: targetWeddingId,
      title: taskData.title,
      due_date: taskData.dueDate,
      priority: taskData.priority,
      status: 'PENDING',
      phase_id: taskData.phaseId || null,
      assigned_to: taskData.assignedTo,
      dependencies: taskData.dependencies || [],
      description: taskData.description || null
    });

    if (!newTask.data) {
      throw new Error('Failed to create task');
    }

    // Log activity
    await client.models.Activity.create({
      wedding_id: targetWeddingId,
      type: 'TASK_CREATED',
      title: `Task created: ${taskData.title}`,
      description: `New task "${taskData.title}" has been added to the timeline`,
      timestamp: new Date().toISOString(),
      phase_id: taskData.phaseId || null,
      performed_by: await getCurrentUserDisplayName()
    });

    return newTask.data.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

// ============================================================================
// WEDDING MANAGEMENT FUNCTIONS
// ============================================================================

export async function updateWeddingDetails(weddingData: {
  weddingId: string;
  coupleNames?: string[];
  weddingType?: 'SINGLE_EVENT' | 'MULTI_PHASE';
  status?: 'PLANNING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}): Promise<void> {
  try {
    const updateData: any = {};

    if (weddingData.coupleNames) {
      updateData.couple_names = weddingData.coupleNames;
    }
    if (weddingData.weddingType) {
      updateData.wedding_type = weddingData.weddingType;
    }
    if (weddingData.status) {
      updateData.status = weddingData.status;
    }
    if (weddingData.notes !== undefined) {
      updateData.notes = weddingData.notes;
    }

    await client.models.Wedding.update({
      id: weddingData.weddingId,
      ...updateData
    });

    // Log activity
    await createActivity({
      weddingId: weddingData.weddingId,
      type: 'WEDDING_UPDATED',
      title: 'Wedding Details Updated',
      description: `Wedding details have been updated`,
      priority: 'MEDIUM',
      isPublic: true
    });

  } catch (error) {
    console.error('Error updating wedding details:', error);
    throw error;
  }
}

export interface WeddingSettings {
  publicVisibility: boolean;
  guestCanViewBudget: boolean;
  allowGuestRSVP: boolean;
  allowVendorAccess: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export async function updateWeddingSettings(weddingId: string, settings: WeddingSettings): Promise<void> {
  try {
    // Update wedding with proper settings schema
    await client.models.Wedding.update({
      id: weddingId,
      settings: {
        privacy: {
          public_visibility: settings.publicVisibility,
          guest_can_view_budget: settings.guestCanViewBudget,
          allow_guest_rsvp: settings.allowGuestRSVP,
          allow_vendor_access: settings.allowVendorAccess
        },
        notifications: {
          email_notifications: settings.emailNotifications,
          sms_notifications: settings.smsNotifications,
          push_notifications: false,
          weekly_summaries: true
        },
        last_updated: new Date().toISOString()
      }
    });

    // Log activity
    await createActivity({
      weddingId,
      type: 'SETTINGS_UPDATED',
      title: 'Wedding Settings Updated',
      description: 'Privacy and notification settings have been updated',
      priority: 'MEDIUM',
      isPublic: false
    });

  } catch (error) {
    console.error('Error updating wedding settings:', error);
    throw error;
  }
}

// ============================================================================
// BUDGET MANAGEMENT FUNCTIONS
// ============================================================================

export async function setupWeddingBudget(budgetData: {
  totalBudget: number;
  currency: string;
  categories: Array<{
    name: string;
    allocated: number;
    percentage: number;
  }>;
  weddingId?: string;
}): Promise<void> {
  try {
    let targetWeddingId = budgetData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    // Update the wedding's overall budget
    await client.models.Wedding.update({
      id: targetWeddingId,
      overall_budget: {
        total: budgetData.totalBudget,
        allocated: budgetData.totalBudget,
        spent: 0,
        remaining: budgetData.totalBudget,
        currency: budgetData.currency
      }
    });

    // Create budget categories
    for (const category of budgetData.categories) {
      await client.models.BudgetCategory.create({
        wedding_id: targetWeddingId,
        name: category.name,
        allocated: category.allocated,
        spent: 0,
        remaining: category.allocated,
        percentage: category.percentage,
        status: 'ON_BUDGET'
      });
    }

    // Log activity
    await client.models.Activity.create({
      wedding_id: targetWeddingId,
      type: 'BUDGET_SETUP',
      title: 'Budget Setup Complete',
      description: `Wedding budget of ${budgetData.currency} ${budgetData.totalBudget.toLocaleString()} has been configured`,
      timestamp: new Date().toISOString(),
      performed_by: await getCurrentUserDisplayName()
    });

  } catch (error) {
    console.error('Error setting up budget:', error);
    throw error;
  }
}

export async function addBudgetExpense(expenseData: {
  description: string;
  amount: number;
  categoryId: string;
  vendorName?: string;
  date: string;
  notes?: string;
  weddingId?: string;
}): Promise<string> {
  try {
    let targetWeddingId = expenseData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    // Get the current category to update spent amount
    const { data: category } = await client.models.BudgetCategory.get({ 
      id: expenseData.categoryId 
    });
    
    if (!category) {
      throw new Error('Budget category not found');
    }

    // Update category spent amount
    const newSpent = (category.spent || 0) + expenseData.amount;
    const newRemaining = category.allocated - newSpent;

    let status: "ON_BUDGET" | "UNDER_BUDGET" | "OVER_BUDGET" | "NOT_STARTED" | "AT_RISK" =
      "ON_BUDGET";
    if (newSpent > category.allocated) {
      status = 'OVER_BUDGET';
    } else if (newSpent / category.allocated > 0.9) {
      status = 'AT_RISK';
    } else if (newSpent / category.allocated < 0.8) {
      status = 'UNDER_BUDGET';
    }

    await client.models.BudgetCategory.update({
      id: expenseData.categoryId,
      spent: newSpent,
      remaining: newRemaining,
      status: status ? status : 'ON_BUDGET'
    });

    // Update overall wedding budget
    const { data: wedding } = await client.models.Wedding.get({ id: targetWeddingId });
    if (wedding && wedding.overall_budget) {
      const currentBudget = wedding.overall_budget;
      const newSpent = (currentBudget.spent || 0) + expenseData.amount;
      
      await client.models.Wedding.update({
        id: targetWeddingId,
        overall_budget: {
          ...currentBudget,
          spent: newSpent,
          remaining: currentBudget.total - newSpent
        }
      });
    }

    // Log activity
    await client.models.Activity.create({
      wedding_id: targetWeddingId,
      type: 'EXPENSE_ADDED',
      title: `Expense added: ${expenseData.description}`,
      description: `$${expenseData.amount} expense recorded for ${expenseData.description}`,
      timestamp: new Date().toISOString(),
      performed_by: await getCurrentUserDisplayName()
    });

    return category.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

// ============================================================================
// GUEST MANAGEMENT FUNCTIONS
// ============================================================================

export async function createGuest(guestData: {
  name: string;
  email?: string;
  phone?: string;
  relationship: string;
  side: 'BRIDE' | 'GROOM';
  inviteGroup?: string;
  dietaryRestrictions?: string[];
  plusOneName?: string;
  plusOneEmail?: string;
  plusOnePhone?: string;
  hasPlusOne: boolean;
  notes?: string;
  weddingId?: string;
}): Promise<string> {
  try {
    let targetWeddingId = guestData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    // Create plus one first if needed
    let plusOneId: string | undefined;
    if (guestData.hasPlusOne && guestData.plusOneName) {
      const newPlusOne = await client.models.PlusOne.create({
        name: guestData.plusOneName,
        email: guestData.plusOneEmail || null,
        phone: guestData.plusOnePhone || null,
        rsvp_status: 'PENDING',
        dietary_restrictions: [],
        accommodation_needs: [],
        accessibility_needs: [],
        phase_attendance: []
      });

      if (newPlusOne.data) {
        plusOneId = newPlusOne.data.id;
      }
    }

    // Create the guest
    const newGuest = await client.models.Guest.create({
      wedding_id: targetWeddingId,
      name: guestData.name,
      email: guestData.email || null,
      phone: guestData.phone || null,
      rsvp_status: 'PENDING',
      relationship: guestData.relationship,
      side: guestData.side,
      invite_group: guestData.inviteGroup || null,
      table_assignment: null,
      dietary_restrictions: guestData.dietaryRestrictions || [],
      accommodation_needs: [],
      accessibility_needs: [],
      plus_one_id: plusOneId || null,
      address: null,
      notes: guestData.notes || null,
      gift_received: false,
      thank_you_sent: false,
      phase_attendance: []
    });

    if (!newGuest.data) {
      throw new Error('Failed to create guest');
    }

    // Log activity
    await createActivity({
      weddingId: targetWeddingId,
      type: 'GUEST_ADDED',
      title: `Guest added: ${guestData.name}`,
      description: `${guestData.name} has been added to the guest list`,
      relatedEntityType: 'GUEST',
      relatedEntityId: newGuest.data.id,
      priority: 'LOW',
      isPublic: true
    });

    return newGuest.data.id;
  } catch (error) {
    console.error('Error creating guest:', error);
    throw error;
  }
}

export async function importGuests(guestsData: Array<{
  name: string;
  email: string;
  phone: string;
  relationship: string;
  side: 'BRIDE' | 'GROOM';
  inviteGroup: string;
  dietaryRestrictions: string[];
  plusOneName: string;
}>, weddingId?: string): Promise<{ successful: number; failed: number; errors: string[] }> {
  try {
    let targetWeddingId = weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const guestData of guestsData) {
      try {
        // Create plus one first if needed
        let plusOneId: string | undefined;
        if (guestData.plusOneName) {
          const newPlusOne = await client.models.PlusOne.create({
            name: guestData.plusOneName,
            email: null,
            phone: null,
            rsvp_status: 'PENDING',
            dietary_restrictions: guestData.dietaryRestrictions || [],
            accommodation_needs: [],
            accessibility_needs: [],
            phase_attendance: []
          });

          if (newPlusOne.data) {
            plusOneId = newPlusOne.data.id;
          }
        }

        // Create the guest
        await client.models.Guest.create({
          wedding_id: targetWeddingId,
          name: guestData.name,
          email: guestData.email || null,
          phone: guestData.phone || null,
          rsvp_status: 'PENDING',
          relationship: guestData.relationship,
          side: guestData.side,
          invite_group: guestData.inviteGroup || null,
          table_assignment: null,
          dietary_restrictions: guestData.dietaryRestrictions || [],
          accommodation_needs: [],
          accessibility_needs: [],
          plus_one_id: plusOneId || null,
          address: null,
          notes: null,
          gift_received: false,
          thank_you_sent: false,
          phase_attendance: []
        });

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to import ${guestData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`Error importing guest ${guestData.name}:`, error);
      }
    }

    // Log bulk activity
    if (results.successful > 0) {
      await createActivity({
        weddingId: targetWeddingId,
        type: 'GUESTS_IMPORTED',
        title: 'Guests imported',
        description: `Successfully imported ${results.successful} guests from CSV file`,
        priority: 'MEDIUM',
        isPublic: true
      });
    }

    return results;
  } catch (error) {
    console.error('Error in bulk guest import:', error);
    throw error;
  }
}

// ============================================================================
// VENDOR MANAGEMENT FUNCTIONS
// ============================================================================

export interface VendorService {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export interface VendorFormData {
  name: string;
  primaryCategory: string;
  secondaryCategory: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  preferredContactMethod: 'EMAIL' | 'PHONE';
  services: VendorService[];
  totalCost: number;
  depositRequired: number;
  contractSigned: boolean;
  contractDate: string;
  finalPaymentDue: string;
  requirements: string[];
  deliverables: string[];
  notes: string;
}

export async function createVendor(vendorData: VendorFormData & { weddingId?: string }): Promise<string> {
  try {
    let targetWeddingId = vendorData.weddingId;
    
    // If no weddingId provided, get user's primary wedding
    if (!targetWeddingId) {
      targetWeddingId = await getUserPrimaryWedding();
    }

    const newVendor = await client.models.Vendor.create({
      wedding_id: targetWeddingId,
      name: vendorData.name,
      category: {
        primary: vendorData.primaryCategory,
        secondary: vendorData.secondaryCategory || null
      },
      contact_info: {
        email: vendorData.email,
        phone: vendorData.phone,
        website: vendorData.website || null,
        address: vendorData.address || null,
        preferred_contact_method: vendorData.preferredContactMethod
      },
      services: vendorData.services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        currency: service.currency
      })),
      status: 'INQUIRED',
      total_cost: vendorData.totalCost,
      contract_signed: vendorData.contractSigned,
      contract_date: vendorData.contractDate || null,
      final_payment_due: vendorData.finalPaymentDue || null,
      requirements: vendorData.requirements || [],
      deliverables: vendorData.deliverables || []
    });

    if (!newVendor.data) {
      throw new Error('Failed to create vendor');
    }

    // Log activity
    await createActivity({
      weddingId: targetWeddingId,
      type: 'VENDOR_ADDED',
      title: `Vendor added: ${vendorData.name}`,
      description: `${vendorData.name} (${vendorData.primaryCategory}) has been added to the vendor list`,
      relatedEntityType: 'VENDOR',
      relatedEntityId: newVendor.data.id,
      priority: 'MEDIUM',
      isPublic: true
    });

    return newVendor.data.id;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
}

export interface CommunicationData {
  type: 'EMAIL' | 'PHONE' | 'MEETING' | 'TEXT';
  subject?: string;
  message: string;
  followUpRequired: boolean;
  followUpDate?: string;
  scheduledDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export async function recordVendorCommunication(
  vendorId: string, 
  communicationData: CommunicationData
): Promise<string> {
  try {
    // Get vendor details for wedding ID
    const { data: vendor } = await client.models.Vendor.get({ id: vendorId });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Create communication log
    const newCommunication = await client.models.VendorCommunication.create({
      vendor_id: vendorId,
      type: communicationData.type,
      subject: communicationData.subject || null,
      content: communicationData.message,
      timestamp: communicationData.scheduledDate || new Date().toISOString(),
      direction: 'OUTBOUND', // Communication initiated by us
      follow_up_needed: communicationData.followUpRequired,
      follow_up_date: communicationData.followUpDate || null,
      status: communicationData.type === 'MEETING' ? 'SCHEDULED' : 'SENT'
    });

    if (!newCommunication.data) {
      throw new Error('Failed to record communication');
    }

    // Update vendor's last contact date
    await client.models.Vendor.update({
      id: vendorId,
      last_contact: new Date().toISOString().split('T')[0],
      next_followup: communicationData.followUpRequired && communicationData.followUpDate 
        ? communicationData.followUpDate 
        : null
    });

    // Log activity
    await createActivity({
      weddingId: vendor.wedding_id,
      type: 'VENDOR_CONTACTED',
      title: `${communicationData.type.toLowerCase().replace('_', ' ')} to ${vendor.name}`,
      description: communicationData.subject || `Contacted ${vendor.name} via ${communicationData.type.toLowerCase()}`,
      relatedEntityType: 'VENDOR',
      relatedEntityId: vendorId,
      priority: communicationData.priority === 'URGENT' ? 'HIGH' : 'MEDIUM',
      isPublic: true
    });

    return newCommunication.data.id;
  } catch (error) {
    console.error('Error recording vendor communication:', error);
    throw error;
  }
}

export interface PaymentData {
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'VENMO' | 'PAYPAL' | 'ZELLE' | 'OTHER';
  paymentType: 'DEPOSIT' | 'PARTIAL' | 'FINAL' | 'ADDITIONAL';
  transactionId: string;
  notes: string;
  receiptUploaded: boolean;
  sendConfirmation: boolean;
}

export async function recordVendorPayment(
  vendorId: string, 
  paymentData: PaymentData
): Promise<string> {
  try {
    // Get vendor details
    const { data: vendor } = await client.models.Vendor.get({ id: vendorId });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Find or create a budget category for this vendor's primary category
    const { data: budgetCategories } = await client.models.BudgetCategory.list({
      filter: { 
        and: [
          { wedding_id: { eq: vendor.wedding_id } },
          { name: { eq: vendor.category.primary } }
        ]
      }
    });

    let categoryId = budgetCategories?.[0]?.id;

    if (!categoryId) {
      // Create category if it doesn't exist
      const newCategory = await client.models.BudgetCategory.create({
        wedding_id: vendor.wedding_id,
        name: vendor.category.primary,
        allocated: paymentData.amount, // Start with this payment amount
        spent: paymentData.amount,
        remaining: 0,
        percentage: 0, // Will need to be recalculated
        status: 'ON_BUDGET'
      });
      categoryId = newCategory.data?.id!!;
    } else {
      // Update existing category
      const category = budgetCategories[0];
      const newSpent = (category.spent || 0) + paymentData.amount;
      const newRemaining = category.allocated - newSpent;

      await client.models.BudgetCategory.update({
        id: category.id,
        spent: newSpent,
        remaining: newRemaining,
        status: newSpent > category.allocated ? 'OVER_BUDGET' : 'ON_BUDGET'
      });
    }

    // Create payment record
    const newPayment = await client.models.Transaction.create({
      vendor_id: vendorId,
      wedding_id: vendor.wedding_id,
      category_id: categoryId,
      description: `Payment to ${vendor.name}`,
      amount: paymentData.amount,
      date: paymentData.paymentDate,
      payment_method: paymentData.paymentMethod,
      type: paymentData.paymentType,
      vendor_name: vendor.name,
      notes: paymentData.notes || null,
      status: 'COMPLETED'
    });

    if (!newPayment.data) {
      throw new Error('Failed to record payment');
    }

    // Get all payments for this vendor to calculate status
    const { data: allPayments } = await client.models.Transaction.list({
      filter: { vendor_id: { eq: vendorId } }
    });

    const totalPaid = (allPayments || []).reduce((sum, payment) => sum + payment.amount, 0);
    const vendorTotalCost = vendor.total_cost || 0;

    // Update vendor status based on payment
    let vendorStatus: "PENDING" | "CONFIRMED" | "COMPLETED" | "ISSUE" | "INQUIRED";
    if (totalPaid <= 0) {
      vendorStatus = 'PENDING';
    } else if (totalPaid >= vendorTotalCost) {
      vendorStatus = 'COMPLETED'; // Vendor is fully paid and work completed
    } else {
      vendorStatus = 'CONFIRMED'; // Vendor is confirmed with partial payment
    }

    await client.models.Vendor.update({
      id: vendorId,
      status: vendorStatus
    });

    // Log activity
    await createActivity({
      weddingId: vendor.wedding_id,
      type: 'VENDOR_PAYMENT_RECORDED',
      title: `Payment recorded for ${vendor.name}`,
      description: `Payment of $${paymentData.amount.toLocaleString()} recorded for ${vendor.name}`,
      relatedEntityType: 'VENDOR',
      relatedEntityId: vendorId,
      priority: 'MEDIUM',
      isPublic: true
    });

    return newPayment.data.id;
  } catch (error) {
    console.error('Error recording vendor payment:', error);
    throw error;
  }
}

export async function getVendorPaymentHistory(vendorId: string): Promise<Array<{
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  notes?: string;
  paymentType: 'DEPOSIT' | 'PARTIAL' | 'FINAL' | 'ADDITIONAL';
}>> {
  try {
    const { data: payments } = await client.models.Transaction.list({
      filter: { vendor_id: { eq: vendorId } }
    });

    return payments?.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.date,
      paymentMethod: payment.payment_method || 'Unknown',
      transactionId: payment.vendor_id || undefined,
      notes: payment.notes || undefined,
      paymentType: payment.type
    })) || [];
  } catch (error) {
    console.error('Error fetching vendor payment history:', error);
    throw error;
  }
}

export async function getVendorCommunicationHistory(vendorId: string): Promise<Array<{
  id: string;
  date: string;
  type: 'EMAIL' | 'PHONE' | 'MEETING' | 'TEXT';
  subject?: string;
  summary: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: 'SENT' | 'RECEIVED' | 'COMPLETED';
}>> {
  try {
    const { data: communications } = await client.models.VendorCommunication.list({
      filter: { vendor_id: { eq: vendorId } }
    });

    return communications?.map(comm => ({
      id: comm.id,
      date: comm.timestamp,
      type: comm.type as 'EMAIL' | 'PHONE' | 'MEETING' | 'TEXT',
      subject: comm.subject || undefined,
      summary: comm.content,
      followUpRequired: comm.follow_up_needed || false,
      followUpDate: comm.follow_up_date || undefined,
      status: comm.status as 'SENT' | 'RECEIVED' | 'COMPLETED'
    })) || [];
  } catch (error) {
    console.error('Error fetching vendor communication history:', error);
    throw error;
  }
}
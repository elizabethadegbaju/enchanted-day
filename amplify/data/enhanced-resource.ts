import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Enums
  BudgetStatus: a.enum(["ON_BUDGET", "UNDER_BUDGET", "OVER_BUDGET", "NOT_STARTED"]),
  TransactionType: a.enum(["EXPENSE", "INCOME"]),
  RSVPStatus: a.enum(["PENDING", "ATTENDING", "DECLINED"]),
  PhaseAttendanceStatus: a.enum(["PENDING", "ATTENDING", "NOT_ATTENDING", "MAYBE"]),
  Side: a.enum(["BRIDE", "GROOM"]),
  MediaType: a.enum(["IMAGE", "VIDEO"]),
  MilestoneStatus: a.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"]),
  DeadlineStatus: a.enum(["PENDING", "COMPLETED", "OVERDUE"]),
  Priority: a.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  ContingencyStatus: a.enum(["ACTIVE", "INACTIVE", "TRIGGERED"]),
  ActionStatus: a.enum(["PENDING", "COMPLETED", "IN_PROGRESS"]),
  VendorStatus: a.enum(["PENDING", "CONFIRMED", "COMPLETED", "ISSUE"]),
  ContactMethod: a.enum(["EMAIL", "PHONE"]),
  WeddingStatus: a.enum(["PLANNING", "CONFIRMED", "COMPLETED"]),
  WeddingType: a.enum(["SINGLE_EVENT", "MULTI_PHASE"]),
  PhaseStatus: a.enum(["PLANNING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"]),

  // Enhanced Custom Types for Better UI Integration

  // Venue structure that matches UI expectations
  Venue: a.customType({
    id: a.string(),
    name: a.string().required(),
    address: a.string(),
    capacity: a.integer(),
    type: a.string(), // Church, Banquet Hall, etc.
    amenities: a.string().array(),
    restrictions: a.string().array(),
    contact_info: a.json(),
    notes: a.string(),
  }),

  // Budget breakdown per phase
  PhaseBudget: a.customType({
    total: a.float().required(),
    allocated: a.float().required(),
    spent: a.float().required(),
    remaining: a.float().required(),
    currency: a.string().required(),
    categories: a.customType({
      name: a.string().required(),
      allocated: a.float().required(),
      spent: a.float().required(),
      percentage: a.float(),
    }).array(),
  }),

  // Phase-specific requirements
  PhaseRequirements: a.customType({
    guest_count: a.integer().required(),
    duration_hours: a.integer().required(),
    special_needs: a.string().array(),
    cultural_requirements: a.string().array(),
    dietary_restrictions: a.string().array(),
    accessibility_needs: a.string().array(),
    entertainment_type: a.string(),
    photography_style: a.string(),
    additional_notes: a.string(),
  }),

  // Timeline for each phase
  PhaseTimeline: a.customType({
    start_time: a.string().required(), // "10:00 AM"
    end_time: a.string().required(),   // "2:00 PM"
    schedule: a.customType({
      time: a.string().required(),
      activity: a.string().required(),
      duration_minutes: a.integer(),
    }).array(),
    setup_time: a.string(),
    breakdown_time: a.string(),
  }),

  // Enhanced Wedding Phase
  WeddingPhase: a.customType({
    id: a.string().required(),
    name: a.string().required(),
    date: a.date().required(), // Use date instead of datetime for simplicity
    status: a.ref("PhaseStatus").required(),
    progress: a.integer().required(), // 0-100
    venue: a.ref("Venue"),
    budget: a.ref("PhaseBudget"),
    requirements: a.ref("PhaseRequirements"),
    timeline: a.ref("PhaseTimeline"),
    vendor_ids: a.string().array(),
    guest_ids: a.string().array(),
    mood_board_ids: a.string().array(),
    milestone_ids: a.string().array(),
    task_ids: a.string().array(),
    notes: a.string(),
    created_at: a.datetime(),
    updated_at: a.datetime(),
  }),

  // Enhanced Wedding Preferences
  WeddingPreferences: a.customType({
    // Style preferences
    wedding_styles: a.string().array(), // Classic, Modern, Rustic, etc.
    color_themes: a.string().array(),   // Gold, Blush, Navy, etc.
    overall_themes: a.string().array(), // Romantic, Elegant, Bohemian, etc.
    
    // Entertainment
    music_genres: a.string().array(),
    entertainment_types: a.string().array(),
    
    // Food & Beverage
    food_preferences: a.string().array(),
    dietary_considerations: a.string().array(),
    bar_preferences: a.string().array(),
    
    // Cultural & Religious
    cultural_traditions: a.string().array(),
    religious_requirements: a.string().array(),
    
    // Photography & Videography
    photography_styles: a.string().array(),
    must_have_shots: a.string().array(),
    
    // Communication
    preferred_communication_methods: a.string().array(),
    
    // Color palette details
    color_palette: a.customType({
      primary: a.string().array(),
      secondary: a.string().array(),
      accent: a.string().array(),
      neutral: a.string().array(),
    }),
    
    // Style keywords for mood boards
    style_keywords: a.string().array(),
    inspiration_sources: a.string().array(),
  }),

  // Overall Budget tracking
  OverallBudget: a.customType({
    total: a.float().required(),
    allocated: a.float().required(),
    spent: a.float().required(),
    remaining: a.float().required(),
    currency: a.string().required(),
    contingency_percentage: a.float(), // Usually 10-15%
    categories: a.customType({
      name: a.string().required(),
      allocated: a.float().required(),
      spent: a.float().required(),
      percentage_of_total: a.float(),
      vendors: a.string().array(),
      phases: a.string().array(),
    }).array(),
    payment_schedule: a.customType({
      vendor_name: a.string().required(),
      amount: a.float().required(),
      due_date: a.date().required(),
      status: a.string().required(), // PENDING, PAID, OVERDUE
      phase_id: a.string(),
    }).array(),
  }),

  // Vendor Category
  VendorCategory: a.customType({
    primary: a.string().required(),
    secondary: a.string(),
  }),

  // Contact Info
  ContactInfo: a.customType({
    email: a.string().required(),
    phone: a.string().required(),
    address: a.string(),
    website: a.string(),
    preferred_contact_method: a.ref("ContactMethod").required(),
  }),

  // Media Asset for mood boards
  MediaAsset: a.customType({
    id: a.string().required(),
    type: a.ref("MediaType").required(),
    url: a.string().required(),
    s3_key: a.string().required(),
    filename: a.string().required(),
    tags: a.string().array(),
    uploaded_at: a.datetime().required(),
    metadata: a.json(),
    phase_id: a.string(),
    mood_board_id: a.string(),
  }),

  // Inspiration Link
  InspirationLink: a.customType({
    id: a.string().required(),
    url: a.string().required(),
    title: a.string().required(),
    description: a.string(),
    source: a.string().required(),
    tags: a.string().array(),
    added_at: a.datetime().required(),
    phase_id: a.string(),
    mood_board_id: a.string(),
  }),

  // Enhanced Guest Phase Attendance
  PhaseAttendance: a.customType({
    phase_id: a.string().required(),
    status: a.ref("PhaseAttendanceStatus").required(),
    special_requests: a.string().array(),
    transportation_needs: a.json(),
    meal_preference: a.string(),
    accessibility_needs: a.string().array(),
    plus_one_attending: a.boolean(),
  }),

  // Main Wedding Model
  Wedding: a
    .model({
      user_id: a.string().required(), // Changed to string for auth integration
      couple_names: a.string().array().required(),
      wedding_type: a.ref("WeddingType").required(),
      status: a.ref("WeddingStatus").required(),
      
      // Core wedding information
      wedding_date: a.date(), // Primary wedding date
      phases: a.ref("WeddingPhase").array().required(),
      overall_budget: a.ref("OverallBudget"),
      preferences: a.ref("WeddingPreferences"),
      
      // Planning metadata
      days_until_wedding: a.integer(),
      overall_progress: a.integer(), // 0-100
      planning_start_date: a.date(),
      
      // Additional information
      wedding_website: a.string(),
      hashtag: a.string(),
      registry_links: a.string().array(),
      emergency_contacts: a.json(),
      
      // Relations
      budget_categories: a.hasMany("BudgetCategory", "wedding_id"),
      transactions: a.hasMany("Transaction", "wedding_id"),
      guests: a.hasMany("Guest", "wedding_id"),
      mood_boards: a.hasMany("MoodBoard", "wedding_id"),
      milestones: a.hasMany("Milestone", "wedding_id"),
      vendors: a.hasMany("Vendor", "wedding_id"),
      tasks: a.hasMany("Task", "wedding_id"),
      activities: a.hasMany("Activity", "wedding_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Budget Category Model
  BudgetCategory: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      name: a.string().required(),
      allocated: a.float().required(),
      spent: a.float().required(),
      remaining: a.float().required(),
      percentage: a.float().required(),
      status: a.ref("BudgetStatus").required(),
      vendor_ids: a.string().array(),
      phase_ids: a.string().array(),
      priority: a.ref("Priority"),
      notes: a.string(),
      transactions: a.hasMany("Transaction", "category_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Transaction Model
  Transaction: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      category_id: a.id().required(),
      category: a.belongsTo("BudgetCategory", "category_id"),
      date: a.date().required(),
      description: a.string().required(),
      amount: a.float().required(),
      type: a.ref("TransactionType").required(),
      vendor_name: a.string(),
      vendor_id: a.string(),
      phase_id: a.string(),
      payment_method: a.string(),
      receipt_url: a.string(),
      status: a.string(),
      notes: a.string(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Enhanced Guest Model
  Guest: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      
      // Basic info
      name: a.string().required(),
      email: a.string(),
      phone: a.string(),
      
      // RSVP and attendance
      rsvp_status: a.ref("RSVPStatus").required(),
      rsvp_date: a.date(),
      phase_attendance: a.ref("PhaseAttendance").array(),
      
      // Guest details
      relationship: a.string().required(),
      side: a.ref("Side").required(),
      invite_group: a.string(),
      table_assignment: a.string(),
      
      // Special needs
      dietary_restrictions: a.string().array(),
      accommodation_needs: a.string().array(),
      accessibility_needs: a.string().array(),
      
      // Plus one
      plus_one_id: a.id(),
      plus_one: a.belongsTo("PlusOne", "plus_one_id"),
      
      // Contact and notes
      address: a.string(),
      notes: a.string(),
      gift_received: a.boolean(),
      thank_you_sent: a.boolean(),
      
      communications: a.hasMany("Communication", "guest_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Plus One Model
  PlusOne: a
    .model({
      name: a.string().required(),
      email: a.string(),
      phone: a.string(),
      rsvp_status: a.ref("RSVPStatus").required(),
      dietary_restrictions: a.string().array(),
      accommodation_needs: a.string().array(),
      accessibility_needs: a.string().array(),
      phase_attendance: a.ref("PhaseAttendance").array(),
      notes: a.string(),
      guests: a.hasMany("Guest", "plus_one_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Enhanced Mood Board Model
  MoodBoard: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      phase_id: a.string(),
      
      name: a.string().required(),
      description: a.string(),
      
      // Media
      images: a.ref("MediaAsset").array(),
      videos: a.ref("MediaAsset").array(),
      inspiration_links: a.ref("InspirationLink").array(),
      
      // Style information
      color_palette: a.customType({
        primary: a.string().array(),
        secondary: a.string().array(),
        accent: a.string().array(),
        neutral: a.string().array(),
      }),
      style_keywords: a.string().array(),
      themes: a.string().array(),
      
      // Organization
      is_public: a.boolean(),
      is_finalized: a.boolean(),
      vendor_shared_with: a.string().array(),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Enhanced Vendor Model
  Vendor: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      
      name: a.string().required(),
      category: a.ref("VendorCategory").required(),
      contact_info: a.ref("ContactInfo").required(),
      status: a.ref("VendorStatus").required(),
      
      // Services and pricing
      services: a.customType({
        id: a.string().required(),
        name: a.string().required(),
        description: a.string(),
        price: a.float().required(),
        currency: a.string().required(),
      }).array(),
      
      // Contract and payment
      contract_signed: a.boolean(),
      contract_date: a.date(),
      total_cost: a.float(),
      deposit_paid: a.float(),
      final_payment_due: a.date(),
      
      // Planning details
      phase_ids: a.string().array(),
      requirements: a.string().array(),
      deliverables: a.string().array(),
      timeline: a.json(),
      
      // Reviews and notes
      rating: a.integer(), // 1-5 stars
      reviews: a.string().array(),
      internal_notes: a.string(),
      
      last_contact: a.date(),
      next_followup: a.date(),
      
      communications: a.hasMany("VendorCommunication", "vendor_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Communication tracking
  Communication: a
    .model({
      guest_id: a.id(),
      guest: a.belongsTo("Guest", "guest_id"),
      timestamp: a.datetime().required(),
      type: a.string().required(), // EMAIL, PHONE, TEXT, IN_PERSON
      direction: a.string().required(), // INBOUND, OUTBOUND
      subject: a.string(),
      content: a.string().required(),
      status: a.string().required(), // SENT, DELIVERED, READ, RESPONDED
      attachments: a.string().array(),
      follow_up_needed: a.boolean(),
      follow_up_date: a.date(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  VendorCommunication: a
    .model({
      vendor_id: a.id().required(),
      vendor: a.belongsTo("Vendor", "vendor_id"),
      timestamp: a.datetime().required(),
      type: a.string().required(),
      direction: a.string().required(),
      subject: a.string(),
      content: a.string().required(),
      status: a.string().required(),
      attachments: a.string().array(),
      follow_up_needed: a.boolean(),
      follow_up_date: a.date(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Enhanced Task Management
  Task: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      
      title: a.string().required(),
      description: a.string(),
      due_date: a.date().required(),
      completed_date: a.date(),
      
      priority: a.ref("Priority").required(),
      status: a.string().required(), // TODO, IN_PROGRESS, COMPLETED, CANCELLED
      
      assigned_to: a.string().array().required(),
      phase_id: a.string(),
      vendor_id: a.string(),
      category: a.string(),
      
      estimated_hours: a.float(),
      actual_hours: a.float(),
      
      dependencies: a.string().array(), // Other task IDs
      subtasks: a.customType({
        id: a.string().required(),
        title: a.string().required(),
        completed: a.boolean().required(),
      }).array(),
      
      attachments: a.string().array(),
      notes: a.string(),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Milestone tracking
  Milestone: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      
      name: a.string().required(),
      description: a.string(),
      target_date: a.date().required(),
      completed_date: a.date(),
      
      status: a.ref("MilestoneStatus").required(),
      priority: a.ref("Priority").required(),
      
      responsible_parties: a.string().array().required(),
      phase_id: a.string(),
      
      success_criteria: a.string().array(),
      deliverables: a.string().array(),
      dependencies: a.string().array(), // Other milestone IDs
      
      progress_percentage: a.integer(), // 0-100
      notes: a.string(),
      
      created_at: a.datetime(),
      updated_at: a.datetime(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  // Activity log for timeline view
  Activity: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      
      type: a.string().required(), // TASK_COMPLETED, VENDOR_CONFIRMED, PAYMENT_MADE, etc.
      title: a.string().required(),
      description: a.string(),
      
      timestamp: a.datetime().required(),
      
      // Related entities
      related_entity_type: a.string(), // VENDOR, GUEST, TASK, MILESTONE, etc.
      related_entity_id: a.string(),
      phase_id: a.string(),
      
      // User who performed the action
      performed_by: a.string(),
      
      // Additional metadata
      metadata: a.json(),
      priority: a.ref("Priority"),
      
      is_milestone: a.boolean(),
      is_public: a.boolean(), // Show to wedding couple vs. internal only
    })
    .authorization((allow: any) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
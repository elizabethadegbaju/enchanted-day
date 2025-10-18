import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { orchestratorFunction } from "../functions/resource";

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

  // Custom Types
  VendorCategory: a.customType({
    primary: a.string().required(),
    secondary: a.string(),
  }),

  ContactInfo: a.customType({
    email: a.string().required(),
    phone: a.string().required(),
    address: a.string(),
    website: a.string(),
    preferred_contact_method: a.ref("ContactMethod").required(),
  }),

  Budget: a.customType({
    allocated: a.float().required(),
    spent: a.float().required(),
  }),

  Service: a.customType({
    id: a.integer().required(),
    name: a.string().required(),
    description: a.string().required(),
    price: a.float().required(),
    currency: a.string().required(),
  }),

  PaymentSchedule: a.customType({
    amount: a.float().required(),
    due_date: a.datetime().required(),
    description: a.string().required(),
    status: a.string().required(),
  }),

  Contract: a.customType({
    id: a.integer().required(),
    signed_date: a.datetime(),
    payment_schedule: a.ref("PaymentSchedule").array(),
  }),

  Deadline: a.customType({
    id: a.integer().required(),
    name: a.string().required(),
    date: a.datetime().required(),
    description: a.string().required(),
    priority: a.ref("Priority").required(),
    status: a.string().required(),
  }),

  ColorPalette: a.customType({
    primary: a.string().array().required(),
    secondary: a.string().array().required(),
    accent: a.string().array().required(),
    neutral: a.string().array().required(),
  }),

  MediaAsset: a.customType({
    id: a.integer().required(),
    type: a.ref("MediaType").required(),
    url: a.string().required(),
    s3_key: a.string().required(),
    filename: a.string().required(),
    tags: a.string().array(),
    uploaded_at: a.datetime().required(),
    metadata: a.json().required(),
  }),

  InspirationLink: a.customType({
    id: a.integer().required(),
    url: a.string().required(),
    title: a.string().required(),
    description: a.string().required(),
    source: a.string().required(),
    tags: a.string().array(),
    added_at: a.datetime().required(),
  }),

  PhaseAttendance: a.customType({
    phase_id: a.integer().required(),
    status: a.ref("PhaseAttendanceStatus").required(),
    special_requests: a.string().array().required(),
    transportation_needs: a.json(),
  }),

  WeddingPhase: a.customType({
    id: a.integer().required(),
    name: a.string().required(),
    date: a.datetime().required(),
    status: a.string().required(),
    progress: a.integer().required(),
    venue: a.json().required(),
    guest_count: a.integer().required(),
  }),

  ContingencyAction: a.customType({
    id: a.integer().required(),
    description: a.string().required(),
    responsible: a.string().required(),
    estimated_duration: a.integer().required(),
    cost: a.float().required(),
    status: a.ref("ActionStatus").required(),
  }),

  Wedding: a
    .model({
      user_id: a.integer().required(),
      couple_names: a.string().array().required(),
      wedding_type: a.ref("WeddingType").required(),
      status: a.ref("WeddingStatus").required(),
      phases: a.ref("WeddingPhase").array().required(),
      overall_budget: a.json().required(),
      cultural_traditions: a.string().array().required(),
      days_until_wedding: a.integer().required(),
      overall_progress: a.integer().required(),
      budget_categories: a.hasMany("BudgetCategory", "wedding_id"),
      transactions: a.hasMany("Transaction", "wedding_id"),
      budget_phases: a.hasMany("BudgetPhase", "wedding_id"),
      overall_budgets: a.hasMany("OverallBudget", "wedding_id"),
      guests: a.hasMany("Guest", "wedding_id"),
      mood_boards: a.hasMany("MoodBoard", "wedding_id"),
      milestones: a.hasMany("Milestone", "wedding_id"),
      project_deadlines: a.hasMany("ProjectDeadline", "wedding_id"),
      contingency_plans: a.hasMany("ContingencyPlan", "wedding_id"),
      vendors: a.hasMany("Vendor", "wedding_id"),
      activities: a.hasMany("Activity", "wedding_id"),
      tasks: a.hasMany("Task", "wedding_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

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
      vendors: a.string().array(),
      phase_id: a.string(),
      transactions: a.hasMany("Transaction", "category_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Transaction: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      category_id: a.id().required(),
      category: a.belongsTo("BudgetCategory", "category_id"),
      date: a.datetime().required(),
      description: a.string().required(),
      amount: a.float().required(),
      type: a.ref("TransactionType").required(),
      vendor: a.string(),
      phase_id: a.string(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  BudgetPhase: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      name: a.string().required(),
      allocated: a.float().required(),
      spent: a.float().required(),
      remaining: a.float().required(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  OverallBudget: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      total: a.float().required(),
      allocated: a.float().required(),
      spent: a.float().required(),
      remaining: a.float().required(),
      currency: a.string().required(),
      updated_at: a.datetime().required(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  PlusOne: a
    .model({
      name: a.string().required(),
      email: a.string(),
      rsvp_status: a.ref("RSVPStatus").required(),
      dietary_restrictions: a.string().array(),
      accommodation_needs: a.string().array(),
      phase_attendance: a.ref("PhaseAttendance").array(),
      guests: a.hasMany("Guest", "plus_one_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Guest: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string().required(),
      rsvp_status: a.ref("RSVPStatus").required(),
      dietary_restrictions: a.string().array(),
      accommodation_needs: a.string().array(),
      plus_one_id: a.id(),
      plus_one: a.belongsTo("PlusOne", "plus_one_id"),
      table_assignment: a.string(),
      phase_attendance: a.ref("PhaseAttendance").array(),
      relationship: a.string().required(),
      side: a.ref("Side").required(),
      invite_group: a.string(),
      rsvp_date: a.datetime(),
      notes: a.string(),
      communications: a.hasMany("Communication", "guest_id"),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Communication: a
    .model({
      guest_id: a.id().required(),
      guest: a.belongsTo("Guest", "guest_id"),
      timestamp: a.datetime().required(),
      type: a.string().required(),
      direction: a.string().required(),
      subject: a.string(),
      content: a.string().required(),
      status: a.string().required(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  MoodBoard: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      phase_id: a.string(),
      name: a.string().required(),
      description: a.string(),
      images: a.ref("MediaAsset").array(),
      videos: a.ref("MediaAsset").array(),
      links: a.ref("InspirationLink").array(),
      color_palette: a.ref("ColorPalette").required(),
      style_keywords: a.string().array(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Milestone: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      name: a.string().required(),
      date: a.datetime().required(),
      description: a.string().required(),
      responsible: a.string().array().required(),
      status: a.ref("MilestoneStatus").required(),
      dependencies: a.string().array(),
      phase_id: a.string(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  ProjectDeadline: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      title: a.string().required(),
      description: a.string().required(),
      due_date: a.datetime().required(),
      priority: a.ref("Priority").required(),
      status: a.ref("DeadlineStatus").required(),
      assigned_to: a.string().array().required(),
      phase_id: a.string(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  ContingencyPlan: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      trigger_condition: a.string().required(),
      description: a.string().required(),
      actions: a.ref("ContingencyAction").array().required(),
      priority: a.ref("Priority").required(),
      status: a.ref("ContingencyStatus").required(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Vendor: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      name: a.string().required(),
      category: a.ref("VendorCategory").required(),
      contact_info: a.ref("ContactInfo").required(),
      status: a.ref("VendorStatus").required(),
      services: a.ref("Service").array(),
      contract: a.ref("Contract"),
      deadlines: a.ref("Deadline").array(),
      budget: a.ref("Budget").required(),
      phases: a.string().array(),
      last_contact: a.datetime(),
      communications: a.hasMany("VendorCommunication", "vendor_id"),
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
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Activity: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      type: a.string().required(),
      message: a.string().required(),
      time: a.datetime().required(),
      status: a.string().required(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

  Task: a
    .model({
      wedding_id: a.id().required(),
      wedding: a.belongsTo("Wedding", "wedding_id"),
      title: a.string().required(),
      due_date: a.datetime().required(),
      priority: a.string().required(),
      status: a.string().required(),
      assigned_to: a.string().array().required(),
      phase_id: a.string(),
    })
    .authorization((allow: any) => [allow.publicApiKey()]),

    chat: a.query()
    .arguments({ prompt: a.string().required() })
    .returns(a.string())
    .authorization((allow: any) => [allow.publicApiKey()])
    .handler(a.handler.function(orchestratorFunction)),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

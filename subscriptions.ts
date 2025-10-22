/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateActivity = /* GraphQL */ `subscription OnCreateActivity($filter: ModelSubscriptionActivityFilterInput) {
  onCreateActivity(filter: $filter) {
    createdAt
    description
    id
    is_milestone
    is_public
    metadata
    performed_by
    phase_id
    priority
    related_entity_id
    related_entity_type
    timestamp
    title
    type
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateActivitySubscriptionVariables,
  APITypes.OnCreateActivitySubscription
>;
export const onCreateBudgetCategory = /* GraphQL */ `subscription OnCreateBudgetCategory(
  $filter: ModelSubscriptionBudgetCategoryFilterInput
) {
  onCreateBudgetCategory(filter: $filter) {
    allocated
    createdAt
    id
    name
    notes
    percentage
    phase_ids
    priority
    remaining
    spent
    status
    transactions {
      nextToken
      __typename
    }
    updatedAt
    vendor_ids
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateBudgetCategorySubscriptionVariables,
  APITypes.OnCreateBudgetCategorySubscription
>;
export const onCreateCommunication = /* GraphQL */ `subscription OnCreateCommunication(
  $filter: ModelSubscriptionCommunicationFilterInput
) {
  onCreateCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    guest {
      accessibility_needs
      accommodation_needs
      address
      createdAt
      dietary_restrictions
      email
      gift_received
      id
      invite_group
      name
      notes
      phone
      plus_one_id
      relationship
      rsvp_date
      rsvp_status
      side
      table_assignment
      thank_you_sent
      updatedAt
      wedding_id
      __typename
    }
    guest_id
    id
    status
    subject
    timestamp
    type
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCommunicationSubscriptionVariables,
  APITypes.OnCreateCommunicationSubscription
>;
export const onCreateGuest = /* GraphQL */ `subscription OnCreateGuest($filter: ModelSubscriptionGuestFilterInput) {
  onCreateGuest(filter: $filter) {
    accessibility_needs
    accommodation_needs
    address
    communications {
      nextToken
      __typename
    }
    createdAt
    dietary_restrictions
    email
    gift_received
    id
    invite_group
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    plus_one {
      accessibility_needs
      accommodation_needs
      createdAt
      dietary_restrictions
      email
      id
      name
      notes
      phone
      rsvp_status
      updatedAt
      __typename
    }
    plus_one_id
    relationship
    rsvp_date
    rsvp_status
    side
    table_assignment
    thank_you_sent
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateGuestSubscriptionVariables,
  APITypes.OnCreateGuestSubscription
>;
export const onCreateMilestone = /* GraphQL */ `subscription OnCreateMilestone($filter: ModelSubscriptionMilestoneFilterInput) {
  onCreateMilestone(filter: $filter) {
    completed_date
    createdAt
    created_at
    deliverables
    dependencies
    description
    id
    name
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    progress_percentage
    responsible_parties
    status
    success_criteria
    target_date
    updatedAt
    updated_at
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMilestoneSubscriptionVariables,
  APITypes.OnCreateMilestoneSubscription
>;
export const onCreateMoodBoard = /* GraphQL */ `subscription OnCreateMoodBoard($filter: ModelSubscriptionMoodBoardFilterInput) {
  onCreateMoodBoard(filter: $filter) {
    color_palette {
      accent
      neutral
      primary
      secondary
      __typename
    }
    createdAt
    created_at
    description
    id
    images {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    inspiration_links {
      added_at
      description
      id
      mood_board_id
      phase_id
      source
      tags
      title
      url
      __typename
    }
    is_finalized
    is_public
    name
    phase_id
    style_keywords
    themes
    updatedAt
    updated_at
    vendor_shared_with
    videos {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMoodBoardSubscriptionVariables,
  APITypes.OnCreateMoodBoardSubscription
>;
export const onCreatePlusOne = /* GraphQL */ `subscription OnCreatePlusOne($filter: ModelSubscriptionPlusOneFilterInput) {
  onCreatePlusOne(filter: $filter) {
    accessibility_needs
    accommodation_needs
    createdAt
    dietary_restrictions
    email
    guests {
      nextToken
      __typename
    }
    id
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    rsvp_status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePlusOneSubscriptionVariables,
  APITypes.OnCreatePlusOneSubscription
>;
export const onCreateTask = /* GraphQL */ `subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
  onCreateTask(filter: $filter) {
    actual_hours
    assigned_to
    attachments
    category
    completed_date
    createdAt
    created_at
    dependencies
    description
    due_date
    estimated_hours
    id
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    status
    subtasks {
      completed
      id
      title
      __typename
    }
    title
    updatedAt
    updated_at
    vendor_id
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTaskSubscriptionVariables,
  APITypes.OnCreateTaskSubscription
>;
export const onCreateTransaction = /* GraphQL */ `subscription OnCreateTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onCreateTransaction(filter: $filter) {
    amount
    category {
      allocated
      createdAt
      id
      name
      notes
      percentage
      phase_ids
      priority
      remaining
      spent
      status
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    category_id
    createdAt
    date
    description
    id
    notes
    payment_method
    phase_id
    receipt_url
    status
    type
    updatedAt
    vendor_id
    vendor_name
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTransactionSubscriptionVariables,
  APITypes.OnCreateTransactionSubscription
>;
export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onCreateUserProfile(filter: $filter) {
    avatar_url
    createdAt
    created_at
    email
    first_name
    id
    last_name
    phone
    timezone
    updatedAt
    updated_at
    user_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onCreateVendor = /* GraphQL */ `subscription OnCreateVendor($filter: ModelSubscriptionVendorFilterInput) {
  onCreateVendor(filter: $filter) {
    category {
      primary
      secondary
      __typename
    }
    communications {
      nextToken
      __typename
    }
    contact_info {
      address
      email
      phone
      preferred_contact_method
      website
      __typename
    }
    contract_date
    contract_signed
    createdAt
    deliverables
    deposit_paid
    final_payment_due
    id
    internal_notes
    last_contact
    name
    next_followup
    phase_ids
    rating
    requirements
    reviews
    services {
      currency
      description
      id
      name
      price
      __typename
    }
    status
    timeline
    total_cost
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateVendorSubscriptionVariables,
  APITypes.OnCreateVendorSubscription
>;
export const onCreateVendorCommunication = /* GraphQL */ `subscription OnCreateVendorCommunication(
  $filter: ModelSubscriptionVendorCommunicationFilterInput
) {
  onCreateVendorCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    id
    status
    subject
    timestamp
    type
    updatedAt
    vendor {
      contract_date
      contract_signed
      createdAt
      deliverables
      deposit_paid
      final_payment_due
      id
      internal_notes
      last_contact
      name
      next_followup
      phase_ids
      rating
      requirements
      reviews
      status
      timeline
      total_cost
      updatedAt
      wedding_id
      __typename
    }
    vendor_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateVendorCommunicationSubscriptionVariables,
  APITypes.OnCreateVendorCommunicationSubscription
>;
export const onCreateWedding = /* GraphQL */ `subscription OnCreateWedding($filter: ModelSubscriptionWeddingFilterInput) {
  onCreateWedding(filter: $filter) {
    activities {
      nextToken
      __typename
    }
    budget_categories {
      nextToken
      __typename
    }
    couple_names
    createdAt
    days_until_wedding
    emergency_contacts
    guests {
      nextToken
      __typename
    }
    hashtag
    id
    milestones {
      nextToken
      __typename
    }
    mood_boards {
      nextToken
      __typename
    }
    notes
    overall_budget {
      allocated
      contingency_percentage
      currency
      remaining
      spent
      total
      __typename
    }
    overall_progress
    phases {
      nextToken
      __typename
    }
    planning_start_date
    preferences {
      bar_preferences
      color_themes
      cultural_traditions
      dietary_considerations
      entertainment_types
      food_preferences
      inspiration_sources
      music_genres
      must_have_shots
      overall_themes
      photography_styles
      preferred_communication_methods
      religious_requirements
      style_keywords
      wedding_styles
      __typename
    }
    registry_links
    settings {
      last_updated
      __typename
    }
    status
    tasks {
      nextToken
      __typename
    }
    transactions {
      nextToken
      __typename
    }
    updatedAt
    user_id
    vendors {
      nextToken
      __typename
    }
    wedding_date
    wedding_type
    wedding_website
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateWeddingSubscriptionVariables,
  APITypes.OnCreateWeddingSubscription
>;
export const onCreateWeddingPhase = /* GraphQL */ `subscription OnCreateWeddingPhase(
  $filter: ModelSubscriptionWeddingPhaseFilterInput
) {
  onCreateWeddingPhase(filter: $filter) {
    budget {
      allocated
      categories
      currency
      remaining
      spent
      __typename
    }
    createdAt
    date
    guest_ids
    id
    milestone_ids
    milestones {
      nextToken
      __typename
    }
    mood_board_ids
    name
    notes
    progress
    requirements {
      accessibility_needs
      additional_notes
      cultural_requirements
      dietary_restrictions
      duration_hours
      entertainment_type
      guest_count
      photography_style
      special_needs
      __typename
    }
    status
    task_ids
    tasks {
      nextToken
      __typename
    }
    timeline {
      deadlines
      milestones
      __typename
    }
    updatedAt
    vendor_ids
    venue {
      address
      amenities
      capacity
      contact_info
      id
      name
      notes
      restrictions
      type
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateWeddingPhaseSubscriptionVariables,
  APITypes.OnCreateWeddingPhaseSubscription
>;
export const onDeleteActivity = /* GraphQL */ `subscription OnDeleteActivity($filter: ModelSubscriptionActivityFilterInput) {
  onDeleteActivity(filter: $filter) {
    createdAt
    description
    id
    is_milestone
    is_public
    metadata
    performed_by
    phase_id
    priority
    related_entity_id
    related_entity_type
    timestamp
    title
    type
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteActivitySubscriptionVariables,
  APITypes.OnDeleteActivitySubscription
>;
export const onDeleteBudgetCategory = /* GraphQL */ `subscription OnDeleteBudgetCategory(
  $filter: ModelSubscriptionBudgetCategoryFilterInput
) {
  onDeleteBudgetCategory(filter: $filter) {
    allocated
    createdAt
    id
    name
    notes
    percentage
    phase_ids
    priority
    remaining
    spent
    status
    transactions {
      nextToken
      __typename
    }
    updatedAt
    vendor_ids
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteBudgetCategorySubscriptionVariables,
  APITypes.OnDeleteBudgetCategorySubscription
>;
export const onDeleteCommunication = /* GraphQL */ `subscription OnDeleteCommunication(
  $filter: ModelSubscriptionCommunicationFilterInput
) {
  onDeleteCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    guest {
      accessibility_needs
      accommodation_needs
      address
      createdAt
      dietary_restrictions
      email
      gift_received
      id
      invite_group
      name
      notes
      phone
      plus_one_id
      relationship
      rsvp_date
      rsvp_status
      side
      table_assignment
      thank_you_sent
      updatedAt
      wedding_id
      __typename
    }
    guest_id
    id
    status
    subject
    timestamp
    type
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCommunicationSubscriptionVariables,
  APITypes.OnDeleteCommunicationSubscription
>;
export const onDeleteGuest = /* GraphQL */ `subscription OnDeleteGuest($filter: ModelSubscriptionGuestFilterInput) {
  onDeleteGuest(filter: $filter) {
    accessibility_needs
    accommodation_needs
    address
    communications {
      nextToken
      __typename
    }
    createdAt
    dietary_restrictions
    email
    gift_received
    id
    invite_group
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    plus_one {
      accessibility_needs
      accommodation_needs
      createdAt
      dietary_restrictions
      email
      id
      name
      notes
      phone
      rsvp_status
      updatedAt
      __typename
    }
    plus_one_id
    relationship
    rsvp_date
    rsvp_status
    side
    table_assignment
    thank_you_sent
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteGuestSubscriptionVariables,
  APITypes.OnDeleteGuestSubscription
>;
export const onDeleteMilestone = /* GraphQL */ `subscription OnDeleteMilestone($filter: ModelSubscriptionMilestoneFilterInput) {
  onDeleteMilestone(filter: $filter) {
    completed_date
    createdAt
    created_at
    deliverables
    dependencies
    description
    id
    name
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    progress_percentage
    responsible_parties
    status
    success_criteria
    target_date
    updatedAt
    updated_at
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMilestoneSubscriptionVariables,
  APITypes.OnDeleteMilestoneSubscription
>;
export const onDeleteMoodBoard = /* GraphQL */ `subscription OnDeleteMoodBoard($filter: ModelSubscriptionMoodBoardFilterInput) {
  onDeleteMoodBoard(filter: $filter) {
    color_palette {
      accent
      neutral
      primary
      secondary
      __typename
    }
    createdAt
    created_at
    description
    id
    images {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    inspiration_links {
      added_at
      description
      id
      mood_board_id
      phase_id
      source
      tags
      title
      url
      __typename
    }
    is_finalized
    is_public
    name
    phase_id
    style_keywords
    themes
    updatedAt
    updated_at
    vendor_shared_with
    videos {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMoodBoardSubscriptionVariables,
  APITypes.OnDeleteMoodBoardSubscription
>;
export const onDeletePlusOne = /* GraphQL */ `subscription OnDeletePlusOne($filter: ModelSubscriptionPlusOneFilterInput) {
  onDeletePlusOne(filter: $filter) {
    accessibility_needs
    accommodation_needs
    createdAt
    dietary_restrictions
    email
    guests {
      nextToken
      __typename
    }
    id
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    rsvp_status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePlusOneSubscriptionVariables,
  APITypes.OnDeletePlusOneSubscription
>;
export const onDeleteTask = /* GraphQL */ `subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
  onDeleteTask(filter: $filter) {
    actual_hours
    assigned_to
    attachments
    category
    completed_date
    createdAt
    created_at
    dependencies
    description
    due_date
    estimated_hours
    id
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    status
    subtasks {
      completed
      id
      title
      __typename
    }
    title
    updatedAt
    updated_at
    vendor_id
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTaskSubscriptionVariables,
  APITypes.OnDeleteTaskSubscription
>;
export const onDeleteTransaction = /* GraphQL */ `subscription OnDeleteTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onDeleteTransaction(filter: $filter) {
    amount
    category {
      allocated
      createdAt
      id
      name
      notes
      percentage
      phase_ids
      priority
      remaining
      spent
      status
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    category_id
    createdAt
    date
    description
    id
    notes
    payment_method
    phase_id
    receipt_url
    status
    type
    updatedAt
    vendor_id
    vendor_name
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTransactionSubscriptionVariables,
  APITypes.OnDeleteTransactionSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onDeleteUserProfile(filter: $filter) {
    avatar_url
    createdAt
    created_at
    email
    first_name
    id
    last_name
    phone
    timezone
    updatedAt
    updated_at
    user_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onDeleteVendor = /* GraphQL */ `subscription OnDeleteVendor($filter: ModelSubscriptionVendorFilterInput) {
  onDeleteVendor(filter: $filter) {
    category {
      primary
      secondary
      __typename
    }
    communications {
      nextToken
      __typename
    }
    contact_info {
      address
      email
      phone
      preferred_contact_method
      website
      __typename
    }
    contract_date
    contract_signed
    createdAt
    deliverables
    deposit_paid
    final_payment_due
    id
    internal_notes
    last_contact
    name
    next_followup
    phase_ids
    rating
    requirements
    reviews
    services {
      currency
      description
      id
      name
      price
      __typename
    }
    status
    timeline
    total_cost
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteVendorSubscriptionVariables,
  APITypes.OnDeleteVendorSubscription
>;
export const onDeleteVendorCommunication = /* GraphQL */ `subscription OnDeleteVendorCommunication(
  $filter: ModelSubscriptionVendorCommunicationFilterInput
) {
  onDeleteVendorCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    id
    status
    subject
    timestamp
    type
    updatedAt
    vendor {
      contract_date
      contract_signed
      createdAt
      deliverables
      deposit_paid
      final_payment_due
      id
      internal_notes
      last_contact
      name
      next_followup
      phase_ids
      rating
      requirements
      reviews
      status
      timeline
      total_cost
      updatedAt
      wedding_id
      __typename
    }
    vendor_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteVendorCommunicationSubscriptionVariables,
  APITypes.OnDeleteVendorCommunicationSubscription
>;
export const onDeleteWedding = /* GraphQL */ `subscription OnDeleteWedding($filter: ModelSubscriptionWeddingFilterInput) {
  onDeleteWedding(filter: $filter) {
    activities {
      nextToken
      __typename
    }
    budget_categories {
      nextToken
      __typename
    }
    couple_names
    createdAt
    days_until_wedding
    emergency_contacts
    guests {
      nextToken
      __typename
    }
    hashtag
    id
    milestones {
      nextToken
      __typename
    }
    mood_boards {
      nextToken
      __typename
    }
    notes
    overall_budget {
      allocated
      contingency_percentage
      currency
      remaining
      spent
      total
      __typename
    }
    overall_progress
    phases {
      nextToken
      __typename
    }
    planning_start_date
    preferences {
      bar_preferences
      color_themes
      cultural_traditions
      dietary_considerations
      entertainment_types
      food_preferences
      inspiration_sources
      music_genres
      must_have_shots
      overall_themes
      photography_styles
      preferred_communication_methods
      religious_requirements
      style_keywords
      wedding_styles
      __typename
    }
    registry_links
    settings {
      last_updated
      __typename
    }
    status
    tasks {
      nextToken
      __typename
    }
    transactions {
      nextToken
      __typename
    }
    updatedAt
    user_id
    vendors {
      nextToken
      __typename
    }
    wedding_date
    wedding_type
    wedding_website
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteWeddingSubscriptionVariables,
  APITypes.OnDeleteWeddingSubscription
>;
export const onDeleteWeddingPhase = /* GraphQL */ `subscription OnDeleteWeddingPhase(
  $filter: ModelSubscriptionWeddingPhaseFilterInput
) {
  onDeleteWeddingPhase(filter: $filter) {
    budget {
      allocated
      categories
      currency
      remaining
      spent
      __typename
    }
    createdAt
    date
    guest_ids
    id
    milestone_ids
    milestones {
      nextToken
      __typename
    }
    mood_board_ids
    name
    notes
    progress
    requirements {
      accessibility_needs
      additional_notes
      cultural_requirements
      dietary_restrictions
      duration_hours
      entertainment_type
      guest_count
      photography_style
      special_needs
      __typename
    }
    status
    task_ids
    tasks {
      nextToken
      __typename
    }
    timeline {
      deadlines
      milestones
      __typename
    }
    updatedAt
    vendor_ids
    venue {
      address
      amenities
      capacity
      contact_info
      id
      name
      notes
      restrictions
      type
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteWeddingPhaseSubscriptionVariables,
  APITypes.OnDeleteWeddingPhaseSubscription
>;
export const onUpdateActivity = /* GraphQL */ `subscription OnUpdateActivity($filter: ModelSubscriptionActivityFilterInput) {
  onUpdateActivity(filter: $filter) {
    createdAt
    description
    id
    is_milestone
    is_public
    metadata
    performed_by
    phase_id
    priority
    related_entity_id
    related_entity_type
    timestamp
    title
    type
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateActivitySubscriptionVariables,
  APITypes.OnUpdateActivitySubscription
>;
export const onUpdateBudgetCategory = /* GraphQL */ `subscription OnUpdateBudgetCategory(
  $filter: ModelSubscriptionBudgetCategoryFilterInput
) {
  onUpdateBudgetCategory(filter: $filter) {
    allocated
    createdAt
    id
    name
    notes
    percentage
    phase_ids
    priority
    remaining
    spent
    status
    transactions {
      nextToken
      __typename
    }
    updatedAt
    vendor_ids
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateBudgetCategorySubscriptionVariables,
  APITypes.OnUpdateBudgetCategorySubscription
>;
export const onUpdateCommunication = /* GraphQL */ `subscription OnUpdateCommunication(
  $filter: ModelSubscriptionCommunicationFilterInput
) {
  onUpdateCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    guest {
      accessibility_needs
      accommodation_needs
      address
      createdAt
      dietary_restrictions
      email
      gift_received
      id
      invite_group
      name
      notes
      phone
      plus_one_id
      relationship
      rsvp_date
      rsvp_status
      side
      table_assignment
      thank_you_sent
      updatedAt
      wedding_id
      __typename
    }
    guest_id
    id
    status
    subject
    timestamp
    type
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCommunicationSubscriptionVariables,
  APITypes.OnUpdateCommunicationSubscription
>;
export const onUpdateGuest = /* GraphQL */ `subscription OnUpdateGuest($filter: ModelSubscriptionGuestFilterInput) {
  onUpdateGuest(filter: $filter) {
    accessibility_needs
    accommodation_needs
    address
    communications {
      nextToken
      __typename
    }
    createdAt
    dietary_restrictions
    email
    gift_received
    id
    invite_group
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    plus_one {
      accessibility_needs
      accommodation_needs
      createdAt
      dietary_restrictions
      email
      id
      name
      notes
      phone
      rsvp_status
      updatedAt
      __typename
    }
    plus_one_id
    relationship
    rsvp_date
    rsvp_status
    side
    table_assignment
    thank_you_sent
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateGuestSubscriptionVariables,
  APITypes.OnUpdateGuestSubscription
>;
export const onUpdateMilestone = /* GraphQL */ `subscription OnUpdateMilestone($filter: ModelSubscriptionMilestoneFilterInput) {
  onUpdateMilestone(filter: $filter) {
    completed_date
    createdAt
    created_at
    deliverables
    dependencies
    description
    id
    name
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    progress_percentage
    responsible_parties
    status
    success_criteria
    target_date
    updatedAt
    updated_at
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMilestoneSubscriptionVariables,
  APITypes.OnUpdateMilestoneSubscription
>;
export const onUpdateMoodBoard = /* GraphQL */ `subscription OnUpdateMoodBoard($filter: ModelSubscriptionMoodBoardFilterInput) {
  onUpdateMoodBoard(filter: $filter) {
    color_palette {
      accent
      neutral
      primary
      secondary
      __typename
    }
    createdAt
    created_at
    description
    id
    images {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    inspiration_links {
      added_at
      description
      id
      mood_board_id
      phase_id
      source
      tags
      title
      url
      __typename
    }
    is_finalized
    is_public
    name
    phase_id
    style_keywords
    themes
    updatedAt
    updated_at
    vendor_shared_with
    videos {
      filename
      id
      metadata
      mood_board_id
      phase_id
      s3_key
      tags
      type
      uploaded_at
      url
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMoodBoardSubscriptionVariables,
  APITypes.OnUpdateMoodBoardSubscription
>;
export const onUpdatePlusOne = /* GraphQL */ `subscription OnUpdatePlusOne($filter: ModelSubscriptionPlusOneFilterInput) {
  onUpdatePlusOne(filter: $filter) {
    accessibility_needs
    accommodation_needs
    createdAt
    dietary_restrictions
    email
    guests {
      nextToken
      __typename
    }
    id
    name
    notes
    phase_attendance {
      accessibility_needs
      meal_preference
      phase_id
      plus_one_attending
      special_requests
      status
      transportation_needs
      __typename
    }
    phone
    rsvp_status
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePlusOneSubscriptionVariables,
  APITypes.OnUpdatePlusOneSubscription
>;
export const onUpdateTask = /* GraphQL */ `subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
  onUpdateTask(filter: $filter) {
    actual_hours
    assigned_to
    attachments
    category
    completed_date
    createdAt
    created_at
    dependencies
    description
    due_date
    estimated_hours
    id
    notes
    phase {
      createdAt
      date
      guest_ids
      id
      milestone_ids
      mood_board_ids
      name
      notes
      progress
      status
      task_ids
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    phase_id
    priority
    status
    subtasks {
      completed
      id
      title
      __typename
    }
    title
    updatedAt
    updated_at
    vendor_id
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTaskSubscriptionVariables,
  APITypes.OnUpdateTaskSubscription
>;
export const onUpdateTransaction = /* GraphQL */ `subscription OnUpdateTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onUpdateTransaction(filter: $filter) {
    amount
    category {
      allocated
      createdAt
      id
      name
      notes
      percentage
      phase_ids
      priority
      remaining
      spent
      status
      updatedAt
      vendor_ids
      wedding_id
      __typename
    }
    category_id
    createdAt
    date
    description
    id
    notes
    payment_method
    phase_id
    receipt_url
    status
    type
    updatedAt
    vendor_id
    vendor_name
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTransactionSubscriptionVariables,
  APITypes.OnUpdateTransactionSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
) {
  onUpdateUserProfile(filter: $filter) {
    avatar_url
    createdAt
    created_at
    email
    first_name
    id
    last_name
    phone
    timezone
    updatedAt
    updated_at
    user_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onUpdateVendor = /* GraphQL */ `subscription OnUpdateVendor($filter: ModelSubscriptionVendorFilterInput) {
  onUpdateVendor(filter: $filter) {
    category {
      primary
      secondary
      __typename
    }
    communications {
      nextToken
      __typename
    }
    contact_info {
      address
      email
      phone
      preferred_contact_method
      website
      __typename
    }
    contract_date
    contract_signed
    createdAt
    deliverables
    deposit_paid
    final_payment_due
    id
    internal_notes
    last_contact
    name
    next_followup
    phase_ids
    rating
    requirements
    reviews
    services {
      currency
      description
      id
      name
      price
      __typename
    }
    status
    timeline
    total_cost
    updatedAt
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateVendorSubscriptionVariables,
  APITypes.OnUpdateVendorSubscription
>;
export const onUpdateVendorCommunication = /* GraphQL */ `subscription OnUpdateVendorCommunication(
  $filter: ModelSubscriptionVendorCommunicationFilterInput
) {
  onUpdateVendorCommunication(filter: $filter) {
    attachments
    content
    createdAt
    direction
    follow_up_date
    follow_up_needed
    id
    status
    subject
    timestamp
    type
    updatedAt
    vendor {
      contract_date
      contract_signed
      createdAt
      deliverables
      deposit_paid
      final_payment_due
      id
      internal_notes
      last_contact
      name
      next_followup
      phase_ids
      rating
      requirements
      reviews
      status
      timeline
      total_cost
      updatedAt
      wedding_id
      __typename
    }
    vendor_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateVendorCommunicationSubscriptionVariables,
  APITypes.OnUpdateVendorCommunicationSubscription
>;
export const onUpdateWedding = /* GraphQL */ `subscription OnUpdateWedding($filter: ModelSubscriptionWeddingFilterInput) {
  onUpdateWedding(filter: $filter) {
    activities {
      nextToken
      __typename
    }
    budget_categories {
      nextToken
      __typename
    }
    couple_names
    createdAt
    days_until_wedding
    emergency_contacts
    guests {
      nextToken
      __typename
    }
    hashtag
    id
    milestones {
      nextToken
      __typename
    }
    mood_boards {
      nextToken
      __typename
    }
    notes
    overall_budget {
      allocated
      contingency_percentage
      currency
      remaining
      spent
      total
      __typename
    }
    overall_progress
    phases {
      nextToken
      __typename
    }
    planning_start_date
    preferences {
      bar_preferences
      color_themes
      cultural_traditions
      dietary_considerations
      entertainment_types
      food_preferences
      inspiration_sources
      music_genres
      must_have_shots
      overall_themes
      photography_styles
      preferred_communication_methods
      religious_requirements
      style_keywords
      wedding_styles
      __typename
    }
    registry_links
    settings {
      last_updated
      __typename
    }
    status
    tasks {
      nextToken
      __typename
    }
    transactions {
      nextToken
      __typename
    }
    updatedAt
    user_id
    vendors {
      nextToken
      __typename
    }
    wedding_date
    wedding_type
    wedding_website
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateWeddingSubscriptionVariables,
  APITypes.OnUpdateWeddingSubscription
>;
export const onUpdateWeddingPhase = /* GraphQL */ `subscription OnUpdateWeddingPhase(
  $filter: ModelSubscriptionWeddingPhaseFilterInput
) {
  onUpdateWeddingPhase(filter: $filter) {
    budget {
      allocated
      categories
      currency
      remaining
      spent
      __typename
    }
    createdAt
    date
    guest_ids
    id
    milestone_ids
    milestones {
      nextToken
      __typename
    }
    mood_board_ids
    name
    notes
    progress
    requirements {
      accessibility_needs
      additional_notes
      cultural_requirements
      dietary_restrictions
      duration_hours
      entertainment_type
      guest_count
      photography_style
      special_needs
      __typename
    }
    status
    task_ids
    tasks {
      nextToken
      __typename
    }
    timeline {
      deadlines
      milestones
      __typename
    }
    updatedAt
    vendor_ids
    venue {
      address
      amenities
      capacity
      contact_info
      id
      name
      notes
      restrictions
      type
      __typename
    }
    wedding {
      couple_names
      createdAt
      days_until_wedding
      emergency_contacts
      hashtag
      id
      notes
      overall_progress
      planning_start_date
      registry_links
      status
      updatedAt
      user_id
      wedding_date
      wedding_type
      wedding_website
      __typename
    }
    wedding_id
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateWeddingPhaseSubscriptionVariables,
  APITypes.OnUpdateWeddingPhaseSubscription
>;

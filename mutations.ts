/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createActivity = /* GraphQL */ `mutation CreateActivity(
  $condition: ModelActivityConditionInput
  $input: CreateActivityInput!
) {
  createActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateActivityMutationVariables,
  APITypes.CreateActivityMutation
>;
export const createBudgetCategory = /* GraphQL */ `mutation CreateBudgetCategory(
  $condition: ModelBudgetCategoryConditionInput
  $input: CreateBudgetCategoryInput!
) {
  createBudgetCategory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBudgetCategoryMutationVariables,
  APITypes.CreateBudgetCategoryMutation
>;
export const createCommunication = /* GraphQL */ `mutation CreateCommunication(
  $condition: ModelCommunicationConditionInput
  $input: CreateCommunicationInput!
) {
  createCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateCommunicationMutationVariables,
  APITypes.CreateCommunicationMutation
>;
export const createGuest = /* GraphQL */ `mutation CreateGuest(
  $condition: ModelGuestConditionInput
  $input: CreateGuestInput!
) {
  createGuest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateGuestMutationVariables,
  APITypes.CreateGuestMutation
>;
export const createMilestone = /* GraphQL */ `mutation CreateMilestone(
  $condition: ModelMilestoneConditionInput
  $input: CreateMilestoneInput!
) {
  createMilestone(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMilestoneMutationVariables,
  APITypes.CreateMilestoneMutation
>;
export const createMoodBoard = /* GraphQL */ `mutation CreateMoodBoard(
  $condition: ModelMoodBoardConditionInput
  $input: CreateMoodBoardInput!
) {
  createMoodBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateMoodBoardMutationVariables,
  APITypes.CreateMoodBoardMutation
>;
export const createPlusOne = /* GraphQL */ `mutation CreatePlusOne(
  $condition: ModelPlusOneConditionInput
  $input: CreatePlusOneInput!
) {
  createPlusOne(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePlusOneMutationVariables,
  APITypes.CreatePlusOneMutation
>;
export const createTask = /* GraphQL */ `mutation CreateTask(
  $condition: ModelTaskConditionInput
  $input: CreateTaskInput!
) {
  createTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTaskMutationVariables,
  APITypes.CreateTaskMutation
>;
export const createTransaction = /* GraphQL */ `mutation CreateTransaction(
  $condition: ModelTransactionConditionInput
  $input: CreateTransactionInput!
) {
  createTransaction(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTransactionMutationVariables,
  APITypes.CreateTransactionMutation
>;
export const createVendor = /* GraphQL */ `mutation CreateVendor(
  $condition: ModelVendorConditionInput
  $input: CreateVendorInput!
) {
  createVendor(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateVendorMutationVariables,
  APITypes.CreateVendorMutation
>;
export const createVendorCommunication = /* GraphQL */ `mutation CreateVendorCommunication(
  $condition: ModelVendorCommunicationConditionInput
  $input: CreateVendorCommunicationInput!
) {
  createVendorCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateVendorCommunicationMutationVariables,
  APITypes.CreateVendorCommunicationMutation
>;
export const createWedding = /* GraphQL */ `mutation CreateWedding(
  $condition: ModelWeddingConditionInput
  $input: CreateWeddingInput!
) {
  createWedding(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateWeddingMutationVariables,
  APITypes.CreateWeddingMutation
>;
export const createWeddingPhase = /* GraphQL */ `mutation CreateWeddingPhase(
  $condition: ModelWeddingPhaseConditionInput
  $input: CreateWeddingPhaseInput!
) {
  createWeddingPhase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateWeddingPhaseMutationVariables,
  APITypes.CreateWeddingPhaseMutation
>;
export const deleteActivity = /* GraphQL */ `mutation DeleteActivity(
  $condition: ModelActivityConditionInput
  $input: DeleteActivityInput!
) {
  deleteActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteActivityMutationVariables,
  APITypes.DeleteActivityMutation
>;
export const deleteBudgetCategory = /* GraphQL */ `mutation DeleteBudgetCategory(
  $condition: ModelBudgetCategoryConditionInput
  $input: DeleteBudgetCategoryInput!
) {
  deleteBudgetCategory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBudgetCategoryMutationVariables,
  APITypes.DeleteBudgetCategoryMutation
>;
export const deleteCommunication = /* GraphQL */ `mutation DeleteCommunication(
  $condition: ModelCommunicationConditionInput
  $input: DeleteCommunicationInput!
) {
  deleteCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteCommunicationMutationVariables,
  APITypes.DeleteCommunicationMutation
>;
export const deleteGuest = /* GraphQL */ `mutation DeleteGuest(
  $condition: ModelGuestConditionInput
  $input: DeleteGuestInput!
) {
  deleteGuest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteGuestMutationVariables,
  APITypes.DeleteGuestMutation
>;
export const deleteMilestone = /* GraphQL */ `mutation DeleteMilestone(
  $condition: ModelMilestoneConditionInput
  $input: DeleteMilestoneInput!
) {
  deleteMilestone(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMilestoneMutationVariables,
  APITypes.DeleteMilestoneMutation
>;
export const deleteMoodBoard = /* GraphQL */ `mutation DeleteMoodBoard(
  $condition: ModelMoodBoardConditionInput
  $input: DeleteMoodBoardInput!
) {
  deleteMoodBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteMoodBoardMutationVariables,
  APITypes.DeleteMoodBoardMutation
>;
export const deletePlusOne = /* GraphQL */ `mutation DeletePlusOne(
  $condition: ModelPlusOneConditionInput
  $input: DeletePlusOneInput!
) {
  deletePlusOne(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePlusOneMutationVariables,
  APITypes.DeletePlusOneMutation
>;
export const deleteTask = /* GraphQL */ `mutation DeleteTask(
  $condition: ModelTaskConditionInput
  $input: DeleteTaskInput!
) {
  deleteTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTaskMutationVariables,
  APITypes.DeleteTaskMutation
>;
export const deleteTransaction = /* GraphQL */ `mutation DeleteTransaction(
  $condition: ModelTransactionConditionInput
  $input: DeleteTransactionInput!
) {
  deleteTransaction(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTransactionMutationVariables,
  APITypes.DeleteTransactionMutation
>;
export const deleteVendor = /* GraphQL */ `mutation DeleteVendor(
  $condition: ModelVendorConditionInput
  $input: DeleteVendorInput!
) {
  deleteVendor(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteVendorMutationVariables,
  APITypes.DeleteVendorMutation
>;
export const deleteVendorCommunication = /* GraphQL */ `mutation DeleteVendorCommunication(
  $condition: ModelVendorCommunicationConditionInput
  $input: DeleteVendorCommunicationInput!
) {
  deleteVendorCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteVendorCommunicationMutationVariables,
  APITypes.DeleteVendorCommunicationMutation
>;
export const deleteWedding = /* GraphQL */ `mutation DeleteWedding(
  $condition: ModelWeddingConditionInput
  $input: DeleteWeddingInput!
) {
  deleteWedding(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteWeddingMutationVariables,
  APITypes.DeleteWeddingMutation
>;
export const deleteWeddingPhase = /* GraphQL */ `mutation DeleteWeddingPhase(
  $condition: ModelWeddingPhaseConditionInput
  $input: DeleteWeddingPhaseInput!
) {
  deleteWeddingPhase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteWeddingPhaseMutationVariables,
  APITypes.DeleteWeddingPhaseMutation
>;
export const updateActivity = /* GraphQL */ `mutation UpdateActivity(
  $condition: ModelActivityConditionInput
  $input: UpdateActivityInput!
) {
  updateActivity(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateActivityMutationVariables,
  APITypes.UpdateActivityMutation
>;
export const updateBudgetCategory = /* GraphQL */ `mutation UpdateBudgetCategory(
  $condition: ModelBudgetCategoryConditionInput
  $input: UpdateBudgetCategoryInput!
) {
  updateBudgetCategory(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBudgetCategoryMutationVariables,
  APITypes.UpdateBudgetCategoryMutation
>;
export const updateCommunication = /* GraphQL */ `mutation UpdateCommunication(
  $condition: ModelCommunicationConditionInput
  $input: UpdateCommunicationInput!
) {
  updateCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateCommunicationMutationVariables,
  APITypes.UpdateCommunicationMutation
>;
export const updateGuest = /* GraphQL */ `mutation UpdateGuest(
  $condition: ModelGuestConditionInput
  $input: UpdateGuestInput!
) {
  updateGuest(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateGuestMutationVariables,
  APITypes.UpdateGuestMutation
>;
export const updateMilestone = /* GraphQL */ `mutation UpdateMilestone(
  $condition: ModelMilestoneConditionInput
  $input: UpdateMilestoneInput!
) {
  updateMilestone(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMilestoneMutationVariables,
  APITypes.UpdateMilestoneMutation
>;
export const updateMoodBoard = /* GraphQL */ `mutation UpdateMoodBoard(
  $condition: ModelMoodBoardConditionInput
  $input: UpdateMoodBoardInput!
) {
  updateMoodBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateMoodBoardMutationVariables,
  APITypes.UpdateMoodBoardMutation
>;
export const updatePlusOne = /* GraphQL */ `mutation UpdatePlusOne(
  $condition: ModelPlusOneConditionInput
  $input: UpdatePlusOneInput!
) {
  updatePlusOne(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePlusOneMutationVariables,
  APITypes.UpdatePlusOneMutation
>;
export const updateTask = /* GraphQL */ `mutation UpdateTask(
  $condition: ModelTaskConditionInput
  $input: UpdateTaskInput!
) {
  updateTask(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTaskMutationVariables,
  APITypes.UpdateTaskMutation
>;
export const updateTransaction = /* GraphQL */ `mutation UpdateTransaction(
  $condition: ModelTransactionConditionInput
  $input: UpdateTransactionInput!
) {
  updateTransaction(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTransactionMutationVariables,
  APITypes.UpdateTransactionMutation
>;
export const updateVendor = /* GraphQL */ `mutation UpdateVendor(
  $condition: ModelVendorConditionInput
  $input: UpdateVendorInput!
) {
  updateVendor(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateVendorMutationVariables,
  APITypes.UpdateVendorMutation
>;
export const updateVendorCommunication = /* GraphQL */ `mutation UpdateVendorCommunication(
  $condition: ModelVendorCommunicationConditionInput
  $input: UpdateVendorCommunicationInput!
) {
  updateVendorCommunication(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateVendorCommunicationMutationVariables,
  APITypes.UpdateVendorCommunicationMutation
>;
export const updateWedding = /* GraphQL */ `mutation UpdateWedding(
  $condition: ModelWeddingConditionInput
  $input: UpdateWeddingInput!
) {
  updateWedding(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateWeddingMutationVariables,
  APITypes.UpdateWeddingMutation
>;
export const updateWeddingPhase = /* GraphQL */ `mutation UpdateWeddingPhase(
  $condition: ModelWeddingPhaseConditionInput
  $input: UpdateWeddingPhaseInput!
) {
  updateWeddingPhase(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateWeddingPhaseMutationVariables,
  APITypes.UpdateWeddingPhaseMutation
>;

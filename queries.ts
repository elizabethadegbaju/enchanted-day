/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getActivity = /* GraphQL */ `query GetActivity($id: ID!) {
  getActivity(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetActivityQueryVariables,
  APITypes.GetActivityQuery
>;
export const getBudgetCategory = /* GraphQL */ `query GetBudgetCategory($id: ID!) {
  getBudgetCategory(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBudgetCategoryQueryVariables,
  APITypes.GetBudgetCategoryQuery
>;
export const getCommunication = /* GraphQL */ `query GetCommunication($id: ID!) {
  getCommunication(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCommunicationQueryVariables,
  APITypes.GetCommunicationQuery
>;
export const getGuest = /* GraphQL */ `query GetGuest($id: ID!) {
  getGuest(id: $id) {
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
` as GeneratedQuery<APITypes.GetGuestQueryVariables, APITypes.GetGuestQuery>;
export const getMilestone = /* GraphQL */ `query GetMilestone($id: ID!) {
  getMilestone(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMilestoneQueryVariables,
  APITypes.GetMilestoneQuery
>;
export const getMoodBoard = /* GraphQL */ `query GetMoodBoard($id: ID!) {
  getMoodBoard(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMoodBoardQueryVariables,
  APITypes.GetMoodBoardQuery
>;
export const getPlusOne = /* GraphQL */ `query GetPlusOne($id: ID!) {
  getPlusOne(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPlusOneQueryVariables,
  APITypes.GetPlusOneQuery
>;
export const getTask = /* GraphQL */ `query GetTask($id: ID!) {
  getTask(id: $id) {
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
` as GeneratedQuery<APITypes.GetTaskQueryVariables, APITypes.GetTaskQuery>;
export const getTransaction = /* GraphQL */ `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTransactionQueryVariables,
  APITypes.GetTransactionQuery
>;
export const getVendor = /* GraphQL */ `query GetVendor($id: ID!) {
  getVendor(id: $id) {
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
` as GeneratedQuery<APITypes.GetVendorQueryVariables, APITypes.GetVendorQuery>;
export const getVendorCommunication = /* GraphQL */ `query GetVendorCommunication($id: ID!) {
  getVendorCommunication(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetVendorCommunicationQueryVariables,
  APITypes.GetVendorCommunicationQuery
>;
export const getWedding = /* GraphQL */ `query GetWedding($id: ID!) {
  getWedding(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetWeddingQueryVariables,
  APITypes.GetWeddingQuery
>;
export const getWeddingPhase = /* GraphQL */ `query GetWeddingPhase($id: ID!) {
  getWeddingPhase(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetWeddingPhaseQueryVariables,
  APITypes.GetWeddingPhaseQuery
>;
export const listActivities = /* GraphQL */ `query ListActivities(
  $filter: ModelActivityFilterInput
  $limit: Int
  $nextToken: String
) {
  listActivities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      wedding_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListActivitiesQueryVariables,
  APITypes.ListActivitiesQuery
>;
export const listBudgetCategories = /* GraphQL */ `query ListBudgetCategories(
  $filter: ModelBudgetCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listBudgetCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBudgetCategoriesQueryVariables,
  APITypes.ListBudgetCategoriesQuery
>;
export const listCommunications = /* GraphQL */ `query ListCommunications(
  $filter: ModelCommunicationFilterInput
  $limit: Int
  $nextToken: String
) {
  listCommunications(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      attachments
      content
      createdAt
      direction
      follow_up_date
      follow_up_needed
      guest_id
      id
      status
      subject
      timestamp
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCommunicationsQueryVariables,
  APITypes.ListCommunicationsQuery
>;
export const listGuests = /* GraphQL */ `query ListGuests(
  $filter: ModelGuestFilterInput
  $limit: Int
  $nextToken: String
) {
  listGuests(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGuestsQueryVariables,
  APITypes.ListGuestsQuery
>;
export const listMilestones = /* GraphQL */ `query ListMilestones(
  $filter: ModelMilestoneFilterInput
  $limit: Int
  $nextToken: String
) {
  listMilestones(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      completed_date
      createdAt
      created_at
      deliverables
      dependencies
      description
      id
      name
      notes
      phase_id
      priority
      progress_percentage
      responsible_parties
      status
      success_criteria
      target_date
      updatedAt
      updated_at
      wedding_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMilestonesQueryVariables,
  APITypes.ListMilestonesQuery
>;
export const listMoodBoards = /* GraphQL */ `query ListMoodBoards(
  $filter: ModelMoodBoardFilterInput
  $limit: Int
  $nextToken: String
) {
  listMoodBoards(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      created_at
      description
      id
      is_finalized
      is_public
      name
      phase_id
      style_keywords
      themes
      updatedAt
      updated_at
      vendor_shared_with
      wedding_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMoodBoardsQueryVariables,
  APITypes.ListMoodBoardsQuery
>;
export const listPlusOnes = /* GraphQL */ `query ListPlusOnes(
  $filter: ModelPlusOneFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlusOnes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPlusOnesQueryVariables,
  APITypes.ListPlusOnesQuery
>;
export const listTasks = /* GraphQL */ `query ListTasks(
  $filter: ModelTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      phase_id
      priority
      status
      title
      updatedAt
      updated_at
      vendor_id
      wedding_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTasksQueryVariables, APITypes.ListTasksQuery>;
export const listTransactions = /* GraphQL */ `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      amount
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
      wedding_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransactionsQueryVariables,
  APITypes.ListTransactionsQuery
>;
export const listVendorCommunications = /* GraphQL */ `query ListVendorCommunications(
  $filter: ModelVendorCommunicationFilterInput
  $limit: Int
  $nextToken: String
) {
  listVendorCommunications(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      vendor_id
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVendorCommunicationsQueryVariables,
  APITypes.ListVendorCommunicationsQuery
>;
export const listVendors = /* GraphQL */ `query ListVendors(
  $filter: ModelVendorFilterInput
  $limit: Int
  $nextToken: String
) {
  listVendors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVendorsQueryVariables,
  APITypes.ListVendorsQuery
>;
export const listWeddingPhases = /* GraphQL */ `query ListWeddingPhases(
  $filter: ModelWeddingPhaseFilterInput
  $limit: Int
  $nextToken: String
) {
  listWeddingPhases(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeddingPhasesQueryVariables,
  APITypes.ListWeddingPhasesQuery
>;
export const listWeddings = /* GraphQL */ `query ListWeddings(
  $filter: ModelWeddingFilterInput
  $limit: Int
  $nextToken: String
) {
  listWeddings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWeddingsQueryVariables,
  APITypes.ListWeddingsQuery
>;

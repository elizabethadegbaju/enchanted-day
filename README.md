# EnchantedDay AI Wedding Planner

## Overview

EnchantedDay is a comprehensive AI-powered wedding planning web application that provides couples with intelligent, autonomous wedding coordination. Built with Next.js and AWS Amplify, it integrates seamlessly with our unified AI agent backend to deliver a magical planning experience across all wedding domains.

## Current Implementation: Full-Stack Wedding Planning Platform

### Architecture Diagram

```mermaid
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Next.js Web   │───▶│  Lambda Function │───▶│  Unified Agent   │
│   Application   │    │   (Chat Bridge)  │    │  (Bedrock Core)  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  AWS Amplify    │    │   GraphQL API    │    │   DynamoDB       │
│  (Frontend +    │    │  (AppSync +      │    │  (Wedding Data)  │
│   Auth)         │    │   Real-time)     │    │                  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
```

### 🤖 Unified AI Integration

**Frontend Integration:** Complete web application with natural language AI chat interface

### Available Wedding Planning Domains

- **Vendor management** (search, contracts, communications, payments tracking)
- **Guest experience** (lists, RSVPs, dietary preferences, contact management)
- **Budget optimization** (expense tracking, categories, cost analysis, financial insights)
- **Timeline management** (tasks, milestones, deadlines, phase coordination)
- **Style & mood boards** (visual inspiration, color palettes, theme development)
- **Crisis management** (emergency response, risk mitigation, contingency planning)
- **Multi-wedding support** (wedding planners managing multiple events)

### Frontend Features Available

#### Vendor Management Interface

```typescript
- Vendor dashboard with status tracking
- Contract management and payment history
- Communication log with AI-powered responses
- Search and filtering by category/status
- Real-time vendor coordination
```

#### Guest Management Interface

```typescript
- Complete guest list management with relationship tracking
- RSVP tracking with dietary restrictions
- Guest communication hub with inquiry chat
- Import/export functionality for guest data
- Attendance status updates and notifications
```

#### Budget Management Interface

```typescript
- Interactive budget dashboard with category breakdown
- Expense tracking with receipt management
- Real-time spending analysis and alerts
- Budget vs actual comparison charts
- AI-powered cost optimization suggestions
```

#### Timeline Management Interface

```typescript
- Visual timeline with drag-and-drop task management
- Milestone tracking with progress indicators
- Phase-based wedding planning workflow
- Deadline notifications and reminders
- Task dependencies and critical path analysis
```

#### Style & Inspiration Interface

```typescript
- Mood board creation with image galleries
- Color palette management and coordination
- Style keyword tagging and organization
- Inspiration link collection and categorization
- Media upload and gallery management
```

## Natural Language AI Chat Interface

The web application features a sophisticated chat interface that connects to our unified AI agent:

### Example User Interactions

- **"Add photographer 'Studio Light' to my wedding with $3500 budget"** → Creates vendor + budget category
- **"Mark Sarah Thompson as attending with vegan meal preference"** → Updates guest RSVP
- **"What tasks should I complete 6 months before my June wedding?"** → Timeline recommendations
- **"Show me all unpaid vendors and their contact details"** → Vendor filtering + display
- **"Create a romantic garden theme mood board"** → Style board generation

### Chat Features

- **Real-time streaming responses** with thinking process visibility
- **Context-aware conversations** with wedding data integration
- **Action suggestions** with direct navigation to relevant pages
- **Multi-turn conversations** with conversation history
- **Agent specialization** routing to appropriate domain experts

## Technology Stack

### Frontend Architecture

- **Framework:** Next.js 14+ with App Router and TypeScript
- **UI Library:** Chakra UI for beautiful, accessible components
- **State Management:** React Context + Custom hooks
- **Styling:** Chakra UI theme system with custom branding
- **Authentication:** AWS Amplify UI components with Cognito

### Backend Integration

- **Platform:** AWS Amplify Gen 2 for full-stack development
- **API:** GraphQL with AWS AppSync for real-time data
- **Database:** Amazon DynamoDB with optimized data models
- **Authentication:** Amazon Cognito User Pools + Identity Pools
- **Storage:** Amazon S3 for media and document storage
- **Functions:** AWS Lambda for AI chat bridge and data processing

### AI Integration

- **Chat Service:** Lambda function bridge to Bedrock Agent Core
- **Agent Backend:** [enchantedday-ai](https://github.com/elizabethadegbaju/enchantedday) repository
- **Streaming:** Server-sent events for real-time AI responses
- **Context Management:** Wedding data integration with AI agent
- **Error Handling:** Graceful fallbacks with mock responses

## Project Structure

```text
enchanted-day/
├── app/                          # Next.js App Router pages
│   ├── AuthWrapper.tsx           # Authentication wrapper
│   ├── chat/                     # AI Chat interface
│   ├── dashboard/                # Wedding planning dashboard
│   ├── vendors/                  # Vendor management pages
│   ├── guests/                   # Guest management pages
│   ├── timeline/                 # Timeline & task management
│   ├── budget/                   # Budget tracking pages
│   └── wedding/                  # Wedding creation & management
├── components/                   # Reusable React components
│   ├── layout/                   # Layout and navigation
│   ├── common/                   # Shared UI components
│   ├── budget/                   # Budget-specific components
│   ├── guests/                   # Guest management UI
│   ├── timeline/                 # Timeline components
│   ├── vendors/                  # Vendor management UI
│   ├── wedding/                  # Wedding planning components
│   └── user/                     # User profile management
├── lib/                          # Utility libraries
│   ├── amplify-client.ts         # AWS Amplify configuration
│   ├── chat-service.ts           # AI agent communication
│   ├── wedding-data-service.ts   # GraphQL data operations
│   ├── streaming-utils.ts        # Chat streaming utilities
│   └── data-utils.ts             # Data transformation helpers
├── contexts/                     # React context providers
│   └── WeddingContext.tsx        # Wedding state management
├── types/                        # TypeScript definitions
├── theme/                        # Chakra UI theming
│   └── amplify-theme.ts          # Authentication UI theme
└── amplify/                      # AWS Amplify backend
    ├── auth/                     # Cognito configuration
    ├── data/                     # GraphQL schema
    ├── functions/                # Lambda functions
    └── storage/                  # S3 configuration
```

## Technical Implementation

- **Platform:** Next.js with AWS Amplify Gen 2
- **Region:** eu-central-1 (matches AI agent deployment)
- **Runtime:** React 18+ with TypeScript for type safety
- **Communication:** Lambda function bridges frontend to AI agent
- **Database:** AWS AppSync GraphQL + DynamoDB for real-time data
- **Authentication:** Cognito User Pools with custom UI theming

## Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn/pnpm
- **AWS Account** with appropriate permissions
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/elizabethadegbaju/enchanted-day.git
   cd enchanted-day
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure AWS Amplify**

   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   amplify init
   ```

4. **Deploy backend resources**

   ```bash
   amplify push
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open application**

   ```text
   http://localhost:3000
   ```

### Environment Configuration

Create `.env.local` file:

```env
# AWS Configuration (auto-configured by Amplify)
NEXT_PUBLIC_AWS_REGION=eu-central-1

# AI Agent Configuration
NEXT_PUBLIC_AI_CHAT_ENDPOINT=https://your-lambda-url.lambda-url.eu-central-1.on.aws/
```

## Future Roadmap: Enhanced Multi-Agent Integration

**Planned Evolution:**

- 🏢 **Specialized Agent UI** - Dedicated interfaces for each AI sub-agent
- 👥 **Advanced Guest Analytics** - Predictive RSVP and engagement insights
- 💰 **AI Budget Optimization** - Intelligent cost reduction recommendations
- 📅 **Smart Timeline Automation** - Auto-scheduling with vendor coordination
- 🎨 **AI Style Generation** - Automated mood board and theme creation
- 🚨 **Proactive Crisis Management** - Predictive issue detection and resolution
- � **Mobile Application** - Native iOS/Android apps with offline capability
- � **Real-time Collaboration** - Multi-user planning with live updates

## Repository Ecosystem

This repository contains the complete web application frontend and backend. The AI intelligence is powered by:

- **Frontend + Backend:** This repository - Complete wedding planning web application
- **AI Agent Runtime:** [enchantedday-ai](https://github.com/elizabethadegbaju/enchantedday) - Unified agent with CRUD operations
- **Deployment:** Integrated system deployed on AWS with seamless AI communication

## Usage Examples

### For Couples

1. **Sign up** and complete your user profile setup
2. **Create your wedding** with basic details and preferences  
3. **Chat with AI** to start planning: "Help me plan my summer outdoor wedding"
4. **Use specialized pages** for detailed vendor, guest, and budget management
5. **Track progress** through the intelligent dashboard

### For Wedding Planners

1. **Manage multiple weddings** with dedicated workspace organization
2. **Collaborate with couples** through shared planning interfaces
3. **Coordinate vendors** across multiple events efficiently
4. **Analyze performance** with built-in analytics and insights

The web application provides comprehensive wedding planning automation with intelligent AI assistance across all domains, delivering a magical planning experience for couples and professionals alike.

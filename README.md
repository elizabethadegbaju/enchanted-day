# 💍 EnchantedDay - AI-Powered Wedding Planner

> Transform wedding planning from stressful coordination into a seamless, magical journey with intelligent AI assistance.

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify-orange?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/amplify/)
[![Chakra UI](https://img.shields.io/badge/Chakra-UI-teal?style=flat-square&logo=chakraui)](https://chakra-ui.com/)

## ✨ Overview

EnchantedDay is a next-generation wedding planning platform that leverages artificial intelligence to provide couples with autonomous, intelligent, and magical wedding planning assistance. Our AI system handles everything from vendor coordination to timeline management, letting couples focus on the joy of their special day (and ideally when we are done, this will be at a much affordable rate than letting a wedding planner handle it all).

## 🤖 AI-Powered Features

### **Conversational AI Interface**

- Natural language wedding planning through an intelligent chat interface
- You can opt to skip the forms or overwhelming menus and just chat with your AI planner
- Context-aware responses that understand your wedding vision and long term memory for the AI planner.

### **Cultural & Personal Adaptation**

- Supports multi-phase weddings and diverse cultural traditions
- Learns and adapts to your unique preferences and style
- Personalized recommendations based on your wedding vision

## 🚀 Key Features

### **Smart Wedding Management**

- **Multi-wedding support** for planners and couples with multiple events
- **Real-time collaboration** between partners and family members
- **Automated vendor coordination** with intelligent communication tracking
- **Dynamic timeline optimization** with deadline management
- **Comprehensive budget tracking** with AI-powered cost optimization

### **Guest Experience**

- **Intelligent RSVP management** with automated follow-ups
- **Guest communication hub** with personalized messaging
- **Attendance tracking** with real-time updates
- **Guest inquiry chat** for instant assistance

### **Visual Planning**

- **Mood board creation** with AI-powered inspiration gathering
- **Media gallery management** for photos and videos
- **Color palette generation** with style coordination
- **Inspiration link management** for organized planning

### **Data & Analytics**

- **Real-time dashboard** with wedding progress tracking
- **Vendor performance analytics** and payment tracking
- **Budget utilization insights** with spending optimization
- **Timeline progress monitoring** with milestone tracking

## 🛠 Technology Stack

### **Frontend**

- **Next.js 14+** with App Router for modern React development
- **TypeScript** for type-safe development
- **Chakra UI** for beautiful, accessible component library
- **React Query** for efficient data fetching and caching

### **Backend & Infrastructure**

- **AWS Amplify** for full-stack cloud development
- **Amazon Cognito** for secure user authentication
- **AWS AppSync** for real-time GraphQL API
- **Amazon DynamoDB** for scalable NoSQL database
- **AWS Lambda** for serverless AI processing

### **AI & Intelligence**

- **Strands AI Framework** with Bedrock AgentCore deployment
- **Multi-agent orchestration** with specialized sub-agents as tools
- **Natural language processing** for conversational interface
- **Machine learning** for personalized recommendations
- **Predictive analytics** for proactive issue prevention

## 🏗 Project Structure

```
enchanted-day/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages
│   ├── chat/                     # AI Chat interface
│   ├── dashboard/                # Main dashboard
│   ├── vendors/                  # Vendor management
│   ├── guests/                   # Guest management
│   ├── timeline/                 # Timeline & milestones
│   ├── budget/                   # Budget tracking
│   └── wedding/                  # Wedding management
├── components/                   # Reusable React components
│   ├── layout/                   # Layout components
│   ├── common/                   # Shared components
│   ├── budget/                   # Budget-specific components
│   ├── guests/                   # Guest management components
│   ├── timeline/                 # Timeline components
│   ├── vendors/                  # Vendor components
│   ├── wedding/                  # Wedding planning components
│   └── user/                     # User profile components
├── lib/                          # Utility libraries
│   ├── amplify-client.ts         # AWS Amplify configuration
│   ├── chat-service.ts           # AI chat service
│   ├── wedding-data-service.ts   # Wedding data operations
│   └── data-utils.ts             # Data transformation utilities
├── contexts/                     # React context providers
├── types/                        # TypeScript type definitions
├── theme/                        # Chakra UI theme configuration
└── amplify/                      # AWS Amplify backend configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn
- **AWS Account** for Amplify deployment
- **Git** for version control

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/elizabethadegbaju/enchanted-day.git
   cd enchanted-day
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up AWS Amplify**

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
   npm run start
   ```

6. **Open in browser**

   ```
   http://localhost:3000
   ```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# AWS Amplify Configuration
NEXT_PUBLIC_AWS_REGION=your-aws-region
NEXT_PUBLIC_AWS_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=your-client-id

# AI Service Configuration
NEXT_PUBLIC_AI_ENDPOINT=your-ai-service-endpoint
```

## 📱 Usage

### **For Couples**

1. **Create Account**: Sign up and set up your user profile
2. **Create Wedding**: Set up your wedding details and preferences
3. **Chat with AI**: Start planning by chatting with your AI assistant
4. **Manage Everything**: Use specialized pages for vendors, guests, timeline, and budget
5. **Track Progress**: Monitor your wedding planning progress on the dashboard

### **For Wedding Planners**

1. **Multi-Wedding Management**: Handle multiple client weddings simultaneously
2. **Client Collaboration**: Invite couples to collaborate on their wedding plans
3. **Vendor Network**: Build and manage relationships with preferred vendors
4. **Analytics & Insights**: Track performance and optimize planning processes

## 🌟 AI Chat Commands

The AI assistant understands natural language, but here are some example interactions (some features still in progress but most aare already in place):

```
💬 "What vendors do I need for my wedding phases?"
💬 "What should I do 6 months before my wedding?"
💬 "Create a timeline for my outdoor wedding in June"
💬 "Help me track RSVPs and send reminders" ** this will be in place after mailing setup
💬 "I need help with my wedding budget"
💬 "Sarah Harton has confirmed she will be attending the reception with a plus one"
```

## 🎨 Customization

### Theme Configuration

Customize the appearance in `theme/index.ts`:

```typescript
export const theme = extendTheme({
  colors: {
    brand: {
      50: '#f7fafc',
      500: '#6366f1',  // Primary brand color
      600: '#4f46e5',
    },
  },
  // Add your custom theme here
})
```

### AI Agent Configuration

Configure AI behavior in `lib/chat-service.ts`. Our sophisticated AI architecture is built on the **Strands AI framework** and deployed in **Bedrock AgentCore**. The complete agent runtime and orchestration logic is hosted at <https://github.com/elizabethadegbaju/enchantedday>.

A Lambda function is deployed in our backend to handle all communications with the Agent Runtime, providing seamless integration between the frontend and our multi-agent AI system.

## 🔧 Configuration

### AWS Amplify Backend

The backend is configured in `amplify/backend.ts`:

- **Authentication**: Amazon Cognito user pools
- **API**: GraphQL with AWS AppSync
- **Database**: DynamoDB tables for all wedding data
- **Storage**: S3 for media files
- **Functions**: Lambda functions for AI processing

### Database Schema

Key data models include:

- **Users**: User profiles and preferences
- **Weddings**: Wedding details and settings
- **Vendors**: Vendor information and communications
- **Guests**: Guest lists and RSVP tracking
- **Timeline**: Milestones and tasks
- **Budget**: Expenses and budget tracking

## 🔒 Security

- **Authentication** via AWS Cognito and API key for Appsync GraphQL
- **Authorization** with fine-grained access controls
- **Data encryption** at rest and in transit

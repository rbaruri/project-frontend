# Full Stack Project

## Project Overview
A modern web application built with React and Node.js, featuring a microservices architecture with Hasura for GraphQL API management. The project implements a robust authentication system, real-time data updates, and a responsive user interface built with Tailwind CSS.

## Tech Stack & Architecture

### Frontend (React Application)
- **Core Framework & Build Tools**
  - React 18 with TypeScript - Main UI framework
  - Vite - Development server and build optimization
  - ESLint & TypeScript - Code quality and type safety

- **State Management & Data Flow**
  - Redux + Redux Saga - Global state and side effects
  - Apollo Client - GraphQL data fetching and caching
  - React Context - Component-level state sharing

- **UI & Styling**
  - TailwindCSS - Utility-first styling
  - Framer Motion - UI animations
  - Headless UI - Accessible UI components
  - Heroicons - SVG icon system

- **Testing & Quality**
  - Jest - Unit testing framework
  - React Testing Library - Component testing
  - TypeScript - Static type checking

### Backend (Node.js Server)
- **Core Framework & Runtime**
  - Node.js with Express - Server framework
  - TypeScript - Type safety and developer experience
  - Nodemon - Development hot-reload

- **Authentication & Security**
  - JWT - Token-based authentication
  - bcrypt - Password hashing
  - Cookie-parser - Session management

- **File Handling & Processing**
  - Multer - File upload handling
  - OCR Service - Document text extraction
  - Token Tracker - Rate limiting

- **Database & ORM**
  - Prisma - Database ORM
  - PostgreSQL - Primary database
  - Hasura - GraphQL API layer

### Infrastructure & APIs
- **Database Layer**
  - PostgreSQL - Primary data store
  - Hasura - GraphQL API gateway and authorization
  - Database migrations - Version control for schema

- **External Services**
  - OCR API Integration
  - AI Path Generation
  - Summary Generation

## Project Structure

### Backend Structure (Detailed)
```
project_backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── syllabusController.ts # Syllabus management
│   │   ├── quizController.ts     # Quiz functionality
│   │   ├── ocrController.ts      # OCR processing
│   │   ├── aiPathController.ts   # AI path generation
│   │   └── tokenController.ts    # Token management
│   │
│   ├── services/             # Business logic layer
│   │   ├── graphqlService.ts     # Hasura/GraphQL operations
│   │   ├── summaryService.ts     # Text summarization
│   │   ├── aiPathService.ts      # AI path generation
│   │   ├── ocrService.ts         # OCR processing
│   │   ├── quizService.ts        # Quiz generation
│   │   └── tokenTracker.ts       # Rate limiting
│   │
│   ├── middleware/           # Express middleware
│   │   ├── auth/                 # Authentication middleware
│   │   ├── validation/           # Request validation
│   │   └── error/                # Error handling
│   │
│   ├── routes/              # API route definitions
│   │   ├── auth.routes.ts        # Authentication routes
│   │   ├── syllabus.routes.ts    # Syllabus endpoints
│   │   └── quiz.routes.ts        # Quiz endpoints
│   │
│   └── utils/               # Helper functions
│       ├── validation/           # Data validation
│       ├── transformers/         # Data transformers
│       └── constants/            # Global constants
│
├── logs/                    # Application logs
└── project-hasura/          # Hasura configuration
    ├── metadata/                # Hasura metadata
    ├── migrations/              # Database migrations
    └── seeds/                   # Seed data
```

### Frontend Structure
```
src/
├── api/          # API integration layer
├── assets/       # Static assets
├── components/   # Reusable UI components
├── containers/   # Complex components with business logic
├── context/      # React context providers
├── graphql/      # GraphQL queries and mutations
├── hooks/        # Custom React hooks
├── pages/        # Route components
├── redux/        # State management
├── routes/       # Routing configuration
├── types/        # TypeScript type definitions
└── utils/        # Helper functions
```

## Key Features
- 🔐 Secure Authentication System
- 📱 Responsive Design
- 🔄 Real-time Data Updates
- 🎯 Type Safety with TypeScript
- 📊 GraphQL API Integration
- 🚀 Optimized Performance
- 🧪 Comprehensive Testing
- 🎨 Modern UI/UX with Tailwind
- 📁 File Upload Capabilities
- 🔍 Advanced Search Functionality

## Getting Started
1. Clone both frontend and backend repositories
2. Install dependencies:
   ```bash
   # Frontend
   cd project-frontend
   npm install

   # Backend
   cd project_backend
   npm install
   ```
3. Set up environment variables (check .env.example)
4. Start development servers:
   ```bash
   # Frontend
   npm run dev

   # Backend
   npm run dev
   ```

## Environment Setup
Ensure you have the following environment variables set up:

Frontend (.env):
```
VITE_API_URL=your_api_url
VITE_HASURA_URL=your_hasura_url
```

Backend (.env):
```
PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_database_url
```

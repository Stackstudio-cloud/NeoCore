# SmartDB Platform

## Overview

SmartDB is a modern backend development platform that provides a complete, fully managed infrastructure stack. The application is built as a full-stack web application with a React frontend and Express.js backend, showcasing the capabilities of the SmartDB platform through an interactive dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with custom neon-themed design system
- **Component Library**: Radix UI primitives with custom shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Styling**: Dark theme with neon accents and glass morphism effects

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Real-time Communication**: WebSocket server for live updates
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot reloading with Vite integration

### Build System
- **TypeScript**: Strict type checking across the entire codebase
- **ESBuild**: Fast bundling for production server builds
- **Module System**: ES modules throughout the project
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definitions in `shared/schema.ts`
- **Tables**: Projects, databases, API endpoints, auth providers, storage buckets, functions, AI assistants, and metrics
- **Migrations**: Automated schema migrations with drizzle-kit

### API Layer
- **Storage Interface**: Abstract storage interface for data operations
- **WebSocket**: Real-time metrics and status updates
- **Error Handling**: Centralized error middleware
- **Logging**: Request/response logging with performance metrics

### Frontend Components
- **Layout**: Fixed header and sidebar with main content area
- **Dashboard**: Interactive metrics carousel and service grid
- **Service Pages**: Dedicated pages for Database, GraphQL, Auth, Storage, Functions, and AI
- **UI Components**: Reusable neon-themed components with hover effects
- **Code Editor**: Syntax-highlighted code blocks with copy/run functionality

## Data Flow

### Client-Server Communication
1. **Frontend** makes HTTP requests to Express.js backend
2. **Backend** processes requests and queries PostgreSQL database
3. **Real-time updates** flow through WebSocket connections
4. **State management** handled by TanStack Query with caching

### Database Operations
1. **Schema definitions** in shared directory for type safety
2. **Drizzle ORM** provides type-safe database queries
3. **Storage interface** abstracts database operations
4. **Migrations** managed through drizzle-kit CLI

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL provider
- **Connection**: Via DATABASE_URL environment variable
- **Extensions**: Support for pgvector and PostGIS

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component

### Development Tools
- **Vite**: Development server and build tool
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database migration tool

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend
- **Hot Reloading**: Vite middleware integrated with Express
- **Type Checking**: Continuous TypeScript compilation
- **Database**: Local or cloud PostgreSQL via connection string

### Production
- **Build Process**: 
  1. Frontend built with Vite to `dist/public`
  2. Backend bundled with ESBuild to `dist/index.js`
- **Deployment**: Single Node.js process serving both frontend and API
- **Static Assets**: Frontend served from `dist/public`
- **Environment**: NODE_ENV=production with optimized builds

### Configuration
- **Environment Variables**: DATABASE_URL required for database connection
- **TypeScript**: Strict mode enabled with path mapping
- **Bundling**: ESM modules throughout with proper external package handling
# NeoCore Platform

## Overview

NeoCore is a modern backend development platform that provides a complete, fully managed infrastructure stack. The application is built as a full-stack web application with a React frontend and Express.js backend, showcasing the capabilities of the NeoCore platform through an interactive modern dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language. Avoid excessive mention of cyberpunk aesthetics in favor of professional technical descriptions.

## Recent Changes (Latest Updates)

### Migration to Replit Environment (2025-01-20)
- **Environment Setup**: Successfully migrated from Replit Agent to standard Replit environment
- **Database Integration**: PostgreSQL database provisioned and schema deployed successfully
- **Error Handling**: Fixed DOM nesting warnings in sidebar navigation
- **Global Error Handlers**: Added unhandled promise rejection and error handling
- **GitHub Documentation**: Created comprehensive README.md with setup instructions, features overview, and deployment guide
- **Project Structure**: Verified all components working correctly in new environment
- **Development Workflow**: Confirmed hot-reload and development server functionality

### Migration to Replit Environment (2025-01-20)
- **Project Import**: Successfully migrated from Replit Agent to standard Replit environment
- **Database Setup**: Created and configured PostgreSQL database with proper environment variables
- **Package Installation**: Verified all required Node.js packages are properly installed
- **Bug Fixes**: Resolved DOM nesting warnings in sidebar navigation component
- **Error Handling**: Added global error handlers for unhandled promise rejections
- **Environment Security**: Implemented proper client/server separation and security practices

### Latest UI/UX Improvements (2025-01-20)
- **Enhanced Error Handling**: Global error boundaries and user-friendly error messages
- **Loading States**: Skeleton components for better UX during data loading  
- **Navigation System**: Breadcrumb navigation and keyboard-shortcut search (Cmd/Ctrl+K)
- **User Preferences**: Local storage for sidebar collapse, sound settings, and theme preferences
- **Performance Optimizations**: Query caching, retry logic, and debounced search
- **Enhanced Components**: Status indicators, metric cards, and modern-styled buttons with sound effects
- **Real-time Features**: Collapsible sidebar with tooltips and smooth animations

### AI-Powered Development Features
- **Development Assistant**: Comprehensive AI chat interface for code generation
- **Code Playground**: Interactive environment for testing APIs and functions
- **Natural Language Queries**: AI converts plain English to SQL/GraphQL
- **Performance Monitoring**: Real-time holographic charts and metrics
- **Smart Code Examples**: Context-aware code generation with best practices

### Advanced UI Components
- **Enhanced Animations**: Glitch text, floating elements, pulse effects
- **Glass Morphism**: Advanced backdrop blur and transparency effects
- **Neon Borders**: Dynamic glowing border effects with multiple colors
- **Interactive Elements**: Hover effects, scale animations, sound feedback
- **Responsive Design**: Mobile-optimized modern interface

### API & Infrastructure Enhancements
- **API Playground**: Full-featured HTTP request builder with live environment
- **WebSocket Integration**: Real-time data streaming and live updates
- **Performance Optimization**: Connection pooling, caching, query optimization
- **Security Features**: JWT authentication, input validation, rate limiting

### Database Implementation (2025-01-18)
- **PostgreSQL Database**: Successfully integrated with Neon serverless PostgreSQL
- **Database Storage**: Replaced in-memory storage with persistent PostgreSQL backend
- **Schema Migration**: Deployed complete database schema with Drizzle ORM
- **Data Seeding**: Populated database with sample projects, databases, APIs, and metrics
- **Connection Management**: Implemented connection pooling and error handling
- **Type Safety**: Full TypeScript integration with database operations

### Enterprise GitHub Integration (2025-01-18)
- **Repository Structure**: Connected to Stackstudio-cloud organization as dedicated repository
- **GitHub Repository**: https://github.com/Stackstudio-cloud/NeoCore
- **Documentation**: Created comprehensive README and setup guide for team collaboration
- **Project Management**: Structured for clean versioning and enterprise workflows
- **Team Workspace**: Ready for import to team workspace with full database integration

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
- **Layout**: Fixed header and sidebar with main content area, enhanced with data streams
- **Dashboard**: Interactive metrics carousel and service grid with matrix rain background
- **Service Pages**: Dedicated pages for Database, GraphQL, Auth, Storage, Functions, AI, and Playground
- **UI Components**: Reusable modern-themed components with hover effects and sound feedback
- **Code Editor**: Syntax-highlighted code blocks with copy/run functionality
- **Effects System**: Matrix rain, particle systems, holographic charts, data streams
- **AI Assistant**: Interactive development assistant with code generation capabilities
- **Sound System**: Optional audio feedback with toggle control

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
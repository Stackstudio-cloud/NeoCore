# NeoCore Platform

## Overview

NeoCore is a modern backend development platform that provides a complete, fully managed infrastructure stack. The application is built as a full-stack web application with a React frontend and Express.js backend, showcasing the capabilities of the NeoCore platform through an interactive modern dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language. Avoid excessive mention of cyberpunk aesthetics in favor of professional technical descriptions.

## Recent Changes (Latest Updates)

### Critical Stability Fix - MetricCard Render Bug Resolution (2025-01-22)
- **MetricCard Bug Fixed**: Resolved systematic render failure that caused crashes after 5-10 random page navigations
- **Icon Prop Standardization**: Fixed all pages to pass component references (e.g., `Video`) instead of JSX elements (`<Video />`) to MetricCard icons
- **Array Safety Enhancement**: Added comprehensive array checks preventing undefined data errors across Storage, Database, Functions, and AI pages
- **Enterprise Feature Stability**: All 8 enterprise features now completely stable and crash-free during extended browsing
- **User Experience Improvement**: Eliminated need for "Home" button workaround - application maintains stability throughout navigation
- **Production Ready**: Platform now stable for extended development sessions and enterprise deployment

### Comprehensive Feature Implementation (2025-01-22)
- **Backend API Enhancement**: Created complete backend service layer with specialized routes for AI, databases, and business features
- **AI Service Integration**: Implemented comprehensive AI service with OpenAI GPT-4o-mini and Gemini 2.5-flash support
- **Database Management Tools**: Built advanced database manager with multi-provider support (PostgreSQL, MySQL, MongoDB, Redis)
- **Testing Framework Integration**: Complete testing suite with support for Jest, Cypress, Playwright, Vitest, and more
- **Enterprise Collaboration**: Full team management system with role-based access control and project collaboration
- **Project Scaffolding**: Template-based project generation system with React, Vue, Angular, Next.js, and backend templates
- **Business Features**: Subscription management, pricing tiers, usage tracking, and Stripe integration ready
- **Enhanced Navigation**: Updated sidebar with organized sections for AI tools, developer tools, enterprise, and business features
- **Professional UI Components**: All new pages built with consistent design system and animations
- **Real-time Features**: WebSocket integration for live updates and metrics streaming
- **Type Safety**: Complete TypeScript integration across all new features and API endpoints

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

### OpenAI GPT-4o-mini Integration (2025-01-20)
- **API Integration**: Successfully integrated OpenAI GPT-4o-mini for real AI-powered development assistance
- **Parameter Compatibility**: Fixed API parameter issues with temperature and max_tokens for stable performance
- **Advanced Code Generation**: Real AI-powered code generation with contextual understanding
- **Enhanced Development Assistant**: AI provides intelligent, conversational responses for complex development questions
- **Professional Integration**: OpenAI GPT-4o-mini - reliable, fast, and cost-effective AI model
- **NeoCore-Specific Guidance**: AI responses tailored specifically for PostgreSQL, Express.js, React, and TypeScript stack

### Latest UI/UX Improvements (2025-01-20)
- **Enhanced Error Handling**: Global error boundaries and user-friendly error messages
- **Loading States**: Skeleton components for better UX during data loading  
- **Navigation System**: Breadcrumb navigation and keyboard-shortcut search (Cmd/Ctrl+K)
- **User Preferences**: Local storage for sidebar collapse, sound settings, and theme preferences
- **Performance Optimizations**: Query caching, retry logic, and debounced search
- **Enhanced Components**: Status indicators, metric cards, and modern-styled buttons with sound effects
- **Real-time Features**: Collapsible sidebar with tooltips and smooth animations
- **Logo Integration**: Custom NeoCore logo integrated across header, sidebar, dashboard, and favicon
- **Professional Branding**: Updated language and documentation for more professional presentation

### AI-Powered Development Features (Google Cloud Integration)
- **Development Assistant**: Comprehensive AI chat interface powered by Google Cloud Natural Language API
- **Code Generation**: Intelligent pattern-based code generation for APIs, databases, and authentication
- **Natural Language Analysis**: Advanced text analysis using Google Cloud sentiment and entity detection
- **Smart Documentation**: Context-aware development guidance with NeoCore-specific recommendations
- **Performance Monitoring**: Real-time holographic charts and metrics
- **Security Best Practices**: AI-powered security recommendations and code review

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
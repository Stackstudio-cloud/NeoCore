# NeoCore Platform Setup Guide

## Project Overview
NeoCore is a cyberpunk-themed Supabase alternative by StackStudio with PostgreSQL backend, AI-powered development tools, and stunning visual effects.

## Enterprise GitHub Integration
This project is managed under the **stackstudio** organization on GitHub Enterprise.

## Team Workspace Setup Instructions

### 1. Database Setup
After importing the project to your team workspace:

```bash
# The database will be automatically provisioned
# Run this command to create the schema:
npm run db:push
```

### 2. Environment Variables
The following environment variables will be automatically set:
- `DATABASE_URL` - PostgreSQL connection string
- `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST` - Database connection details

### 3. Dependencies
All dependencies are already configured in package.json:
- React with TypeScript
- Express.js backend
- PostgreSQL with Drizzle ORM
- Tailwind CSS with cyberpunk theme
- AI development tools

### 4. Running the Application
```bash
npm run dev
```

This starts both the frontend (Vite) and backend (Express) servers.

### 5. Database Seeding
The database will be automatically seeded with:
- 1 demo project
- 2 database instances
- 3 auth providers (email, google, github)
- 3 API endpoints (REST, GraphQL, WebSocket)
- 3 serverless functions
- 3 AI assistants
- Performance metrics

### 6. Key Features
- **Cyberpunk UI**: Matrix rain effects, neon borders, glass morphism
- **AI Assistant**: Code generation and development help
- **API Playground**: Interactive HTTP request builder
- **Database Management**: PostgreSQL with visual interface
- **Real-time Updates**: WebSocket integration
- **Performance Monitoring**: Live metrics and charts

### 7. File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── components.json  # UI component config
├── drizzle.config.ts # Database configuration
└── package.json     # Dependencies
```

### 8. Troubleshooting
If you encounter issues:
1. Ensure PostgreSQL is provisioned
2. Run `npm run db:push` to sync schema
3. Check environment variables are set
4. Restart the application workflow

## Team Collaboration
- All team members can contribute to the codebase
- Database is shared across the team workspace
- Real-time collaboration supported
- Version control through GitHub integration
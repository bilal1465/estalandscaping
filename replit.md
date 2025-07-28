# STA Landscaping Website

## Overview

This is a full-stack web application for STA Landscaping, a landscaping service company. The application is built as a marketing website with contact form functionality, featuring a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Development**: Hot module replacement in development, static file serving in production

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API calls
- **React Hook Form** with Zod validation for form handling
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom color scheme

### Backend Architecture
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations with PostgreSQL
- **Neon Database** serverless PostgreSQL hosting
- **Memory storage fallback** for development/testing
- **Zod** for request validation using shared schemas

### Database Design
- **Contact Requests Table**: Stores customer inquiries with fields for personal info, service type, property size, and message
- **UUID primary keys** for better security and scalability
- **Timestamp tracking** for audit trails

### UI/UX Design
- **Single-page application** with smooth scrolling navigation
- **Responsive design** optimized for mobile and desktop
- **Custom brand colors**: Forest green, beige, brown, and off-white theme
- **Comprehensive component library** including forms, cards, modals, and navigation

## Data Flow

1. **User Interaction**: Users navigate the landing page and fill out contact forms
2. **Form Submission**: React Hook Form validates data client-side using Zod schemas
3. **API Request**: TanStack Query sends validated data to Express API endpoints
4. **Server Processing**: Express validates requests and stores data via Drizzle ORM
5. **Database Storage**: Contact requests are persisted to PostgreSQL
6. **Response Handling**: Success/error states are displayed via toast notifications

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Hook Form)
- Express.js with TypeScript support
- Vite build tooling with React plugin

### Database & ORM
- Drizzle ORM with PostgreSQL dialect
- Neon Database serverless PostgreSQL
- Database migrations via Drizzle Kit

### UI Components & Styling
- Radix UI primitives for accessible components
- Tailwind CSS for styling
- Lucide React for icons
- shadcn/ui component system

### Development Tools
- TypeScript for type safety
- ESBuild for production builds
- PostCSS with Autoprefixer
- Replit-specific development plugins

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite dev server with Express backend
- **File System Watching**: Automatic rebuilds on code changes
- **Error Overlay**: Runtime error display in development
- **Database**: Can use memory storage or PostgreSQL connection

### Production Build
- **Frontend Build**: Vite compiles React app to static assets
- **Backend Build**: ESBuild bundles Express server to single file
- **Asset Serving**: Express serves static files in production
- **Environment Variables**: DATABASE_URL required for PostgreSQL connection

### Database Management
- **Schema Management**: Drizzle migrations handle database schema changes
- **Connection Pooling**: Neon serverless handles connection management
- **Environment Configuration**: Flexible database connection via environment variables

The application is designed to be deployed on platforms like Replit, Vercel, or traditional hosting providers with PostgreSQL support.
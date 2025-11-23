# TinyLink - URL Shortener

A professional URL shortening service similar to bit.ly, built with React, Express, and TypeScript.

## Project Overview

TinyLink allows users to:
- Create shortened URLs with optional custom codes (6-8 alphanumeric)
- Track click analytics for each link
- View detailed statistics per link
- Delete links with immediate 404 handling
- Monitor system health

## Current Status

✅ **MVP Complete** - November 23, 2025
- Full-stack implementation with React frontend and Express backend
- In-memory storage with click tracking
- Comprehensive error handling and validation
- Professional UI with Tailwind CSS and Shadcn components
- 40/40 E2E tests passing

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Shadcn UI** components with Tailwind CSS
- **TanStack Query v5** for data fetching and caching
- **React Hook Form** with Zod validation
- **Lucide React** icons
- Typography: Inter (body) + JetBrains Mono (code)

### Backend
- **Express.js** server
- **In-memory MemStorage** with Map data structure
- **Validator.js** for URL validation
- **Nanoid** for generating random short codes

### Data Model

```typescript
Link {
  id: string              // UUID
  code: string            // 6-8 alphanumeric characters
  targetUrl: string       // Valid URL with protocol
  clicks: number          // Starts at 0
  lastClicked: Date | null
  createdAt: Date
}
```

## Features Implemented

### Dashboard (/)
- Table showing all links with code, target URL, clicks, last clicked
- Search/filter by code or URL
- Create new links via modal form
- Copy buttons for quick clipboard access
- Delete links with confirmation
- Empty state, loading skeletons, error states

### Stats Page (/code/:code)
- Detailed metrics cards (clicks, created date, last clicked)
- Link details with copy buttons
- Back navigation to dashboard
- 404 handling for deleted/missing links

### Health Check (/healthz)
- System status monitoring
- Uptime tracking
- Version display
- Periodic polling from header badge

### API Endpoints
- **POST /api/links** - Create link (409 for duplicate codes)
- **GET /api/links** - List all links sorted by creation
- **GET /api/links/:code** - Get link stats (404 if missing)
- **DELETE /api/links/:code** - Delete link (404 if missing)
- **GET /:code** - 302 redirect with click tracking
- **GET /healthz** - Health status endpoint

## Design System

Following Linear + Vercel Dashboard hybrid approach:
- Clean, minimal interface
- Proper spacing hierarchy
- Semantic color tokens
- Responsive design (mobile-first)
- Accessible contrast ratios
- Interactive hover/active states with elevate animations
- Comprehensive data-testid coverage for testing

## Testing

Complete e2e test coverage:
- ✅ 40/40 test steps passing
- Link creation with custom codes
- Redirect functionality (302 status)
- Click tracking and statistics
- Deletion and 404 handling
- All API endpoints with proper status codes
- Health check monitoring
- UI interactions (modals, toasts, copy buttons)

## Deployment

### GitHub
Repository: https://github.com/vasanthgondrala-7/tiny-link

Setup instructions available in GITHUB_SETUP.md

### Netlify
- Build command: `npm run build`
- Publish directory: `dist/public`
- Auto-deploys from GitHub main branch
- Free tier includes HTTPS, CI/CD, and custom domains

## Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm check

# Run production build locally
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

```
client/
  src/
    pages/
      dashboard.tsx      # Main dashboard with links table
      stats.tsx          # Individual link statistics
      health.tsx         # System health status
    components/
      header.tsx         # Site header with navigation
      ui/                # Shadcn UI components
server/
  storage.ts             # In-memory storage implementation
  routes.ts              # API and redirect routes
  index.ts               # Express server setup
shared/
  schema.ts              # Shared TypeScript types and Zod schemas
```

## Future Enhancements

Planned features:
- PostgreSQL database for persistence
- QR code generation for links
- Link expiration with TTL
- Analytics dashboard with click trend charts
- Search functionality optimization
- Rate limiting
- User authentication/accounts
- Custom domains support

## Key Design Decisions

1. **In-Memory Storage** - Chosen for MVP simplicity and speed
2. **Wouter for Routing** - Lightweight, perfect for single-page apps
3. **React Query** - Robust caching and data synchronization
4. **Shadcn Components** - Beautiful, accessible UI components
5. **Zod Validation** - Type-safe runtime validation
6. **Express Backend** - Simple, lightweight API server

## Environment Setup

No secrets or environment variables required for MVP:
- Application uses in-memory storage
- No external API integrations
- Health check endpoint returns static data

For production deployment with database, add:
- DATABASE_URL (Neon PostgreSQL)
- SESSION_SECRET (for user sessions)

## Notes for Future Development

- Search functionality is client-side (can be optimized with backend filtering)
- Statistics are real-time without persistence
- Consider adding PostgreSQL integration for data persistence
- Dark mode already fully implemented via next-themes
- All UI components support light/dark themes automatically

---

Built with ❤️ using modern web technologies

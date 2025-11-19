# TinyLink - URL Shortener

A full-stack URL shortening web application similar to bit.ly, built with React, Express, and TypeScript.

## Project Overview

TinyLink allows users to:
- Create shortened URLs with optional custom codes
- Track click analytics for each link
- View detailed statistics per link
- Delete links
- Monitor system health

## Recent Changes (November 19, 2025)

### Complete Implementation
- Implemented full TinyLink URL shortener application from scratch
- Built responsive React frontend with Shadcn UI components
- Created Express backend with REST API
- Implemented in-memory storage with click tracking
- Added comprehensive e2e test coverage

### Features Implemented
1. **Dashboard Page (/)** - Main interface showing all links in a table
2. **Stats Page (/code/:code)** - Individual link analytics
3. **Health Page (/healthz)** - System status monitoring
4. **Redirect (/:code)** - 302 redirects with click tracking
5. **API Endpoints** - Complete REST API for link management

## Technical Architecture

### Frontend
- **React** with TypeScript
- **Wouter** for client-side routing
- **Shadcn UI** components with Tailwind CSS
- **TanStack Query** for data fetching and caching
- **React Hook Form** with Zod validation

### Backend
- **Express.js** server
- **In-memory storage** using Map data structure
- **Validator.js** for URL validation
- **Nanoid** for generating random short codes

### API Endpoints

**POST /api/links**
- Creates new short link
- Returns 201 with created link
- Returns 409 if code already exists
- Returns 400 for validation errors

**GET /api/links**
- Lists all links sorted by creation date

**GET /api/links/:code**
- Returns stats for specific link
- Returns 404 if not found

**DELETE /api/links/:code**
- Deletes a link
- Returns 200 on success
- Returns 404 if not found

**GET /healthz**
- Health check endpoint
- Returns system status, version, and uptime

**GET /:code**
- Redirects to target URL (302)
- Increments click counter
- Updates lastClicked timestamp
- Returns 404 if link not found

### Data Model

```typescript
Link {
  id: string           // UUID
  code: string         // 6-8 alphanumeric characters
  targetUrl: string    // Valid URL with protocol
  clicks: number       // Starts at 0
  lastClicked: Date | null
  createdAt: Date
}
```

### Key Features

1. **Short Code Generation**: Auto-generates 7-character random codes if custom code not provided
2. **URL Validation**: Ensures valid URLs with protocols
3. **Duplicate Prevention**: Returns 409 for existing codes
4. **Click Tracking**: Increments counter and timestamps on each redirect
5. **Search/Filter**: Dashboard table can be filtered by code or URL
6. **Copy to Clipboard**: One-click copy for short URLs and target URLs
7. **Responsive Design**: Mobile-friendly layout with Inter and JetBrains Mono fonts
8. **Real-time Stats**: Shows total links and total clicks across all links
9. **Proper States**: Loading skeletons, empty states, error messages

## Testing

Comprehensive e2e test coverage including:
- Link creation with custom codes
- Redirect functionality (302)
- Click tracking and stats updates
- Deletion and 404 handling
- All API endpoints with proper status codes
- Health check monitoring
- UI interactions (modals, toasts, copy buttons)

All 40 test steps passed successfully.

## Design Guidelines

Following Linear + Vercel Dashboard hybrid design approach:
- Clean typography with Inter (sans) and JetBrains Mono (mono)
- Consistent spacing (2, 4, 6, 8 unit system)
- Professional color scheme with semantic tokens
- Proper interactive states (hover, active, loading)
- Accessible contrast ratios
- Mobile-responsive layout

## Running the Application

```bash
npm run dev
```

Starts Express server on port 5000 with Vite dev server for frontend.

## Project Structure

```
client/
  src/
    pages/
      dashboard.tsx     # Main dashboard with links table
      stats.tsx         # Individual link statistics
      health.tsx        # System health status
    components/
      header.tsx        # Site header with navigation
      ui/               # Shadcn UI components
server/
  storage.ts            # In-memory storage implementation
  routes.ts             # API and redirect routes
shared/
  schema.ts             # Shared TypeScript types and Zod schemas
```

## Future Enhancements

Potential features for next phase:
- PostgreSQL database for persistence
- QR code generation for links
- Link expiration with TTL
- Analytics charts with click trends
- Rate limiting
- Authentication/user accounts

# TinyLink Design Guidelines

## Design Approach
**Selected System**: Linear + Vercel Dashboard hybrid approach
**Justification**: Utility-focused data management tool requiring clean information hierarchy, efficient table interactions, and clear state feedback. Linear's typography precision combined with Vercel's dashboard clarity creates the optimal foundation for a URL management interface.

## Typography System

**Font Family**: 
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for URLs, codes)

**Hierarchy**:
- Page Titles: text-2xl font-semibold
- Section Headers: text-lg font-medium  
- Table Headers: text-sm font-medium uppercase tracking-wide
- Body Text: text-base font-normal
- Labels: text-sm font-medium
- Short Codes/URLs: font-mono text-sm
- Helper Text: text-sm text-gray-500
- Stats Numbers: text-3xl font-bold

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8
- Component padding: p-4, p-6
- Section gaps: gap-6, gap-8
- Margins: m-2, m-4, m-6
- Input padding: px-4 py-2

**Container Strategy**:
- Max width: max-w-7xl mx-auto
- Page padding: px-4 sm:px-6 lg:px-8
- Vertical rhythm: py-6 to py-8 between sections

**Grid System**:
- Dashboard: Single column with full-width table
- Stats page: Two-column layout (lg:grid-cols-2) for metrics cards, single column for detail table

## Component Library

### Navigation Header
- Sticky top header with site branding
- Height: h-16
- Single row layout with logo left, health status indicator right
- Border bottom for separation
- "TinyLink" branding: text-xl font-bold

### Dashboard Table
- Full-width responsive table with horizontal scroll on mobile
- Columns: Short Code (font-mono), Target URL (truncated with ellipsis), Clicks (right-aligned), Last Clicked, Actions
- Row height: py-4
- Zebra striping for readability
- Hover state on rows
- Copy button for URLs and short codes (icon-only, small)
- Delete button in actions column (text destructive style)

### Stats Page Layout
- Header section: Large short code display (font-mono text-4xl) with target URL below
- Metrics grid: 3 columns on desktop (total clicks, created date, last clicked)
- Each metric card: Bordered container with label and large number
- Click history section below (if implementing time-series data)

### Forms (Create Link)
- Inline form on dashboard OR modal overlay
- Two inputs stacked vertically with gap-4:
  - Target URL (type="url", required, full validation)
  - Custom Short Code (optional, pattern validation for [A-Za-z0-9]{6,8})
- Submit button: Primary style, full width on mobile
- Loading state: Disabled button with spinner
- Success: Inline confirmation message with newly created link highlighted
- Error: Inline error below respective field with specific message

### Empty States
- Centered content with icon (from Heroicons)
- Icon size: w-16 h-16
- Message: text-lg
- CTA button below message
- Example: "No links yet. Create your first short link to get started."

### Loading States
- Table skeleton: Shimmer effect on placeholder rows
- Form submission: Button with spinner icon, disabled state
- Page load: Centered spinner with "Loading links..."

### Error States
- Inline field errors: Small text below input, red accent
- 404 page: Centered message "Short link not found" with return home link
- API errors: Toast notification or inline alert component

### Health Status Indicator
- Small badge in header: "System Healthy" with green dot
- On /healthz page: Larger status card with uptime, version, database status

### Action Buttons
- Primary: Solid background, medium size (px-4 py-2)
- Destructive: Red text/border for delete actions
- Icon buttons: Square, icon-only for copy/actions
- All buttons: Rounded corners (rounded-md)

## Icons
**Library**: Heroicons (via CDN)
**Usage**:
- Copy icon for URL/code copy actions
- Trash icon for delete
- External link icon for target URLs
- Chart/stats icon for analytics
- Check circle for success states
- Exclamation for errors
- Cloud/server icon for health status

## Interaction Patterns

**Copy to Clipboard**: Click icon shows brief "Copied!" tooltip/state change

**Delete Confirmation**: Optional inline confirmation or immediate delete with undo toast

**URL Validation**: Real-time feedback as user types, red border for invalid

**Table Interactions**:
- Sortable columns (click header to sort)
- Search/filter input above table with debounced filtering
- Clickable short code links to stats page

**Redirect Behavior**: Not visible in UI - automatic 302 redirect

## Responsive Behavior

**Mobile (< 640px)**:
- Stack table vertically as cards
- Full-width buttons
- Reduce padding to p-4
- Hide less critical columns, show in expanded card view

**Tablet (640px - 1024px)**:
- Maintain table structure with horizontal scroll
- Slightly reduced spacing

**Desktop (> 1024px)**:
- Full multi-column table layout
- Generous spacing (p-6, p-8)
- Two-column stats layout

## Page-Specific Layouts

**Dashboard (/)**: Header → Create form section → Stats summary (total links, total clicks) → Table with search/filter

**Stats (/code/:code)**: Header → Large code display → Metrics grid → Detail information → Back to dashboard link

**Health (/healthz)**: Simple centered status card with system information

## Key Principles
- **Clarity over decoration**: Focus on legible data presentation
- **Immediate feedback**: All actions provide clear state changes
- **Monospace integrity**: Always use monospace for codes/URLs
- **Consistent spacing**: Stick to 2/4/6/8 unit system
- **Accessible contrast**: Ensure text readability without specifying colors
- **Minimal animation**: Only for state transitions (loading spinners, success checks)
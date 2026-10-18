# Programs Page Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Programs Page (UI)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   Programs.tsx (Main Component)      │
        │  - State Management                  │
        │  - Filter Logic                      │
        │  - Modal Handling                    │
        └──────────────────┬───────────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │    useCourses() Hook         │
            │  - Automatic Fetching        │
            │  - Loading State             │
            │  - Error Handling            │
            │  - Retry Logic               │
            └──────────────┬───────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │   courseApi.ts (Data Layer)          │
        │  - API Communication                 │
        │  - Retry Logic                       │
        │  - Caching (5-min TTL)               │
        │  - Data Validation                   │
        │  - Error Handling                    │
        └──────────────┬───────────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────────┐
    │  TypeScript Types (course.ts)            │
    │  - Course Interface                      │
    │  - CourseApiResponse                     │
    │  - Validation Functions                  │
    │  - Transform Functions                   │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────────────┐
    │  API: https://portal.itforyouthghana...  │
    │  GET /api/courses                        │
    │  Returns: { success, data: Course[] }    │
    └──────────────────────────────────────────┘
```

## Component Hierarchy

```
Programs.tsx (Main Page)
├── ProgramsHero (Hero Section)
├── ProgramFilter (Filter Controls)
├── ProgramGrid (Course Display)
│   ├── ProgramCard (Individual Course)
│   │   ├── Image with Status Badge
│   │   ├── Title & Subtitle
│   │   └── Description
│   ├── LoadingSkeleton (While loading)
│   ├── ErrorState (On error)
│   └── EmptyState (No courses)
└── ProgramModal (Detail Modal)
    ├── Course Image
    ├── Course Details
    ├── Skills & Technologies
    ├── Career Outcomes
    └── Action Buttons
        ├── Enroll Now (→ Portal)
        ├── Notify Me (→ Portal)
        └── Sign Up (→ Portal)
```

## Data Structure

### Course Type
```typescript
interface Course {
  id: string                    // Unique identifier
  title: string                 // Course name
  description: string           // Full description
  image: string                 // Course image URL
  duration: string              // e.g., "6 weeks"
  level: string                 // Beginner/Intermediate/Advanced
  category: string              // e.g., "Web Development"
  instructor?: string           // Optional instructor name
  capacity?: number             // Max students
  enrolled?: number             // Current enrollment
  skills?: string[]             // Tech skills covered
  requirements?: string         // Prerequisites
  startDate?: string            // Start date
  highlights?: string[]         // Key highlights
  careerOutcomes?: string[]      // Expected outcomes
}
```

### Program Type (Internal)
```typescript
interface Program {
  title: string
  subtitle: string
  description: string
  duration: string
  participants?: string
  image: string
  skills?: string[]
  requirements: string
  status: 'current' | 'past' | 'future'
  type: string
  nextStart?: string
  completedDate?: string
  careerOutcomes?: string[]
  highlights?: string[]
}
```

## State Management

### Programs.tsx State
```typescript
- activeFilter: 'current' | 'past' | 'future'  // Current tab
- selectedProgram: Program | null               // Modal content
- showModal: boolean                            // Modal visibility
```

### useCourses Hook State
```typescript
- courses: Course[]           // Fetched courses
- loading: boolean           // Fetching status
- error: Error | null        // Error if any
- retry: () => void          // Retry function
```

### ProgramGrid Props
```typescript
- programs: Program[]         // Filtered programs
- activeFilter: 'current' | 'past' | 'future'
- onProgramClick: Function   // Click handler
- loading?: boolean          // Show skeleton
- error?: Error | null       // Show error
- onRetry?: Function        // Retry handler
```

## API Flow Diagram

```
User Opens Programs Page
          │
          ▼
   Programs Component Mount
          │
          ▼
   useCourses Hook Triggered
          │
          ▼
   Check sessionStorage Cache
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
  Valid      Invalid/Empty
  Cache      
    │           │
    │           ▼
    │      Fetch from API
    │           │
    │      ┌────┴────┐
    │      │          │
    │      ▼          ▼
    │    Success    Error
    │      │          │
    │      ▼          ▼
    │   Validate   Retry Logic
    │      │      ┌──┴──┬──┐
    │      ▼      │     │  │
    │   Transform │  1s 2s 4s
    │      │      │     │  │
    │      ▼      └──┬──┴──┘
    │   Cache        │
    │      │         ▼
    └──────┼──────Success
           │
           ▼
    Update UI State
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
  Loading      Courses
   State       Display
    │             │
    │      ┌──────┴──────┐
    │      │             │
    │      ▼             ▼
    │   Transform    Modal Click
    │      │             │
    │      ▼             ▼
    │   Display      Redirect to
    │   Skeleton     Portal
    │      │
    │      ▼
    │   Ready
```

## Error Handling Flow

```
API Call Failed
      │
      ▼
  Catch Error
      │
      ▼
  Set Error State
      │
      ▼
  Show Error UI
      │
      ├─── User clicks "Try Again"
      │
      ▼
  Attempt Retry (1/3)
      │
    ┌─┴─┐
    │   │
    ▼   ▼
  OK  Fail
    │   │
    │   └─── Wait 1 second
    │        │
    │        ▼
    │        Retry (2/3)
    │        │
    │        └─── (exponential backoff)
    │
    ▼
  Success
    │
    ▼
  Update UI
```

## Caching Strategy

```
Session Storage
      │
      ├─── Courses Data
      │    ├─── Cache Key: 'courses_cache'
      │    └─── Content: { data: Course[], timestamp }
      │
      └─── TTL: 5 minutes
           │
           └─── Auto-invalidate if expired
                │
                └─── Fresh API call
```

## Data Transformation Pipeline

```
Raw API Response
      │
      ▼
Validate Structure
      │
    ┌─┴─┐
    │   │
    ▼   ▼
  Valid Invalid
    │     │
    │     └─── Return null
    │          (Filtered out)
    │
    ▼
Transform Each Course
    │
    ├─── Validate required fields
    ├─── Apply defaults
    ├─── Clean data
    └─── Return Course object
           │
           ▼
    Course[] Array
           │
           ▼
    Categorize by Status
           │
    ┌──────┼──────┐
    │      │      │
    ▼      ▼      ▼
  Current Past  Future
    │      │      │
    └──────┴──────┘
           │
           ▼
    Filtered Display
```

## Request Lifecycle

```
1. Request Initiated
   ├─ URL: https://portal.itforyouthghana.org/api/courses
   ├─ Method: GET
   ├─ Headers: Content-Type: application/json
   └─ Timeout: 10 seconds

2. Retry Logic (on failure)
   ├─ Attempt 1: Immediate
   ├─ Attempt 2: Wait 1s, then retry
   ├─ Attempt 3: Wait 2s, then retry
   └─ Attempt 4: Wait 4s, then retry

3. Response Handling
   ├─ Status 200: Parse & Validate
   ├─ Status Error: Throw & Retry
   └─ Timeout: Throw & Retry

4. Cache Management
   ├─ Success: Store in sessionStorage
   ├─ Expiry: 5 minutes
   └─ Clear: Manual or auto-expiry

5. State Update
   ├─ Success: Update courses state
   ├─ Error: Set error state
   └─ Finally: Set loading = false
```

## Performance Characteristics

| Operation | Time | Notes |
|-----------|------|-------|
| Cache Hit | <1ms | Instant from sessionStorage |
| API Call | 1-3s | Network dependent |
| Timeout | 10s | Max wait time |
| Retry 1 | 1s | After first failure |
| Retry 2 | 2s | After second failure |
| Retry 3 | 4s | After third failure |
| Max Total | ~20s | With retries |
| Skeleton Show | 100ms | Animation start |

## Security Flow

```
Request
   │
   ├─ HTTPS Only
   ├─ Content-Type Validation
   ├─ Origin Check (Browser CORS)
   └─ No Auth Required
           │
           ▼
Response
   │
   ├─ Content-Type Check
   ├─ JSON Parse (safe)
   ├─ Structure Validation
   ├─ Field Type Check
   └─ No XSS Vulnerability
           │
           ▼
Storage
   │
   ├─ sessionStorage Only
   ├─ No Sensitive Data
   ├─ Auto-clear on Logout
   └─ Page-level isolation
           │
           ▼
Display
   │
   ├─ React Escaping
   ├─ No innerHTML
   ├─ Safe Rendering
   └─ No Injection Risk
```

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ sessionStorage support
- ✅ AbortSignal.timeout() support
- ✅ ES6+ JavaScript
- ✅ React 18.x

## Accessibility Architecture

```
Screen Reader Support
   │
   ├─ Semantic HTML
   ├─ ARIA Labels
   ├─ Image Alt Text
   └─ Error Messages

Keyboard Navigation
   │
   ├─ Tab Order
   ├─ Focus Management
   ├─ Click Handlers
   └─ Escape Key Support

Color & Contrast
   │
   ├─ WCAG AA Compliant
   ├─ No Color Only Info
   └─ Clear Visual States
```

---

**Architecture Version:** 1.0  
**Last Updated:** 2026-02-14  
**Status:** Production Ready ✅

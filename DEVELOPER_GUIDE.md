# Programs Page Refactoring - Developer Guide

## Quick Start

### File Structure

```
src/
├── types/
│   └── course.ts                 # Course type definitions
├── lib/
│   └── api/
│       └── courseApi.ts          # API data access layer
├── hooks/
│   └── useCourses.ts             # React hook for fetching
└── pages/programs/
    ├── Programs.tsx              # Main page component (UPDATED)
    └── components/
        ├── ProgramGrid.tsx       # Grid display (UPDATED)
        ├── ProgramModal.tsx      # Modal details (UPDATED)
        ├── ProgramFilter.tsx     # Filter buttons
        └── ProgramsHero.tsx      # Hero section
```

## How It Works

### 1. Component Initialization

```tsx
const Programs: React.FC = () => {
  // Hook automatically fetches courses on mount
  const { courses, loading, error, retry } = useCourses()
```

### 2. Data Transformation

```tsx
// API courses are transformed to Program interface
const transformApiCoursesToPrograms = (): {
  current: Program[]
  past: Program[]
  future: Program[]
} => {
  // Maps Course[] to Program[] with categorization
}
```

### 3. Display with States

```tsx
<ProgramGrid
  programs={filteredPrograms}
  loading={loading}        // Shows skeleton
  error={error}            // Shows error state
  onRetry={retry}          // Retry functionality
/>
```

## Key Implementation Details

### useCourses Hook

```tsx
import { useCourses } from '../../hooks/useCourses'

// In your component:
const { courses, loading, error, retry } = useCourses()

// courses: Course[] - Array of fetched courses
// loading: boolean - True while fetching
// error: Error | null - Error object if failed
// retry: () => void - Retry function
```

### fetchCourses Function

```tsx
import { fetchCourses } from '../../lib/api/courseApi'

// Fetch with cache (default)
const courses = await fetchCourses()

// Fetch without cache
const courses = await fetchCourses(false)

// With custom retry count
const courses = await fetchCourses(true, 5)
```

### Type Definitions

```tsx
import { Course, CourseApiResponse } from '../../types/course'

const course: Course = {
  id: 'course-1',
  title: 'Web Development',
  description: 'Learn web dev',
  image: 'https://...',
  duration: '12 weeks',
  level: 'Intermediate',
  category: 'Programming',
  // ... other optional fields
}
```

## API Integration Points

### Main Endpoint

```
GET https://portal.itforyouthghana.org/api/courses
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "image": "string",
      "duration": "string",
      "level": "string",
      "category": "string",
      "instructor": "string?",
      "capacity": "number?",
      "enrolled": "number?",
      "skills": ["string"]?,
      "requirements": "string?",
      "startDate": "string?",
      "highlights": ["string"]?,
      "careerOutcomes": ["string"]?
    }
  ]
}
```

## Customization

### Change API Endpoint

**File:** `src/lib/api/courseApi.ts` (line 5)

```typescript
const COURSE_API_ENDPOINT = 'https://your-api.com/courses'
```

### Adjust Cache Duration

**File:** `src/lib/api/courseApi.ts` (line 7)

```typescript
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (was 5)
```

### Modify Request Timeout

**File:** `src/lib/api/courseApi.ts` (line 72)

```typescript
signal: AbortSignal.timeout(15000) // 15 seconds (was 10)
```

### Change Retry Count

**File:** `src/pages/programs/Programs.tsx` (line 37)

```typescript
const { courses, loading, error, retry } = useCourses(5) // 5 retries
```

## Debugging

### Enable Debug Logs

All logs are prefixed with `[v0]` for easy filtering:

```
[v0] Fetching courses from API...
[v0] Using cached courses
[v0] Successfully fetched 12 courses
[v0] Error fetching courses: Network timeout
[v0] useCourses: Loading courses...
```

### Check Cache Status

**Browser Console:**
```javascript
// View cached data
console.log(sessionStorage.getItem('courses_cache'))

// Clear cache
sessionStorage.removeItem('courses_cache')
```

### Throttle Network (Chrome DevTools)

1. Open DevTools (F12)
2. Go to Network tab
3. Set throttle to "Slow 3G"
4. Observe skeleton loading animation

### Simulate Network Error

Edit `courseApi.ts` temporarily:
```typescript
const COURSE_API_ENDPOINT = 'https://invalid-api.test/courses'
```

This will trigger the error state.

## Common Tasks

### Add Loading Indicator to Button

```tsx
<button disabled={loading}>
  {loading ? 'Loading...' : 'Load Courses'}
</button>
```

### Filter Courses by Level

```tsx
const advancedCourses = courses.filter(c => c.level === 'Advanced')
```

### Search Courses

```tsx
import { searchCourses } from '../../lib/api/courseApi'

const results = await searchCourses('Web Development')
```

### Handle Enrollment Click

```tsx
const handleEnroll = (course: Course) => {
  // Redirect to portal
  window.location.href = `https://portal.itforyouthghana.org?course=${course.id}`
}
```

## Error Handling Patterns

### Try-Catch in Components

```tsx
try {
  const courses = await fetchCourses()
  setCourses(courses)
} catch (error) {
  console.error('[v0] Error:', error)
  setError(error)
}
```

### Hook Error Recovery

```tsx
const { error, retry } = useCourses()

if (error) {
  return (
    <button onClick={retry}>
      Try Again
    </button>
  )
}
```

## Testing Examples

### Test Loading State

```tsx
// Add delay to API
const response = await fetch(url)
await new Promise(r => setTimeout(r, 3000)) // 3 second delay
```

### Test Error State

```tsx
// Simulate fetch error
if (Math.random() > 0.5) {
  throw new Error('Random error for testing')
}
```

### Test Cache

```tsx
// First call hits API
const courses1 = await fetchCourses()

// Second call uses cache
const courses2 = await fetchCourses()

// Clear cache
clearCourseCache()

// Third call hits API again
const courses3 = await fetchCourses()
```

## Performance Tips

1. **Cache Management:** Cache is 5 minutes by default. Adjust based on data freshness needs.

2. **Lazy Loading:** Images use lazy loading by default. No optimization needed.

3. **Pagination:** For 100+ courses, consider adding pagination to API calls.

4. **Filtering:** Apply filtering client-side for <1000 courses, server-side for more.

5. **Search:** Use the `searchCourses()` function for substring search.

## Troubleshooting

### Issue: Courses not loading

**Checklist:**
- [ ] API endpoint is correct and accessible
- [ ] CORS is configured on backend
- [ ] API returns valid JSON matching schema
- [ ] Check network tab in DevTools
- [ ] Check console for [v0] error logs

### Issue: Infinite loading spinner

**Checklist:**
- [ ] API request completed? Check network tab
- [ ] Response status is 200?
- [ ] Response has valid structure?
- [ ] No JavaScript errors? Check console
- [ ] Timeout reached? (10 seconds)

### Issue: Cache not working

**Checklist:**
- [ ] sessionStorage enabled in browser?
- [ ] Check sessionStorage in DevTools
- [ ] Try clearing manually: `sessionStorage.clear()`
- [ ] Check CACHE_DURATION value

### Issue: Type errors

**Checklist:**
- [ ] API response matches Course interface?
- [ ] All required fields present?
- [ ] TypeScript version is up to date?
- [ ] Rebuild: `npm run build`

## Resources

- **Type Definitions:** `src/types/course.ts`
- **API Layer:** `src/lib/api/courseApi.ts`
- **Hook Implementation:** `src/hooks/useCourses.ts`
- **Component Usage:** `src/pages/programs/Programs.tsx`
- **Full Documentation:** `PROGRAMS_REFACTORING.md`

## Contact & Support

For issues or questions:
1. Check debug logs with `[v0]` prefix
2. Review `PROGRAMS_REFACTORING.md` for detailed docs
3. Check TypeScript errors in VS Code
4. Test API endpoint independently

---

**Version:** 1.0  
**Last Updated:** 2026-02-14  
**Status:** Production Ready ✅

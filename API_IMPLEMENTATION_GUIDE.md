# API Improvements Implementation Guide

## Overview

This guide explains the improvements made to handle the API response structure from `https://portal.itforyouthghana.org/api/courses` and provides practical examples for using the new data transformation layer.

---

## Key Changes

### 1. Separated Raw and Transformed Types

**File:** `src/types/course.ts`

```typescript
// Raw API types (what backend sends)
interface RawApiCourse { ... }
interface RawApiResponse { ... }

// Transformed types (what frontend uses)
interface Course { ... }
interface CourseApiResponse { ... }
```

**Why:** Keeps backend concerns separate from frontend UI concerns. Easy to adapt if API changes.

---

### 2. Automatic Data Transformation

**File:** `src/lib/api/courseApi.ts`

Handles nested response structure:
```typescript
const responseData = rawData as RawApiResponse
const courseArray = responseData.data?.data  // ✅ Navigates nested structure
const courses = courseArray.map(transformCourseData)
```

---

### 3. Comprehensive Error Handling

**Features:**
- Validates response structure
- Individual course errors don't crash everything
- Detailed logging for debugging
- Graceful fallbacks for missing data

```typescript
const courses = courseArray
  .map((rawCourse, index) => {
    try {
      return transformCourseData(rawCourse)
    } catch (error) {
      console.warn(`Failed to transform course at index ${index}`)
      return null
    }
  })
  .filter((course): course is Course => course !== null)
```

---

## Using the API Layer

### Basic Usage

```typescript
import { fetchCourses } from '@/lib/api/courseApi'

// In a React component
const { data: courses, loading, error } = useCourses()

// Or directly
const courses = await fetchCourses()
console.log(courses[0].title)  // Automatically transformed
```

### Search Functionality

```typescript
import { searchCourses } from '@/lib/api/courseApi'

// Search across title, description, category, skills
const results = await searchCourses('Data Analytics')

// Example results
results.forEach(course => {
  console.log(course.title)              // "Data Analytics"
  console.log(course.description)        // Plain text, no HTML
  console.log(course.pricing.isFree)    // true/false
})
```

### Filtering

```typescript
import {
  filterCoursesByLevel,
  filterCoursesByCategory
} from '@/lib/api/courseApi'

// Get all beginner courses
const beginnerCourses = await filterCoursesByLevel('beginner')

// Get all courses in a category
const techCourses = await filterCoursesByCategory('Technology')
```

### Cache Management

```typescript
import {
  fetchCourses,
  clearCourseCache,
  getCacheStats
} from '@/lib/api/courseApi'

// Get cache statistics for debugging
const stats = getCacheStats()
if (stats?.isCached) {
  console.log(`Cache age: ${stats.age}s`)
  console.log(`Cached entries: ${stats.entries}`)
}

// Force refresh by clearing cache
clearCourseCache()
const freshCourses = await fetchCourses()
```

---

## Data Transformation Examples

### Example 1: HTML Sanitization

**Raw API Response:**
```json
{
  "description": "<p>Learn <strong>Data Analytics</strong></p>"
}
```

**Transformed Output:**
```typescript
{
  description: "Learn Data Analytics"  // ✅ HTML stripped
}
```

### Example 2: Null Handling

**Raw API Response:**
```json
{
  "durationWeeks": null,
  "category": null,
  "thumbnailUrl": null
}
```

**Transformed Output:**
```typescript
{
  duration: {
    weeks: null,
    displayText: "Self-paced"        // ✅ Default display value
  },
  category: "Uncategorized",         // ✅ Default category
  image: "https://placeholder.com/..." // ✅ Fallback image
}
```

### Example 3: Price Conversion

**Raw API Response:**
```json
{
  "price": "0.00",
  "currency": "GHS"
}
```

**Transformed Output:**
```typescript
{
  pricing: {
    amount: 0,        // ✅ Number type
    currency: "GHS",
    isFree: true      // ✅ Computed from amount
  }
}
```

---

## Error Handling in Practice

### Catching Transformation Errors

```typescript
try {
  const courses = await fetchCourses()
  console.log(`Loaded ${courses.length} courses`)
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to load courses:', error.message)
    // Show user-friendly message
    showErrorNotification('Unable to load courses. Please try again.')
  }
}
```

### With Retry Logic

```typescript
// Already built-in with exponential backoff
const courses = await fetchCourses(
  true,    // useCache
  3        // retries (default)
)

// Logs will show retry attempts if needed
// [v0] Fetch attempt 1/3 failed: Network timeout
// [v0] Retrying in 1000ms...
// [v0] Fetch attempt 2/3 failed: Network timeout
// [v0] Retrying in 2000ms...
// [v0] Successfully transformed 2 courses
```

---

## Using with React Components

### Custom Hook (useCourses)

**File:** `src/hooks/useCourses.ts`

```typescript
const { courses, loading, error, retry } = useCourses()

if (loading) return <LoadingSpinner />
if (error) return <ErrorState onRetry={retry} />
return <CourseGrid courses={courses} />
```

### Manual Fetch in Component

```typescript
import { fetchCourses, searchCourses } from '@/lib/api/courseApi'
import { useState, useEffect } from 'react'

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = query
          ? await searchCourses(query)
          : await fetchCourses()
        setCourses(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [query])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses..."
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span className={course.pricing.isFree ? 'free' : 'paid'}>
              {course.pricing.isFree ? 'Free' : `${course.pricing.currency} ${course.pricing.amount}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Debugging Tips

### Enable Detailed Logging

All transformations log with `[v0]` prefix for easy filtering:

```typescript
// Watch browser console for lines starting with [v0]
// Filter in Chrome DevTools:
// Enter regex: \[v0\]
```

### Common Log Messages

```
[v0] Fetching courses from API: https://portal.itforyouthghana.org/api/courses
[v0] Using cached courses, count: 2
[v0] Raw API response received, validating structure
[v0] Processing 2 courses from API
[v0] Successfully transformed 2 courses
[v0] Using cached courses

[v0] Fetch attempt 1/3 failed: Network timeout
[v0] Retrying in 1000ms...
[v0] All retry attempts exhausted
[v0] Error fetching courses: Failed after retries
```

### Inspect Cache

```typescript
import { getCacheStats } from '@/lib/api/courseApi'

// In console
const stats = getCacheStats()
console.log(stats)
// Output: { isCached: true, age: 45, entries: 2 }
```

---

## Migration from Old Implementation

### Before
```typescript
// Old code using mock data
import { mockCourses } from '@/data/programs'
const courses = mockCourses
```

### After
```typescript
// New code using API
import { useCourses } from '@/hooks/useCourses'
const { courses, loading, error } = useCourses()
```

**No other changes needed!** The transformation layer handles everything.

---

## Handling Edge Cases

### Empty Response
```typescript
const courses = await fetchCourses()
if (courses.length === 0) {
  // Show "No courses available" message
}
```

### Network Failure
```typescript
try {
  const courses = await fetchCourses()
} catch (error) {
  // Automatically tried 3 times with backoff
  // Show error to user
}
```

### Missing Image
```typescript
// Automatically falls back to placeholder
course.image
// Returns placeholder if thumbnailUrl was null
```

### Malformed HTML
```typescript
// HTML sanitization works even with broken HTML
// "<p>Broken<br>" → "Broken"
```

---

## Performance Considerations

### Caching Strategy
- **Duration:** 5 minutes
- **Storage:** Session storage (cleared on page close)
- **Cache Key:** `courses_cache_v2` (versioned for migrations)

### Network Optimization
- **Timeout:** 10 seconds per request
- **Retries:** 3 attempts with exponential backoff (1s, 2s, 4s)
- **Payload:** Only essential fields after transformation

### Rendering Optimization
```typescript
// Already optimized in useCourses hook
// - Memoization of course data
// - Prevents unnecessary re-renders
// - Handles loading/error states efficiently
```

---

## Testing the Implementation

### Test Data Transformation

```typescript
import { transformCourseData } from '@/types/course'

const rawCourse = {
  id: '123',
  title: 'Test Course',
  description: '<p>Test</p>',
  price: '100.00',
  durationWeeks: null,
  category: null,
  // ... other fields
}

const transformed = transformCourseData(rawCourse)

console.assert(transformed.description === 'Test')
console.assert(typeof transformed.pricing.amount === 'number')
console.assert(transformed.category === 'Uncategorized')
```

### Test API Fetch

```typescript
import { fetchCourses } from '@/lib/api/courseApi'

// Clear cache first
sessionStorage.clear()

// Fetch with logging
const courses = await fetchCourses()
console.log('Fetched courses:', courses.length)
```

---

## Future Enhancements

Consider adding:
- Pagination support
- Sorting options
- Advanced filtering
- Favorites/bookmarks
- Course reviews
- Related courses

All can be built on top of the current data layer!

---

## Summary

The improved API implementation provides:
✅ Automatic data transformation
✅ HTML sanitization
✅ Intelligent defaults for null values
✅ Type safety
✅ Error resilience
✅ Caching for performance
✅ Easy search and filtering
✅ Comprehensive logging

Use the examples above to integrate the new API layer into your components and enjoy a cleaner, more maintainable codebase!

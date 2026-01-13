# Timestamp Bug Fix

## Problem
After refreshing the page on the feed, post timestamps were displaying as negative values like `-17996s` instead of relative times like `4m` or `2h`.

## Root Cause
The timestamp inconsistency was caused by two issues:

1. **Inconsistent timestamp formats from backend:**
   - When creating posts: Backend returned `new Date()` (JavaScript Date object → ISO format)
   - When fetching posts: Backend returned SQLite DATETIME string (e.g., `2026-01-13 18:29:18`)

2. **Timezone handling error:**
   - SQLite stores UTC datetime as `YYYY-MM-DD HH:MM:SS`
   - Converting with `new Date(sqliteDatetime)` treated it as local time, then converted back to UTC
   - This created a timezone offset, making post times appear in the future
   - Result: Negative time difference → displayed as `-17996s`

## Solution

### Backend Changes (`backend/src/routes/posts.js`)

1. **Added consistent timezone-aware conversion function:**
```javascript
function toISOString(sqliteDatetime) {
  if (!sqliteDatetime) return new Date().toISOString();
  // SQLite format: "2026-01-13 18:29:18" -> ISO: "2026-01-13T18:29:18.000Z"
  if (typeof sqliteDatetime === 'string' && !sqliteDatetime.includes('T')) {
    // Replace space with T and append .000Z for UTC
    return sqliteDatetime.replace(' ', 'T') + '.000Z';
  }
  return sqliteDatetime;
}
```

2. **Updated all feed endpoints to convert timestamps:**
   - `/feed` endpoint: Converts all post timestamps to ISO format
   - `/:postId` endpoint: Converts post and reply timestamps to ISO format

### Frontend Changes (`frontend/src/components/Post.js`)

1. **Enhanced `getTimeAgo()` function with error handling:**
```javascript
function getTimeAgo(date) {
  // Handle both Date objects and strings
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  // Return "just now" if date is invalid or in the future
  if (isNaN(date.getTime())) {
    return 'just now';
  }
  
  const seconds = Math.floor((new Date() - date) / 1000);
  
  // If negative (future date), return "just now"
  if (seconds < 0) {
    return 'just now';
  }
  // ... rest of calculation
}
```

## Verification

**Before fix:**
```
API Response: "created_at": "2026-01-13 18:44:43"
Frontend calculation: -17996s (displayed)
```

**After fix:**
```
API Response: "created_at": "2026-01-13T18:44:43.000Z"
Frontend calculation: 4m (displayed)
```

## Testing

✅ All 13 backend tests pass
✅ All 18 frontend tests pass
✅ Manual API test confirms correct ISO format timestamps
✅ Relative time calculation verified working correctly

## Files Modified

- `backend/src/routes/posts.js`
  - Added `toISOString()` conversion function
  - Updated `/feed` endpoint to convert all post timestamps
  - Updated `/:postId` endpoint to convert post and reply timestamps

- `frontend/src/components/Post.js`
  - Enhanced `getTimeAgo()` function with error handling for:
    - Invalid dates
    - Negative time differences (future dates)
    - Both string and Date object inputs

## Impact

Users will now see:
- ✅ Correct relative timestamps on page load
- ✅ Correct relative timestamps after page refresh
- ✅ Graceful fallback to "just now" for any edge cases
- ✅ Consistent timestamp format across all API endpoints

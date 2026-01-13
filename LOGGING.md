# Logging Guide

Complete logging system for both backend and frontend applications.

## Backend Logging

### Overview
Backend uses a custom logger utility with timestamps and log levels. All requests are logged automatically, plus important business logic events.

### Log Levels

- **ERROR** 🔴 - Critical errors and failures
- **WARN** 🟡 - Warnings and failed attempts
- **INFO** 🟢 - Important events (login, registration, post creation)
- **DEBUG** 🔵 - Detailed information

### Features

✅ Automatic request logging (method, path, status, duration)
✅ Timestamped log entries
✅ Color-coded console output
✅ Error tracking

### Log Examples

```
[2026-01-13T14:30:45.123Z] [INFO] 🚀 Server running on port 3000
[2026-01-13T14:30:50.456Z] [INFO] → POST /api/auth/register
[2026-01-13T14:30:50.512Z] [INFO] ← ✓ POST /api/auth/register 201 (56ms)
[2026-01-13T14:30:50.512Z] [INFO] ✓ User registered: john_doe
[2026-01-13T14:30:55.000Z] [INFO] → GET /api/posts/feed
[2026-01-13T14:30:55.100Z] [DEBUG] Feed fetched: 15 posts
[2026-01-13T14:30:55.100Z] [INFO] ← ✓ GET /api/posts/feed 200 (100ms)
```

### Logged Events

#### Authentication
- User registration (success/duplicate)
- User login (success/invalid credentials)
- Failed login attempts

#### Posts
- Post creation
- Feed retrieval
- Post validation failures

#### Requests
- All HTTP requests (method, path, status)
- Request duration
- Response status codes

### Using Logger in Backend Code

```javascript
const { logger } = require('./logger');

// Info level
logger.info('User logged in: john_doe');

// Warning level
logger.warn('Failed login attempt for user: jane');

// Error level
logger.error('Database error', error.message);

// Debug level
logger.debug('Feed fetched: 25 posts');
```

---

## Frontend Logging

### Overview
Frontend uses a client-side logger with styled console output. Tracks authentication, API calls, and user interactions.

### Log Levels

Same as backend:
- **ERROR** 🔴 - API errors, network issues
- **WARN** 🟡 - Warnings
- **INFO** 🟢 - Successful operations
- **DEBUG** 🔵 - API requests

### Features

✅ Color-coded console output in browser DevTools
✅ Formatted timestamps
✅ API request/response logging
✅ Authentication tracking

### Log Examples

```
[14:30:50.456] [DEBUG] API Request: POST http://localhost:3000/api/auth/register
[14:30:50.512] [INFO] ✓ POST /api/auth/register 201
[14:30:50.512] [INFO] ✓ Authentication successful for john_doe
[14:30:55.000] [DEBUG] API Request: GET http://localhost:3000/api/posts/feed
[14:30:55.100] [INFO] ✓ GET /api/posts/feed 200
```

### Using Logger in Frontend Code

```javascript
import { logger } from '../services/logger';

// Info level
logger.info('Post created successfully');

// Warning level
logger.warn('Character limit approaching');

// Error level
logger.error('Failed to load feed', error);

// Debug level
logger.debug('API Request: POST /posts');
```

### Viewing Logs

Open browser DevTools:
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Logs appear with color coding

---

## API Logging

### Request Logging

All API requests are automatically logged via axios interceptor:

```
[14:30:50] [DEBUG] API Request: POST /auth/register
[14:30:50] [DEBUG] API Request: POST /posts
[14:30:55] [DEBUG] API Request: GET /posts/feed
```

### Response Logging

Success responses:
```
[14:30:50] [INFO] ✓ POST /auth/register 201
[14:30:50] [INFO] ✓ GET /posts/feed 200
```

Error responses:
```
[14:30:50] [ERROR] ❌ POST /auth/register 400 { error: 'User already exists' }
[14:30:50] [ERROR] Network error Connection refused
```

---

## Debugging with Logs

### Backend Debugging

1. **Check server startup:**
   ```
   [timestamp] [INFO] 🚀 Server running on port 3000
   ```

2. **Track user registration:**
   ```
   [timestamp] [WARN] Registration attempt with missing fields: undefined
   [timestamp] [WARN] Registration failed for username: john - User already exists
   [timestamp] [INFO] ✓ User registered: jane_doe
   ```

3. **Track user login:**
   ```
   [timestamp] [INFO] → POST /api/auth/login
   [timestamp] [INFO] ✓ User logged in: john_doe
   [timestamp] [INFO] ← ✓ POST /api/auth/login 200 (45ms)
   ```

4. **Track post creation:**
   ```
   [timestamp] [INFO] → POST /api/posts
   [timestamp] [WARN] Post too long (300 chars) by user 1
   [timestamp] [INFO] ← ✓ POST /api/posts 400 (20ms)
   ```

### Frontend Debugging

1. **Check authentication:**
   Open DevTools console and look for:
   ```
   [time] [INFO] Attempting login for user: john_doe
   [time] [INFO] ✓ Authentication successful for john_doe
   ```

2. **Track API calls:**
   All API requests appear as:
   ```
   [time] [DEBUG] API Request: POST /auth/login
   [time] [INFO] ✓ POST /auth/login 200
   ```

3. **Find errors:**
   Search console for ERROR or ❌:
   ```
   [time] [ERROR] ❌ POST /posts 400 { error: 'Post content cannot be empty' }
   ```

---

## Log Files

### Backend
Logs output to console. To save to file:

```bash
# Save to file
node src/server.js > server.log 2>&1

# Follow logs in real-time
node src/server.js | tee server.log
```

### Frontend
Logs appear in browser DevTools Console. To export:
1. Right-click console
2. Select "Save as..."
3. Save console output

---

## Performance Monitoring

### Backend Request Duration

Each request logs execution time:
```
[timestamp] [INFO] ← ✓ GET /api/posts/feed 200 (125ms)
                                              ^^^^^^^ Duration
```

### Identifying Slow Requests

Look for requests taking > 500ms:
```
[timestamp] [INFO] ← ✓ GET /api/posts/feed 200 (650ms)  ⚠️ Slow
[timestamp] [INFO] ← ✓ POST /api/posts 201 (100ms)      ✓ Normal
```

---

## Log Patterns

### Success Pattern
```
[time] [INFO] → METHOD /path
[time] [INFO/DEBUG] Operation details
[time] [INFO] ← ✓ METHOD /path 200 (duration)
```

### Error Pattern
```
[time] [INFO] → METHOD /path
[time] [WARN/ERROR] Error details
[time] [INFO] ← ❌ METHOD /path 400/500 (duration)
```

---

## Best Practices

### What to Log
✅ User actions (login, registration)
✅ API requests and responses
✅ Errors and failures
✅ Important business events
✅ Request durations

### What NOT to Log
❌ Passwords (never!)
❌ Full request/response bodies (too verbose)
❌ Every single state change (too noisy)
❌ Sensitive user data (PII)

### Log Levels
- Use INFO for important events
- Use WARN for recoverable errors
- Use ERROR for critical failures
- Use DEBUG for development only

---

## Troubleshooting

### Backend Logs Not Showing

Check:
1. Server is running: `npm start`
2. Terminal is not redirecting output
3. Console output is enabled

### Frontend Logs Not Showing

Check:
1. Open DevTools (F12)
2. Go to Console tab
3. Check if filters are hiding logs
4. Clear console with `console.clear()`

### Missing Logs

If logs disappear:
1. Save console output before closing
2. Check if log rotation is needed
3. Verify logger is initialized

---

## Next Steps

1. Monitor logs while using the application
2. Look for patterns in error logs
3. Use logs to debug issues
4. Track application performance
5. Adjust log levels as needed

---

**Happy Debugging!** 🔍

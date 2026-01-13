# Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React Application (Port 3000)                        │   │
│  │ ├─ App.js (Router)                                   │   │
│  │ ├─ Pages/                                            │   │
│  │ │  ├─ Feed.js (Main feed)                           │   │
│  │ │  └─ UserProfile.js (Profile page)                 │   │
│  │ ├─ Components/                                       │   │
│  │ │  ├─ Login.js (Auth UI)                            │   │
│  │ │  ├─ Post.js (Post display)                        │   │
│  │ │  └─ PostComposer.js (New post form)              │   │
│  │ └─ Services/                                         │   │
│  │    └─ api.js (Axios HTTP client)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │ JSON + JWT Token
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend Server (Node.js/Express)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Port 5000                                            │   │
│  │ ├─ server.js (Express setup)                        │   │
│  │ ├─ middleware/auth.js (JWT verification)            │   │
│  │ └─ routes/                                           │   │
│  │    ├─ auth.js (Register, Login)                    │   │
│  │    ├─ posts.js (CRUD posts, likes, replies)         │   │
│  │    └─ users.js (Profiles)                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                       │                                       │
│                       ▼                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ SQLite Database (microblog.db)                       │   │
│  │ ├─ users                                             │   │
│  │ ├─ posts                                             │   │
│  │ ├─ replies                                           │   │
│  │ └─ likes                                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
1. User Registration:
   Frontend → POST /api/auth/register → Backend
   ├─ Validate input
   ├─ Hash password with bcryptjs
   ├─ Store in database
   ├─ Generate JWT token
   └─ Return token + user info → Frontend stores in localStorage

2. User Login:
   Frontend → POST /api/auth/login → Backend
   ├─ Find user by username
   ├─ Compare password with hash
   ├─ Generate JWT token
   └─ Return token + user info → Frontend stores in localStorage

3. Protected Requests:
   Frontend sends Authorization header with token
   Backend verifies token with middleware
   If valid → process request
   If invalid → return 403 Unauthorized
```

## Data Flow for Post Creation

```
User Input (PostComposer)
      ↓
Validate (length check)
      ↓
POST /api/posts with {content, token}
      ↓
Backend authenticates token (middleware)
      ↓
Validate content length
      ↓
Insert into posts table
      ↓
Return new post
      ↓
Update Feed UI
```

## Data Flow for Like/Unlike

```
User clicks like button
      ↓
Check if already liked (local state)
      ↓
POST /api/posts/{id}/like
      ↓
Backend inserts into likes table
      ↓
Update like count in UI
      ↓
User can unlike → DELETE /api/posts/{id}/like
```

## Data Flow for Reply

```
User clicks Reply button
      ↓
Show reply form
      ↓
User submits reply
      ↓
POST /api/posts/{postId}/reply with {content, token}
      ↓
Backend validates and inserts into replies table
      ↓
Update post view with new reply
```

## User Profile Access

```
Frontend:
User clicks username
      ↓
Navigate to /profile/:userId
      ↓
Fetch user profile data

Backend:
GET /api/users/:userId
      ↓
Join users with their posts
      ↓
Return user info + posts
      ↓
Frontend displays profile and timeline
```

## Constraints Implementation

### No Private Messaging
- No messaging database table
- No messaging API endpoints
- Users can only communicate via post replies (public)

### No Retweets/Reposts
- No retweet table
- No repost API endpoint
- Posts are immutable once created
- Can like or reply, but not amplify

### No Follower Graph
- No followers/following table
- Feed shows all posts (global)
- No personalization or filtering
- Chronological order (most recent first)

## Security Considerations

1. **Password Security**
   - Bcrypt hashing with salt
   - Never store plaintext passwords
   - Minimum complexity recommended for production

2. **Authentication**
   - JWT tokens with 7-day expiration
   - Token stored in localStorage
   - Sent in Authorization header

3. **Input Validation**
   - Post/reply length limits (280 chars)
   - Required fields validation
   - Email format validation

4. **Database Protection**
   - Foreign key constraints
   - Unique constraints on (post_id, user_id) for likes
   - Cascade delete on user removal

## Database Relationships

```
users (1) ──── (n) posts
  │
  ├─── (n) replies
  └─── (n) likes

posts (1) ──── (n) replies
 │
 └─── (n) likes

replies (n) ──── (1) users
replies (n) ──── (1) posts

likes (n) ──── (1) users
likes (n) ──── (1) posts
```

## Performance Considerations

1. **Feed Query**
   - Fetches last 50 posts (pagination)
   - Includes like/reply counts
   - Optimized with JOINs

2. **Post Detail**
   - Single post with all replies
   - Like count aggregated

3. **User Profile**
   - User info with all their posts
   - No pagination (could add for large volumes)

## Future Enhancements

1. **Pagination** - Infinite scroll or pagination for feeds
2. **Search** - Search posts and users
3. **Follower System** - Add followers to enable personalized feeds
4. **Direct Messaging** - Private messaging between users
5. **Media Support** - Images and videos in posts
6. **Hashtags** - Searchable hashtags
7. **Notifications** - Real-time notifications for likes/replies
8. **Edit Posts** - Allow users to edit their posts
9. **Delete** - Soft delete or hard delete options
10. **Caching** - Redis for frequently accessed data

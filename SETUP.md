# MicroBlog - Twitter-like Microblogging Application

A full-stack web application for microblogging with user profiles, posts, replies, and likes.

## Features

✅ **User Management**
- User registration and authentication
- User profiles with bio
- View any user's profile and their posts

✅ **Posts**
- Create short text posts (280 character limit)
- View global chronological feed of all posts
- Post timestamps displayed as relative times (e.g., "2h ago")

✅ **Interactions**
- Like/unlike posts
- Reply to posts (one level deep)
- View reply counts and like counts

✅ **Constraints Implemented**
- ✓ No private messaging
- ✓ No retweets/reposts
- ✓ No follower graph (global feed only)

## Project Structure

```
├── backend/                      # Node.js/Express API server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js          # User registration and login
│   │   │   ├── posts.js         # Posts, likes, replies endpoints
│   │   │   └── users.js         # User profile endpoints
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── db.js                # SQLite database initialization
│   │   └── server.js            # Express server setup
│   └── package.json
│
├── frontend/                     # React web application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Feed.js          # Main feed page
│   │   │   └── UserProfile.js   # User profile page
│   │   ├── components/
│   │   │   ├── Login.js         # Login/register form
│   │   │   ├── Post.js          # Post component with likes/replies
│   │   │   └── PostComposer.js  # Compose new post form
│   │   ├── services/
│   │   │   └── api.js           # API service with axios
│   │   ├── App.js               # Main app with routing
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   └── package.json
│
└── README.md

```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Posts Table
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL (280 char max),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
```

### Replies Table (one level deep)
```sql
CREATE TABLE replies (
  id INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL (280 char max),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(post_id) REFERENCES posts(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
)
```

### Likes Table
```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id),
  FOREIGN KEY(post_id) REFERENCES posts(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
)
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will open on `http://localhost:3000` and automatically connects to the backend.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts/feed` - Get global feed (50 most recent posts)
- `POST /api/posts` - Create new post (requires auth)
- `GET /api/posts/:postId` - Get post with replies
- `POST /api/posts/:postId/like` - Like a post (requires auth)
- `DELETE /api/posts/:postId/like` - Unlike a post (requires auth)
- `POST /api/posts/:postId/reply` - Reply to a post (requires auth)

### Users
- `GET /api/users/:userId` - Get user profile and their posts
- `PUT /api/users/:userId` - Update user bio (requires auth)

## Request/Response Examples

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "bio": "Just a regular user"
}

Response: { token: "jwt_token", user: { id, username, email } }
```

### Create Post
```bash
POST /api/posts
Authorization: Bearer jwt_token
Content-Type: application/json

{ "content": "Hello, this is my first post!" }

Response: { id, user_id, content, created_at }
```

### Reply to Post
```bash
POST /api/posts/1/reply
Authorization: Bearer jwt_token
Content-Type: application/json

{ "content": "Great post!" }

Response: { id, post_id, user_id, content, created_at }
```

## Features Explained

### Authentication
- Passwords are hashed using bcryptjs
- JWT tokens issued on login/register
- Tokens stored in localStorage on frontend
- Token included in Authorization header for protected routes

### Posts
- Limited to 280 characters (Twitter-like)
- Posts are immutable (no editing/deleting)
- Feed shows last 50 posts in reverse chronological order
- Like counts and reply counts displayed with each post

### Replies
- One level deep - can only reply to posts, not to other replies
- Limited to 280 characters per reply
- Replies displayed with post

### User Profiles
- Each user has a username, email, and optional bio
- Profile page shows user's posts
- Users can update their own bio

## Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **In a new terminal, start the frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Open http://localhost:3000 in your browser**

4. **Create an account or login**

5. **Start microblogging!**

## Technology Stack

**Backend:**
- Node.js + Express - Web framework
- SQLite3 - Database
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- CORS - Cross-origin requests

**Frontend:**
- React 18 - UI framework
- React Router v6 - Routing
- Axios - HTTP client
- CSS-in-JS - Styling

## Notes

- The database file is created automatically as `backend/microblog.db`
- Default JWT secret can be changed via `JWT_SECRET` environment variable
- The application uses a chronological global feed (no personalization or follower graph)
- Posts and replies are immutable once created
- No delete functionality implemented (per constraints)

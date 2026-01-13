# 🐦 MicroBlog - Twitter-like Microblogging Application

A full-stack web application for sharing short text updates, interacting with posts, and building a community around microblogs.

## 📋 Overview

MicroBlog is a complete social microblogging application inspired by Twitter. Users can create accounts, post short messages (280 characters), like posts, reply to posts, and view user profiles.

## ✨ Features Implemented

### Core Features ✅
- **User Authentication** - Register and login with secure JWT tokens
- **Create Posts** - Share thoughts in 280 characters or less
- **Global Feed** - View all posts from all users in chronological order
- **Like Posts** - Express appreciation for posts you enjoy
- **Reply to Posts** - Engage in one-level-deep conversations
- **User Profiles** - View any user's profile and their posts
- **Edit Profile** - Update your bio

### Design Principles
- 🌍 **Global Feed** - All users see the same chronological feed
- 🚫 **No Private Messaging** - All communication is public
- 🔄 **No Retweets** - Focus on original content
- 📱 **Responsive UI** - Clean, Twitter-inspired interface
- 🔒 **Secure** - Password hashing and JWT authentication

## 🚀 Quick Start

### Prerequisites
- Node.js v14+ and npm

### Installation
```bash
# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### Running
```bash
# Terminal 1: Backend (port 3000)
cd backend && npm start

# Terminal 2: Frontend (port 3000)
cd frontend && npm start
```

Then open http://localhost:3000 in your browser.

## 📁 Project Structure

```
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # JWT authentication
│   │   ├── db.js              # SQLite database
│   │   └── server.js          # Express setup
│   └── package.json
│
├── frontend/                   # React web app
│   ├── src/
│   │   ├── pages/             # Feed, profiles
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   └── App.js
│   └── package.json
│
├── SETUP.md                    # Detailed documentation
├── QUICKSTART.md               # Quick reference
├── ARCHITECTURE.md             # System design
├── FEATURES.md                 # Feature checklist
└── README.md
```

## 🛠 Technology Stack

**Backend:** Node.js, Express, SQLite3, JWT, bcryptjs
**Frontend:** React 18, React Router, Axios

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[FEATURES.md](FEATURES.md)** - Feature checklist

## 🔌 API Endpoints

```
Authentication:
  POST   /api/auth/register       Register new user
  POST   /api/auth/login          Login

Posts:
  GET    /api/posts/feed          Get global feed
  POST   /api/posts               Create post
  GET    /api/posts/:id           Get post
  POST   /api/posts/:id/like      Like post
  DELETE /api/posts/:id/like      Unlike post
  POST   /api/posts/:id/reply     Reply to post

Users:
  GET    /api/users/:id           Get profile
  PUT    /api/users/:id           Update bio
```

## 💾 Database

Four tables: `users`, `posts`, `replies`, `likes`
- SQLite database with proper foreign keys and constraints
- Automatic schema creation on startup

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected API routes
- Input validation
- Database integrity constraints

## 🎯 User Workflows

1. **Register** → Create account with JWT token
2. **Post** → Write message (280 chars max)
3. **Feed** → Browse all posts chronologically
4. **Interact** → Like and reply to posts
5. **Profiles** → View any user and their posts

## ✅ All Requirements Met

- ✅ User profiles (create, view, update bio)
- ✅ Post short text (280 character limit)
- ✅ View chronological feed
- ✅ Like posts
- ✅ Reply to posts (one level deep)
- ✅ User login/authentication
- ✅ View user profiles and posts
- ✅ No private messaging
- ✅ No retweets/reposts
- ✅ No follower graph (global feed only)

## 🐛 Troubleshooting

```bash
# Backend port in use?
PORT=3001 npm start

# Reset database?
rm backend/microblog.db && npm start

# Frontend can't connect?
Ensure backend runs on port 3000
```

## 📈 Ready for

- Local development and testing
- Deployment to cloud platforms
- Extension with additional features
- Learning MERN stack

---

**Start microblogging now!** 🐦

See [QUICKSTART.md](QUICKSTART.md) to get started immediately.

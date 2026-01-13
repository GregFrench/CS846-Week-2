# Quick Start Guide

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
cd ..
```

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
```
Expected output: `Server running on port 5000`

### Terminal 2: Start Frontend
```bash
cd frontend
npm start
```
Expected output: Browser opens to `http://localhost:3000`

## First Steps

1. **Create an account** - Register with username, email, password, and optional bio
2. **Create a post** - Click in the text area and type a post (max 280 characters)
3. **Browse the feed** - See all posts from all users in chronological order
4. **Interact with posts** - Like posts, click to view replies, or add your own reply
5. **View profiles** - Click on any username to see their profile and posts

## Testing the App

### Test Accounts
Create multiple accounts to test the social features:
- Account 1: john_doe
- Account 2: jane_smith
- Account 3: bob_johnson

### Features to Try
1. Create posts from different accounts
2. Like posts from other users
3. Reply to posts
4. Navigate to user profiles
5. Update your bio by visiting your profile

## Troubleshooting

**Port already in use?**
```bash
# Backend on different port
PORT=3001 npm start
```

**Database issues?**
```bash
# Remove the database and restart
rm backend/microblog.db
npm start
```

**CORS errors?**
- Make sure backend is running on port 5000
- Make sure frontend proxy is set in package.json

## File Structure Quick Reference

```
backend/
  src/
    server.js              # Main server
    db.js                  # Database setup
    routes/auth.js         # Login/register
    routes/posts.js        # Posts & replies
    routes/users.js        # User profiles
    middleware/auth.js     # JWT verification

frontend/
  src/
    App.js                 # Main app
    pages/Feed.js          # Feed page
    pages/UserProfile.js   # User profiles
    components/Login.js    # Auth form
    components/Post.js     # Post display
    components/PostComposer.js  # New post form
```

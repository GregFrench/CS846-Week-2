import React, { useState, useEffect } from 'react';
import { postsService } from '../services/api';
import Post from '../components/Post';
import PostComposer from '../components/PostComposer';

export default function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await postsService.getFeed();
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load feed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div style={styles.container}>
      <PostComposer onPostCreated={handlePostCreated} />
      {error && <div style={styles.error}>{error}</div>}
      {loading ? (
        <div style={styles.loading}>Loading feed...</div>
      ) : posts.length === 0 ? (
        <div style={styles.noPosts}>No posts yet. Be the first to post!</div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            user={user}
            onPostUpdate={fetchFeed}
          />
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    borderLeft: '1px solid #e1e8ed',
    borderRight: '1px solid #e1e8ed',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
  },
  noPosts: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    textAlign: 'center',
  },
};

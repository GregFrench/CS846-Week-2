import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersService, postsService } from '../services/api';

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await usersService.getProfile(userId);
      setProfile(response.data.user);
      setPosts(response.data.posts);
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>{error}</div>;
  if (!profile) return <div style={styles.container}>Profile not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.profileHeader}>
        <h1>{profile.username}</h1>
        {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
        <p style={styles.joinDate}>
          Joined {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      <div style={styles.postsSection}>
        <h2>{posts.length} Posts</h2>
        {posts.length === 0 ? (
          <p style={styles.noPosts}>No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} style={styles.post}>
              <p style={styles.postContent}>{post.content}</p>
              <p style={styles.postTime}>
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  bio: {
    color: '#666',
    marginTop: '10px',
    fontSize: '16px',
  },
  joinDate: {
    color: '#999',
    fontSize: '14px',
    marginTop: '10px',
  },
  postsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  post: {
    borderBottom: '1px solid #e1e8ed',
    padding: '15px',
  },
  postContent: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  postTime: {
    color: '#999',
    fontSize: '12px',
    margin: '0',
  },
  noPosts: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  },
};

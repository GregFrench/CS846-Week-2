import React, { useState } from 'react';
import { postsService } from '../services/api';

const MAX_POST_LENGTH = 280;

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await postsService.createPost(content);
      setContent('');
      onPostCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX_POST_LENGTH - content.length;

  return (
    <div style={styles.composer}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?!"
          maxLength={MAX_POST_LENGTH}
          style={styles.textarea}
        />
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.footer}>
          <span style={{ color: remaining < 20 ? '#c33' : '#666' }}>
            {remaining}
          </span>
          <button
            type="submit"
            disabled={!content.trim() || loading}
            style={styles.button}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  composer: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e1e8ed',
    padding: '15px',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
  },
  button: {
    padding: '8px 24px',
    backgroundColor: '#1DA1F2',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '8px',
    borderRadius: '4px',
    marginTop: '10px',
    fontSize: '14px',
  },
};

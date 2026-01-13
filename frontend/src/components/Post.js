import React, { useState } from 'react';
import { postsService } from '../services/api';

export default function Post({ post, user, onPostUpdate }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      if (!liked) {
        await postsService.likePost(post.id);
        setLiked(true);
        setLikesCount(likesCount + 1);
      } else {
        await postsService.unlikePost(post.id);
        setLiked(false);
        setLikesCount(likesCount - 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      const response = await postsService.replyToPost(post.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
      onPostUpdate?.();
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const createdAt = new Date(post.created_at);
  const timeAgo = getTimeAgo(createdAt);

  return (
    <div style={styles.post}>
      <div style={styles.header}>
        <span style={styles.username}>{post.username}</span>
        <span style={styles.time}>{timeAgo}</span>
      </div>
      <p style={styles.content}>{post.content}</p>
      <div style={styles.stats}>
        <span>{post.replies_count || 0} replies</span>
        <span style={styles.likesCount}>{likesCount} likes</span>
      </div>
      <div style={styles.actions}>
        <button
          onClick={handleLike}
          style={{
            ...styles.actionButton,
            color: liked ? '#c33' : '#666',
          }}
        >
          {liked ? '❤️' : '🤍'} Like
        </button>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          style={styles.actionButton}
        >
          💬 Reply
        </button>
      </div>
      {showReplyForm && (
        <form onSubmit={handleReply} style={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            maxLength={280}
            style={styles.replyInput}
          />
          <div>
            <button
              type="submit"
              disabled={!replyContent.trim() || loading}
              style={styles.replyButton}
            >
              {loading ? 'Replying...' : 'Reply'}
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              style={{ ...styles.replyButton, backgroundColor: '#ccc' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';
  return Math.floor(seconds) + 's';
}

const styles = {
  post: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e1e8ed',
    padding: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  username: {
    fontWeight: 'bold',
    color: '#000',
  },
  time: {
    color: '#666',
    fontSize: '14px',
  },
  content: {
    margin: '8px 0',
    fontSize: '16px',
    lineHeight: '1.5',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    color: '#666',
    fontSize: '14px',
    marginBottom: '10px',
    borderBottom: '1px solid #e1e8ed',
    paddingBottom: '10px',
  },
  likesCount: {
    marginLeft: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '30px',
    justifyContent: 'center',
    color: '#666',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#666',
  },
  replyForm: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  replyInput: {
    width: '100%',
    minHeight: '80px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '10px',
  },
  replyButton: {
    padding: '6px 16px',
    backgroundColor: '#1DA1F2',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px',
  },
};

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Post from '../components/Post';

describe('Post Component', () => {
  const mockPost = {
    id: 1,
    username: 'testuser',
    content: 'This is a test post',
    created_at: new Date().toISOString(),
    likes_count: 5,
    replies_count: 2
  };

  const mockUser = {
    id: 1,
    username: 'currentuser'
  };

  const mockOnPostUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders post content and username', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('This is a test post')).toBeInTheDocument();
  });

  test('displays like and reply counts', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    expect(screen.getByText('2 replies')).toBeInTheDocument();
    expect(screen.getByText('5 likes')).toBeInTheDocument();
  });

  test('has like and reply buttons', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    expect(screen.getByText(/Like/)).toBeInTheDocument();
    expect(screen.getByText(/Reply/)).toBeInTheDocument();
  });

  test('toggles reply form when reply button is clicked', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    const replyButton = screen.getByText(/Reply/);
    fireEvent.click(replyButton);

    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
  });

  test('displays relative time', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    // Should display some time indicator
    expect(screen.getByText(/[0-9]+[smhd]/)).toBeInTheDocument();
  });

  test('reply form has submit button', () => {
    render(
      <Post post={mockPost} user={mockUser} onPostUpdate={mockOnPostUpdate} />
    );

    const replyButton = screen.getByText(/Reply/);
    fireEvent.click(replyButton);

    expect(screen.getByText('Reply')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});

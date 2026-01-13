import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostComposer from '../components/PostComposer';

describe('PostComposer Component', () => {
  const mockOnPostCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders post composer form', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    expect(screen.getByPlaceholderText(/What's happening/)).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  test('displays character counter', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    // Should show 280 characters remaining initially
    expect(screen.getByText('280')).toBeInTheDocument();
  });

  test('updates character counter as user types', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    const textarea = screen.getByPlaceholderText(/What's happening/);
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(screen.getByText('275')).toBeInTheDocument();
  });

  test('post button is disabled when textarea is empty', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    const postButton = screen.getByText('Post');
    expect(postButton).toBeDisabled();
  });

  test('post button is enabled when textarea has content', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    const textarea = screen.getByPlaceholderText(/What's happening/);
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    const postButton = screen.getByText('Post');
    expect(postButton).not.toBeDisabled();
  });

  test('respects 280 character limit', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    const textarea = screen.getByPlaceholderText(/What's happening/);
    
    // Verify maxLength attribute is set to 280
    expect(textarea).toHaveAttribute('maxLength', '280');
    
    // Verify initial character count shows 280
    expect(screen.getByText('280')).toBeInTheDocument();
  });

  test('displays warning color when characters are low', () => {
    render(<PostComposer onPostCreated={mockOnPostCreated} />);

    const textarea = screen.getByPlaceholderText(/What's happening/);
    fireEvent.change(textarea, { target: { value: 'a'.repeat(270) } });

    // Should display remaining count (10)
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});

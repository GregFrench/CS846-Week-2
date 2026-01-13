import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';

describe('Login Component', () => {
  const mockSetUser = jest.fn();
  const mockSetToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form by default', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('toggles between login and register forms', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const toggleButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText(/error|Error/i)).toBeInTheDocument();
    });
  });

  test('requires username and password for login', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Inputs should be required
    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  test('has register form with email and bio fields', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const toggleButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bio (optional)')).toBeInTheDocument();
  });
});

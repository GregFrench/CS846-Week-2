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
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('toggles between login and register forms', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const toggleButton = screen.getByText('Register');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  test('displays error message on failed login', async () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.queryByText(/error|Error/i)).toBeInTheDocument();
    });
  });

  test('requires username and password for login', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeDisabled();
  });

  test('has register form with email and bio fields', () => {
    render(<Login setUser={mockSetUser} setToken={mockSetToken} />);
    
    const toggleButton = screen.getByText('Register');
    fireEvent.click(toggleButton);
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bio (optional)')).toBeInTheDocument();
  });
});

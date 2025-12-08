import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

const TestComponent = () => {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <div>User: {user ? user.username : 'No user'}</div>
      <div>Token: {token || 'No token'}</div>
      <div>Authenticated: {isAuthenticated.toString()}</div>
      <button onClick={() => login('test-token', { username: 'testuser' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('provides initial state correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('User: No user')).toBeInTheDocument();
    expect(screen.getByText('Token: No token')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
  });

  test('handles login correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');

    act(() => {
      loginButton.click();
    });

    expect(screen.getByText('User: testuser')).toBeInTheDocument();
    expect(screen.getByText('Token: test-token')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('user')).toBe('{"username":"testuser"}');
  });

  test('handles logout correctly', () => {
    localStorage.setItem('token', 'existing-token');
    localStorage.setItem('user', '{"username":"existinguser"}');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('User: existinguser')).toBeInTheDocument();

    const logoutButton = screen.getByText('Logout');

    act(() => {
      logoutButton.click();
    });

    expect(screen.getByText('User: No user')).toBeInTheDocument();
    expect(screen.getByText('Token: No token')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('loads existing token from localStorage', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', '{"username":"storeduser"}');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('User: storeduser')).toBeInTheDocument();
    expect(screen.getByText('Token: stored-token')).toBeInTheDocument();
    expect(screen.getByText('Authenticated: true')).toBeInTheDocument();
  });
});


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginForm from '../index';

const mockOnSubmit = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const renderLoginForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <LoginForm
          onSubmit={mockOnSubmit}
          loading={false}
          error={null}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it('renders correctly', () => {
    renderLoginForm();
    expect(screen.getByText('Welcome !')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('handles form submission correctly', () => {
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('displays loading state correctly', () => {
    renderLoginForm({ loading: true });
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Invalid credentials';
    renderLoginForm({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('has link to sign up page', () => {
    renderLoginForm();
    const signUpLink = screen.getByText('Create an account');
    expect(signUpLink).toHaveAttribute('href', '/authentication/signup');
  });
}); 
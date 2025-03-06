import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SignUpForm from '../index';

const mockOnSubmit = jest.fn();

describe('SignUpForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const renderSignUpForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <SignUpForm
          onSubmit={mockOnSubmit}
          loading={false}
          error={null}
          {...props}
        />
      </BrowserRouter>
    );
  };

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });
  };

  it('renders correctly', () => {
    renderSignUpForm();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('handles form submission with valid data', () => {
    renderSignUpForm();
    fillForm();
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
  });

  it('displays validation error for invalid email', () => {
    renderSignUpForm();
    fillForm();
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays validation error for password mismatch', () => {
    renderSignUpForm();
    fillForm();
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'different-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('displays loading state correctly', () => {
    renderSignUpForm({ loading: true });
    expect(screen.getByText('Signing up...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Email already exists';
    renderSignUpForm({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('has link to sign in page', () => {
    renderSignUpForm();
    const signInLink = screen.getByText('Sign in here');
    expect(signInLink).toHaveAttribute('href', '/authentication/login');
  });
}); 
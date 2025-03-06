import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import UserProfileCard from '../index';

describe('UserProfileCard', () => {
  const defaultProps = {
    firstName: 'John',
    email: 'john@example.com',
    onLogout: jest.fn(),
  };

  const renderUserProfileCard = (props = defaultProps) => {
    return render(
      <BrowserRouter>
        <UserProfileCard {...props} />
      </BrowserRouter>
    );
  };

  it('renders user information correctly', () => {
    renderUserProfileCard();

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // Initial
  });

  it('renders skeleton loader when data is not provided', () => {
    renderUserProfileCard({
      firstName: '',
      email: '',
      onLogout: jest.fn(),
    });

    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.queryByText('View Learning Path')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  it('calls onLogout when sign out button is clicked', () => {
    const mockOnLogout = jest.fn();
    renderUserProfileCard({
      ...defaultProps,
      onLogout: mockOnLogout,
    });

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  it('has correct link to learning path', () => {
    renderUserProfileCard();

    const learningPathLink = screen.getByText('View Learning Path');
    expect(learningPathLink).toHaveAttribute('href', '/learning-path');
  });

  it('displays user initial in avatar', () => {
    renderUserProfileCard();

    const initial = screen.getByText('J');
    expect(initial).toBeInTheDocument();
    expect(initial).toHaveClass('text-2xl', 'text-indigo-600');
  });
}); 
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeoutModal from '..';

jest.mock('@headlessui/react', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Transition: {
    Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Child: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
  }
}));

describe('TimeoutModal', () => {
  const defaultProps = {
    isOpen: true,
    onRetake: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true', () => {
    render(<TimeoutModal {...defaultProps} />);
    expect(screen.getByText("Time's Up!")).toBeInTheDocument();
    expect(screen.getByText('Your time for this quiz has expired. Would you like to try again?')).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    render(<TimeoutModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Time's Up!")).not.toBeInTheDocument();
  });

  it('calls onRetake when the retake button is clicked', () => {
    render(<TimeoutModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Retake Quiz'));
    expect(defaultProps.onRetake).toHaveBeenCalled();
  });

  it('renders with the correct styling classes', () => {
    render(<TimeoutModal {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveClass(
      'mt-3',
      'inline-flex',
      'w-full',
      'justify-center',
      'rounded-md',
      'bg-blue-600'
    );
  });
}); 
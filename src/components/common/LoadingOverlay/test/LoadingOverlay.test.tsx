import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingOverlay from '../index';

describe('LoadingOverlay', () => {
  it('renders loading overlay', () => {
    render(<LoadingOverlay />);
    const overlay = screen.getByRole('presentation', { hidden: true });
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('contains a spinner element', () => {
    const { container } = render(<LoadingOverlay />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = screen.getByRole('presentation', { hidden: true });
    const spinner = container.querySelector('.animate-spin');

    expect(overlay).toHaveClass('bg-black', 'bg-opacity-50', 'z-50');
    expect(spinner).toHaveClass('border-blue-600', 'rounded-full');
  });
}); 
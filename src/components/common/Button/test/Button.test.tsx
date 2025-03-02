import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import Button from '../index';

describe('Button Component', () => {
  it('renders with children correctly', () => {
    render(<Button onClick={() => {}}>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button onClick={() => {}} isLoading={true}>Submit</Button>);
    
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('.fa-spinner')).toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    render(<Button onClick={() => {}} disabled={true}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:bg-gray-300');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('applies custom className correctly', () => {
    render(<Button onClick={() => {}} className="custom-test-class">Styled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-test-class');
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).toHaveClass('text-white');
  });

  it('maintains base styling when no custom className is provided', () => {
    render(<Button onClick={() => {}}>Default Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-indigo-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('w-full');
  });

  it('handles disabled click events correctly', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} disabled={true}>Disabled Button</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles loading state click events correctly', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} isLoading={true}>Loading Button</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../index';

describe('ProgressBar', () => {
  it('renders correctly', () => {
    const { container } = render(<ProgressBar progress={50} />);
    expect(container.firstChild).toHaveClass('bg-gray-200', 'rounded-full');
  });

  it('displays correct progress width', () => {
    const { container } = render(<ProgressBar progress={75} />);
    const progressBar = container.querySelector('.bg-blue-600');
    expect(progressBar).toHaveStyle({ width: '75%' });
  });

  it('handles zero progress', () => {
    const { container } = render(<ProgressBar progress={0} />);
    const progressBar = container.querySelector('.bg-blue-600');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('handles full progress', () => {
    const { container } = render(<ProgressBar progress={100} />);
    const progressBar = container.querySelector('.bg-blue-600');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('has correct styling classes', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const progressBar = container.querySelector('.bg-blue-600');
    expect(progressBar).toHaveClass('rounded-full', 'h-2.5');
  });
}); 
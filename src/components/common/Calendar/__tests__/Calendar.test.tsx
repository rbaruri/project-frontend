import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import Calendar from '@/components/common/Calendar/index';

describe('Calendar', () => {
  const mockProps = {
    label: 'Test Date',
    name: 'testDate',
    value: '2024-03-20',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label and input', () => {
    render(<Calendar {...mockProps} />);
    expect(screen.getByLabelText('Test Date')).toBeInTheDocument();
    const input = screen.getByLabelText('Test Date');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('handles onChange events', () => {
    render(<Calendar {...mockProps} />);
    const input = screen.getByLabelText('Test Date');
    fireEvent.change(input, { target: { value: '2024-03-21' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  it('applies disabled state correctly', () => {
    render(<Calendar {...mockProps} disabled={true} />);
    const input = screen.getByLabelText('Test Date');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('uses minDate when provided', () => {
    const minDate = '2024-03-15';
    render(<Calendar {...mockProps} minDate={minDate} />);
    const input = screen.getByLabelText('Test Date');
    expect(input).toHaveAttribute('min', minDate);
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    render(<Calendar {...mockProps} className={customClass} />);
    const input = screen.getByLabelText('Test Date');
    expect(input).toHaveClass(customClass);
  });
}); 
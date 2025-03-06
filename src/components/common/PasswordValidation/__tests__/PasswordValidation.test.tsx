import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordValidation from './index';

describe('PasswordValidation', () => {
  it('renders all validation rules', () => {
    render(<PasswordValidation password="" />);
    
    expect(screen.getByText('At least 8 characters long')).toBeInTheDocument();
    expect(screen.getByText('Contains at least one uppercase letter')).toBeInTheDocument();
    expect(screen.getByText('Contains at least one number')).toBeInTheDocument();
    expect(screen.getByText('Contains at least one special character')).toBeInTheDocument();
  });

  it('shows neutral state when password is empty', () => {
    render(<PasswordValidation password="" />);
    const items = screen.getAllByText('•');
    expect(items).toHaveLength(4);
    items.forEach(item => {
      expect(item.parentElement).toHaveClass('text-gray-500');
    });
  });

  it('validates password length correctly', () => {
    render(<PasswordValidation password="short" />);
    const lengthRule = screen.getByText('At least 8 characters long');
    expect(lengthRule.parentElement).toHaveClass('text-red-600');

    render(<PasswordValidation password="longenough" />);
    const validLengthRule = screen.getByText('At least 8 characters long');
    expect(validLengthRule.parentElement).toHaveClass('text-green-600');
  });

  it('validates uppercase letter correctly', () => {
    render(<PasswordValidation password="lowercase" />);
    const uppercaseRule = screen.getByText('Contains at least one uppercase letter');
    expect(uppercaseRule.parentElement).toHaveClass('text-red-600');

    render(<PasswordValidation password="Uppercase" />);
    const validUppercaseRule = screen.getByText('Contains at least one uppercase letter');
    expect(validUppercaseRule.parentElement).toHaveClass('text-green-600');
  });

  it('validates number correctly', () => {
    render(<PasswordValidation password="noNumbers" />);
    const numberRule = screen.getByText('Contains at least one number');
    expect(numberRule.parentElement).toHaveClass('text-red-600');

    render(<PasswordValidation password="with1number" />);
    const validNumberRule = screen.getByText('Contains at least one number');
    expect(validNumberRule.parentElement).toHaveClass('text-green-600');
  });

  it('validates special character correctly', () => {
    render(<PasswordValidation password="nospecial" />);
    const specialRule = screen.getByText('Contains at least one special character');
    expect(specialRule.parentElement).toHaveClass('text-red-600');

    render(<PasswordValidation password="with@special" />);
    const validSpecialRule = screen.getByText('Contains at least one special character');
    expect(validSpecialRule.parentElement).toHaveClass('text-green-600');
  });

  it('shows correct icons for valid/invalid rules', () => {
    render(<PasswordValidation password="Test@1" />);
    
    // Valid rules
    expect(screen.getAllByText('✓')).toHaveLength(3); // Uppercase, number, special char
    
    // Invalid rules
    expect(screen.getAllByText('×')).toHaveLength(1); // Length
  });
}); 
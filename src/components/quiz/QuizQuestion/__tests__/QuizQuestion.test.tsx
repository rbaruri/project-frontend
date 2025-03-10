import { render, screen, fireEvent } from '@testing-library/react';
import QuizQuestion from '..';
import { QuizQuestion as QuizQuestionType } from '../types';

describe('QuizQuestion', () => {
  const mockQuestion: QuizQuestionType = {
    id: '1',
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correct_option: '4'
  };

  const mockProps = {
    question: mockQuestion,
    questionNumber: 1,
    selectedAnswer: undefined,
    onAnswerSelect: jest.fn()
  };

  it('renders question text and number correctly', () => {
    render(<QuizQuestion {...mockProps} />);
    
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<QuizQuestion {...mockProps} />);
    
    mockQuestion.options.forEach(option => {
      expect(screen.getByLabelText(option)).toBeInTheDocument();
    });
  });

  it('calls onAnswerSelect when an option is selected', () => {
    render(<QuizQuestion {...mockProps} />);
    
    fireEvent.click(screen.getByLabelText('4'));
    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('1', '4');
  });

  it('shows selected answer as checked', () => {
    render(<QuizQuestion {...mockProps} selectedAnswer="4" />);
    
    const radioButton = screen.getByLabelText('4') as HTMLInputElement;
    expect(radioButton.checked).toBe(true);
  });

  it('applies correct styling to selected option', () => {
    render(<QuizQuestion {...mockProps} selectedAnswer="4" />);
    
    const selectedLabel = screen.getByLabelText('4').closest('label');
    expect(selectedLabel).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('applies default styling to unselected options', () => {
    render(<QuizQuestion {...mockProps} selectedAnswer="4" />);
    
    const unselectedLabel = screen.getByLabelText('3').closest('label');
    expect(unselectedLabel).toHaveClass('border-gray-200');
    expect(unselectedLabel).not.toHaveClass('border-blue-500', 'bg-blue-50');
  });
}); 
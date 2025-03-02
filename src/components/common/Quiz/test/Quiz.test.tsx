import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '..';
import { QuizProps } from '../types';

const mockQuiz = [
  {
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4'
  },
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  }
];

const defaultProps: QuizProps = {
  quiz: mockQuiz,
  currentQuestion: 0,
  selectedAnswers: [],
  onAnswerSelect: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  onFinish: jest.fn()
};

describe('Quiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the current question and options', () => {
    render(<Quiz {...defaultProps} />);
    
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    mockQuiz[0].options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('shows selected answer state', () => {
    render(
      <Quiz
        {...defaultProps}
        selectedAnswers={['4']}
      />
    );

    const selectedButton = screen.getByText('4');
    expect(selectedButton).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('calls onAnswerSelect when an option is clicked', () => {
    render(<Quiz {...defaultProps} />);
    
    fireEvent.click(screen.getByText('4'));
    expect(defaultProps.onAnswerSelect).toHaveBeenCalledWith('4');
  });

  it('shows/hides Previous button appropriately', () => {
    const { rerender } = render(<Quiz {...defaultProps} />);
    
    expect(screen.getByText('Previous')).toBeDisabled();

    rerender(<Quiz {...defaultProps} currentQuestion={1} />);
    expect(screen.getByText('Previous')).toBeEnabled();
  });

  it('shows Finish button on last question', () => {
    render(<Quiz {...defaultProps} currentQuestion={1} />);
    
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  it('calls appropriate navigation function when buttons are clicked', () => {
    render(<Quiz {...defaultProps} currentQuestion={1} />);
    
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPrevious).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Finish'));
    expect(defaultProps.onFinish).toHaveBeenCalled();
  });
}); 
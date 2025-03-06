import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from './index';
import { QuizQuestion } from './Quiz.types';

describe('Quiz', () => {
  const mockQuiz: QuizQuestion[] = [
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

  const mockProps = {
    quiz: mockQuiz,
    currentQuestion: 0,
    selectedAnswers: ['4'],
    onAnswerSelect: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onFinish: jest.fn()
  };

  it('renders quiz question and options', () => {
    render(<Quiz {...mockProps} />);
    
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    mockQuiz[0].options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('shows correct progress indicator', () => {
    render(<Quiz {...mockProps} />);
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
  });

  it('handles option selection', () => {
    render(<Quiz {...mockProps} />);
    fireEvent.click(screen.getByText('3'));
    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('3');
  });

  it('shows selected option with correct styling', () => {
    render(<Quiz {...mockProps} />);
    const selectedOption = screen.getByText('4');
    expect(selectedOption.className).toContain('selected');
  });

  it('handles navigation correctly', () => {
    render(<Quiz {...mockProps} currentQuestion={1} selectedAnswers={['4', 'Paris']} />);
    
    const previousButton = screen.getByText('Previous');
    const finishButton = screen.getByText('Finish');
    
    fireEvent.click(previousButton);
    expect(mockProps.onPrevious).toHaveBeenCalled();
    
    fireEvent.click(finishButton);
    expect(mockProps.onFinish).toHaveBeenCalled();
  });

  it('disables navigation when no answer is selected', () => {
    render(<Quiz {...mockProps} selectedAnswers={[]} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('hides previous button on first question', () => {
    render(<Quiz {...mockProps} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });
}); 
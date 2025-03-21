import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizNavigation from '@/components/quiz/QuizNavigation/index';

describe('QuizNavigation', () => {
  const defaultProps = {
    currentQuestionIndex: 1,
    totalQuestions: 3,
    answeredQuestions: 2,
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders progress indicator correctly', () => {
    render(<QuizNavigation {...defaultProps} />);
    expect(screen.getByText('2 of 3 questions answered')).toBeInTheDocument();
  });

  it('disables previous button on first question', () => {
    render(<QuizNavigation {...defaultProps} currentQuestionIndex={0} />);
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
    expect(previousButton).toHaveClass('bg-gray-300', 'cursor-not-allowed');
  });

  it('enables previous button when not on first question', () => {
    render(<QuizNavigation {...defaultProps} />);
    const previousButton = screen.getByText('Previous');
    expect(previousButton).not.toBeDisabled();
    expect(previousButton).toHaveClass('bg-gray-600');
  });

  it('shows next button when not on last question', () => {
    render(<QuizNavigation {...defaultProps} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.queryByText('Submit Quiz')).not.toBeInTheDocument();
  });

  it('shows submit button on last question', () => {
    render(<QuizNavigation {...defaultProps} currentQuestionIndex={2} />);
    expect(screen.getByText('Submit Quiz')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('disables submit button when not all questions are answered', () => {
    render(
      <QuizNavigation
        {...defaultProps}
        currentQuestionIndex={2}
        answeredQuestions={2}
      />
    );
    const submitButton = screen.getByText('Submit Quiz');
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('bg-gray-400', 'cursor-not-allowed');
  });

  it('enables submit button when all questions are answered', () => {
    render(
      <QuizNavigation
        {...defaultProps}
        currentQuestionIndex={2}
        answeredQuestions={3}
      />
    );
    const submitButton = screen.getByText('Submit Quiz');
    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveClass('bg-blue-600');
  });

  it('calls onPrevious when previous button is clicked', () => {
    render(<QuizNavigation {...defaultProps} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPrevious).toHaveBeenCalled();
  });

  it('calls onNext when next button is clicked', () => {
    render(<QuizNavigation {...defaultProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('calls onSubmit when submit button is clicked', () => {
    render(
      <QuizNavigation
        {...defaultProps}
        currentQuestionIndex={2}
        answeredQuestions={3}
      />
    );
    fireEvent.click(screen.getByText('Submit Quiz'));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
}); 
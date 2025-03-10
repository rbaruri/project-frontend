import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuizHeader from '@/components/quiz/QuizHeader/index';

describe('QuizHeader', () => {
  const defaultProps = {
    moduleTitle: 'Test Module',
    timeLeft: 300,
    cutoffScore: 70,
    currentQuestion: 1,
    totalQuestions: 10,
    attempts: 0,
    isSubmitted: false,
    score: 0,
    progress: 10
  };

  it('renders module title correctly', () => {
    render(<QuizHeader {...defaultProps} />);
    expect(screen.getByText('Test Module - Quiz')).toBeInTheDocument();
  });

  it('displays time left correctly', () => {
    render(<QuizHeader {...defaultProps} />);
    expect(screen.getByText('Time Left: 5:00')).toBeInTheDocument();
  });

  it('shows cutoff score and question progress', () => {
    render(<QuizHeader {...defaultProps} />);
    expect(screen.getByText('Cutoff Score: 70%')).toBeInTheDocument();
    expect(screen.getByText('Questions: 1/10')).toBeInTheDocument();
  });

  it('displays attempts count when attempts > 0', () => {
    render(<QuizHeader {...defaultProps} attempts={1} />);
    expect(screen.getByText('Attempts: 2')).toBeInTheDocument();
  });

  it('hides attempts count when attempts = 0', () => {
    render(<QuizHeader {...defaultProps} />);
    expect(screen.queryByText(/Attempts:/)).not.toBeInTheDocument();
  });

  it('shows score when quiz is submitted', () => {
    render(<QuizHeader {...defaultProps} isSubmitted={true} score={80} />);
    expect(screen.getByText('Score: 8/10')).toBeInTheDocument();
    expect(screen.getByText('(80%)')).toBeInTheDocument();
  });

  it('hides score when quiz is not submitted', () => {
    render(<QuizHeader {...defaultProps} />);
    expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    render(<QuizHeader {...defaultProps} progress={60} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({ width: '60%' });
  });

  it('applies correct color to score based on cutoff', () => {
    const { rerender } = render(
      <QuizHeader {...defaultProps} isSubmitted={true} score={80} />
    );
    expect(screen.getByText('Score: 8/10')).toHaveClass('text-green-600');

    rerender(
      <QuizHeader {...defaultProps} isSubmitted={true} score={60} />
    );
    expect(screen.getByText('Score: 6/10')).toHaveClass('text-red-600');
  });
}); 
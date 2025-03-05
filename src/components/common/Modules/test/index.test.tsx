import { render, screen, fireEvent } from '@testing-library/react';
import Module from '@/components/common/Modules/index';
import { Module as ModuleType } from '@/components/common/Modules/types/index';

// Mock the Quiz component
jest.mock('@/components/common/Quiz', () => {
  return function MockQuiz() {
    return <div data-testid="mock-quiz">Quiz Component</div>;
  };
});

describe('Module', () => {
  const mockModule: ModuleType = {
    id: 1,
    title: 'Test Module',
    description: 'Test Description',
    duration: '2 weeks',
    hoursRequired: '10 hours',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'In Progress',
    resources: {
      sources: [
        { name: 'Resource 1', url: 'http://example.com/1' },
        { name: 'Resource 2', url: 'http://example.com/2' }
      ],
      similarQuestions: ['Question 1', 'Question 2']
    },
    quiz: [
      {
        question: 'Test Question',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A'
      }
    ]
  };

  const mockProps = {
    module: mockModule,
    showQuiz: false,
    hasQuiz: true,
    onQuizToggle: jest.fn()
  };

  it('renders module details correctly', () => {
    render(<Module {...mockProps} />);
    
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/2 weeks/)).toBeInTheDocument();
    expect(screen.getByText(/10 hours/)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/)).toBeInTheDocument();
  });

  it('renders resources section correctly', () => {
    render(<Module {...mockProps} />);
    
    expect(screen.getByText('Resource 1')).toBeInTheDocument();
    expect(screen.getByText('Resource 2')).toBeInTheDocument();
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('handles quiz toggle correctly', () => {
    render(<Module {...mockProps} />);
    
    const quizButton = screen.getByText('Take Quiz');
    fireEvent.click(quizButton);
    expect(mockProps.onQuizToggle).toHaveBeenCalled();
  });

  it('shows quiz component when showQuiz is true', () => {
    render(<Module {...mockProps} showQuiz={true} />);
    expect(screen.getByTestId('mock-quiz')).toBeInTheDocument();
  });

  it('disables quiz button when hasQuiz is false', () => {
    render(<Module {...mockProps} hasQuiz={false} />);
    const quizButton = screen.getByText('Take Quiz');
    expect(quizButton).toBeDisabled();
  });

  it('formats dates correctly', () => {
    render(<Module {...mockProps} />);
    expect(screen.getByText(/3\/1\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/3\/15\/2024/)).toBeInTheDocument();
  });
}); 
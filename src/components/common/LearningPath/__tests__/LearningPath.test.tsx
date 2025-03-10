import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import LearningPath from '@/components/common/LearningPath/index';
import { Module } from '@/components/common/LearningPath/types/index';

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Module 1',
    description: 'First module description'
  },
  {
    id: '2',
    title: 'Module 2',
    description: 'Second module description'
  }
];

describe('LearningPath', () => {
  const mockProps = {
    modules: mockModules,
    overallProgress: 50,
    onModuleClick: jest.fn(),
    courseName: 'Test Course'
  };

  it('renders course name and progress', () => {
    render(<LearningPath {...mockProps} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders all modules', () => {
    render(<LearningPath {...mockProps} />);
    expect(screen.getByText('Module 1')).toBeInTheDocument();
    expect(screen.getByText('Module 2')).toBeInTheDocument();
    expect(screen.getByText('First module description')).toBeInTheDocument();
    expect(screen.getByText('Second module description')).toBeInTheDocument();
  });

  it('handles module click', () => {
    render(<LearningPath {...mockProps} />);
    fireEvent.click(screen.getByText('Module 1'));
    expect(mockProps.onModuleClick).toHaveBeenCalledWith(mockModules[0]);
  });

  it('displays module numbers', () => {
    render(<LearningPath {...mockProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows learning journey text', () => {
    render(<LearningPath {...mockProps} />);
    expect(screen.getByText('Your Learning Journey')).toBeInTheDocument();
    expect(screen.getByText('Overall Progress')).toBeInTheDocument();
  });

  it('displays start learning text for each module', () => {
    render(<LearningPath {...mockProps} />);
    const startLearningTexts = screen.getAllByText('Start Learning');
    expect(startLearningTexts).toHaveLength(2);
  });
}); 
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import QuizResults from '..';
// import { QuizQuestion } from '../types';

// describe('QuizResults', () => {
//   const mockQuestions: QuizQuestion[] = [
//     {
//       id: '1',
//       question: 'What is 2 + 2?',
//       options: ['3', '4', '5', '6'],
//       correct_option: '4'
//     },
//     {
//       id: '2',
//       question: 'What is the capital of France?',
//       options: ['London', 'Berlin', 'Paris', 'Madrid'],
//       correct_option: 'Paris'
//     }
//   ];

//   const mockUserAnswers = {
//     '1': '4',
//     '2': 'London'
//   };

//   const mockProps = {
//     questions: mockQuestions,
//     userAnswers: mockUserAnswers,
//     score: 50,
//     cutoffScore: 70,
//     onRetake: jest.fn(),
//     onBackToModule: jest.fn(),
//     onNextModule: jest.fn(),
//     hasNextModule: true,
//     timeExpired: false
//   };

//   it('renders time expired message when timeExpired is true', () => {
//     render(<QuizResults {...mockProps} timeExpired={true} />);
    
//     expect(screen.getByText("Uh Oh! Time's Up!")).toBeInTheDocument();
//     expect(screen.getByText("Don't worry, you can try again. Take your time to review the questions carefully.")).toBeInTheDocument();
    
//     const retakeButton = screen.getByText('Retake Quiz');
//     fireEvent.click(retakeButton);
//     expect(mockProps.onRetake).toHaveBeenCalled();
//   });

//   it('renders quiz results when timeExpired is false', () => {
//     render(<QuizResults {...mockProps} />);
    
//     expect(screen.getByText('Question 1')).toBeInTheDocument();
//     expect(screen.getByText('Question 2')).toBeInTheDocument();
//     expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
//     expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
//   });

//   it('shows correct and incorrect answers', () => {
//     render(<QuizResults {...mockProps} />);
    
//     expect(screen.getByText('✓ Correct!')).toBeInTheDocument();
//     expect(screen.getByText('✗ Incorrect. The correct answer is: Paris')).toBeInTheDocument();
//   });

//   it('displays final score and appropriate message when score is below cutoff', () => {
//     render(<QuizResults {...mockProps} />);
    
//     expect(screen.getByText('Final Score: 1/2 (50%)')).toBeInTheDocument();
//     expect(screen.getByText('You need 70% to pass. Please try again.')).toBeInTheDocument();
    
//     const retakeButton = screen.getByText('Retake Quiz');
//     const backButton = screen.getByText('Back to Course');
    
//     fireEvent.click(retakeButton);
//     expect(mockProps.onRetake).toHaveBeenCalled();
    
//     fireEvent.click(backButton);
//     expect(mockProps.onBackToModule).toHaveBeenCalled();
//   });

//   it('displays success message and next module button when score is above cutoff', () => {
//     render(<QuizResults {...mockProps} score={80} />);
    
//     expect(screen.getByText('Final Score: 1/2 (80%)')).toBeInTheDocument();
//     expect(screen.getByText('Congratulations! You\'ve passed the quiz.')).toBeInTheDocument();
//     expect(screen.getByText('You can now proceed to the next module.')).toBeInTheDocument();
    
//     const nextButton = screen.getByText('Next Module');
//     fireEvent.click(nextButton);
//     expect(mockProps.onNextModule).toHaveBeenCalled();
//   });

//   it('shows complete module button when no next module is available', () => {
//     render(<QuizResults {...mockProps} score={80} hasNextModule={false} />);
    
//     expect(screen.getByText('Complete Module')).toBeInTheDocument();
    
//     const completeButton = screen.getByText('Complete Module');
//     fireEvent.click(completeButton);
//     expect(mockProps.onBackToModule).toHaveBeenCalled();
//   });
// }); 
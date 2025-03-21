import { ButtonClassesProps, ButtonClasses } from '../types';

export const getButtonClasses = ({ isFirstQuestion, canSubmit }: ButtonClassesProps): ButtonClasses => ({
  previousButton: `px-4 py-2 rounded-md ${
    isFirstQuestion
      ? 'bg-gray-300 cursor-not-allowed'
      : 'bg-gray-600 text-white hover:bg-gray-700'
  }`,
  nextButton: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
  submitButton: `px-6 py-2 rounded-md text-white font-medium ${
    canSubmit
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-gray-400 cursor-not-allowed'
  }`
});

export const canSubmitQuiz = (answeredQuestions: number, totalQuestions: number): boolean => {
  return answeredQuestions === totalQuestions;
};

export const isLastQuestion = (currentQuestionIndex: number, totalQuestions: number): boolean => {
  return currentQuestionIndex === totalQuestions - 1;
}; 
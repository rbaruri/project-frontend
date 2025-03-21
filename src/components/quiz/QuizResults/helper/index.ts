import { QuizQuestion, AnswerStatus } from '../types/index';

export const getAnswerStatus = (question: QuizQuestion, userAnswer: string | undefined): AnswerStatus => {
  if (!userAnswer) {
    return { isCorrect: false, className: '' };
  }

  const isCorrect = userAnswer === question.correct_option;
  return {
    isCorrect,
    className: isCorrect 
      ? 'border-green-500 bg-green-50'
      : 'border-red-500 bg-red-50'
  };
};

export const getOptionClassName = (
  isSelected: boolean,
  isCorrectOption: boolean
): string => {
  let optionClassName = "flex items-center p-3 rounded-lg border transition-colors ";
  
  if (isCorrectOption) {
    optionClassName += "border-green-500 bg-green-50";
  } else if (isSelected && !isCorrectOption) {
    optionClassName += "border-red-500 bg-red-50";
  } else {
    optionClassName += "border-gray-200";
  }

  return optionClassName;
};

export const calculateResults = (questions: QuizQuestion[], userAnswers: Record<string, string>) => {
  const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correct_option).length;
  const totalQuestions = questions.length;
  
  return {
    correctAnswers,
    totalQuestions
  };
}; 
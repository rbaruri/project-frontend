import React from 'react';

interface QuestionResultProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correct_option: string;
  };
  userAnswer: string;
  questionNumber: number;
}

const QuestionResult: React.FC<QuestionResultProps> = ({ question, userAnswer, questionNumber }) => {
  const isCorrect = userAnswer === question.correct_option;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start">
          <span className="font-medium text-gray-600 mr-2">Q{questionNumber}.</span>
          <p className="text-gray-800">{question.question}</p>
        </div>

        <div className="ml-6 space-y-2">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                option === question.correct_option
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : option === userAnswer && option !== question.correct_option
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
                {option === question.correct_option && (
                  <span className="ml-2 text-green-600">✓ Correct Answer</span>
                )}
                {option === userAnswer && option !== question.correct_option && (
                  <span className="ml-2 text-red-600">✗ Your Answer</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionResult; 
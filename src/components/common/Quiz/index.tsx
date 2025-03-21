import React from 'react';
import { QuizProps } from './types';
import { OptionButton, NavigationButtons } from './components';

const Quiz: React.FC<QuizProps> = ({
  quiz,
  currentQuestion,
  selectedAnswers,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFinish,
}) => {
  const currentQuestionData = quiz[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestion + 1} of {quiz.length}
        </h2>
        <p className="text-gray-700 mb-6">{currentQuestionData.question}</p>
        <div className="space-y-3">
          {currentQuestionData.options.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              isSelected={selectedAnswers[currentQuestion] === option}
              onSelect={() => onAnswerSelect(option)}
            />
          ))}
        </div>
      </div>

      <NavigationButtons
        currentQuestion={currentQuestion}
        totalQuestions={quiz.length}
        onPrevious={onPrevious}
        onNext={onNext}
        onFinish={onFinish}
      />
    </div>
  );
};

export default Quiz; 
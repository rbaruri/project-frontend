import React from "react";
import "./Quiz.css";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  quiz: QuizQuestion[];
  currentQuestion: number;
  selectedAnswers: string[];
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
}

const Quiz: React.FC<QuizProps> = ({
  quiz,
  currentQuestion,
  selectedAnswers,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFinish,
}) => {
  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {quiz.length}
      </div>

      <div className="question-container">
        <h3>{quiz[currentQuestion].question}</h3>
        <div className="options-container">
          {quiz[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`option-btn ${selectedAnswers[currentQuestion] === option ? "selected" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        {currentQuestion > 0 && (
          <button onClick={onPrevious} className="nav-btn">
            Previous
          </button>
        )}
        <button
          onClick={currentQuestion === quiz.length - 1 ? onFinish : onNext}
          className="nav-btn"
          disabled={!selectedAnswers[currentQuestion]}
        >
          {currentQuestion === quiz.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;

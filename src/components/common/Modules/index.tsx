import React, { useState } from "react";
import Quiz from "@/components/common/Quiz";
import { ModuleProps } from './types';
import { formatDate, hasResources, hasQuizContent } from './helper';

const Module: React.FC<ModuleProps> = ({ module, showQuiz, hasQuiz, onQuizToggle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < (module.quiz?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    // Handle quiz completion here
    console.log('Quiz completed', selectedAnswers);
    onQuizToggle();
  };

  return (
    <div className="module-detail">
      <div className="module-header">
        <h2>{module.title}</h2>
        <div className="module-meta">
          <p><strong>Duration:</strong> {module.duration}</p>
          <p><strong>Hours Required:</strong> {module.hoursRequired}</p>
          <p><strong>Start Date:</strong> {formatDate(module.startDate)}</p>
          <p><strong>End Date:</strong> {formatDate(module.endDate)}</p>
          <p><strong>Status:</strong> {module.status}</p>
        </div>
        <p className="module-description">{module.description}</p>
      </div>

      {hasResources(module) && (
        <div className="module-resources">
          {module.resources && (
            <>
              <div className="sources-section">
                <h3>Learning Resources</h3>
                {module.resources.sources.length > 0 ? (
                  <ul className="sources-list">
                    {module.resources.sources.map((source, index) => (
                      <li key={index}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No learning resources available</p>
                )}
              </div>

              <div className="questions-section">
                <h3>Related Questions</h3>
                {module.resources.similarQuestions.length > 0 ? (
                  <ul className="questions-list">
                    {module.resources.similarQuestions.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No related questions available</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="module-quiz-section">
        <div className="quiz-header">
          <h3>Module Quiz</h3>
          <button onClick={onQuizToggle} className="take-quiz-btn" disabled={!hasQuiz}>
            {showQuiz ? "Hide Quiz" : "Take Quiz"}
          </button>
        </div>

        {showQuiz && hasQuiz && hasQuizContent(module) ? (
          <Quiz
            quiz={module.quiz!}
            currentQuestion={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
          />
        ) : (
          <p className="quiz-prompt">
            {hasQuiz ? "Click 'Take Quiz' to test your knowledge." : "No quiz available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Module; 
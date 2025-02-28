import React from "react";
import Quiz from "@/components/common/Quiz";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  hoursRequired: string;
  startDate: string;
  endDate: string;
  status: string;
  resources?: {
    sources: Array<{ name: string; url: string }>;
    similarQuestions: string[];
  };
  quiz?: QuizQuestion[];
}

interface ModuleProps {
  module: Module;
  showQuiz: boolean;
  hasQuiz: boolean;
  onQuizToggle: () => void;
}

const Module: React.FC<ModuleProps> = ({ module, showQuiz, hasQuiz, onQuizToggle }) => {
  return (
    <div className="module-detail">
      <div className="module-header">
        <h2>{module.title}</h2>
        <div className="module-meta">
          <p><strong>Duration:</strong> {module.duration}</p>
          <p><strong>Hours Required:</strong> {module.hoursRequired}</p>
          <p><strong>Start Date:</strong> {new Date(module.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(module.endDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {module.status}</p>
        </div>
        <p className="module-description">{module.description}</p>
      </div>

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

      <div className="module-quiz-section">
        <div className="quiz-header">
          <h3>Module Quiz</h3>
          <button onClick={onQuizToggle} className="take-quiz-btn" disabled={!hasQuiz}>
            {showQuiz ? "Hide Quiz" : "Take Quiz"}
          </button>
        </div>

        {showQuiz && hasQuiz ? (
          <Quiz quiz={module.quiz!} />
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

import React, { useState } from 'react';
import QuizComponent from '../../components/ui/Quiz';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuizProps {
    quiz: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ quiz }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(quiz.length).fill(''));
    const [showResults, setShowResults] = useState(false);

    const handleAnswerSelect = (answer: string) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answer;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < quiz.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        setShowResults(true);
    };

    if (showResults) {
        const score = selectedAnswers.reduce((acc, answer, index) => 
            answer === quiz[index].correctAnswer ? acc + 1 : acc, 0);
        
        return (
            <div className="quiz-results">
                <h2>Quiz Results</h2>
                <p>Your score: {score} out of {quiz.length}</p>
                <button onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers(new Array(quiz.length).fill(''));
                }}>
                    Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <QuizComponent
            quiz={quiz}
            currentQuestion={currentQuestion}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
        />
    );
};

export default Quiz;

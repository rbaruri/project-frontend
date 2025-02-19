import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Quiz from "./Quiz";
import { fetchQuizRequest } from "./quizActions";

const QuizContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { quiz, loading, error } = useSelector((state: any) => state.quiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchQuizRequest());
  }, [dispatch]);

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleFinish = () => {
    console.log("Quiz Finished!");
    console.log("Selected Answers:", selectedAnswers);
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Quiz
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

export default QuizContainer;

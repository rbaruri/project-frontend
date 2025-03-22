import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectSummaryAnalysis, selectSummaryLoading, selectSummaryError } from '@/containers/SummaryReport/summarySelectors';
import { SummaryDisplay } from '@/components/quiz/SummaryReport';

const QuizSummaryPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const analysis = useSelector((state: RootState) => moduleId ? selectSummaryAnalysis(state, moduleId) : null);
  const isLoading = useSelector((state: RootState) => moduleId ? selectSummaryLoading(state, moduleId) : false);
  const error = useSelector((state: RootState) => moduleId ? selectSummaryError(state, moduleId) : null);

  const handleBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const quizId = searchParams.get('quizId');
    
    if (quizId) {
      navigate(`/quiz/${quizId}?showResults=true`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quiz Summary</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
        >
          Back
        </button>
      </div>

      <SummaryDisplay
        analysis={analysis}
        isLoading={isLoading}
        error={error}
        moduleName={moduleId || ''}
      />
    </div>
  );
};

export default QuizSummaryPage; 
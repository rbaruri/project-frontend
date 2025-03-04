import React from 'react';
import { formatParagraphs, downloadReport } from '../helper';

export interface SummaryDisplayProps {
  analysis: string;
  isLoading: boolean;
  error?: string;
  moduleName?: string;
  score?: number;
  timeTaken?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  analysis,
  isLoading,
  error,
  moduleName,
  score,
  timeTaken,
  totalQuestions,
  correctAnswers
}) => {
  const canDownload = !isLoading && !error && analysis && moduleName && 
    score !== undefined && timeTaken !== undefined &&
    totalQuestions !== undefined && correctAnswers !== undefined;

  const handleDownload = () => {
    if (!canDownload) return;
    
    downloadReport(
      moduleName!,
      score!,
      timeTaken!,
      analysis,
      totalQuestions!,
      correctAnswers!
    );
  };

  if (isLoading) {
    return (
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Generating analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const paragraphs = formatParagraphs(analysis);

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Performance Analysis</span>
          </div>
        </h3>
        {canDownload && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Report</span>
          </button>
        )}
      </div>
      <div className="prose max-w-none">
        {paragraphs.map((paragraph: string, index: number) => (
          <p key={index} className="mb-3 text-gray-600 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}; 
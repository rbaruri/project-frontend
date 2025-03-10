import React from 'react';
import { downloadPDFReport } from '@/components/quiz/SummaryReport/helper/index';
import { StructuredAnalysis } from '@/components/quiz/SummaryReport/types';

export interface SummaryDisplayProps {
  analysis: StructuredAnalysis | null;
  isLoading: boolean;
  error: string | null;
  moduleName: string;
  score?: number;
  timeTaken?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  analysis,
  isLoading,
  error,
  moduleName = 'Unknown Module',

}) => {
  const handleDownload = () => {
    if (!analysis || isLoading || error) return;
    downloadPDFReport(analysis, moduleName);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Performance Analysis</h2>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Download Report
        </button>
      </div>

      {/* Overall Performance */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-blue-600">Overall Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Average Score</p>
            <p className="text-2xl font-bold">{analysis.overallPerformance.averageScore}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Trend</p>
            <p className="font-medium">{analysis.overallPerformance.trend}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Improvement</p>
            <p className="font-medium">{analysis.overallPerformance.improvementRate}</p>
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-green-600">Strengths</h3>
        <div className="bg-green-50 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-2">
            {analysis.strengths.topics.map((topic, index) => (
              <li key={index} className="text-green-700">{topic}</li>
            ))}
          </ul>
          <p className="mt-3 text-green-700">{analysis.strengths.details}</p>
        </div>
      </section>

      {/* Weaknesses */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-red-600">Areas for Improvement</h3>
        <div className="bg-red-50 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-2">
            {analysis.weaknesses.topics.map((topic, index) => (
              <li key={index} className="text-red-700">{topic}</li>
            ))}
          </ul>
          <p className="mt-3 text-red-700">{analysis.weaknesses.details}</p>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-orange-600">Common Mistakes</h3>
        <div className="bg-orange-50 p-4 rounded-lg">
          {analysis.commonMistakes.patterns.map((pattern, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium text-orange-700">Pattern {index + 1}:</p>
              <p className="ml-4 text-orange-600">{pattern}</p>
              {analysis.commonMistakes.recommendations[index] && (
                <p className="ml-4 mt-2 text-orange-700">
                  Recommendation: {analysis.commonMistakes.recommendations[index]}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Time Management */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-purple-600">Time Management</h3>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-purple-600">Average Time</p>
              <p className="text-lg font-bold">{analysis.timeManagement.averageTime} seconds</p>
            </div>
            <div>
              <p className="text-sm text-purple-600">Efficiency</p>
              <p className="text-lg font-medium">{analysis.timeManagement.efficiency}</p>
            </div>
          </div>
          <div>
            <p className="font-medium text-purple-700">Recommendations:</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              {analysis.timeManagement.recommendations.map((rec, index) => (
                <li key={index} className="text-purple-600">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Action Plan */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-teal-600">Action Plan</h3>
        <div className="space-y-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-medium text-teal-700 mb-2">Immediate Actions:</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.immediate.map((rec, index) => (
                <li key={index} className="text-teal-600">{rec}</li>
              ))}
            </ul>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <h4 className="font-medium text-teal-700 mb-2">Long-term Goals:</h4>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.longTerm.map((rec, index) => (
                <li key={index} className="text-teal-600">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}; 
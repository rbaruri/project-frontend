import { useState, useCallback } from 'react';
import { QuizSummaryReport, SummaryAnalysisResponse } from '../types';
import SummaryService from '../service';

interface UseSummaryReturn {
  isLoading: boolean;
  error: string | null;
  analysis: string | null;
  generateAnalysis: (moduleReports: QuizSummaryReport[]) => Promise<void>;
}

const useSummary = (): UseSummaryReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const summaryService = SummaryService.getInstance();

  const generateAnalysis = useCallback(async (moduleReports: QuizSummaryReport[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await summaryService.generateSummary(moduleReports);
      
      if (response.error) {
        setError(response.error);
        setAnalysis(null);
      } else {
        setAnalysis(response.analysis);
        
        // Log the analysis in a formatted way
        console.group('AI Analysis Report');
        console.log(response.analysis);
        console.groupEnd();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    analysis,
    generateAnalysis
  };
};

export default useSummary; 
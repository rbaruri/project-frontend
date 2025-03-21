import { useState, useCallback } from 'react';
import { QuizSummaryReport, StructuredAnalysis } from '@/containers/SummaryReport/summaryConstants';
import SummaryService from '@/containers/SummaryReport/services';

export const useSummary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<StructuredAnalysis | null>(null);

  const generateAnalysis = useCallback(async (moduleReports: QuizSummaryReport[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const summaryService = SummaryService.getInstance();
      const response = await summaryService.generateSummary(moduleReports);
      
      if (response.error) {
        setError(response.error);
        setAnalysis(null);
      } else {
        setAnalysis(response.analysis);
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
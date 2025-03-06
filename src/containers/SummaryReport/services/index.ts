import { QuizSummaryReport, SummaryAnalysisResponse } from '../summaryConstants';

class SummaryService {
  private static instance: SummaryService;
  private readonly BASE_URL = 'http://localhost:5000'; // Backend server URL
  private readonly API_URL = `${this.BASE_URL}/api/summary/analyze`;

  private constructor() {}

  public static getInstance(): SummaryService {
    if (!SummaryService.instance) {
      SummaryService.instance = new SummaryService();
    }
    return SummaryService.instance;
  }

  public async generateSummary(
    moduleReports: QuizSummaryReport[],
    userId?: string,
    moduleId?: string
  ): Promise<SummaryAnalysisResponse> {
    try {
      console.log('Sending request to generate summary:', {
        moduleReports,
        userId,
        moduleId
      });
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleReports }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      console.log('Received summary response:', data);
      return data;
      
    } catch (error) {
      console.error('Error generating summary:', error);
      return {
        analysis: {
          overallPerformance: {
            trend: '',
            averageScore: 0,
            improvementRate: ''
          },
          strengths: {
            topics: [],
            details: ''
          },
          weaknesses: {
            topics: [],
            details: ''
          },
          commonMistakes: {
            patterns: [],
            recommendations: []
          },
          timeManagement: {
            averageTime: 0,
            efficiency: '',
            recommendations: []
          },
          recommendations: {
            immediate: [],
            longTerm: [],
            focusAreas: []
          }
        },
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export default SummaryService; 
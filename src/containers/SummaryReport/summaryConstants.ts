export const GENERATE_SUMMARY = 'summary/GENERATE_SUMMARY';
export const GENERATE_SUMMARY_SUCCESS = 'summary/GENERATE_SUMMARY_SUCCESS';
export const GENERATE_SUMMARY_FAILURE = 'summary/GENERATE_SUMMARY_FAILURE';

export const CLEAR_SUMMARY = 'summary/CLEAR_SUMMARY';

export const FETCH_SUMMARY_REQUEST = 'summary/FETCH_SUMMARY_REQUEST';
export const FETCH_SUMMARY_SUCCESS = 'summary/FETCH_SUMMARY_SUCCESS';
export const FETCH_SUMMARY_FAILURE = 'summary/FETCH_SUMMARY_FAILURE';

export interface QuizAttemptSummary {
  attemptNumber: number;
  score: number;
  timeTaken: number;
  timestamp: string;
  wrongAnswers: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface QuizSummaryReport {
  moduleId: string;
  moduleName: string;
  quizId: string;
  attempts: QuizAttemptSummary[];
}

export interface ModuleQuizReports {
  [moduleId: string]: QuizSummaryReport[];
}

export interface StructuredAnalysis {
  overallPerformance: {
    trend: string;
    averageScore: number;
    improvementRate: string;
  };
  strengths: {
    topics: string[];
    details: string;
  };
  weaknesses: {
    topics: string[];
    details: string;
  };
  commonMistakes: {
    patterns: string[];
    recommendations: string[];
  };
  timeManagement: {
    averageTime: number;
    efficiency: string;
    recommendations: string[];
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
    focusAreas: string[];
  };
}

export interface SummaryAnalysisResponse {
  analysis: StructuredAnalysis;
  error?: string;
}

export interface SummaryState {
  data: SummaryAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

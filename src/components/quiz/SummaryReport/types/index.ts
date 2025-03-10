export interface WrongAnswer {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export interface QuizAttemptSummary {
  attemptNumber: number;
  score: number;
  timeTaken: number;
  timestamp: string;
  wrongAnswers: WrongAnswer[];
}

export interface QuizSummaryReport {
  moduleId: string;
  moduleName: string;
  quizId: string;
  score: number;
  timeTaken: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: string;
  topics?: string[];
  strengths?: string[];
  weaknesses?: string[];
  attempts: QuizAttemptSummary[];
}

export interface ModuleQuizReports {
  [moduleId: string]: QuizSummaryReport[];
}

export interface StructuredAnalysis {
  overallPerformance: {
    averageScore: number;
    trend: string;
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
  recommendations: {
    immediate: string[];
    longTerm: string[];
    focusAreas: string[];
  };
  commonMistakes: {
    patterns: string[];
    details: string;
    recommendations: string[];
  };
  timeManagement: {
    patterns: string[];
    recommendations: string[];
    averageTime: number;
    efficiency: string;
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
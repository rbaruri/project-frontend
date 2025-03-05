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
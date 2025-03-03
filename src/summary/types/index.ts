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

export interface SummaryAnalysisResponse {
  analysis: string;
  error?: string;
} 
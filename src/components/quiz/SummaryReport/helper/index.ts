import { QuizSummaryReport } from '@/summary/types';

export const formatParagraphs = (analysis: string): string[] => {
  if (!analysis) return [];
  return analysis.split('\n').filter(paragraph => paragraph.trim() !== '');
};

export const hasValidReports = (moduleReports: QuizSummaryReport[] | undefined): boolean => {
  if (!moduleReports || !Array.isArray(moduleReports)) return false;
  return moduleReports.length > 0;
};

export const getLatestAttempt = (moduleReports: QuizSummaryReport[]): number => {
  if (!moduleReports.length) return 0;
  return Math.max(...moduleReports.map(report => 
    Math.max(...report.attempts.map(attempt => attempt.attemptNumber))
  ));
};

export const formatElapsedTime = (seconds: number): string => {
  if (seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  
  parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const generateReportContent = (
  moduleName: string,
  score: number,
  timeTaken: number,
  analysis: string,
  totalQuestions: number,
  correctAnswers: number
): string => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  return `
Quiz Performance Report
======================
Generated on: ${currentDate} at ${currentTime}

Module: ${moduleName}
Score: ${correctAnswers}/${totalQuestions} (${score}%)
Time Taken: ${formatElapsedTime(timeTaken)}

Performance Analysis
------------------
${analysis}
`;
};

export const downloadReport = (
  moduleName: string,
  score: number,
  timeTaken: number,
  analysis: string,
  totalQuestions: number,
  correctAnswers: number
): void => {
  const content = generateReportContent(
    moduleName,
    score,
    timeTaken,
    analysis,
    totalQuestions,
    correctAnswers
  );

  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${moduleName.replace(/\s+/g, '_')}_Quiz_Report_${new Date().toISOString().split('T')[0]}.txt`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}; 
import { QuizSummaryReport, StructuredAnalysis } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const downloadPDFReport = (
  analysis: StructuredAnalysis,
  moduleName: string
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Title
  doc.setFontSize(20);
  doc.text('Performance Summary Report', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Module: ${moduleName}`, pageWidth / 2, 25, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' });

  let yPos = 45;

  // Overall Performance Section
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 204);
  doc.text('Overall Performance', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Average Score', `${analysis.overallPerformance.averageScore}%`],
      ['Trend', analysis.overallPerformance.trend],
      ['Improvement Rate', analysis.overallPerformance.improvementRate]
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 204] }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Strengths Section
  doc.setFontSize(14);
  doc.setTextColor(0, 153, 0);
  doc.text('Strengths', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [['Strong Topics']],
    body: analysis.strengths.topics.map(topic => [topic]),
    theme: 'striped',
    headStyles: { fillColor: [0, 153, 0] }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Weaknesses Section
  doc.setFontSize(14);
  doc.setTextColor(204, 0, 0);
  doc.text('Areas for Improvement', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [['Topics to Focus On']],
    body: analysis.weaknesses.topics.map(topic => [topic]),
    theme: 'striped',
    headStyles: { fillColor: [204, 0, 0] }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add new page if needed
  if (yPos > doc.internal.pageSize.height - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Common Mistakes Section
  doc.setFontSize(14);
  doc.setTextColor(204, 102, 0);
  doc.text('Common Mistakes & Recommendations', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [['Pattern', 'Recommendation']],
    body: analysis.commonMistakes.patterns.map((pattern, index) => [
      pattern,
      analysis.commonMistakes.recommendations[index] || ''
    ]),
    theme: 'striped',
    headStyles: { fillColor: [204, 102, 0] }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add new page if needed
  if (yPos > doc.internal.pageSize.height - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Time Management Section
  doc.setFontSize(14);
  doc.setTextColor(102, 0, 204);
  doc.text('Time Management', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Average Time', `${formatElapsedTime(analysis.timeManagement.averageTime)}`],
      ['Efficiency', analysis.timeManagement.efficiency],
      ...analysis.timeManagement.recommendations.map(rec => ['Recommendation', rec])
    ],
    theme: 'striped',
    headStyles: { fillColor: [102, 0, 204] }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Add new page if needed
  if (yPos > doc.internal.pageSize.height - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Action Plan Section
  doc.setFontSize(14);
  doc.setTextColor(0, 102, 102);
  doc.text('Action Plan', 14, yPos);
  doc.setTextColor(0);
  doc.setFontSize(12);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [['Timeline', 'Actions']],
    body: [
      ...analysis.recommendations.immediate.map(rec => ['Immediate', rec]),
      ...analysis.recommendations.longTerm.map(rec => ['Long Term', rec])
    ],
    theme: 'striped',
    headStyles: { fillColor: [0, 102, 102] }
  });

  // Save the PDF
  const fileName = `${moduleName.replace(/\s+/g, '_')}_Performance_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}; 
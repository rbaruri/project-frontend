import {
  GENERATE_MODULE_SUMMARY,
  GENERATE_MODULE_SUMMARY_SUCCESS,
  GENERATE_MODULE_SUMMARY_FAILURE,
  GenerateModuleSummaryAction,
  GenerateModuleSummarySuccessAction,
  GenerateModuleSummaryFailureAction
} from '../types/summary';
import { QuizSummaryReport } from '@/summary/types';

export const generateModuleSummary = (
  moduleId: string,
  moduleReports: QuizSummaryReport[]
): GenerateModuleSummaryAction => ({
  type: GENERATE_MODULE_SUMMARY,
  payload: {
    moduleId,
    moduleReports
  }
});

export const generateModuleSummarySuccess = (
  moduleId: string,
  analysis: string
): GenerateModuleSummarySuccessAction => ({
  type: GENERATE_MODULE_SUMMARY_SUCCESS,
  payload: {
    moduleId,
    analysis
  }
});

export const generateModuleSummaryFailure = (
  moduleId: string,
  error: string
): GenerateModuleSummaryFailureAction => ({
  type: GENERATE_MODULE_SUMMARY_FAILURE,
  payload: {
    moduleId,
    error
  }
}); 
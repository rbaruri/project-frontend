import { RootState } from '@/redux/store';
import { StructuredAnalysis } from '@/summary/types';

export const selectSummaryAnalysis = (state: RootState, moduleId: string): StructuredAnalysis | null =>
  state.summary.analyses[moduleId] || null;

export const selectSummaryLoading = (state: RootState, moduleId: string): boolean =>
  state.summary.loading[moduleId] || false;

export const selectSummaryError = (state: RootState, moduleId: string): string | null =>
  state.summary.errors[moduleId] || null;

import { RootState } from '@/redux/store';

export const selectSummaryLoading = (state: RootState, moduleId: string): boolean =>
  state.summary.loading[moduleId] || false;

export const selectSummaryAnalysis = (state: RootState, moduleId: string): string =>
  state.summary.analyses[moduleId] || '';

export const selectSummaryError = (state: RootState, moduleId: string): string =>
  state.summary.errors[moduleId] || '';

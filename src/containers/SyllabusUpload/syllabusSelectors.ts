import { createSelector } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { SyllabusState, SyllabusUploadResponse } from './types';

interface RootState {
  syllabus: SyllabusState;
}

const selectSyllabusDomain = (state: RootState): SyllabusState =>
  get(state, 'syllabus', { loading: false, error: null, data: null });

export const selectSyllabusLoading = createSelector(
  [selectSyllabusDomain],
  (syllabusState: SyllabusState): boolean => get(syllabusState, 'loading', false)
);

export const selectSyllabusError = createSelector(
  [selectSyllabusDomain],
  (syllabusState: SyllabusState): string | null => get(syllabusState, 'error', null)
);

export const selectSyllabusData = createSelector(
  [selectSyllabusDomain],
  (syllabusState: SyllabusState): SyllabusUploadResponse | null => get(syllabusState, 'data', null)
); 
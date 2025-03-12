import { get } from 'lodash';
import { SyllabusState } from '@/containers/SyllabusUpload/types';

interface RootState {
  syllabus: SyllabusState;
}

export const selectSyllabusState = (state: RootState) => get(state, 'syllabus', {});

export const selectSyllabusLoading = (state: RootState) =>
  get(state, 'syllabus.loading', false);

export const selectSyllabusError = (state: RootState) =>
  get(state, 'syllabus.error', null);

export const selectSyllabusSuccess = (state: RootState) =>
  get(state, 'syllabus.success', false);

export const selectSyllabusData = (state: RootState) =>
  get(state, 'syllabus.data', null);

export const selectUploadProgress = (state: RootState) =>
  get(state, 'syllabus.uploadProgress', 0); 
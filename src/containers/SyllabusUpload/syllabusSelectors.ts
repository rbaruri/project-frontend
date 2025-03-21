import { get } from 'lodash';
import { SyllabusState } from '@/containers/SyllabusUpload/types';

interface RootState {
  syllabus: SyllabusState;
}

export const selectSyllabusState = (state: RootState) => state.syllabus;
export const selectSyllabusStatus = (state: RootState) => selectSyllabusState(state).status;
export const selectSyllabusMessage = (state: RootState) => selectSyllabusState(state).message; 
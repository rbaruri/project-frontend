import { RootState } from "../../redux/store";

export const selectSyllabusState = (state: RootState) => state.syllabus;
export const selectSyllabusStatus = (state: RootState) => selectSyllabusState(state).status;
export const selectSyllabusMessage = (state: RootState) => selectSyllabusState(state).message; 
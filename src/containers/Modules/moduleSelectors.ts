import { RootState } from "@/redux/store";
import { ModuleState } from "@/types/moduleTypes";

export const selectModuleState = (state: RootState): ModuleState => state.modules;

export const selectModules = (state: RootState) => selectModuleState(state).modules;
export const selectModulesLoading = (state: RootState) => selectModuleState(state).loading;
export const selectModulesError = (state: RootState) => selectModuleState(state).error;

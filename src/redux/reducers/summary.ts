import {
  GENERATE_MODULE_SUMMARY,
  GENERATE_MODULE_SUMMARY_SUCCESS,
  GENERATE_MODULE_SUMMARY_FAILURE,
  SummaryActionTypes
} from '../types/summary';

interface SummaryState {
  loading: { [moduleId: string]: boolean };
  analyses: { [moduleId: string]: string };
  errors: { [moduleId: string]: string };
}

const initialState: SummaryState = {
  loading: {},
  analyses: {},
  errors: {}
};

const summaryReducer = (
  state = initialState,
  action: SummaryActionTypes
): SummaryState => {
  switch (action.type) {
    case GENERATE_MODULE_SUMMARY:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.moduleId]: true
        },
        errors: {
          ...state.errors,
          [action.payload.moduleId]: ''
        }
      };

    case GENERATE_MODULE_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.moduleId]: false
        },
        analyses: {
          ...state.analyses,
          [action.payload.moduleId]: action.payload.analysis
        }
      };

    case GENERATE_MODULE_SUMMARY_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.moduleId]: false
        },
        errors: {
          ...state.errors,
          [action.payload.moduleId]: action.payload.error
        }
      };

    default:
      return state;
  }
};

export default summaryReducer; 
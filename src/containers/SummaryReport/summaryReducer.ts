import {
  GENERATE_SUMMARY,
  GENERATE_SUMMARY_SUCCESS,
  GENERATE_SUMMARY_FAILURE,
  CLEAR_SUMMARY
} from './summaryConstants';
import { SummaryActionTypes, UUID } from './summaryActions';
import { StructuredAnalysis } from '@/summary/types';

export interface SummaryState {
  loading: { [moduleId: UUID]: boolean };
  analyses: { [moduleId: UUID]: StructuredAnalysis };
  errors: { [moduleId: UUID]: string };
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
    case GENERATE_SUMMARY:
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

    case GENERATE_SUMMARY_SUCCESS:
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

    case GENERATE_SUMMARY_FAILURE:
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

    case CLEAR_SUMMARY:
      return initialState;

    default:
      return state;
  }
};

export default summaryReducer;

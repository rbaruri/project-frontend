import { takeLatest, call, put, select } from 'redux-saga/effects';
import { get } from 'lodash';
import { 
  FETCH_QUIZ_REQUEST,
  UPDATE_QUIZ_STATUS_REQUEST,
} from './quizConstants';
import {
  fetchQuizSuccess,
  fetchQuizFailure,
  updateQuizStatusSuccess,
  updateQuizStatusFailure,
} from './quizActions';
import { QuizData, UpdateQuizStatusPayload } from '../../types/quizTypes';
import { GET_QUIZ_WITH_QUESTIONS, GET_NEXT_MODULE } from '../../graphql/queries/quiz';
import { UPDATE_QUIZ_STATUS, UPDATE_MODULE_STATUS } from '../../graphql/mutations/quiz';
import { client } from '../../graphql/client';

function* fetchQuizSaga(action: { type: string; payload: string }) {
  try {
    const { data } = yield call(client.query, {
      query: GET_QUIZ_WITH_QUESTIONS,
      variables: { quizId: action.payload },
    });

    // Get next module data
    const quizData = data.quizzes_by_pk;
    const { data: nextModuleData } = yield call(client.query, {
      query: GET_NEXT_MODULE,
      variables: {
        courseId: quizData.module.course_id,
        currentModuleId: quizData.module.id,
      },
    });

    yield put(fetchQuizSuccess({
      ...quizData,
      nextModule: nextModuleData.modules[0] || null,
    }));
  } catch (error: any) {
    const errorMessage = get(error, 'message', 'Failed to fetch quiz');
    yield put(fetchQuizFailure(errorMessage));
  }
}

function* updateQuizStatusSaga(action: { type: string; payload: UpdateQuizStatusPayload }) {
  try {
    const { quizId, status, score } = action.payload;

    // Update quiz status
    yield call(client.mutate, {
      mutation: UPDATE_QUIZ_STATUS,
      variables: {
        quizId,
        status,
        score,
      },
    });

    // If quiz is passed, update module status
    if (status === 'passed') {
      const quizData: QuizData = yield select(state => state.quiz.data);
      if (quizData?.module?.id) {
        yield call(client.mutate, {
          mutation: UPDATE_MODULE_STATUS,
          variables: {
            moduleId: quizData.module.id,
            status: 'completed',
          },
        });
      }
    }

    yield put(updateQuizStatusSuccess());
  } catch (error: any) {
    const errorMessage = get(error, 'message', 'Failed to update quiz status');
    yield put(updateQuizStatusFailure(errorMessage));
  }
}

export function* watchQuizSaga() {
  yield takeLatest(FETCH_QUIZ_REQUEST, fetchQuizSaga);
  yield takeLatest(UPDATE_QUIZ_STATUS_REQUEST, updateQuizStatusSaga);
}

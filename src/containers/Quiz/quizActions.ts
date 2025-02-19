export const FETCH_QUIZ_REQUEST = "FETCH_QUIZ_REQUEST";
export const FETCH_QUIZ_SUCCESS = "FETCH_QUIZ_SUCCESS";
export const FETCH_QUIZ_FAILURE = "FETCH_QUIZ_FAILURE";

export const fetchQuizRequest = () => ({ type: FETCH_QUIZ_REQUEST });
export const fetchQuizSuccess = (quizData: any) => ({ type: FETCH_QUIZ_SUCCESS, payload: quizData });
export const fetchQuizFailure = (error: string) => ({ type: FETCH_QUIZ_FAILURE, payload: error });

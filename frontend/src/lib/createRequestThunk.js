import { startLoading, finishLoading } from "modules/loading";

/**
 * 액션 타입 생성 [요청타입, 성공, 실패]
 * @param {*} type
 */
export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

/**
 * Thunk 생성
 * @param {*} type
 * @param {*} request
 */
export default function createRequestThunk(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return params => async dispatch => {
    dispatch({ type });
    dispatch(startLoading(type));

    try {
      const response = await request(params);
      console.log(response);

      dispatch({
        type: SUCCESS,
        payload: response
      });

      dispatch(finishLoading(type));
    } catch (e) {
      console.error(e);
      dispatch({
        type: FAILURE,
        payload: e,
        error: true
      });
      // dispatch(startLoading(type));
      // throw e;
    }
  };
}

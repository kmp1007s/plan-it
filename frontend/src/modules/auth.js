import { handleActions } from "redux-actions";
import authApi from "lib/api/auth";
import createRequestThunk, {
  createRequestActionTypes
} from "lib/createRequestThunk";

export const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
  "auth/LOGIN"
);
export const [
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
] = createRequestActionTypes("auth/LOGOUT");
export const [
  VALIDATE_TOKEN,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE
] = createRequestActionTypes("auth/VALIDATE_TOKEN");

export const login = createRequestThunk(LOGIN, authApi.login);
export const logout = createRequestThunk(LOGOUT, authApi.logout);
export const validateToken = createRequestThunk(
  VALIDATE_TOKEN,
  authApi.tokenCheck
);

const initialState = {
  login: false,
  userId: null
};

const auth = handleActions(
  {
    [LOGIN_SUCCESS]: (state, action) => ({
      ...state,
      login: true,
      userId: action.payload
    }),
    [LOGOUT_SUCCESS]: (state, action) => ({
      ...state,
      login: false,
      userId: null
    }),
    [VALIDATE_TOKEN_SUCCESS]: (state, action) => ({
      ...state,
      login: true,
      userId: action.payload
    }),
    [VALIDATE_TOKEN_FAILURE]: (state, action) => ({
      ...state,
      login: false,
      userId: null
    })
  },
  initialState
);

export default auth;

import { handleActions } from "redux-actions";
import subscribeLib from "lib/subscribe";
import createRequestThunk, {
  createRequestActionTypes
} from "lib/createRequestThunk";

export const [
  REGISTER_SW,
  REGISTER_SW_SUCCESS,
  REGISTER_SW_FAILURE
] = createRequestActionTypes("subscribe/REGISTER_SW");

export const registerSW = createRequestThunk(
  REGISTER_SW,
  subscribeLib.registerSW
);

const initialState = {
  registration: null
};

const subscribe = handleActions(
  {
    [REGISTER_SW_SUCCESS]: (state, action) => ({
      ...state,
      registration: action.payload
    })
  },
  initialState
);

export default subscribe;

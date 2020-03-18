import { handleActions } from "redux-actions";
import scheduleApi from "lib/api/schedule";
import createRequestThunk, {
  createRequestActionTypes
} from "lib/createRequestThunk";

export const [
  GET_SCHEDULES,
  GET_SCHEDULES_SUCCESS,
  GET_SCHEDULES_FAILURE
] = createRequestActionTypes("schedule/GET_SCHEDULES");

export const [
  CREATE_SCHEDULE,
  CREATE_SCHEDULE_SUCCESS,
  CREATE_SCHEDULE_FAILURE
] = createRequestActionTypes("schedule/CREATE_SCHEDULE");

export const getSchedules = createRequestThunk(
  GET_SCHEDULES,
  scheduleApi.getSchedules
);
export const createSchedule = createRequestThunk(
  CREATE_SCHEDULE,
  scheduleApi.createSchedule
);

const initialState = {
  schedules: []
};

const schedule = handleActions(
  {
    [GET_SCHEDULES_SUCCESS]: (state, action) => ({
      ...state,
      schedules: action.payload
    }),
    [CREATE_SCHEDULE_SUCCESS]: (state, action) => ({
      ...state,
      schedules: state.schedules.concat(action.payload)
    })
  },
  initialState
);

export default schedule;

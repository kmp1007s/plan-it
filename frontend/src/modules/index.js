import { combineReducers } from "redux";
import schedule from "./schedule";
import loading from "./loading";
import auth from "./auth";
import subscribe from "./subscribe";

const rootReducer = combineReducers({
  schedule,
  loading,
  auth,
  subscribe
});

export default rootReducer;

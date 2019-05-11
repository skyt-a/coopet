import { combineReducers } from "redux";
import * as Auth from "./auth";

export type RootState = {
  auth: Auth.State;
};

export const rootReducer = combineReducers({
  auth: Auth.reducer
});

export const actionCreator = {
  auth: Auth.actionCreator
};

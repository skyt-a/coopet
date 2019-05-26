// import { Action } from 'typescript-fsa'; // Note: not from 'redux'
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { appActions } from "../actions";
import { AppError } from "../models/AppError";
import { AppInfo } from "../models/AppInfo";

export interface IAppState {
  errors: AppError[];
  infos: AppInfo[];
  selectedUserInfo: any;
}
const INITIAL_APP_STATE: IAppState = {
  errors: [] as AppError[],
  infos: [] as AppInfo[],
  selectedUserInfo: []
};

export const reducer = reducerWithInitialState(INITIAL_APP_STATE)
  .caseWithAction(appActions.pushErrors, (state, action) => {
    return {
      ...state,
      errors: state.errors.concat(action.payload)
    };
  })
  .case(appActions.clearErrors, state => {
    return {
      ...state,
      errors: []
    };
  })
  .caseWithAction(appActions.pushInfos, (state, action) => {
    return {
      ...state,
      infos: state.infos.concat(action.payload)
    };
  })
  .case(appActions.clearInfos, state => {
    return {
      ...state,
      infos: []
    };
  })
  .case(appActions.initialize, state => {
    return INITIAL_APP_STATE;
  })
  .case(appActions.selectUser, (state: any, action: any) => {
    const nowUserInfo = state.selectedUserInfo;
    const index = nowUserInfo.map((n: any) => n.uid).indexOf(action.uid);
    if (index >= 0) {
      nowUserInfo.splice(index, 1);
    }
    nowUserInfo.push(action);
    console.log("nowUserInfo", index, nowUserInfo);
    return {
      ...state,
      selectedUserInfo: nowUserInfo
    };
  })
  .case(appActions.unselectUser, (state: any, action: any) => {
    const nowUserInfo = state.selectedUserInfo;
    nowUserInfo.pop();
    return {
      ...state,
      selectedUserInfo: nowUserInfo
    };
  });

export default reducer;

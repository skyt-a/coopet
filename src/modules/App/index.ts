// import { Action } from 'typescript-fsa'; // Note: not from 'redux'
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { appActions } from "../../actions";
import { AppError } from "../../models/AppError";
import { AppInfo } from "../../models/AppInfo";

export interface IAppState {
  errors: AppError[];
  infos: AppInfo[];
  selectedUserInfo: any;
}
const INITIAL_APP_STATE: IAppState = {
  errors: [] as AppError[],
  infos: [] as AppInfo[],
  selectedUserInfo: null
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
    return {
      ...state,
      selectedUserInfo: action
    };
  })
  .case(appActions.unselectUser, (state: any, action: any) => {
    return {
      ...state,
      selectedUserInfo: null
    };
  });

export default reducer;

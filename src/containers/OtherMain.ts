import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import OtherMain from "../components/OtherMain";
import { authActions, appActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    },
    onUnSelectUser: () => {
      dispatch(appActions.unselectUser());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OtherMain);

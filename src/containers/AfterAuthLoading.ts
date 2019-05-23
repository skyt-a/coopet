import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import AfterAuthLoading from "../components/AfterAuthLoading";
import { authActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AfterAuthLoading);

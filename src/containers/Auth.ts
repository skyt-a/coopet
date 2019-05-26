import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import Auth from "../components/Auth";
import { authActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onAuth: (signing: any) => {
      dispatch(authActions.signIn.started(signing));
    },
    onSignUp: (signing: any) => {
      dispatch(authActions.signUp.started(signing));
    },
    // onUpdateUser: (user: any) => {
    //   dispatch(actionCreator.auth.updateUser(user));
    // },
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    },
    onLogout: () => {
      dispatch(authActions.signOut.started());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

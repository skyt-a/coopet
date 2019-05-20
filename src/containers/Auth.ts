import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import Auth from "../components/Auth";
import { authActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onAuth: (signing: any) => {
      dispatch(authActions.signIn.started(signing));
    },
    // onUpdateUser: (user: any) => {
    //   dispatch(actionCreator.auth.updateUser(user));
    // },
    onLogout: () => {
      dispatch(authActions.signOut.started());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

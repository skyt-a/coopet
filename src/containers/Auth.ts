import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { actionCreator, RootState } from "../modules";
import Login from "../components/Login";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onLogin: (user: any) => {
      console.log(user);
      dispatch(actionCreator.auth.login({ user }));
    },
    onLogout: () => {
      dispatch(actionCreator.auth.logout());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

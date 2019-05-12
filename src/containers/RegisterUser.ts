import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { actionCreator, RootState } from "../modules";
import RegisterUser from "../components/RegisterUser";

const mapStateToProps = () => (state: RootState) => {
  return {
    registerUser: state.registerUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onRegisterUser: (registerInfo: any) => {
      dispatch(
        actionCreator.registerUser.confirmRegister({
          userName: registerInfo.userName,
          petName: registerInfo.petName
        })
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterUser);

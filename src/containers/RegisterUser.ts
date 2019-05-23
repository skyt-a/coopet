import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import RegisterUser from "../components/RegisterUser";
import { authActions } from "../actions/index";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth,
    registerUser: state.ResgisterUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onRegisterUser: (registerInfo: any) => {
      dispatch(
        authActions.updateUserInfo.started({
          userName: registerInfo.userName,
          petName: registerInfo.petName,
          photoURL: registerInfo.photoURL,
          petSpecies: registerInfo.petSpecies,
          uploadedImage: registerInfo.uploadedImage,
          follow: registerInfo.follow,
          follower: registerInfo.follower
        })
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterUser);

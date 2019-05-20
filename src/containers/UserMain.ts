import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import UserMain from "../components/UserMain";
import { authActions, uploadActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onLogout: () => {
      dispatch(authActions.signOut.started());
    },
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    },
    onUploadImage: (param: any) => {
      dispatch(uploadActions.uploadImage.started(param));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserMain);

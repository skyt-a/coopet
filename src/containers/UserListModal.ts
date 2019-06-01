import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import UserListModal from "../components/UserListModal";
import { authActions, uploadActions, appActions } from "../actions";

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
    onUploadImage: (param: any) => {
      dispatch(uploadActions.uploadImage.started(param));
    },
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListModal);

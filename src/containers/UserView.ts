import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import UserView from "../components/UserView";
import { authActions, uploadActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  console.log(state);
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserView);

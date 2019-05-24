import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import ImageView from "../components/ImageView";
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
    },
    onCommentImage: (param: any) => {
      dispatch(uploadActions.commentImage.started(param));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageView);

import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import CommentInput from "../components/CommentInput";
import { appActions, uploadActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    },
    onCommentImage: (param: any) => {
      dispatch(uploadActions.commentImage.started(param));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentInput);

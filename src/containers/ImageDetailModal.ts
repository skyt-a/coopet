import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import ImageDetailModal from "../components/ImageDetailModal";
import { uploadActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onLikeImage: (param: any) => {
      dispatch(uploadActions.likeImage.started(param));
    },
    onDislikeImage: (param: any) => {
      dispatch(uploadActions.dislikeImage.started(param));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageDetailModal);

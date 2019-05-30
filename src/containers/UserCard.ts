import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import UserCard from "../components/UserCard";
import { appActions } from "../actions";

const mapStateToProps = () => (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCard);

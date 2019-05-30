import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import Navbar from "../components/Navbar";

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);

import React, { Component } from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions } from "../actions";

import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import Loading from "../components/Loading";
import User from "../utils/User";

interface Props extends RouteComponentProps {
  onStoreUserInfo: (p: any) => void;
}

let userInfo: any;
export class AfterAuthLoading extends Component<Props> {
  constructor(props: Props) {
    super(props);
    userInfo = this.getFirebaseCurrentUser();
  }

  componentDidMount = () => {
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    User.isInitAuthedRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        this.props.history.push("/registerUser");
        return;
      }
      this.props.onStoreUserInfo(snap.val());
      this.props.history.push("/userMain");
    });
  };

  getFirebaseCurrentUser = () => {
    return firebase.auth().currentUser;
  };

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    User.isInitAuthedRef(userInfo.uid).off();
  }

  render() {
    return <Loading />;
  }
}

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AfterAuthLoading));

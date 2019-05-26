import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import Loading from "./Loading";
import User from "../utils/User";

interface Props extends RouteComponentProps {
  onStoreUserInfo: (p: any) => void;
}

interface State {}

let userInfo: any;
class AfterAuthLoading extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    userInfo = firebase.auth().currentUser;
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

export default withRouter(AfterAuthLoading);

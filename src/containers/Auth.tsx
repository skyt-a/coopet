import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions } from "../actions";

import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
// ランディングページのTop画像
import {
  Button,
  ListItem,
  List,
  TextField,
  Card,
  Typography
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import IconUtil from "../utils/IconUtil";
import classNames from "classnames";
import Loading from "../components/Loading";
import dog from "../assets/images/dog.svg";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    button: {
      margin: theme.spacing.unit
    },
    card: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit
    },
    listItemInner: {
      margin: "auto"
    },
    progress: {
      margin: "auto"
    },
    progressWrapper: {
      textAlign: "center"
    },
    dog: {
      height: "80px",
      position: "absolute",
      right: "10px"
    },
    type: {
      fontSize: "1.1rem"
    }
  });
interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  auth: any;
  onAuth: (signing: any) => void;
  onSignUp: (signing: any) => void;
  onUpdateUser: (user: any) => void;
  onStoreUserInfo: (p: any) => void;
}
interface State {
  email: string;
  password: string;
  loading: boolean;
}
const providers: {
  providerName: string;
  color: string;
}[] = [
  { providerName: "Google", color: "#4285F4" },
  { providerName: "Facebook", color: "#3B5998" },
  { providerName: "Twitter", color: "#1DA1F2" }
];
const testUserMail = "testtestcoopet@gmail.com";
const testUserPassword = "testtestcoopet";
export class Auth extends Component<Props, State> {
  unsubscribe: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: false
    };
  }

  componentDidMount = () => {
    this.setState({
      loading: true
    });
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      // this.props.onUpdateUser(user);
      if (user != null) {
        this.props.history.push("/afterAuth");
      }
      this.setState({
        loading: false
      });
    });
  };

  componentWillUnmount() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  authByProvider = (providerName: string) => {
    const signing = {
      email: this.state.email,
      password: this.state.password,
      authProvider: providerName
    };
    if (providerName === "Password") {
      this.props.onSignUp(signing);
    }
    this.props.onAuth(signing);
  };

  authByTestUser = () => {
    const signing = {
      email: testUserMail,
      password: testUserPassword,
      authProvider: "Password"
    };
    this.props.onAuth(signing);
  };

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Fragment>
        <List>
          <Card className={classes.card} color="secondary">
            <Typography className={classes.type}>
              メールアドレスでログイン
            </Typography>
            <ListItem>
              <TextField
                label="メールアドレス"
                className={classNames(classes.button, classes.listItemInner)}
                value={this.state.email}
                onChange={this.handleChange("email")}
                margin="dense"
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <TextField
                label="パスワード"
                className={classNames(classes.button, classes.listItemInner)}
                value={this.state.password}
                onChange={this.handleChange("password")}
                type="password"
                margin="dense"
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <Button
                className={classNames(classes.button, classes.listItemInner)}
                color="secondary"
                variant="contained"
                onClick={() => this.authByProvider("Password")}
              >
                {IconUtil.renderAuthProviderIcon("Password")}
                メールでログイン
              </Button>
            </ListItem>
          </Card>
          <Card className={classes.card}>
            <Typography className={classes.type}>SNSでログイン</Typography>
            {providers.map((p: any, i: number) => {
              return (
                <ListItem key={i}>
                  <Button
                    className={classNames(
                      classes.button,
                      classes.listItemInner
                    )}
                    style={{ background: p.color, color: "#FFF" }}
                    variant="contained"
                    onClick={() => this.authByProvider(p.providerName)}
                  >
                    {IconUtil.renderAuthProviderIcon(p.providerName)}
                    {p.providerName}でログイン
                  </Button>
                </ListItem>
              );
            })}
          </Card>

          <ListItem>
            <Button
              className={classNames(classes.button, classes.listItemInner)}
              color="secondary"
              variant="contained"
              onClick={() => this.authByTestUser()}
            >
              テストユーザーでログイン
            </Button>
          </ListItem>
        </List>

        <img alt="dog" className={classes.dog} src={dog} />
      </Fragment>
    );
  }
}

const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onAuth: (signing: any) => {
      dispatch(authActions.signIn.started(signing));
    },
    onSignUp: (signing: any) => {
      dispatch(authActions.signUp.started(signing));
    },
    // onUpdateUser: (user: any) => {
    //   dispatch(authActions.updateUserInfo.started(user));
    // },
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Auth)));

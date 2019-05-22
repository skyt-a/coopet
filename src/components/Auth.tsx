import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
// ランディングページのTop画像
import { Button, Paper, ListItem, List, TextField } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import { UserInfo } from "../models/UserInfo";
import IconUtil from "../utils/IconUtil";
import classNames from "classnames";
import Loading from "./Loading";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    button: {
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
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  auth: any;
  authenticatedUser: UserInfo;
  onAuth: (signing: any) => void;
  onUpdateUser: (user: any) => void;
  onLogout: () => void;
  onStoreUserInfo: (p: any) => void;
}
interface State {
  email: string;
  password: string;
  loading: boolean;
}
const providers: {
  providerName: string;
}[] = [
  { providerName: "Google" },
  { providerName: "Twitter" },
  { providerName: "Password" }
];
class Auth extends Component<Props, State> {
  unsubscribe: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loading: true
    };
  }

  componentDidMount = () => {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      // this.props.onUpdateUser(user);
      this.setState({
        loading: false
      });
      console.log(user);
      if (user != null) {
        this.props.history.push("/afterAuth");
      }
    });
  };

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  logout = () => {
    this.props.onLogout();
  };

  authByProvider = (providerName: string) => {
    const signing = {
      email: this.state.email,
      password: this.state.password,
      authProvider: providerName
    };
    this.props.onAuth(signing);
  };

  componentWillUnmount() {
    if (!this.unsubscribe) {
      return;
    }
    this.unsubscribe();
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Paper className={classes.paper}>
        {/* <Typography>Username: {user && user.displayName}</Typography> */}
        <List>
          {providers.map((p: any, i: number) => {
            return (
              <Fragment key={i}>
                {p.providerName === "Password" && (
                  <Fragment>
                    <ListItem>
                      <TextField
                        label="メールアドレス"
                        className={classNames(
                          classes.button,
                          classes.listItemInner
                        )}
                        value={this.state.email}
                        onChange={this.handleChange("email")}
                        margin="normal"
                        variant="outlined"
                      />
                    </ListItem>
                    <ListItem>
                      <TextField
                        label="パスワード"
                        className={classNames(
                          classes.button,
                          classes.listItemInner
                        )}
                        value={this.state.password}
                        onChange={this.handleChange("password")}
                        margin="normal"
                        variant="outlined"
                      />
                    </ListItem>
                  </Fragment>
                )}
                <ListItem>
                  <Button
                    className={classNames(
                      classes.button,
                      classes.listItemInner
                    )}
                    color="secondary"
                    variant="contained"
                    onClick={() => this.authByProvider(p.providerName)}
                  >
                    {IconUtil.renderAuthProviderIcon(p.providerName)}
                    {p.providerName}でログイン
                  </Button>
                </ListItem>
              </Fragment>
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(Auth));

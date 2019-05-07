import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
// ランディングページのTop画像
import { Button, Typography, Paper } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}
interface State {
  user: any;
}
class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: null
    };
    this.loginGoogle = this.loginGoogle.bind(this);
    this.logout = this.logout.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }

  loginGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.login(provider);
  }

  login(provider: any) {
    firebase.auth().signInWithRedirect(provider);
  }

  logout() {
    firebase.auth().signOut();
  }
  public render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        {/* <div className="App"> */}
        <Typography>UID: {this.state.user && this.state.user.uid}</Typography>

        {this.state.user ? (
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={this.logout}
          >
            ログアウト
          </Button>
        ) : (
          <Button
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={this.loginGoogle}
          >
            Google ログイン
          </Button>
        )}
        {/* </div> */}
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(Login));

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
import SignInScreen from "./SignInScreen";

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
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  auth: any;
  onLogin: (user: any) => void;
  onLogout: () => void;
}
interface State {
  user: any;
}
class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      this.props.onLogin(user);
      if (user != null) {
        this.props.history.push("/registerUser");
      }
    });
  };

  logout = () => {
    this.props.onLogout();
    firebase.auth().signOut();
  };

  render() {
    // if (this.state.loading) return <div>loading</div>;
    const { classes } = this.props;
    const user = this.props.auth.user;
    return (
      <Paper className={classes.paper}>
        <Typography>Username: {user && user.displayName}</Typography>
        {user ? (
          <Button
            onClick={this.logout}
            className={classes.button}
            color="secondary"
            variant="contained"
          >
            Logout
          </Button>
        ) : (
          <SignInScreen />
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(Login));

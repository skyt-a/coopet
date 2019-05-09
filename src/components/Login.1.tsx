import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
// ランディングページのTop画像
import {
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  TextField
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center"
    },
    listItemInner: {
      margin: "auto"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}
interface State {
  user: any;
  mailAddress: string;
  password: string;
}
class Login_ extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: null,
      mailAddress: "",
      password: ""
    };
    this.loginGoogle = this.loginGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    firebase.auth().signInWithPopup(provider);
  }

  logout() {
    firebase.auth().signOut();
  }
  handleChange(name: string, event: any) {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  }
  public render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
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
          <List>
            <ListItem>
              <Button
                className={classes.listItemInner}
                color="secondary"
                variant="contained"
                onClick={this.loginGoogle}
              >
                Google ログイン
              </Button>
            </ListItem>
            <ListItem>
              <TextField
                label="メールアドレス"
                className={classes.listItemInner}
                value={this.state.mailAddress}
                onChange={e => this.handleChange("mailAddress", e)}
                margin="dense"
                variant="outlined"
              />
            </ListItem>
            <ListItem>
              <TextField
                label="パスワード"
                className={classes.listItemInner}
                value={this.state.password}
                onChange={e => this.handleChange("password", e)}
                margin="normal"
                variant="outlined"
              />
            </ListItem>
          </List>
        )}
        {/* </div> */}
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(Login_));

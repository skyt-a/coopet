import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Button, Typography, Paper, TextField } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";

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
  registerUser: State;
  onRegisterUser: (registerInfo: State) => void;
  // onLogout: () => void;
}
interface State {
  userName: string;
  petName: string;
}
class RegisterUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userName: props.registerUser.userName,
      petName: props.registerUser.petName
    };
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  confirmRegister = () => {
    this.props.onRegisterUser(this.state);
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6">
          あなたとあなたのペットについて教えてください
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-name"
            label="あなたのお名前"
            className={classes.textField}
            value={this.state.userName}
            onChange={this.handleChange("userName")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="ペットのお名前"
            className={classes.textField}
            value={this.state.petName}
            onChange={this.handleChange("petName")}
            margin="normal"
            variant="outlined"
          />
        </form>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.confirmRegister}
        >
          登録
        </Button>
      </Paper>
    );
  }
}

export default withStyles(styles)(withRouter(RegisterUser));

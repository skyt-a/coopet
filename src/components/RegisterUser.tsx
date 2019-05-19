import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Button,
  Typography,
  Paper,
  TextField,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CircularProgress
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import User from "../utils/User";

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
    fileUpload: {
      opacity: 0,
      appearance: "none",
      position: "absolute"
    },
    media: {
      objectFit: "cover",
      height: 150,
      width: "auto",
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
  registerUser: any;
  auth: any;
  onRegisterUser: (registerInfo: State) => void;
  // onLogout: () => void;
}
interface State {
  userName: string;
  petName: string;
  photoURL: string;
  uploadedImage: any;
  follow: any[];
  follower: any[];
  loading: boolean;
}
const createObjectURL =
  (window.URL || (window as any).webkitURL).createObjectURL ||
  (window as any).createObjectURL;
let userInfo: any;
class RegisterUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let userName = "";
    userInfo = firebase.auth().currentUser;
    console.log(userInfo);
    if (userInfo != null) {
      userName = userInfo.displayName || "";
    }
    this.state = {
      userName: userName,
      petName: props.registerUser.petName,
      photoURL: "",
      uploadedImage: null,
      follow: [],
      follower: [],
      loading: true
    };
    User.isInitAuthedRef(userInfo.uid).on("value", snap => {
      if (snap && snap.val()) {
        this.props.history.push("/userMain");
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  confirmRegister = () => {
    this.props.onRegisterUser(this.state);
    this.props.history.push("/userMain");
  };

  handleChangeFile = (e: any) => {
    const files = e.target.files;
    const src = files.length === 0 ? "" : createObjectURL(files[0]);
    console.log(files[0]);
    this.setState({ photoURL: src, uploadedImage: files[0] });
  };

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return (
        <section className={classes.progressWrapper}>
          <CircularProgress className={classes.progress} />
        </section>
      );
    }
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6">
          あなたのペットについて教えてください
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            label="あなたのお名前"
            className={classes.textField}
            defaultValue={this.state.userName}
            onChange={this.handleChange("userName")}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="ペットのお名前"
            className={classes.textField}
            value={this.state.petName}
            onChange={this.handleChange("petName")}
            margin="normal"
            variant="outlined"
          />
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                component="img"
                className={classes.media}
                src={this.state.photoURL || userInfo.photoURL}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Button component="label" variant="contained" color="secondary">
                  サムネイル画像を変更する
                  <input
                    type="file"
                    onChange={this.handleChangeFile}
                    className={classes.fileUpload}
                  />
                </Button>
              </CardContent>
            </CardActionArea>
          </Card>
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

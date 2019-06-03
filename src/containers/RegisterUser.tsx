import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions } from "../actions/index";

import React, { Component, Fragment } from "react";
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
  CardMedia,
  CardContent,
  MenuItem
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import firebase from "../firebase";
import User from "../utils/User";
import Loading from "../components/Loading";
import animalSpecies from "../assets/data/animalSpecies.json";
import Navbar from "../containers/Navbar";
import { UploadFile } from "../utils/UploadFile";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      marginTop: "60px"
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
    },
    select: {
      width: "60vw"
    }
  });

interface Props
  extends WithStyles<typeof styles>,
    RouteComponentProps,
    WithSnackbarProps {
  registerUser: any;
  auth: any;
  isChangeMode?: boolean;
  onRegisterUser: (registerInfo: State) => void;
}
interface State {
  userName: string;
  petName: string;
  petSpecies: any;
  photoURL: string;
  uploadedImage: any;
}

let userInfo: any;
let loading = true;

/**
 * ユーザー登録画面
 */
class RegisterUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let userName = "";
    userInfo = firebase.auth().currentUser;
    if (userInfo != null) {
      userName = userInfo.displayName || "";
    } else {
      this.props.history.push("/auth");
      return;
    }
    if (props.isChangeMode) {
      this.state = {
        userName: this.props.auth.additionalUserInfo.userName,
        petName: this.props.auth.additionalUserInfo.petName,
        petSpecies: this.props.auth.additionalUserInfo.petSpecies,
        photoURL: this.props.auth.additionalUserInfo.photoURL,
        uploadedImage: null
      };
      loading = false;
    } else {
      this.state = {
        userName: userName,
        petName: props.registerUser ? props.registerUser.petName : "",
        petSpecies: props.registerUser
          ? props.registerUser.petSpecies
          : animalSpecies[0].id,
        photoURL: "",
        uploadedImage: null
      };
      User.isInitAuthedRef(userInfo.uid).on("value", snap => {
        if (snap && snap.val()) {
          this.props.history.push("/userMain");
        } else {
          loading = false;
        }
      });
    }
  }

  /**
   * 画面入力時のハンドラー
   */
  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  /**
   * 登録完了処理
   */
  confirmRegister = () => {
    loading = true;
    this.props.onRegisterUser(this.state);
    setTimeout(() => {
      this.props.history.push("/userMain");
      loading = false;
    }, 2000);
  };

  /**
   * 画像選択時処理
   */
  handleChangeFile = (e: any) => {
    UploadFile.uploadImage(
      e,
      (src, blob) => this.setState({ photoURL: src, uploadedImage: blob }),
      () =>
        this.props.enqueueSnackbar(
          "画像ファイル(.jpg,.png)を選択してください",
          {
            variant: "error",
            autoHideDuration: 3000
          }
        )
    );
  };

  /**
   * 入力エラーが存在するかチェックする
   */
  hasValidateError = () => {
    return (
      !this.state.userName ||
      !this.state.petName ||
      (!this.state.photoURL && !userInfo.photoURL)
    );
  };

  render() {
    const { classes } = this.props;
    if (loading) {
      return <Loading />;
    }
    return (
      <Fragment>
        <Navbar />
        <Paper className={classes.paper}>
          {!this.props.isChangeMode && (
            <Typography variant="h6">
              あなたのペットについて教えてください
            </Typography>
          )}
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              required
              label="あなたのお名前"
              className={classes.textField}
              defaultValue={this.state.userName}
              onChange={this.handleChange("userName")}
              margin="dense"
              variant="outlined"
            />

            <TextField
              required
              label="ペットのお名前"
              className={classes.textField}
              value={this.state.petName}
              onChange={this.handleChange("petName")}
              margin="dense"
              variant="outlined"
            />
            {!this.props.isChangeMode && (
              <TextField
                select
                required
                label="ペットの種類"
                className={classes.select}
                value={this.state.petSpecies || animalSpecies[0].id}
                margin="dense"
                variant="outlined"
                onChange={this.handleChange("petSpecies")}
              >
                {animalSpecies.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <Card className={classes.card}>
              {(this.state.photoURL || userInfo.photoURL) && (
                <CardMedia
                  component="img"
                  className={classes.media}
                  src={this.state.photoURL || userInfo.photoURL}
                  title="Contemplative Reptile"
                />
              )}
              <CardContent>
                <Button component="label" variant="contained" color="secondary">
                  サムネイル画像を設定する
                  <input
                    type="file"
                    required
                    onChange={this.handleChangeFile}
                    className={classes.fileUpload}
                  />
                </Button>
              </CardContent>
            </Card>
          </form>
          {!this.hasValidateError() ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.confirmRegister}
            >
              {this.props.isChangeMode ? "変更" : "登録"}
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled
              color="primary"
              className={classes.button}
            >
              {this.props.isChangeMode ? "変更" : "登録"}
            </Button>
          )}
        </Paper>
      </Fragment>
    );
  }
}

// reduxへのconnect
const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth,
    registerUser: state.ResgisterUser
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onRegisterUser: (registerInfo: any) => {
      dispatch(
        authActions.updateUserInfo.started({
          userName: registerInfo.userName,
          petName: registerInfo.petName,
          photoURL: registerInfo.photoURL,
          petSpecies: registerInfo.petSpecies,
          uploadedImage: registerInfo.uploadedImage
        })
      );
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(withSnackbar(RegisterUser))));

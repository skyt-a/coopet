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
import Loading from "./Loading";
import animalSpecies from "../assets/data/animalSpecies.json";
import Navbar from "../containers/Navbar";

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
const createObjectURL =
  (window.URL || (window as any).webkitURL).createObjectURL ||
  (window as any).createObjectURL;
let userInfo: any;
let loading = true;
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

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  confirmRegister = () => {
    loading = true;
    this.props.onRegisterUser(this.state);
    setTimeout(() => {
      this.props.history.push("/userMain");
      loading = false;
    }, 2000);
  };

  handleChangeFile = (e: any) => {
    const files = e.target.files;
    const file = files[0];
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      this.props.enqueueSnackbar("画像ファイル(.jpg,.png)を選択してください", {
        variant: "error",
        autoHideDuration: 3000
      });
      return;
    }
    const image = new Image();
    const reader = new FileReader();
    let blob;
    const THUMBNAIL_WIDTH = 500; // 画像リサイズ後の横の長さの最大値
    const THUMBNAIL_HEIGHT = 500; // 画像リサイズ後の縦の長さの最大値
    reader.onload = (event: any) => {
      image.onload = () => {
        let width, height;
        if (image.width > image.height) {
          // 横長の画像は横のサイズを指定値にあわせる
          let ratio = image.height / image.width;
          width = THUMBNAIL_WIDTH;
          height = THUMBNAIL_WIDTH * ratio;
        } else {
          // 縦長の画像は縦のサイズを指定値にあわせる
          let ratio = image.width / image.height;
          width = THUMBNAIL_HEIGHT * ratio;
          height = THUMBNAIL_HEIGHT;
        }
        // サムネ描画用canvasのサイズを上で算出した値に変更
        const canvas: any = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        // canvasに既に描画されている画像をクリア
        ctx.clearRect(0, 0, width, height);
        // canvasにサムネイルを描画
        ctx.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          width,
          height
        );

        // canvasからbase64画像データを取得
        const base64 = canvas.toDataURL("image/jpeg");
        // base64からBlobデータを作成
        const bin = atob(base64.split("base64,")[1]);
        const len = bin.length;
        const barr = new Uint8Array(len);
        let i = 0;
        while (i < len) {
          barr[i] = bin.charCodeAt(i);
          i++;
        }
        blob = new Blob([barr], { type: "image/jpeg" });
        // blobデータからurlを生成
        let src = createObjectURL(blob);
        if (blob) {
          this.setState({ photoURL: src, uploadedImage: blob });
        }
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

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

export default withStyles(styles)(withRouter(withSnackbar(RegisterUser)));

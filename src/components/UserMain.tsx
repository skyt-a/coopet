import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Typography,
  Paper,
  Avatar,
  Modal,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  CardHeader,
  Chip,
  CardActions,
  Badge
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import firebase from "../firebase";
import Navbar from "../containers/Navbar";
import Follow from "../utils/Follow";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import User from "../utils/User";
import animalSpecies from "../assets/data/animalSpecies.json";
import CommentsView from "../containers/CommentsView";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    avatar: {
      margin: 10,
      width: 60,
      height: 60
    },
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      marginTop: "60px",
      overflowX: "hidden"
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
    flex: {
      display: "flex",
      flexWrap: "wrap"
    },
    betweenAround: {
      justifyContent: "space-between"
    },
    addPhotoIcon: {
      fontSize: "40px"
    },
    fullWidth: {
      width: "100vw"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: "80vw"
    },
    uploadedImageWrap: {
      flexBasis: "calc(100% / 3.1)",
      position: "relative",
      height: "150px",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      margin: "1px"
    },
    uploadedImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    },
    chip: {
      margin: theme.spacing.unit
    },
    card: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    cardComponent: {
      padding: "1px"
    },
    mainCommentContent: {},
    cardContent: {
      overflow: "auto",
      height: "30vh"
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "10px"
    },
    balloonRight: {
      position: "relative",
      display: "inline-block",
      padding: "7px 10px",
      minWidth: "120px",
      maxWidth: "100%",
      color: "#555",
      fontSize: "16px",
      background: "#e0edff",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "100%",
        marginTop: "-15px",
        border: "15px solid transparent",
        borderLeft: "15px solid #e0edff"
      }
    },
    balloonLeft: {
      position: "relative",
      display: "inline-block",
      padding: "7px 10px",
      minWidth: "120px",
      maxWidth: "100%",
      color: "#555",
      fontSize: "16px",
      background: "#ff8e9d",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "-30px",
        marginTop: "-15px",
        border: "15px solid transparent",
        borderRight: "15px solid #ff8e9d"
      }
    },
    commentWrapperLeft: {
      textAlign: "left",
      margin: "10px"
    },
    commentWrapperRight: {
      textAlign: "right",
      margin: "10px"
    }
  });

function getModalStyle() {
  return {
    backgroundColor: "white",
    height: "60vh",
    width: "100vw"
  };
}

interface Props
  extends WithStyles<typeof styles>,
    RouteComponentProps,
    WithSnackbarProps {
  registerUser?: State;
  userInfo?: any;
  auth?: any;
  onUploadImage: (param: {
    uploadedImage: any;
    comment: string;
    petSpecies: string;
  }) => void;
  onLogout: () => void;
  onStoreUserInfo: (p: any) => void;
}

type UploadedImageInfo = {
  url: string;
  comment: string;
};

interface State {
  userName: string;
  photoURL: string;
  uploadedImage: any;
  followingNumber: number;
  followerNumber: number;
  loading: boolean;
  isOpenUploadImageModal: boolean;
  isOpenSelectedImageModal: boolean;
  comment: string;
  uploadedImages: UploadedImageInfo[];
  selectedImageURL: string;
  selectedImageDetail: any;
  commentUserMast: any;
  selectedComment: string;
  isMenuOpen: boolean;
}

const createObjectURL =
  (window.URL || (window as any).webkitURL).createObjectURL ||
  (window as any).createObjectURL;
let userInfo: any;
let additionalUserInfo: any;
class UserMain extends Component<Props, State> {
  menuItems = [
    {
      menuLabel: "ログアウト",
      func: () => {
        this.props.onLogout();
        this.props.history.push("/auth");
        this.onMenuClose();
      }
    },
    {
      menuLabel: "会員情報変更",
      func: () => {
        this.props.history.push("/registerUser");
        this.onMenuClose();
      }
    }
  ];
  constructor(props: Props) {
    super(props);
    userInfo = firebase.auth().currentUser;
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    this.state = {
      userName: "",
      photoURL: "",
      uploadedImage: null,
      followingNumber: 0,
      followerNumber: 0,
      loading: true,
      isOpenUploadImageModal: false,
      isOpenSelectedImageModal: false,
      comment: "",
      uploadedImages: [],
      selectedImageURL: "",
      selectedComment: "",
      selectedImageDetail: {},
      commentUserMast: {},
      isMenuOpen: false
    };
  }

  componentDidMount = () => {
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    Follow.getFollowingRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followingNumber: Object.keys(snap.val()).length
      });
    });
    Follow.getFollowerRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followerNumber: Object.keys(snap.val()).length
      });
    });
    User.isInitAuthedRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.props.onStoreUserInfo(snap.val());
      additionalUserInfo = snap.val();
    });
    UploadedImage.getMyUploadedImageRef(userInfo.uid)
      .orderByKey()
      .on("value", snap => {
        if (!snap || !snap.val()) {
          return;
        }
        const result = snap.val();
        console.log(snap.val());
        this.setState({
          uploadedImages: Object.keys(result).map(key => {
            const image = result[key];
            image["uid"] = userInfo.uid;
            image["key"] = key;
            return image;
          })
          //Object.values(snap.val())
        });
      });
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1000);
  };

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    Follow.getFollowingRef(userInfo.uid).off();
    Follow.getFollowerRef(userInfo.uid).off();
    User.isInitAuthedRef(userInfo.uid).off();
    UploadedImage.getMyUploadedImageRef(userInfo.uid).off();
    userInfo = null;
    additionalUserInfo = null;
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
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
          this.handleOpenUploadImageModal();
        }
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  handleOpenUploadImageModal = () => {
    this.setState({ isOpenUploadImageModal: true });
  };

  handleCloseUploadImageModal = () => {
    this.setState({
      uploadedImage: null,
      isOpenUploadImageModal: false
    });
  };

  handleOpenSelectedImageModal = (selectedImageDetail: any) => {
    UploadedImage.getMyUploadedImageDetailRef(
      selectedImageDetail.uid,
      selectedImageDetail.key
    ).on("value", snap => {
      let commenteds: any[] = [];
      let promises: Promise<any>[] = [];
      if (snap && snap.val()) {
        const result = snap.val();
        if (result.commenteds) {
          const targetCommentsProp = result.commenteds;
          const userIds = Object.keys(targetCommentsProp)
            .map((key: any) => {
              const inner = targetCommentsProp[key];
              return Object.keys(inner)[0];
            })
            // 重複を削除する
            .filter(function(x, i, self) {
              return self.indexOf(x) === i;
            });
          promises = userIds.map(v => User.getUserByIdRef(v).once("value"));
        }
        Promise.all(promises).then(users => {
          const targetCommentsProp = result.commenteds;
          let userMast: any = {};
          if (targetCommentsProp) {
            commenteds = Object.keys(targetCommentsProp).map((key: any) => {
              const inner = targetCommentsProp[key];
              const comment = inner[Object.keys(inner)[0]];
              comment["uid"] = Object.keys(inner)[0];
              comment["key"] = key;
              return comment;
            });
            userMast = {};
            users.forEach(user => {
              if (user && user.val()) {
                userMast[user.val().uid] = user.val();
              }
            });
          }
          selectedImageDetail["commenteds"] = commenteds;
          if (!this.state.isOpenSelectedImageModal) {
            this.setState({
              selectedImageDetail: selectedImageDetail,
              commentUserMast: userMast,
              isOpenSelectedImageModal: true
            });
          }
        });
      }
    });
  };

  handleCloseSelectedImageModal = () => {
    this.setState({
      isOpenSelectedImageModal: false,
      selectedImageDetail: {}
    });
  };

  uploadImage = () => {
    this.props.onUploadImage({
      uploadedImage: this.state.uploadedImage,
      comment: this.state.comment,
      petSpecies: additionalUserInfo.petSpecies
    });
    this.handleCloseUploadImageModal();
  };

  onMenuOpen = () => {
    this.setState({
      isMenuOpen: true
    });
  };

  onMenuClose = () => {
    this.setState({
      isMenuOpen: false
    });
  };

  render() {
    if (!additionalUserInfo) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        {!this.props.userInfo && (
          <Navbar
            title={this.state.userName}
            menuItems={this.menuItems}
            open={this.state.isMenuOpen}
            onOpen={this.onMenuOpen}
          />
        )}
        <Paper className={classNames(classes.paper, classes.fullWidth)}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  alt="Remy Sharp"
                  src={userInfo.photoURL}
                  className={classes.avatar}
                />
              }
              action={
                !this.props.userInfo && (
                  <IconButton component="label">
                    <input
                      type="file"
                      onChange={this.handleChangeFile}
                      className={classes.fileUpload}
                    />
                    <AddAPhotoRoundedIcon className={classes.addPhotoIcon} />{" "}
                  </IconButton>
                )
              }
              className={classes.cardComponent}
              title={additionalUserInfo.userName}
              subheader={additionalUserInfo.petName}
            />
            <CardContent className={classes.cardComponent}>
              <Chip
                color="primary"
                label={
                  additionalUserInfo &&
                  additionalUserInfo.petSpecies &&
                  animalSpecies.filter(
                    ele => ele.id === additionalUserInfo.petSpecies
                  )[0].name
                }
                className={classes.chip}
                variant="outlined"
              />
            </CardContent>
            <CardActions className={classes.actions}>
              <Badge
                color="primary"
                showZero
                badgeContent={this.state.followingNumber}
                className={classes.margin}
              >
                <Chip label="フォロー" variant="outlined" color="secondary" />
              </Badge>
              <Badge
                color="primary"
                showZero
                badgeContent={this.state.followerNumber}
                className={classes.margin}
              >
                <Chip label="フォロワー" variant="outlined" color="secondary" />
              </Badge>
            </CardActions>
          </Card>
          <Card className={classNames(classes.flex, classes.card)}>
            <Fragment>
              {this.state.uploadedImages.map((uploaded, i) => (
                <div className={classes.uploadedImageWrap} key={i}>
                  <img
                    onClick={() => this.handleOpenSelectedImageModal(uploaded)}
                    alt={uploaded.comment}
                    className={classes.uploadedImage}
                    src={uploaded.url}
                  />
                </div>
              ))}
            </Fragment>
          </Card>
        </Paper>
        <Modal
          aria-labelledby="simple-modal-title2"
          aria-describedby="simple-modal-description2"
          open={this.state.isOpenSelectedImageModal}
          onClose={this.handleCloseSelectedImageModal}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Card>
              <CardMedia
                component="img"
                className={classes.media}
                src={this.state.selectedImageDetail.url}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography>
                  {this.state.selectedImageDetail.comment}
                </Typography>
              </CardContent>
              <CommentsView
                commenteds={this.state.selectedImageDetail.commenteds}
                commentUserMast={this.state.commentUserMast}
              />
            </Card>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isOpenUploadImageModal}
          onClose={this.handleCloseUploadImageModal}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Card>
              <CardMedia
                component="img"
                className={classes.media}
                src={this.state.photoURL || userInfo.photoURL}
                title="Contemplative Reptile"
              />
              <CardContent>
                <TextField
                  id="outlined-multiline-static"
                  label="コメント"
                  multiline
                  rows="4"
                  defaultValue=""
                  onChange={this.handleChange("comment")}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.uploadImage}
                >
                  投稿
                </Button>
              </CardContent>
            </Card>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(withSnackbar(UserMain)));

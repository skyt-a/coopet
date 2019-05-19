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
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  TextField
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import Navbar from "../containers/Navbar";
import Follow from "../utils/Follow";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";

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
      flexBasis: "calc(100% / 3)",
      position: "relative",
      height: "150px",
      border: "1px solid rgba(0, 0, 0, 0.12)"
    },
    uploadedImage: {
      width: "100%",
      height: "100%",
      objectFit: "scale-down"
    }
  });

function getModalStyle() {
  return {
    backgroundColor: "white",
    height: "60vh",
    width: "100vw"
  };
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  registerUser: State;
  auth: any;
  onUploadImage: (param: { uploadedImage: any; comment: string }) => void;
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
  selectedComment: string;
}

const createObjectURL =
  (window.URL || (window as any).webkitURL).createObjectURL ||
  (window as any).createObjectURL;
let userInfo: any;
class UserMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let userName = "";
    userInfo = firebase.auth().currentUser;
    if (userInfo != null) {
      userName = userInfo.displayName || "";
    }
    this.state = {
      userName: userName,
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
      selectedComment: ""
    };
  }

  componentDidMount = () => {
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
    UploadedImage.getMyUploadedImageRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      console.log(snap.val());
      this.setState({
        uploadedImages: Object.values(snap.val())
      });
    });
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 1000);
  };

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleChangeFile = (e: any) => {
    const files = e.target.files;
    const src = files.length === 0 ? "" : createObjectURL(files[0]);
    this.setState({ photoURL: src, uploadedImage: files[0] });
    if (files[0]) {
      this.handleOpenUploadImageModal();
    }
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

  handleOpenSelectedImageModal = (
    selectedURL: string,
    selectedComment: string
  ) => {
    this.setState({
      isOpenSelectedImageModal: true,
      selectedImageURL: selectedURL,
      selectedComment: selectedComment
    });
  };

  handleCloseSelectedImageModal = () => {
    this.setState({
      isOpenSelectedImageModal: false,
      selectedImageURL: "",
      selectedComment: ""
    });
  };

  uploadImage = () => {
    this.props.onUploadImage({
      uploadedImage: this.state.uploadedImage,
      comment: this.state.comment
    });
    this.handleCloseUploadImageModal();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar title={this.state.userName} />
        <Paper className={classNames(classes.paper, classes.fullWidth)}>
          <section className={classNames(classes.flex, classes.betweenAround)}>
            <Avatar
              alt="Remy Sharp"
              src={userInfo.photoURL}
              className={classes.avatar}
            />
            <Typography variant="h5" color="inherit">
              {userInfo.displayName}
            </Typography>
          </section>
          <section className={classNames(classes.flex, classes.betweenAround)}>
            <div>
              <Typography color="inherit">
                フォロー: {this.state.followingNumber}
              </Typography>
              <Typography color="inherit">
                フォロワー: {this.state.followerNumber}
              </Typography>
            </div>

            <IconButton component="label">
              <input
                type="file"
                onChange={this.handleChangeFile}
                className={classes.fileUpload}
              />
              <AddAPhotoRoundedIcon className={classes.addPhotoIcon} />{" "}
            </IconButton>
          </section>
          <Card className={classes.flex}>
            <Fragment>
              {this.state.uploadedImages.map((uploaded, i) => (
                <div className={classes.uploadedImageWrap}>
                  <img
                    onClick={() =>
                      this.handleOpenSelectedImageModal(
                        uploaded.url,
                        uploaded.comment
                      )
                    }
                    alt={uploaded.comment}
                    key={i}
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
            <CardActionArea>
              <CardMedia
                component="img"
                className={classes.media}
                src={this.state.selectedImageURL}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography>{this.state.selectedComment}</Typography>
              </CardContent>
            </CardActionArea>
          </div>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.isOpenUploadImageModal}
          onClose={this.handleCloseUploadImageModal}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <CardActionArea>
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
                <Button variant="contained" onClick={this.uploadImage}>
                  投稿
                </Button>
              </CardContent>
            </CardActionArea>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(UserMain));

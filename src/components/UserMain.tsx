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
  TextField,
  CardHeader,
  Chip,
  CardActions,
  Badge
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import Navbar from "../containers/Navbar";
import Follow from "../utils/Follow";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import User from "../utils/User";
import animalSpecies from "../assets/data/animalSpecies.json";

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
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "10px"
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

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    Follow.getFollowingRef(userInfo.uid).off();
    Follow.getFollowerRef(userInfo.uid).off();
    User.isInitAuthedRef(userInfo.uid).off();
    UploadedImage.getMyUploadedImageRef(userInfo.uid).off();
  }

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
    console.log(animalSpecies);
    if (!additionalUserInfo) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar
          title={this.state.userName}
          menuItems={this.menuItems}
          open={this.state.isMenuOpen}
          onOpen={this.onMenuOpen}
        />
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
                <IconButton component="label">
                  <input
                    type="file"
                    onChange={this.handleChangeFile}
                    className={classes.fileUpload}
                  />
                  <AddAPhotoRoundedIcon className={classes.addPhotoIcon} />{" "}
                </IconButton>
              }
              className={classes.cardComponent}
              title={userInfo.displayName}
              subheader={additionalUserInfo.petName}
            />
            <CardContent className={classes.cardComponent}>
              <Chip
                color="primary"
                label={
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
                    onClick={() =>
                      this.handleOpenSelectedImageModal(
                        uploaded.url,
                        uploaded.comment
                      )
                    }
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

export default withStyles(styles)(withRouter(UserMain));

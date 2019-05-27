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
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Chip,
  CardActions,
  Badge,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Follow from "../utils/Follow";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import User from "../utils/User";
import animalSpecies from "../assets/data/animalSpecies.json";
import CommentsView from "../containers/CommentsView";
import ReplyIcon from "@material-ui/icons/Reply";

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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  registerUser?: State;
  userInfo?: any;
  auth?: any;
  onStoreUserInfo: (p: any) => void;
  onUnSelectUser: () => void;
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

let userInfo: any;
let additionalUserInfo: any;
class OtherMain extends Component<Props, State> {
  menuItems = [];
  constructor(props: Props) {
    super(props);
    userInfo = this.props.userInfo[this.props.userInfo.length - 1];
    this.props.userInfo && console.log("userddddd", userInfo);
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
    User.isInitAuthedRef(userInfo.uid).once("value", snap => {
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

  handleOpenSelectedImageModal = (selectedImageDetail: any) => {
    console.log("modal");
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

  revertUser = () => {
    this.props.onUnSelectUser();
    this.props.history.replace("/reload");
    setTimeout(() => {
      this.props.history.replace("/otherView");
    });
  };

  render() {
    if (!additionalUserInfo) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="revert"
              onClick={this.revertUser}
            >
              <ReplyIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
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
              className={classes.cardComponent}
              title={additionalUserInfo.userName}
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
                variant="default"
              />
            </CardContent>
            <CardActions className={classes.actions}>
              <Badge
                color="primary"
                showZero
                badgeContent={this.state.followingNumber}
                className={classes.margin}
              >
                <Chip label="フォロー" variant="outlined" color="primary" />
              </Badge>
              <Badge
                color="primary"
                showZero
                badgeContent={this.state.followerNumber}
                className={classes.margin}
              >
                <Chip label="フォロワー" variant="outlined" color="primary" />
              </Badge>
            </CardActions>
          </Card>
          {this.state.uploadedImages && this.state.uploadedImages.length > 0 && (
            <Card className={classNames(classes.flex, classes.card)}>
              <Fragment>
                {this.state.uploadedImages.map((uploaded, i) => (
                  <div className={classes.uploadedImageWrap} key={i}>
                    <img
                      onClick={() =>
                        this.handleOpenSelectedImageModal(uploaded)
                      }
                      alt={uploaded.comment}
                      className={classes.uploadedImage}
                      src={uploaded.url}
                    />
                  </div>
                ))}
              </Fragment>
            </Card>
          )}
        </Paper>
        <Modal
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
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(OtherMain));

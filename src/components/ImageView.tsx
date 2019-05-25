import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Paper,
  Card,
  TextField,
  MenuItem,
  Modal,
  CardMedia,
  CardContent,
  Typography,
  Button
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import animalSpecies from "../assets/data/animalSpecies.json";
import CommentsView from "./CommentsView";
import User from "../utils/User";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      overflowX: "hidden"
    },
    select: {
      width: "60vw"
    },
    card: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    cardContent: {
      textAlign: "center",
      height: "30vh",
      overflow: "auto"
    },
    flex: {
      display: "flex",
      flexWrap: "wrap"
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
      objectFit: "scale-down"
    },
    media: {
      objectFit: "contain",
      width: "80vw",
      margin: "auto",
      padding: "20px",
      maxHeight: "35vh"
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
    },
    postArea: {
      textAlign: "center",
      padding: "3px"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  registerUser: State;
  auth: any;
  onUploadImage: (param: {
    uploadedImage: any;
    comment: string;
    petSpecies: string;
  }) => void;
  onCommentImage: (param: {
    uid: any;
    petSpecies: string;
    key: string;
    comment: string;
  }) => void;
  onLogout: () => void;
  onStoreUserInfo: (p: any) => void;
}

type UploadedImageInfo = {
  url: string;
  comment: string;
};

interface State {
  selectedSpecies: string;
  viewedImages: any[];
  isOpenImageDetailModal: boolean;
  selectedImageDetail: any;
  postComment: string;
  commentUserMast: any;
  loading: boolean;
}

function getModalStyle() {
  return {
    backgroundColor: "white",
    width: "90vw",
    margin: "auto",
    marginTop: "10px"
  };
}

let userInfo: any;
let additionalUserInfo: any;
class ImageView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    userInfo = this.props.auth.user;
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    additionalUserInfo = this.props.auth.additionalUserInfo;
    this.state = {
      selectedSpecies: additionalUserInfo.petSpecies,
      viewedImages: [],
      isOpenImageDetailModal: false,
      selectedImageDetail: {},
      postComment: "",
      commentUserMast: {},
      loading: false
    };
    UploadedImage.getUploadedImageBySpeciesRef(this.state.selectedSpecies)
      .orderByKey()
      .on("value", snap => {
        if (!snap || !snap.val()) {
          return;
        }
        const result = snap.val();
        console.log(result);
        this.setState({
          viewedImages: Object.keys(result)
            .filter(key => {
              const inner = Object.keys(result[key])[0];
              return inner !== userInfo.uid;
            })
            .map(key => {
              const inner = result[key];
              const image = inner[Object.keys(inner)[0]];
              image["uid"] = Object.keys(inner)[0];
              image["key"] = key;
              return image;
            })
        });
      });
  }

  componentDidMount = () => {
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
  };

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    UploadedImage.getUploadedImageBySpeciesRef(
      this.state.selectedSpecies
    ).off();
    // UploadedImage.getMyUploadedImageRef(userInfo.uid).off();
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleSpeciesSelectChange = () => (event: any) => {
    this.setState({
      viewedImages: [],
      loading: true
    });
    const selectedValue = event.target.value;
    UploadedImage.getUploadedImageBySpeciesRef(
      this.state.selectedSpecies
    ).off();
    UploadedImage.getUploadedImageBySpeciesRef(selectedValue).on(
      "value",
      snap => {
        let thisViewedImages = [];
        if (snap && snap.val()) {
          const result = snap.val();
          thisViewedImages = Object.keys(result)
            .filter(key => {
              const inner = Object.keys(result[key])[0];
              return inner !== userInfo.uid;
            })
            .map(key => {
              const inner = result[key];
              const image = inner[Object.keys(inner)[0]];
              image["uid"] = Object.keys(inner)[0];
              image["key"] = key;
              return image;
            })
        }
        this.setState({
          viewedImages: thisViewedImages,
          loading: false
        });
      }
    );
    this.setState({
      selectedSpecies: selectedValue
    });
  };

  handleOpenImageDetailModal = (selectedImageDetail: any) => {
    UploadedImage.getUploadedImageCommentedsRef(
      this.state.selectedSpecies,
      selectedImageDetail.key,
      selectedImageDetail.uid
    )
      .orderByKey()
      .on("value", snap => {
        let commenteds: any[] = [];
        let promises: Promise<any>[] = [];
        let result: any;
        if (snap && snap.val()) {
          result = snap.val();
          if (result) {
            const targetCommentsProp = result;
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
        }
        Promise.all(promises).then(users => {
          const targetCommentsProp = result;
          let userMast: any = {};
          if (targetCommentsProp) {
            commenteds = Object.keys(targetCommentsProp).map((key: any) => {
              const inner = targetCommentsProp[key];
              const comment = inner[Object.keys(inner)[0]];
              comment["uid"] = Object.keys(inner)[0];
              comment["key"] = key;
              return comment;
            });
            console.log(users);
            users.forEach(user => {
              if (user && user.val()) {
                userMast[user.val().uid] = user.val();
              }
            });
          }
          selectedImageDetail["commenteds"] = commenteds;
          if (!this.state.isOpenImageDetailModal) {
            this.setState({
              selectedImageDetail: selectedImageDetail,
              commentUserMast: userMast,
              isOpenImageDetailModal: true
            });
          } else {
            this.setState({
              selectedImageDetail: selectedImageDetail,
              commentUserMast: userMast
            });
          }
        });
      });
  };

  handleCloseImageDetailModal = () => {
    this.setState({
      isOpenImageDetailModal: false
    });
  };

  commentUploadedImage = () => {
    if (!this.state.postComment) {
      return;
    }
    this.props.onCommentImage({
      comment: this.state.postComment,
      uid: this.state.selectedImageDetail.uid,
      key: this.state.selectedImageDetail.key,
      petSpecies: this.state.selectedSpecies
    });
    this.setState({
      postComment: ""
    });
    this.handleOpenImageDetailModal(this.state.selectedImageDetail);
  };

  render() {
    if (!additionalUserInfo || this.state.loading) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        <Paper className={classNames(classes.paper, classes.fullWidth)}>
          <TextField
            select
            label="ペットの種類"
            className={classes.select}
            value={this.state.selectedSpecies}
            margin="normal"
            variant="outlined"
            onChange={this.handleSpeciesSelectChange()}
          >
            {animalSpecies.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          {this.state.viewedImages && this.state.viewedImages.length !== 0 && (
            <Card className={classNames(classes.flex, classes.card)}>
              {this.state.viewedImages.map((uploaded, i) => (
                <div className={classes.uploadedImageWrap} key={i}>
                  <img
                    onClick={() => this.handleOpenImageDetailModal(uploaded)}
                    alt={uploaded.comment}
                    className={classes.uploadedImage}
                    src={uploaded.url}
                  />
                </div>
              ))}
            </Card>
          )}
        </Paper>
        <Modal
          aria-labelledby="simple-modal-title2"
          aria-describedby="simple-modal-description2"
          open={this.state.isOpenImageDetailModal}
          onClose={this.handleCloseImageDetailModal}
        >
          <div style={getModalStyle()}>
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
                userInfo={userInfo}
                commentUserMast={this.state.commentUserMast}
              />
              <div className={classes.postArea}>
                <TextField
                  id="outlined-multiline-static"
                  label="コメント"
                  multiline
                  rows="2"
                  value={this.state.postComment}
                  onChange={this.handleChange("postComment")}
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
                <div>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.commentUploadedImage}
                  >
                    投稿
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(ImageView));

import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Typography,
  CardContent,
  Avatar,
  Modal,
  TextField,
  Button
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import UserMain from "../containers/UserMain";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import User from "../utils/User";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    cardContent: {
      overflow: "auto",
      maxHeight: "30vh",
      padding: "5px"
    },
    avatarLeft: {
      bottom: 0,
      left: 0,
      display: "inline-block",
      position: "absolute"
    },
    avatarRight: {
      bottom: 0,
      right: 0,
      display: "inline-block",
      position: "absolute"
    },
    userNameRight: {
      position: "absolute",
      right: 0
    },
    userNameLeft: {
      position: "absolute",
      left: 0
    },
    balloonSetBox: {
      display: "flex",
      flexWrap: "wrap",
      position: "relative"
    },
    balloon: {
      position: "relative",
      display: "inline-block",
      maxWidth: "300px",
      padding: "8px 15px",
      background: "#f0f0f0",
      textAlign: "left",
      borderRadius: "15px",
      marginTop: "20px",
      "&::after": {
        content: "''",
        border: "14px solid transparent",
        borderTopColor: "#f0f0f0",
        position: "absolute",
        top: "0"
      }
    },
    leftBalloon: {
      flexDirection: "row",
      marginLeft: "45px",
      marginRight: "auto",
      "&::after": {
        left: "-10px"
      }
    },
    rightBalloon: {
      flexDirection: "row-reverse",
      marginRight: "45px",
      marginLeft: "auto",
      "&::after": {
        right: "-10px"
      }
    },
    postArea: {
      textAlign: "center",
      padding: "3px"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  selectedImageDetail: any;
  onSelectUser?: (user: any) => void;
  onCommentImage?: (param: { uid: any; key: string; comment: string }) => void;
}

interface State {
  isOpenUserDetailModal: boolean;
  commenteds: any[];
  commentUserMast?: any;
  selectedUserInfo: any;
  postComment: string;
}

let userInfo: any;
class CommentsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenUserDetailModal: false,
      commenteds: [],
      commentUserMast: null,
      selectedUserInfo: {},
      postComment: ""
    };
    userInfo = firebase.auth().currentUser;
  }

  componentDidMount = () => {
    this.updateComment();
  };

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    UploadedImage.getUploadedImageCommentedsRef(
      this.props.selectedImageDetail.key
    ).off();
  }

  updateComment = () => {
    const selectedImageDetail = this.props.selectedImageDetail;
    UploadedImage.getUploadedImageCommentedsRef(selectedImageDetail.key)
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
            users.forEach(user => {
              if (user && user.val()) {
                userMast[user.val().uid] = user.val();
              }
            });
          }
          this.setState({
            commenteds: commenteds,
            commentUserMast: userMast
          });
        });
      });
  };

  goToUserDetail = (selectedUserInfo: any) => (e: any) => {
    if (!this.props.onSelectUser || selectedUserInfo.uid === userInfo.uid) {
      return;
    }
    this.props.onSelectUser(selectedUserInfo);
    this.props.history.replace("/reload");
    setTimeout(() => {
      this.props.history.replace("/otherView");
    });
  };

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleCloseUserDetailModal = () => {
    this.setState({
      isOpenUserDetailModal: false,
      selectedUserInfo: {}
    });
  };

  commentUploadedImage = () => {
    if (!this.state.postComment || !this.props.onCommentImage) {
      return;
    }
    this.props.onCommentImage({
      comment: this.state.postComment,
      uid: this.props.selectedImageDetail.uid,
      key: this.props.selectedImageDetail.key
    });
    this.setState({
      postComment: ""
    });
    // this.handleOpenImageDetailModal(this.state.selectedImageDetail);
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <CardContent className={classes.cardContent}>
          {this.state.commenteds &&
            this.state.commenteds.map((commented: any, i: number) => {
              if (!commented) {
                return null;
              }
              if (commented.uid === userInfo.uid) {
                return (
                  <div
                    className={classes.balloonSetBox}
                    key={i}
                    onClick={this.goToUserDetail(
                      this.state.commentUserMast[commented.uid]
                    )}
                  >
                    <Typography className={classes.userNameRight}>
                      {this.state.commentUserMast[commented.uid].userName}
                    </Typography>
                    <div
                      className={classNames(
                        classes.balloon,
                        classes.rightBalloon
                      )}
                    >
                      {commented.comment}
                    </div>
                    <Avatar
                      alt="Remy Sharp"
                      src={this.state.commentUserMast[commented.uid].photoURL}
                      className={classes.avatarRight}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    className={classes.balloonSetBox}
                    key={i}
                    onClick={this.goToUserDetail(
                      this.state.commentUserMast[commented.uid]
                    )}
                  >
                    <Typography className={classes.userNameLeft}>
                      {this.state.commentUserMast[commented.uid].userName}
                    </Typography>
                    <div
                      className={classNames(
                        classes.balloon,
                        classes.leftBalloon
                      )}
                    >
                      {commented.comment}
                    </div>
                    <Avatar
                      alt="Remy Sharp"
                      src={this.state.commentUserMast[commented.uid].photoURL}
                      className={classes.avatarLeft}
                    />
                  </div>
                );
              }
            })}
        </CardContent>
        <CardContent>
          <div className={classes.postArea}>
            <TextField
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
        </CardContent>
        <Modal
          aria-labelledby="simple-modal-title2"
          aria-describedby="simple-modal-description2"
          open={this.state.isOpenUserDetailModal}
          onClose={this.handleCloseUserDetailModal}
        >
          <UserMain userInfo={this.state.selectedUserInfo} />
        </Modal>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(CommentsView));

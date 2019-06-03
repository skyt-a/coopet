import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { appActions } from "../actions";

import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Typography, CardContent, Avatar } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import User from "../utils/User";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    cardContent: {
      padding: "5px"
    },
    avatarLeft: {
      bottom: 0,
      left: 0,
      top: "20px",
      display: "inline-block",
      position: "absolute"
    },
    avatarRight: {
      bottom: 0,
      right: 0,
      top: "20px",
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
      wordBreak: "break-all",
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
    },
    buttonArea: {
      display: "flex",
      justifyContent: "space-around"
    },
    actionButton: {
      minWidth: "30vw"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  selectedImageDetail: any;
  onSelectUser?: (user: any) => void;
}

interface State {
  isOpenUserDetailModal: boolean;
  commenteds: any[];
  commentUserMast?: any;
  selectedUserInfo: any;
  postComment: string;
  userInfo: any;
}

/**
 * コメント表示モジュール
 */
export class CommentsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenUserDetailModal: false,
      commenteds: [],
      commentUserMast: null,
      selectedUserInfo: {},
      postComment: "",
      userInfo: firebase.auth().currentUser
    };
  }

  componentDidMount = () => {
    this.updateComment();
  };

  componentWillUnmount() {
    if (!this.state.userInfo) {
      return;
    }
    UploadedImage.getUploadedImageCommentedsRef(
      this.props.selectedImageDetail.key
    ).off();
  }

  /**
   * 画面に表示されるコメントを更新する
   */
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
            commenteds: commenteds.reverse(),
            commentUserMast: userMast
          });
        });
      });
  };

  /**
   * ユーザー詳細画面へ遷移する
   */
  goToUserDetail = (selectedUserInfo: any) => (e: any) => {
    if (
      !this.props.onSelectUser ||
      selectedUserInfo.uid === this.state.userInfo.uid
    ) {
      return;
    }
    this.props.onSelectUser(selectedUserInfo);
    this.props.history.replace("/reload");
    setTimeout(() => {
      this.props.history.replace("/otherView");
    });
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
              if (commented.uid === this.state.userInfo.uid) {
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
      </Fragment>
    );
  }
}

// reduxへのconnect
const mapStateToProps = () => (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CommentsView)));

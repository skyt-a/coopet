import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Typography, CardContent, Avatar, Modal } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import UserMain from "../containers/UserMain";
import classNames from "classnames";

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
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  commenteds: any[];
  commentUserMast?: any;
  onSelectUser?: (user: any) => void;
}

interface State {
  isOpenUserDetailModal: boolean;
  selectedUserInfo: any;
}

let userInfo: any;
class CommentsView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenUserDetailModal: false,
      selectedUserInfo: {}
    };
    userInfo = firebase.auth().currentUser;
  }

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

  handleCloseUserDetailModal = () => {
    this.setState({
      isOpenUserDetailModal: false,
      selectedUserInfo: {}
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <CardContent className={classes.cardContent}>
          {this.props.commenteds &&
            this.props.commenteds.map((commented: any, i: number) => {
              if (!commented) {
                return null;
              }
              if (commented.uid === userInfo.uid) {
                return (
                  <div
                    className={classes.balloonSetBox}
                    key={i}
                    onClick={this.goToUserDetail(
                      this.props.commentUserMast[commented.uid]
                    )}
                  >
                    <Typography className={classes.userNameRight}>
                      {this.props.commentUserMast[commented.uid].userName}
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
                      src={this.props.commentUserMast[commented.uid].photoURL}
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
                      this.props.commentUserMast[commented.uid]
                    )}
                  >
                    <Typography className={classes.userNameLeft}>
                      {this.props.commentUserMast[commented.uid].userName}
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
                      src={this.props.commentUserMast[commented.uid].photoURL}
                      className={classes.avatarLeft}
                    />
                  </div>
                );
              }
              // if (commented.uid === userInfo.uid) {
              //   return (
              //     <div
              //       className={classes.commentWrapperRight}
              //       key={i}
              //       onClick={this.goToUserDetail(
              //         this.props.commentUserMast[commented.uid]
              //       )}
              //     >
              //       <Typography>
              //         {this.props.commentUserMast[commented.uid].userName}
              //       </Typography>
              //       <div className={classes.balloonRight}>
              //         <Typography>{commented.comment}</Typography>
              //       </div>
              //       <Avatar
              //         alt="Remy Sharp"
              //         src={this.props.commentUserMast[commented.uid].photoURL}
              //         className={classes.avatarRight}
              //       />
              //     </div>
              //   );
              // } else {
              //   return (
              //     <div
              //       className={classes.commentWrapperLeft}
              //       key={i}
              //       onClick={this.goToUserDetail(
              //         this.props.commentUserMast[commented.uid]
              //       )}
              //     >
              //       <Typography>
              //         {this.props.commentUserMast[commented.uid].userName}
              //       </Typography>
              //       <Avatar
              //         alt="Remy Sharp"
              //         src={this.props.commentUserMast[commented.uid].photoURL}
              //         className={classes.avatarLeft}
              //       />
              //       <div className={classes.balloonLeft}>
              //         <Typography>{commented.comment}</Typography>
              //       </div>
              //     </div>
              //   );
              // }
            })}
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

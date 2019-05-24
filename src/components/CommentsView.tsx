import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Typography, CardContent, Avatar } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    cardContent: {
      overflow: "auto",
      height: "30vh"
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
      marginRight: "50px",
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
      marginLeft: "50px",
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
      margin: "10px",
      position: "relative"
    },
    commentWrapperRight: {
      textAlign: "right",
      margin: "10px",
      position: "relative"
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
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  commenteds: any[];
  userInfo: any;
  commentUserMast?: any;
}

interface State {}

class CommentsView extends Component<Props, State> {
  render() {
    const { classes } = this.props;
    console.log(this.props.commentUserMast, this.props.commentUserMast);
    return (
      <CardContent className={classes.cardContent}>
        {this.props.commenteds &&
          this.props.commenteds.map((commented: any, i: number) => {
            if (!commented) {
              return null;
            }
            if (commented.uid === this.props.userInfo.uid) {
              return (
                <div className={classes.commentWrapperRight} key={i}>
                  <Typography>
                    {this.props.commentUserMast[commented.uid].userName}
                  </Typography>
                  <div className={classes.balloonRight}>
                    <Typography>{commented.comment}</Typography>
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
                <div className={classes.commentWrapperLeft} key={i}>
                  <Typography>
                    {this.props.commentUserMast[commented.uid].userName}
                  </Typography>
                  <Avatar
                    alt="Remy Sharp"
                    src={this.props.commentUserMast[commented.uid].photoURL}
                    className={classes.avatarLeft}
                  />
                  <div className={classes.balloonLeft}>
                    <Typography>{commented.comment}</Typography>
                  </div>
                </div>
              );
            }
          })}
      </CardContent>
    );
  }
}

export default withStyles(styles)(withRouter(CommentsView));

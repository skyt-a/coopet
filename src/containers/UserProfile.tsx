import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { followActions } from "../actions";

import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Avatar,
  IconButton,
  Card,
  CardHeader,
  Chip,
  CardActions,
  Badge
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { withSnackbar, WithSnackbarProps } from "notistack";
import AddAPhotoRoundedIcon from "@material-ui/icons/AddAPhotoRounded";
import Loading from "../components/Loading";
import animalSpecies from "../assets/data/animalSpecies.json";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    avatar: {
      margin: 10,
      width: 60,
      height: 60
    },
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      marginTop: "60px",
      overflowX: "hidden"
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
      [theme.breakpoints.up("sm")]: {
        flexBasis: "calc(100% / 6)"
      },
      [theme.breakpoints.up("md")]: {
        flexBasis: "calc(100% / 10)"
      },
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
    card: {
      margin: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    cardComponent: {
      padding: "1px",
      textAlign: "left"
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "10px"
    },
    headActions: {
      textAlign: "right",
      padding: "2px",
      paddingTop: "12px"
    },
    followButton: {
      marginBottom: "2px"
    }
  });

interface Props
  extends WithStyles<typeof styles>,
    RouteComponentProps,
    WithSnackbarProps {
  userInfo?: any;
  auth?: any;
  isOther?: boolean;
  followingUids: string[];
  followerUids: string[];
  handleOpenFollowerModal: () => void;
  handleCloseFollowerModal: () => void;
  handleOpenFollowingModal: () => void;
  handleCloseFollowingModal: () => void;
  handleChangeFile?: (e: any) => void;
  onFollow?: (user: any) => void;
  onUnfollow?: (user: any) => void;
}

/**
 * ユーザープロフィール
 */
class UserProfile extends Component<Props> {
  /**
   * フォロー時の処理
   */
  handleFollow = (user: any) => {
    this.props.onFollow && this.props.onFollow(user);
    this.setState({
      following: true
    });
  };

  /**
   * フォロー解除時の処理
   */
  handleUnfollow = (user: any) => {
    this.props.onUnfollow && this.props.onUnfollow(user);
    this.setState({
      following: false
    });
  };

  /**
   * フォローしているか判定する
   */
  isFollowing = () => {
    if (!this.props.auth || !this.props.auth.additionalUserInfo) {
      return false;
    }
    return this.props.followerUids.includes(
      this.props.auth.additionalUserInfo.uid
    );
  };

  render() {
    if (!this.props.userInfo) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              alt="UserAvatar"
              src={this.props.userInfo.photoURL}
              className={classes.avatar}
            />
          }
          action={
            <div className={classes.headActions}>
              {!this.props.isOther ? (
                <IconButton component="label">
                  <input
                    type="file"
                    onChange={
                      this.props.handleChangeFile && this.props.handleChangeFile
                    }
                    className={classes.fileUpload}
                  />
                  <AddAPhotoRoundedIcon
                    color="primary"
                    className={classes.addPhotoIcon}
                  />
                </IconButton>
              ) : (
                <Chip
                  label={!this.isFollowing() ? "フォロー" : "フォロー済"}
                  variant={!this.isFollowing() ? "outlined" : "default"}
                  color="primary"
                  className={classes.followButton}
                  onClick={() => {
                    if (!this.isFollowing()) {
                      this.handleFollow(this.props.userInfo);
                    } else {
                      this.handleUnfollow(this.props.userInfo);
                    }
                  }}
                />
              )}
              <div>
                <Chip
                  color="primary"
                  label={
                    this.props.userInfo &&
                    this.props.userInfo.petSpecies &&
                    animalSpecies.filter(
                      ele => ele.id === this.props.userInfo.petSpecies
                    )[0].name
                  }
                  className={classes.chip}
                  variant="default"
                />
              </div>
            </div>
          }
          className={classes.cardComponent}
          title={this.props.userInfo.userName}
          subheader={this.props.userInfo.petName}
        />
        {/* <CardContent className={classes.cardComponent}>
              
            </CardContent> */}
        <CardActions className={classes.actions}>
          <Badge
            color="primary"
            showZero
            badgeContent={this.props.followingUids.length}
            className={classes.margin}
          >
            <Chip
              label="フォロー"
              variant="outlined"
              color="primary"
              onClick={this.props.handleOpenFollowingModal}
            />
          </Badge>
          <Badge
            color="primary"
            showZero
            badgeContent={this.props.followerUids.length}
            className={classes.margin}
          >
            <Chip
              label="フォロワー"
              variant="outlined"
              color="primary"
              onClick={this.props.handleOpenFollowerModal}
            />
          </Badge>
        </CardActions>
      </Card>
    );
  }
}

// reduxへのconnect
const mapStateToProps = () => (state: RootState) => {
  return {
    auth: state.Auth
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onFollow: (p: any) => {
      dispatch(followActions.follow.started(p));
    },
    onUnfollow: (p: any) => {
      dispatch(followActions.unfollow.started(p));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(withSnackbar(UserProfile))));

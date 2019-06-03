import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions, appActions, followActions } from "../actions";

import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Paper } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Follow from "../utils/Follow";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import User from "../utils/User";
import ImageDetailModal from "./ImageDetailModal";
import firebase from "../firebase";
import UserListModal from "./UserListModal";
import ImageList from "../components/ImageList";
import UserProfile from "./UserProfile";

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
      overflowX: "hidden"
    },
    flex: {
      display: "flex",
      flexWrap: "wrap"
    },
    fullWidth: {
      width: "100vw"
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
      padding: "1px",
      textAlign: "left"
    },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      paddingRight: "10px"
    },
    followButton: {
      margin: theme.spacing.unit
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  registerUser?: State;
  userInfo?: any;
  auth?: any;
  onStoreUserInfo: (p: any) => void;
  onUnSelectUser: () => void;
  onFollow: (p: any) => void;
  onUnfollow: (p: any) => void;
}

type UploadedImageInfo = {
  url: string;
  comment: string;
};

interface State {
  uploadedImage: any;
  followingUids: string[];
  followerUids: string[];
  isOpenImageDetailModal: boolean;
  uploadedImages: UploadedImageInfo[];
  selectedImageDetail: any;
  following: boolean;
  isOpenFollowingModal: boolean;
  isOpenFollowerModal: boolean;
}

let authUser: any;
let userInfo: any;

/**
 * 他ユーザー詳細画面
 */
class OtherMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    authUser = firebase.auth().currentUser;
    if (authUser === null) {
      this.props.history.push("/auth");
    }
    userInfo = this.props.userInfo;
    this.state = {
      uploadedImage: null,
      followingUids: [],
      followerUids: [],
      isOpenImageDetailModal: false,
      uploadedImages: [],
      selectedImageDetail: {},
      following: false,
      isOpenFollowingModal: false,
      isOpenFollowerModal: false
    };
  }

  componentDidMount = () => {
    if (!userInfo || !firebase.auth()) {
      this.props.history.push("/auth");
      return;
    }
    Follow.getFollowingRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followingUids: Object.keys(snap.val())
      });
    });
    Follow.getFollowerRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followerUids: Object.keys(snap.val())
      });
    });
    UploadedImage.getMyUploadedImageRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      const result = snap.val();
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
    Follow.getFollowerRef(userInfo.uid).on("child_removed", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followerUids: Object.keys(snap.val()),
        following: Object.keys(snap.val()).includes(authUser.uid)
      });
    });
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
  }

  /**
   * フォロー一覧モーダル表示
   */
  handleOpenFollowingModal = () => {
    if (this.state.followingUids.length === 0) {
      return;
    }
    this.setState({ isOpenFollowingModal: true });
  };

  /**
   * フォロー一覧モーダル非表示
   */
  handleCloseFollowingModal = () => {
    this.setState({ isOpenFollowingModal: false });
  };

  /**
   * フォロワー一覧モーダル表示
   */
  handleOpenFollowerModal = () => {
    if (this.state.followerUids.length === 0) {
      return;
    }
    this.setState({ isOpenFollowerModal: true });
  };

  /**
   * フォロワー一覧モーダル非表示
   */
  handleCloseFollowerModal = () => {
    this.setState({ isOpenFollowerModal: false });
  };

  /**
   * 画像詳細モーダル表示
   */
  handleOpenImageDetailModal = (selectedImageDetail: any) => {
    this.setState({
      selectedImageDetail: selectedImageDetail,
      isOpenImageDetailModal: true
    });
  };

  /**
   * 画像詳細モーダル非表示
   */
  handleCloseImageDetailModal = () => {
    this.setState({
      isOpenImageDetailModal: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Paper className={classNames(classes.paper, classes.fullWidth)}>
          <UserProfile
            userInfo={this.props.userInfo}
            followingUids={this.state.followingUids}
            followerUids={this.state.followerUids}
            handleOpenFollowerModal={this.handleOpenFollowerModal}
            handleCloseFollowerModal={this.handleCloseFollowerModal}
            handleOpenFollowingModal={this.handleOpenFollowingModal}
            handleCloseFollowingModal={this.handleCloseFollowingModal}
            isOther={true}
          />
          <ImageList
            uploadedImages={this.state.uploadedImages}
            handleOpenImageDetailModal={this.handleOpenImageDetailModal}
          />
        </Paper>
        {this.state.isOpenFollowingModal && (
          <UserListModal
            open={this.state.isOpenFollowingModal}
            onClose={this.handleCloseFollowingModal}
            uids={this.state.followingUids}
            title="フォロー"
          />
        )}
        {this.state.isOpenFollowerModal && (
          <UserListModal
            open={this.state.isOpenFollowerModal}
            onClose={this.handleCloseFollowerModal}
            uids={this.state.followerUids}
            title="フォロワー"
          />
        )}
        {this.state.isOpenImageDetailModal && (
          <ImageDetailModal
            open={this.state.isOpenImageDetailModal}
            selectedImageDetail={this.state.selectedImageDetail}
            onClose={this.handleCloseImageDetailModal}
          />
        )}
      </Fragment>
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
    onStoreUserInfo: (p: any) => {
      dispatch(authActions.storeUserInfo.started(p));
    },
    onUnSelectUser: () => {
      dispatch(appActions.unselectUser());
    },
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
)(withStyles(styles)(withRouter(OtherMain)));

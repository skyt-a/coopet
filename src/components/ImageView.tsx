import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Card,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Badge
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import animalSpecies from "../assets/data/animalSpecies.json";
import ImageDetailModal from "../containers/ImageDetailModal";
import Follow from "../utils/Follow";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      textAlign: "center"
    },
    select: {
      width: "60vw"
    },
    card: {
      margin: theme.spacing.unit,
      padding: "10px"
    },
    badge: {
      flexBasis: "calc(100% / 3.1)"
    },
    flex: {
      display: "flex",
      flexWrap: "wrap",
      overflow: "auto"
    },
    uploadedImageWrap: {
      position: "relative",
      height: "150px",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      margin: "1px"
    },
    uploadedImage: {
      width: "100%",
      height: "100%",
      objectFit: "scale-down"
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
  followingUid: string[];
  isFollowingView: boolean;
}

const allSpeciesItem = {
  id: "all",
  name: "すべて"
};

let userInfo: any;
let additionalUserInfo: any;
class ImageView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    userInfo = this.props.auth.user;
    additionalUserInfo = this.props.auth.additionalUserInfo;
    this.state = {
      selectedSpecies: allSpeciesItem.id,
      viewedImages: [],
      isOpenImageDetailModal: false,
      selectedImageDetail: {},
      postComment: "",
      commentUserMast: {},
      loading: false,
      followingUid: [],
      isFollowingView: true
    };
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
  }

  componentDidMount = () => {
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    this.updateImageViewBySpecies(this.state.selectedSpecies);
  };

  componentWillUnmount() {
    if (!userInfo) {
      return;
    }
    UploadedImage.getUploadedImageBySpeciesRef(
      this.state.selectedSpecies
    ).off();
    UploadedImage.getFullUploadedImageRef().off();
    // UploadedImage.getMyUploadedImageRef(userInfo.uid).off();
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handlecheckChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.checked;
    this.setState(obj);
    this.setState({
      loading: true
    });
    if (event.target.checked) {
      this.updateImageViewByFollow(this.state.viewedImages);
    } else {
      this.updateImageViewBySpecies(this.state.selectedSpecies);
    }
  };

  handleSpeciesSelectChange = () => (event: any) => {
    const selectedValue = event.target.value;
    this.setState({
      loading: true
    });
    this.updateImageViewBySpecies(selectedValue);
  };

  updateImageViewByFollow = (viewedImages: any[]) => {
    Follow.getFollowingRef(userInfo.uid).once("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      const followingUid = snap.val();
      const users = Object.keys(followingUid);
      this.setState({
        viewedImages: viewedImages.filter(image => users.includes(image.uid)),
        loading: false
      });
    });
  };

  updateImageViewBySpecies = (selectedValue: string) => {
    this.setState({
      viewedImages: []
    });
    Follow.getFollowingRef(userInfo.uid).off();
    UploadedImage.getFullUploadedImageRef().off();
    let targetRef: any = UploadedImage.getFullUploadedImageRef();
    // .limitToFirst(1)
    if (allSpeciesItem.id !== selectedValue) {
      targetRef = targetRef
        .orderByChild("petSpecies")
        .startAt(selectedValue)
        .endAt(selectedValue);
    }
    targetRef.on("value", (snap: any) => {
      let viewedImages: any[] = [];
      if (snap && snap.val()) {
        const result = snap.val();
        viewedImages = Object.keys(result)
          // 自分自身が投稿した画像は表示しない
          .filter(key => {
            const imageInfo = result[key];
            return imageInfo.uid !== userInfo.uid;
          })
          .map(key => {
            const imageInfo = result[key];
            imageInfo["key"] = key;
            return imageInfo;
          });
      }
      if (this.state.isFollowingView) {
        this.updateImageViewByFollow(viewedImages);
      } else {
        this.setState({
          viewedImages: viewedImages
        });
      }
      this.setState({
        loading: false
      });
    });
    this.setState({
      selectedSpecies: selectedValue
    });
  };

  handleOpenImageDetailModal = (selectedImageDetail: any) => {
    this.setState({
      selectedImageDetail: selectedImageDetail,
      isOpenImageDetailModal: true
    });
  };

  handleCloseImageDetailModal = () => {
    this.setState({
      isOpenImageDetailModal: false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.root}>
          <div className={classes.filterArea}>
            <TextField
              select
              label="ペットの種類"
              className={classes.select}
              value={
                this.state ? this.state.selectedSpecies : allSpeciesItem.id
              }
              margin="dense"
              variant="outlined"
              onChange={this.handleSpeciesSelectChange()}
            >
              <MenuItem key={allSpeciesItem.id} value={allSpeciesItem.id}>
                {allSpeciesItem.name}
              </MenuItem>
              {animalSpecies.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.isFollowingView}
                  onChange={this.handlecheckChange("isFollowingView")}
                  value="isFollowingView"
                  color="primary"
                />
              }
              label="フォローフィルタ"
            />
          </div>
          {this.state.viewedImages && this.state.viewedImages.length !== 0 && (
            <Card className={classNames(classes.flex, classes.card)}>
              {!this.state.isOpenImageDetailModal &&
              (!additionalUserInfo || this.state.loading) ? (
                <Loading />
              ) : (
                this.state.viewedImages.map((uploaded, i) => (
                  <Badge
                    key={i}
                    color="primary"
                    showZero
                    badgeContent={
                      uploaded.liked ? Object.keys(uploaded.liked).length : 0
                    }
                    className={classes.badge}
                  >
                    <div className={classes.uploadedImageWrap}>
                      <img
                        onClick={() =>
                          this.handleOpenImageDetailModal(uploaded)
                        }
                        alt={uploaded.comment}
                        className={classes.uploadedImage}
                        src={uploaded.url}
                      />
                    </div>
                  </Badge>
                ))
              )}
            </Card>
          )}
        </div>
        {this.state.isOpenImageDetailModal ? (
          <ImageDetailModal
            open={this.state.isOpenImageDetailModal}
            selectedImageDetail={this.state.selectedImageDetail}
            onClose={this.handleCloseImageDetailModal}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(ImageView));

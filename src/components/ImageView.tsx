import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Card, TextField, MenuItem } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import animalSpecies from "../assets/data/animalSpecies.json";
import ImageDetailModal from "./ImageDetailModal";

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
      padding: theme.spacing.unit
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
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    additionalUserInfo = this.props.auth.additionalUserInfo;
    this.state = {
      selectedSpecies: allSpeciesItem.id,
      viewedImages: [],
      isOpenImageDetailModal: false,
      selectedImageDetail: {},
      postComment: "",
      commentUserMast: {},
      loading: false
    };
  }

  componentDidMount = () => {
    if (!userInfo) {
      this.props.history.push("/auth");
      return;
    }
    UploadedImage.getFullUploadedImageRef()
      .orderByKey()
      // .limitToFirst(1)
      .on("value", snap => {
        if (!snap || !snap.val()) {
          return;
        }
        const result = snap.val();
        this.setState({
          viewedImages: Object.keys(result)
            // 自分自身が投稿した画像は表示しない
            .filter(key => {
              const imageInfo = result[key];
              return imageInfo.uid !== userInfo.uid;
            })
            .map(key => {
              const imageInfo = result[key];
              imageInfo["key"] = key;
              return imageInfo;
            })
        });
      });
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

  handleSpeciesSelectChange = () => (event: any) => {
    this.setState({
      viewedImages: [],
      loading: true
    });
    const selectedValue = event.target.value;
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
      this.setState({
        viewedImages: viewedImages,
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
    if (!additionalUserInfo || this.state.loading) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        <div className={classes.root}>
          <TextField
            select
            label="ペットの種類"
            className={classes.select}
            value={this.state.selectedSpecies}
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
        </div>
        <ImageDetailModal
          open={this.state.isOpenImageDetailModal}
          selectedImageDetail={this.state.selectedImageDetail}
          onClose={this.handleCloseImageDetailModal}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(ImageView));

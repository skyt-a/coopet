import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Paper, Card, TextField, MenuItem } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import UploadedImage from "../utils/UploadedImage";
import Loading from "./Loading";
import animalSpecies from "../assets/data/animalSpecies.json";

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
    flex: {
      display: "flex",
      flexWrap: "wrap"
    },
    uploadedImageWrap: {
      flexBasis: "calc(100% / 3)",
      position: "relative",
      height: "150px",
      border: "1px solid rgba(0, 0, 0, 0.12)"
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
      viewedImages: []
    };
    UploadedImage.getUploadedImageBySpeciesRef(this.state.selectedSpecies).on(
      "value",
      snap => {
        if (!snap || !snap.val()) {
          return;
        }
        const result = snap.val();
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
              return image;
            })
        });
      }
    );
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
    const selectedValue = event.target.value;
    UploadedImage.getUploadedImageBySpeciesRef(
      this.state.selectedSpecies
    ).off();
    UploadedImage.getUploadedImageBySpeciesRef(selectedValue).on(
      "value",
      snap => {
        if (!snap || !snap.val()) {
          return;
        }
        const result = snap.val();
        this.setState({
          viewedImages: Object.keys(result).map(key => {
            const inner = result[key];
            return inner[Object.keys(inner)[0]];
          })
        });
      }
    );
    this.setState({
      selectedSpecies: selectedValue
    });
  };

  render() {
    if (!additionalUserInfo) {
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
                    // onClick={() =>
                    //   this.handleOpenSelectedImageModal(
                    //     uploaded.url,
                    //     uploaded.comment
                    //   )
                    // }
                    alt={uploaded.comment}
                    className={classes.uploadedImage}
                    src={uploaded.url}
                  />
                </div>
              ))}
            </Card>
          )}
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(ImageView));

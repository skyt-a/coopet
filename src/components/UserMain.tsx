import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Button,
  Typography,
  Paper,
  TextField,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Avatar
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import firebase from "../firebase";
import Navbar from "../containers/Navbar";
import Follow from "../utils/Follow";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    avatar: {
      margin: 10,
      width: 60,
      height: 60
    },
    button: {
      margin: theme.spacing.unit
    },
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      marginTop: "60px"
    },
    listItemInner: {
      margin: "auto"
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
      display: "flex"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  registerUser: State;
  auth: any;
  onLogout: () => void;
}
interface State {
  userName: string;
  photoURL: string;
  uploadedImage: any;
  followingNumber: number;
  followerNumber: number;
}
const createObjectURL =
  (window.URL || (window as any).webkitURL).createObjectURL ||
  (window as any).createObjectURL;
let userInfo: any;
class UserMain extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let userName = "";
    userInfo = firebase.auth().currentUser;
    if (userInfo != null) {
      userName = userInfo.displayName || "";
    }
    this.state = {
      userName: userName,
      photoURL: "",
      uploadedImage: null,
      followingNumber: 0,
      followerNumber: 0
    };
    Follow.getFollowingRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followingNumber: Object.keys(snap.val()).length
      });
    });
    Follow.getFollowerRef(userInfo.uid).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      this.setState({
        followerNumber: Object.keys(snap.val()).length
      });
    });
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleChangeFile = (e: any) => {
    const files = e.target.files;
    const src = files.length === 0 ? "" : createObjectURL(files[0]);
    this.setState({ photoURL: src, uploadedImage: files[0] });
  };

  logout = () => {
    this.props.onLogout();
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Navbar title={this.state.userName} />
        <Paper className={classes.paper}>
          <section className={classes.flex}>
            <Avatar
              alt="Remy Sharp"
              src={userInfo.photoURL}
              className={classes.avatar}
            />
            <Typography variant="h5" color="inherit">
              {userInfo.displayName}
            </Typography>
          </section>
          <section className={classes.flex}>
            <Typography color="inherit">
              フォロー: {this.state.followingNumber}
            </Typography>
            <Typography color="inherit">
              フォロワー: {this.state.followerNumber}
            </Typography>
            <AddAPhotoIcon />
          </section>
        </Paper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(UserMain));

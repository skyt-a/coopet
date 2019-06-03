import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions, uploadActions, appActions } from "../actions";

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
import Loading from "../components/Loading";
import User from "../utils/User";
import animalSpecies from "../assets/data/animalSpecies.json";
import UserCard from "./UserCard";

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
    userCard: {
      width: "95%"
    },
    flex: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center"
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
  onSelectUser: (user: any) => void;
}

interface State {
  selectedSpecies: string;
  viewedUser: any[];
  isOpenUserDetailModal: boolean;
  selectedUserInfo: any;
  loading: boolean;
}

let userInfo: any;
let additionalUserInfo: any;

/**
 * ユーザー一覧画面
 */
class UserView extends Component<Props, State> {
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
      viewedUser: [],
      isOpenUserDetailModal: false,
      selectedUserInfo: {},
      loading: false
    };
    User.getUsersBySpeciesRef(this.state.selectedSpecies).on("value", snap => {
      if (!snap || !snap.val()) {
        return;
      }
      const result = snap.val();
      this.setState({
        viewedUser: Object.keys(result)
          .filter(key => {
            return key !== userInfo.uid;
          })
          .map(key => {
            const user = result[key];
            user["uid"] = key;
            return user;
          })
      });
    });
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
    User.getUsersBySpeciesRef(this.state.selectedSpecies).off();
    // UploadedImage.getMyUploadedImageRef(userInfo.uid).off();
  }

  /**
   * 画面入力時のハンドラー
   */
  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  /**
   * ペット種別変更時の処理
   */
  handleSpeciesSelectChange = () => (event: any) => {
    const selectedValue = event.target.value;
    this.setState({
      loading: true
    });
    User.getUsersBySpeciesRef(this.state.selectedSpecies).off();
    User.getUsersBySpeciesRef(selectedValue).on("value", snap => {
      let thisViewedUser = [];
      if (snap && snap.val()) {
        const result = snap.val();
        thisViewedUser = Object.keys(result)
          .filter(key => {
            return key !== userInfo.uid;
          })
          .map(key => {
            const user = result[key];
            user["uid"] = key;
            return user;
          });
      }
      this.setState({
        viewedUser: thisViewedUser,
        loading: false
      });
    });
    this.setState({
      selectedSpecies: selectedValue
    });
  };

  /**
   * ユーザー詳細画面への遷移
   */
  goToUserDetail = (selectedUserInfo: any) => (e: any) => {
    this.props.onSelectUser(selectedUserInfo);
    this.props.history.push("/otherView");
  };

  render() {
    if (!additionalUserInfo || this.state.loading) {
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
            margin="dense"
            variant="outlined"
            onChange={this.handleSpeciesSelectChange()}
          >
            {animalSpecies.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          {this.state.viewedUser && this.state.viewedUser.length !== 0 && (
            <Card className={classNames(classes.flex, classes.card)}>
              {this.state.viewedUser.map((user, i) => (
                <UserCard user={user} />
              ))}
            </Card>
          )}
        </Paper>
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
    onUploadImage: (param: any) => {
      dispatch(uploadActions.uploadImage.started(param));
    },
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UserView)));

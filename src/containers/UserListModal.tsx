import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { authActions, uploadActions, appActions } from "../actions";

import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Paper, Card, Modal, Typography } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import User from "../utils/User";
import UserCard from "../containers/UserCard";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    paper: {
      textAlign: "center",
      padding: theme.spacing.unit,
      overflowX: "hidden",
      maxHeight: "85vh"
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
  uids: string[];
  open: boolean;
  title: string;
  onClose: () => void;
}

interface State {
  viewedUser: any;
}

function getModalStyle() {
  return {
    backgroundColor: "white",
    width: "95vw",
    margin: "10px auto"
  };
}

class UserListModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      viewedUser: []
    };
  }
  componentDidMount = () => {
    let promises: Promise<any>[] = this.props.uids.map(id =>
      User.getUserByIdRef(id).once("value")
    );
    Promise.all(promises).then(users => {
      this.setState({
        viewedUser: users.map(user => user.val())
      });
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Modal open={this.props.open} onClose={this.props.onClose}>
        <div style={getModalStyle()}>
          <Paper className={classNames(classes.paper, classes.fullWidth)}>
            <Typography variant="h6">{this.props.title}</Typography>
            {this.state.viewedUser && this.state.viewedUser.length !== 0 && (
              <Card className={classNames(classes.flex, classes.card)}>
                {this.state.viewedUser.map((user: any, i: number) => (
                  <UserCard user={user} key={i} />
                ))}
              </Card>
            )}
          </Paper>
        </div>
      </Modal>
    );
  }
}

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
)(withStyles(styles)(withRouter(UserListModal)));

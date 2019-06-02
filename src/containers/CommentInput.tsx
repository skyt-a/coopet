import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "../modules";
import { appActions, uploadActions } from "../actions";

import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { TextField, Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import ChatIcon from "@material-ui/icons/Chat";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    cardContent: {
      padding: "3px",
      background: "#FFF",
      margin: "auto",
      width: "90vw"
    },
    postArea: {
      textAlign: "center",
      padding: "3px",
      display: "flex"
    },
    textField: {
      width: "70vw"
    },
    buttonArea: {
      margin: "auto 10px"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  selectedImageDetail: any;
  onSelectUser?: (user: any) => void;
  onCommentImage?: (param: { uid: any; key: string; comment: string }) => void;
}

interface State {
  isOpenUserDetailModal: boolean;
  commenteds: any[];
  commentUserMast?: any;
  selectedUserInfo: any;
  postComment: string;
}

class CommentInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpenUserDetailModal: false,
      commenteds: [],
      commentUserMast: null,
      selectedUserInfo: {},
      postComment: ""
    };
  }

  handleChange = (name: string) => (event: any) => {
    const obj: any = {};
    obj[name] = event.target.value;
    this.setState(obj);
  };

  handleCloseUserDetailModal = () => {
    this.setState({
      isOpenUserDetailModal: false,
      selectedUserInfo: {}
    });
  };

  commentUploadedImage = () => {
    if (!this.state.postComment || !this.props.onCommentImage) {
      return;
    }
    this.props.onCommentImage({
      comment: this.state.postComment,
      uid: this.props.selectedImageDetail.uid,
      key: this.props.selectedImageDetail.key
    });
    this.setState({
      postComment: ""
    });
    // this.handleOpenImageDetailModal(this.state.selectedImageDetail);
  };

  render() {
    const { classes } = this.props;
    return (
      <section className={classes.cardContent}>
        <div className={classes.postArea}>
          <TextField
            label="コメント"
            value={this.state.postComment}
            onChange={this.handleChange("postComment")}
            className={classes.textField}
            margin="none"
            variant="outlined"
          />
          <div className={classes.buttonArea}>
            <Button
              color="primary"
              variant="contained"
              onClick={this.commentUploadedImage}
            >
              <ChatIcon />
            </Button>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = () => (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    onSelectUser: (user: any) => {
      dispatch(appActions.selectUser(user));
    },
    onCommentImage: (param: any) => {
      dispatch(uploadActions.commentImage.started(param));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CommentInput)));

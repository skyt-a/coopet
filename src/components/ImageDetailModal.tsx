import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Card, CardMedia, CardContent, Modal, Button } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import CommentsView from "../containers/CommentsView";
import User from "../utils/User";
import UserCard from "../containers/UserCard";
import classNames from "classnames";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import ClearIcon from "@material-ui/icons/Clear";
import CommentInput from "../containers/CommentInput";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    modal: {
      overflow: "auto"
    },
    media: {
      objectFit: "contain",
      width: "80vw",
      margin: "auto",
      maxHeight: "30vh"
    },
    likeIcon: {
      width: "2rem",
      height: "2rem"
    },
    balloon: {
      position: "relative",
      display: "inline-block",
      maxWidth: "300px",
      padding: "8px 15px",
      background: "#f0f0f0",
      textAlign: "left",
      borderRadius: "15px",
      marginTop: "5px",
      "&::after": {
        content: "''",
        border: "14px solid transparent",
        borderTopColor: "#f0f0f0",
        position: "absolute",
        top: "0"
      }
    },
    leftBalloon: {
      flexDirection: "row",
      marginRight: "auto",
      "&::after": {
        left: "-10px"
      }
    },
    commentInputArea: {
      marginTop: "10px"
    },
    modalFooter: {
      marginTop: "10px",
      width: "90vw",
      margin: "auto",
      display: "flex",
      justifyContent: "space-between"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  auth?: any;
  open: boolean;
  selectedImageDetail: any;
  onClose: () => void;
  onLikeImage?: (detail: any) => void;
  onDislikeImage?: (detail: any) => void;
  onDeleteImage?: (detail: any) => void;
}

interface State {
  imageUser: any;
  isLiked: boolean;
}
function getModalStyle() {
  return {
    backgroundColor: "white",
    width: "90vw",
    margin: "auto",
    marginTop: "10px",
    maxHeight: "70vh",
    overflow: "auto"
  };
}
class ImageDetailModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imageUser: null,
      isLiked: false
    };
  }

  onRendered = () => {
    User.getUserByIdRef(this.props.selectedImageDetail.uid).once(
      "value",
      snap => {
        if (snap && snap.val()) {
          this.setState({
            imageUser: snap.val()
          });
        }
      }
    );
    console.log(this.props.auth);
    const liked = this.props.selectedImageDetail.liked
      ? Object.keys(this.props.selectedImageDetail.liked)
      : [];
    this.setState({
      isLiked:
        this.props.auth.additionalUserInfo.uid &&
        liked.includes(this.props.auth.additionalUserInfo.uid)
    });
  };

  onCancel = () => {
    this.props.onClose();
  };

  clickLike = () => {
    if (!this.props.onLikeImage || !this.props.onDislikeImage) {
      return;
    }

    if (!this.state.isLiked) {
      this.props.onLikeImage(this.props.selectedImageDetail);
    } else {
      this.props.onDislikeImage(this.props.selectedImageDetail);
    }
    this.setState({
      isLiked: !this.state.isLiked
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Modal
        open={this.props.open}
        onRendered={this.onRendered}
        onBackdropClick={this.props.onClose}
        className={classes.modal}
      >
        <div>
          <div style={getModalStyle()}>
            <Card>
              <CardContent>
                {this.state.imageUser && (
                  <UserCard user={this.state.imageUser} />
                )}
                <div
                  className={classNames(classes.balloon, classes.leftBalloon)}
                >
                  {this.props.selectedImageDetail.comment}
                </div>
              </CardContent>
              <CardMedia
                component="img"
                className={classes.media}
                src={this.props.selectedImageDetail.url}
                title="Contemplative Reptile"
              />
              <CommentsView
                onCancel={this.onCancel}
                selectedImageDetail={this.props.selectedImageDetail}
              />
            </Card>
          </div>
          <div className={classes.commentInputArea}>
            <CommentInput
              selectedImageDetail={this.props.selectedImageDetail}
            />
          </div>
          <div className={classes.modalFooter}>
            {this.props.auth.additionalUserInfo.uid ===
              this.props.selectedImageDetail.uid && (
              <Button
                onClick={() => {
                  if (!this.props.onDeleteImage) {
                    return;
                  }
                  this.props.onDeleteImage(this.props.selectedImageDetail);
                  this.props.onClose();
                }}
                color="secondary"
                variant="contained"
              >
                <DeleteIcon className={classes.likeIcon} color="action" />
              </Button>
            )}
            <Button
              onClick={this.clickLike}
              color="secondary"
              variant="contained"
            >
              <FavoriteIcon
                className={classes.likeIcon}
                color={this.state.isLiked ? "primary" : "action"}
              />
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={this.onCancel}
              className={classes.actionButton}
            >
              <ClearIcon color="action" />
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(withRouter(ImageDetailModal));

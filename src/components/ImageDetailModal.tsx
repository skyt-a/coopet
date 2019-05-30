import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Card, CardMedia, CardContent, Modal } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import CommentsView from "../containers/CommentsView";
import User from "../utils/User";
import UserCard from "../containers/UserCard";
import classNames from "classnames";

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
      marginLeft: "35px",
      marginRight: "auto",
      "&::after": {
        left: "-10px"
      }
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  open: boolean;
  selectedImageDetail: any;
  onClose: () => void;
}

interface State {
  imageUser: any;
}
function getModalStyle() {
  return {
    backgroundColor: "white",
    width: "90vw",
    margin: "auto",
    marginTop: "10px",
    maxHeight: "60vh"
  };
}
class ImageDetailModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imageUser: null
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
  };

  onCancel = () => {
    this.props.onClose();
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
        <div style={getModalStyle()}>
          <Card>
            <CardContent>
              {this.state.imageUser && <UserCard user={this.state.imageUser} />}
              <div className={classNames(classes.balloon, classes.leftBalloon)}>
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
      </Modal>
    );
  }
}

export default withStyles(styles)(withRouter(ImageDetailModal));

import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Modal
} from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import CommentsView from "../containers/CommentsView";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    media: {
      objectFit: "contain",
      width: "80vw",
      margin: "auto",
      padding: "20px",
      maxHeight: "30vh"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  open: boolean;
  selectedImageDetail: any;
  onClose: () => void;
}

interface State {}
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
  render() {
    const { classes } = this.props;
    return (
      <Modal open={this.props.open} onBackdropClick={this.props.onClose}>
        <div style={getModalStyle()}>
          <Card>
            <CardMedia
              component="img"
              className={classes.media}
              src={this.props.selectedImageDetail.url}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography>{this.props.selectedImageDetail.comment}</Typography>
            </CardContent>
            <CommentsView
              selectedImageDetail={this.props.selectedImageDetail}
            />
          </Card>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(withRouter(ImageDetailModal));

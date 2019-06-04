import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { Card, Badge } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";
import classNames from "classnames";
import Loading from "./Loading";
import firebase from "../firebase";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    flex: {
      display: "flex",
      flexWrap: "wrap"
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
      objectFit: "contain"
    },
    card: {
      margin: theme.spacing.unit,
      padding: "10px"
    },
    badge: {
      flexBasis: "calc(100% / 3.1)",
      [theme.breakpoints.up("sm")]: {
        flexBasis: "calc(100% / 4)"
      },
      [theme.breakpoints.up("md")]: {
        flexBasis: "calc(100% / 5)"
      }
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  uploadedImages: any[];
  handleOpenImageDetailModal: (uploaded: any) => void;
}

/**
 * 画像一覧モジュール
 */
class ImageList extends Component<Props> {
  render() {
    if (!firebase.auth()) {
      return <Loading />;
    }
    const { classes } = this.props;
    return (
      <Fragment>
        {this.props.uploadedImages && this.props.uploadedImages.length > 0 && (
          <Card className={classNames(classes.flex, classes.card)}>
            {this.props.uploadedImages.map((uploaded, i) => (
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
                    onClick={() => {
                      this.props.handleOpenImageDetailModal(uploaded);
                    }}
                    alt={uploaded.comment}
                    className={classes.uploadedImage}
                    src={uploaded.url}
                  />
                </div>
              </Badge>
            ))}
          </Card>
        )}
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(ImageList));

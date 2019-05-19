import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import { CircularProgress, createStyles } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    progress: {
      margin: "auto"
    },
    progressWrapper: {
      textAlign: "center"
    }
  });
interface Props extends WithStyles<typeof styles>, RouteComponentProps {}
class Loading extends Component<Props> {
  render() {
    const { classes } = this.props;
    return (
      <section className={classes.progressWrapper}>
        <CircularProgress className={classes.progress} />
      </section>
    );
  }
}
export default withStyles(styles)(withRouter(Loading));

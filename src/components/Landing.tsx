import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
// ランディングページのTop画像
import landingImgPath from "../assets/images/landing-theme.jpg";
import { Button, Typography } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router-dom";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    paragraph: {
      padding: theme.spacing.unit * 2
    },
    button: {},
    landingView: {
      backgroundColor: "transparent",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `url(${landingImgPath})`,
      height: "100vh",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        /* 輪郭がぼやけてしまうのでブラー範囲を広げる */
        top: "-5px",
        bottom: "-5px",
        left: "-5px",
        right: "-5px",
        background: "inherit",
        filter: "blur(3px)"
      }
    },
    landingSection: {
      position: "absolute",
      textAlign: "center",
      top: "50%",
      left: 0,
      right: 0,
      margin: "auto"
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}
/**
 * ランディングページ
 */
class Landing extends Component<Props> {
  /**
   * ログインページへ遷移する
   */
  goToLoginPage = () => {
    this.props.history.push("/auth");
  };
  public render() {
    const { classes } = this.props;
    return (
      <article className={classes.landingView}>
        <section className={classes.landingSection}>
          <Typography variant="h6" paragraph className={classes.paragraph}>
            ペットの素晴らしさを共有しましょう！
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={this.goToLoginPage}
          >
            Start
          </Button>
        </section>
      </article>
    );
  }
}

export default withStyles(styles)(withRouter(Landing));

import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import { createStyles } from "@material-ui/core";
import { withRouter, RouteComponentProps } from "react-router";
import "./Loading.scss";
import footPrint from "../assets/images/footprint.svg";

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
    return (
      // <section className={classes.progressWrapper}>
      //   <CircularProgress className={classes.progress} />
      // </section>
      <Fragment>
        <svg id="svg-sprite">
          <symbol id="paw" viewBox="0 0 249 209.32">
            <image
              xlinkHref={footPrint}
              x="0"
              y="0"
              height="100px"
              width="100px"
            />
          </symbol>
        </svg>

        <div className="footprints">
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>

          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
          <div className="paw">
            <svg className="icon">
              <use xlinkHref="#paw" />
            </svg>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default withStyles(styles)(withRouter(Loading));

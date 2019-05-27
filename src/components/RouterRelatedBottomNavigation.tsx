import React, { Component } from "react";

import { withStyles, WithStyles, StyleRules } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

// Material-UIアイコン取得
import ImageIcon from "@material-ui/icons/Image";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyles from "@material-ui/core/styles/createStyles";

// Route関連
import { withRouter, RouteComponentProps } from "react-router-dom";

// スタイル
const styles = (theme: Theme): StyleRules =>
  createStyles({
    wrapper: {
      display: "block",
      width: "100%",
      position: "fixed",
      left: 0,
      bottom: 0,
      zIndex: 1000,
      textAlign: "center"
    },
    root: {
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },
    button: {
      maxWidth: "100%" // ボタンが横一杯に広がって欲しくない時はコメントアウト
    }
  });

interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

class RouteRelatedBottomNavigation extends Component<Props> {
  navButtons = [
    {
      label: "画像",
      icon: <ImageIcon />,
      link_to: "/imageView",
      onclick: () => this.props.history.push("/imageView")
    },
    {
      label: "ユーザー",
      icon: <AccountCircle />,
      link_to: "/userView",
      onclick: () => this.props.history.push("/userView")
    },
    {
      label: "会員情報",
      icon: <InfoIcon />,
      link_to: "/userMain",
      onclick: () => this.props.history.push("/userMain")
    }
  ];

  isViewBottomNav() {
    if (!this.props.location) {
      return false;
    }
    return ["/userMain", "/userView", "/imageView"].includes(
      this.props.location.pathname
    );
  }

  buttons = this.navButtons.map((button_info, index) => {
    return (
      <BottomNavigationAction
        color="secondary"
        value={button_info.link_to}
        label={button_info.label}
        icon={button_info.icon}
        onClick={button_info.onclick}
      />
    );
  });

  render() {
    if (!this.isViewBottomNav()) {
      return null;
    }
    // Material-ui関連
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <BottomNavigation
          color="secondary"
          value={this.props.location.pathname}
          showLabels
          className={classes.root}
          children={this.buttons}
        />
      </div>
    );
  }
}

// Material-uiのテーマ設定＋Redux設定＋React-Router情報取得
export default withRouter(
  withStyles(styles, { withTheme: true })(RouteRelatedBottomNavigation)
);

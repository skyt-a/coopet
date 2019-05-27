import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { AppBar, MenuItem, Drawer } from "@material-ui/core";
import { Toolbar, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import logo from "../assets/images/logo.png";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      textAlign: "center"
    },
    toolbar: {
      padding: 0
    },
    paragraph: {
      fontFamily: "serif",
      padding: theme.spacing.unit * 2
    },
    menuButton: {
      marginLeft: theme.spacing.unit
    },
    logo: {
      height: "60px",
      position: "absolute",
      margin: "auto",
      right: 0,
      left: 0
    }
  });

interface Props extends WithStyles<typeof styles> {
  onLogout: () => void;
  title: string;
  menuItems: any[];
  open: boolean;
  onOpen: () => void;
  onBackdropClick: () => void;
}
interface MenuItem {
  menuLabel: string;
  func: () => void;
}

// Component を定義: React.PureComponent<Props> で拡張する
class Navbar extends Component<Props> {
  createMenuItem() {
    return this.props.menuItems.map((item, index) => (
      <MenuItem onClick={item.func} key={index}>
        {item.menuLabel}
      </MenuItem>
    ));
  }
  public render() {
    const { classes } = this.props;
    return (
      <div>
        <Drawer
          open={this.props.open}
          ModalProps={{
            onBackdropClick: () => {
              this.props.onBackdropClick();
            }
          }}
        >
          {this.createMenuItem()}
        </Drawer>
        <AppBar color="secondary">
          <Toolbar className={classes.toolbar}>
            <IconButton
              onClick={this.props.onOpen}
              color="inherit"
              aria-label="Menu"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <img alt="logo" src={logo} className={classes.logo} />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Navbar);

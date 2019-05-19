import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { AppBar, MenuItem, Drawer } from "@material-ui/core";
import { Toolbar, IconButton, Typography } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      textAlign: "center"
    },
    paragraph: {
      fontFamily: "serif",
      padding: theme.spacing.unit * 2
    },
    menuButton: {
      marginLeft: theme.spacing.unit
    }
  });

interface Props extends WithStyles<typeof styles> {
  onLogout: () => void;
  title: string;
}
interface State {
  open: boolean;
}
interface MenuItem {
  menuLabel: string;
  func: () => void;
}

// Component を定義: React.PureComponent<Props> で拡張する
class Navbar extends Component<Props, State> {
  menuItems: MenuItem[] = [
    {
      menuLabel: "ログアウト",
      func: () => {
        this.props.onLogout();
        this.onToggle();
      }
    }
  ];
  constructor(props: any) {
    super(props);
    this.state = {
      open: false
    };
  }
  onToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  createMenuItem() {
    return this.menuItems.map((item, index) => (
      <MenuItem onClick={item.func} key={index}>
        {item.menuLabel}
      </MenuItem>
    ));
  }
  public render() {
    const { open } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Drawer open={open}>{this.createMenuItem()}</Drawer>
        <AppBar color="primary">
          <Toolbar>
            <IconButton
              onClick={this.onToggle}
              color="inherit"
              aria-label="Menu"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" color="inherit">
              {this.props.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Navbar);

import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { AppBar, MenuItem, Drawer } from "@material-ui/core";
import { Toolbar, IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      textAlign: "center"
    },
    paragraph: {
      fontFamily: "serif",
      padding: theme.spacing.unit * 2
    }
  });

interface Props extends WithStyles<typeof styles> {
  open: boolean;
  onToggle: Function;
}
const menuItems = ["React", "Redux", "React Router"];
// Component を定義: React.PureComponent<Props> で拡張する
class Navbar extends Component<Props> {
  constructor(props: any) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle() {
    this.props.onToggle();
  }

  createMenuItem() {
    return menuItems.map((item, index) => (
      <MenuItem onClick={this.onToggle} key={index}>
        {item}
      </MenuItem>
    ));
  }
  public render() {
    const { open } = this.props;
    return (
      <div>
        <Drawer open={open}>{this.createMenuItem()}</Drawer>
        <AppBar color="primary">
          <Toolbar>
            <IconButton
              onClick={this.onToggle}
              color="inherit"
              aria-label="Menu"
            >
              <DeleteIcon />
            </IconButton>
            <Typography variant="h5" color="inherit">
              React Study
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Navbar);

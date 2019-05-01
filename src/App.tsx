import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";

// Components
import Navbar from './components/Navbar';
// withRoot を import
import withRoot from './utils/withRoot';

// styles を定義
const styles = (theme: Theme): StyleRules => createStyles({
  root: {

  }
});

// 型定義 Props を定義
type Props = WithStyles<typeof styles>;

interface State {
  open: boolean;
}

// App Component を定義
class App extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      open: false
    };
    this.onToggle = this.onToggle.bind(this);
  }
  onToggle() {
    this.setState({
      open: !this.state.open
    });
  }
  render() {
    return <div>
      <Navbar open={this.state.open} onToggle={this.onToggle} />
    </div>
  }
}
// withRoot で export
export default withRoot(withStyles(styles)(App));
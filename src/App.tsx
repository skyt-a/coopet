import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";

// Components
import Landing from "./components/Landing";
// withRoot を import
import withRoot from "./utils/withRoot";
// robotoフォントをインポート
import "typeface-roboto";

// styles を定義
const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {}
  });

// 型定義 Props を定義
type Props = WithStyles<typeof styles>;

interface State {
  open: boolean;
}

// App Component を定義
class App extends Component<Props, State> {
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
    return (
      <div>
        <Landing />
      </div>
    );
  }
}
// withRoot で export
// これによってアプリケーション全体に設定が適用される
export default withRoot(withStyles(styles)(App));

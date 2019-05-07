import React, { Component } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";

// Components
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
// withRoot を import
import withRoot from "./utils/withRoot";
// robotoフォントをインポート
import "typeface-roboto";
// Routing設定をインポート
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./components/Login";

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
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Landing />} />
          <Route path="/top" component={Landing} />
          <Route path="/login" component={Login} />
          <Route
            path="/nav"
            render={() => (
              <Navbar open={this.state.open} onToggle={this.onToggle} />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}
// withRoot で export
// これによってアプリケーション全体に設定が適用される
export default withRoot(withStyles(styles)(App));

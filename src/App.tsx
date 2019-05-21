import React, { Component, Fragment } from "react";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import withStyles, {
  WithStyles,
  StyleRules
} from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";

// Components
import Landing from "./components/Landing";
import Auth from "./containers/Auth";
import RegisterUser from "./containers/RegisterUser";
import UserMain from "./containers/UserMain";
// withRoot を import
import withRoot from "./utils/withRoot";
// robotoフォントをインポート
import "typeface-roboto";
// Routing設定をインポート
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import RouterRelatedBottomNavigation from "./components/RouterRelatedBottomNavigation";

// styles を定義
const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {}
  });

// 型定義 Props を定義
interface Props extends WithStyles<typeof styles>, RouteComponentProps {}

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
      <Fragment>
        <Switch>
          <Route exact path="/" render={() => <Landing />} />
          <Route path="/top" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/registerUser" component={RegisterUser} />
          <Route path="/userMain" component={UserMain} />
        </Switch>
        <RouterRelatedBottomNavigation />
      </Fragment>
    );
  }
}
// withRoot で export
// これによってアプリケーション全体に設定が適用される
export default withRoot(withStyles(styles)(App));

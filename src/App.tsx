import React, { Component } from "react";
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
import ImageView from "./containers/ImageView";
import UserView from "./containers/UserView";
import OtherMain from "./containers/OtherMain";

// withRoot を import
import withRoot from "./utils/withRoot";
// robotoフォントをインポート
import "typeface-roboto";
// Routing設定をインポート
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import RouterRelatedBottomNavigation from "./components/RouterRelatedBottomNavigation";
import AfterAuthLoading from "./containers/AfterAuthLoading";

import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

import { RootState } from "./modules";
import { SnackbarProvider } from "notistack";

// styles を定義
const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {}
  });

// 型定義 Props を定義
interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  app: any;
}

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
      <SnackbarProvider maxSnack={3}>
        <Switch>
          <Route path="/reload" component={() => null} key="reload" />
          <Route exact path="/" render={() => <Landing />} />
          <Route path="/top" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/registerUser" component={RegisterUser} />
          <Route
            path="/changeUser"
            render={() => <RegisterUser isChangeMode={true} />}
          />
          <Route path="/userMain" component={UserMain} />
          <Route path="/imageView" component={ImageView} />
          <Route path="/userView" component={UserView} />
          <Route
            path="/otherView"
            render={() => (
              <OtherMain userInfo={this.props.app.selectedUserInfo} />
            )}
          />
          <Route path="/afterAuth" component={AfterAuthLoading} />
        </Switch>
        <RouterRelatedBottomNavigation />
      </SnackbarProvider>
    );
  }
}

const mapStateToProps = () => (state: RootState) => {
  return {
    app: state.App
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {};
};

// withRoot で export
// これによってアプリケーション全体に設定が適用される
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRoot(withStyles(styles)(App)));

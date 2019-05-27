import * as React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  // テーマ色設定
  palette: {
    type: "light",
    primary: {
      main: "#CCB093"
    },
    secondary: {
      // light: will be calculated from palette.primary.main,
      main: "#fff"
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    }
  },
  // タイポグラフィ設定
  typography: {
    useNextVariants: true
  }
});

function withRoot<P>(Component: React.ComponentType<P>) {
  function WithRoot(props: P) {
    // CssBaseLineによってブラウザ感
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;

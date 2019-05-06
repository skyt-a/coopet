import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { red, pink } from '@material-ui/core/colors';

const theme = createMuiTheme({
    // テーマ色設定
    palette: {
        type: 'dark',
        primary: red,
        secondary: pink,
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
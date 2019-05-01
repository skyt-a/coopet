import * as React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// 任意の Theme Colors
import CssBaseline from '@material-ui/core/CssBaseline';
import { red, pink } from '@material-ui/core/colors';

const theme = createMuiTheme({
    // Theme Colors
    palette: {
        primary: red,
        secondary: pink,
    },
    // typography
    typography: {
        useNextVariants: true
    }
});

function withRoot<P>(Component: React.ComponentType<P>) {
    function WithRoot(props: P) {
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
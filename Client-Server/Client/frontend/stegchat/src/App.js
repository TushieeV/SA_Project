import React from 'react';
import Login from './Login';
import MessageBox from './MessageBox';
import './App.css';
import {Helmet} from 'react-helmet';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');
    const theme = React.useMemo(
      () =>
        createMuiTheme({
          palette: {
            type: prefersDarkMode ? 'dark' : 'light',
          },
        }),
      [prefersDarkMode],
    );
    return (
      <div className="application">
        <ThemeProvider theme={theme}>
          <Helmet>
            <style>{'body {background-color: #121212; }'}</style>
          </Helmet>
          <MessageBox />
        </ThemeProvider>
      </div>
    );
}

export default App;

import React from 'react';
import Login from './Login';
import MessageBox from './MessageBox';
import './App.css';
import { useState } from 'react';
import {Helmet} from 'react-helmet';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
    const [username, setUsername] = useState(0);
    const [token, setToken] = useState(0);
    if (!token) {
      return (
        <div className="application">
          <ThemeProvider theme={theme}>
            <Helmet>
              <style>{'body {background-color: #121212; }'}</style>
            </Helmet>
            <Login setTok={setToken} setUsername={setUsername}/>
          </ThemeProvider>
        </div>
      );
    } else {
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
}

export default App;

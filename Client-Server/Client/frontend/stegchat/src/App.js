import React from 'react';
import Login from './Login';
import MessageBox from './MessageBox';
import './App.css';
import {Helmet} from 'react-helmet';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: createMuiTheme({
        palette: {
          type: 'dark'
        }
      }),
      username: null,
      token: null,
      dh: null,
      pkeyPosted: false
    };
    this.render = this.render.bind(this);
    this.setToken = this.setToken.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setDh = this.setDh.bind(this);
  }
  setToken(val) {
    this.setState({token: val});
  }
  setUsername(val) {
    this.setState({username: val});
  }
  setDh(val) {
    this.setState({dh: val});
  }
  componentDidUpdate() {
    if (!this.state.pkeyPosted && this.state.dh) {
      fetch(`http://127.0.0.1:5000/my-pkey?token=${this.state.token}&pkey=${this.state.dh.public_key}`, {method: 'post'})
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({pkeyPosted: true})
      });
    }
  }
  render() {
    if (!this.state.pkeyPosted) {
      return (
        <div className="application">
          <ThemeProvider theme={this.state.theme}>
            <Helmet>
              <style>{'body {background-color: #121212; }'}</style>
            </Helmet>
            <Login 
              setTok={this.setToken} 
              setUsername={this.setUsername}
              setDh={this.setDh}
            />
          </ThemeProvider>
        </div>
      );
    } else {
      return (
        <div className="application">
          <ThemeProvider theme={this.state.theme}>
            <Helmet>
              <style>{'body {background-color: #121212; }'}</style>
            </Helmet>
            <MessageBox />
          </ThemeProvider>
        </div>
      );
    }
  }
}

export default App;

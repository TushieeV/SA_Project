import React from 'react';
import Login from './Login';
import Main from './Main';
import './App.css';
import {Helmet} from 'react-helmet';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from './AppBar'

const keytar = require('electron').remote.require('keytar');

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
      pkeyPosted: false,
    };
    this.render = this.render.bind(this);
    this.setToken = this.setToken.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.setDh = this.setDh.bind(this);
    this.signOut = this.signOut.bind(this);
    this.deactivate = this.deactivate.bind(this);
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
  signOut() {
    this.setState({
      username: null,
      token: null,
      pkeyPosted: false,
      dh: null
    });
  }
  deactivate() {
    keytar.deletePassword('stegchat', this.state.username);
    keytar.deletePassword('stegchat-tokens', this.state.username);
    this.signOut();
  }
  componentDidUpdate() {
    if (!this.state.pkeyPosted && this.state.dh) {
      fetch(`http://1.40.77.213:5000/my-pkey?token=${this.state.token}&pkey=${this.state.dh.public_key}`, {method: 'post'})
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.Success) {
          this.setState({pkeyPosted: true});
        }
      });
    }
  }
  render() {
    if (!this.state.pkeyPosted) {
      return (
        <div className="application">
          <ThemeProvider theme={this.state.theme} style={{width: "100vw"}}>
            <Helmet>
              <style>{'body {background-color: #282828; }'}</style>
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
          <ThemeProvider theme={this.state.theme} style={{width: "100vw"}}>
            <Helmet>
              <style>{'body {background-color: #282828; }'}</style>
            </Helmet>
            <AppBar 
              signOut={this.signOut}
              deactivate={this.deactivate}  
            />
            <Main 
              username={this.state.username}
              token={this.state.token}
            />
          </ThemeProvider>
        </div>
      );
    }
  }
}

export default App;

import React from 'react';
import Login from './Login';
import Main from './Main';
import './App.css';
import {Helmet} from 'react-helmet';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from './AppBar'
import { server_addr } from './server_addr';
import { socket } from './socket'
import * as url from './stegchatlogo.PNG';
import Grid from '@material-ui/core/Grid';
 
const keytar = require('electron').remote.require('keytar');
const remote = require('electron').remote

let w = remote.getCurrentWindow();

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

    // Uncomment below to clear all account and token data
    keytar.findCredentials('stegchat').then(res => {
      res.map(obj => {
        keytar.deletePassword('stegchat', obj.account)
      })
    })

    keytar.findCredentials('stegchat-tokens').then(res => {
      res.map(obj => {
        keytar.deletePassword('stegchat-tokens', obj.account)
      })
    })
  
  }
  componentDidMount() {
    socket.on('res-my-pkey', (data) => {
      console.log(data);
      if (data.Success) {
        this.setState({pkeyPosted: true});
      }
    });
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
    }, () => {
      socket.disconnect();
      //socket.connect();
      w.close();
    });
  }
  deactivate() {
    keytar.deletePassword('stegchat', this.state.username);
    keytar.deletePassword('stegchat-tokens', this.state.username);
    socket.emit('deactivate', {
      token: this.state.token,
      username: this.state.username
    });
    this.signOut();
  }
  componentDidUpdate() {
    if (!this.state.pkeyPosted && this.state.dh && this.state.token) {
      //fetch(`http://${server_addr}/my-pkey?token=${this.state.token}&pkey=${this.state.dh.public_key}`, {method: 'post'})
      /*fetch(`${server_addr}/my-pkey`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'token': this.state.token
        },
        body: JSON.stringify({
          pkey: this.state.dh.public_key
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.Success) {
          this.setState({pkeyPosted: true});
        }
      });*/
      socket.emit('my-pkey', {
        token: this.state.token,
        pkey: this.state.dh.public_key
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
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="center"
              justify="center"
              style={{marginTop: "25vh"}}
            >
              <Grid item xs={12}>
                <img src={url.default} />
              </Grid>
              <Grid item xs={12}>
                <Login 
                  setTok={this.setToken} 
                  setUsername={this.setUsername}
                  setDh={this.setDh}
                  socket={socket}
                />
              </Grid>
            </Grid>
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
              socket={socket}
            />
          </ThemeProvider>
        </div>
      );
    }
  }
}

export default App;

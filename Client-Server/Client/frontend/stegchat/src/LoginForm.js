import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { server_addr } from './server_addr';

const keytar = require('electron').remote.require('keytar');

const useStyles = theme => ({
    paper: {
        //marginTop: theme.spacing(8),
        marginTop: "90%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            creds: null,
            tokens: null,
            msg: null,
            msgColor: "red",
        }
        keytar.findCredentials('stegchat')
            .then(result => {
                this.state.creds = result;
            });
        keytar.findCredentials('stegchat-tokens')
            .then(result => {
                this.state.tokens = result;
            })
        this.fieldChange = this.fieldChange.bind(this);
        this.render = this.render.bind(this);
        this.logPress = this.logPress.bind(this);
        this.updateCreds = this.updateCreds.bind(this);
    }
    updateCreds(user) {
        keytar.setPassword('stegchat', user.username, user.password);
        keytar.findCredentials('stegchat')
            .then(result => {
                this.setState({creds: result});
            });
    }
    updateTokens(user, token) {
        keytar.setPassword('stegchat-tokens', user, token);
        keytar.findCredentials('stegchat-tokens')
            .then(result => {
                this.setState({tokens: result});
            })
    }
    fieldChange(value, field) {
        if (field === 'username') {
            this.setState({username: value});
        } else {
            this.setState({password: value});
        }
    }
    logPress(e){
        e.preventDefault();
        if (!this.state.username || !this.state.password) {
            if (!this.state.username && !this.state.password){
                this.setState({msg: "Both fields empty!", msgColor: "red"});
            } else if (!this.state.username) {
                this.setState({msg: "Please enter a username", msgColor: "red"});
            } else {
                this.setState({msg: "Please enter a password", msgColor: "red"});
            }
            return;
        }
        this.setState({msg: null});
        var user = {
            username: this.state.username,
            password: this.state.password,
        }
        if (this.props.prompt === 'Sign Up') {
            const found = this.state.creds.some(el => el.account === user.username);
            if (!found) {
                this.updateCreds(user);
                this.setState({msg: "Registration successful!", msgColor: "green"});
            } else {
                this.setState({msg: "Username already taken", msgColor: "red"});
            }
        } else {
            const foundAccount = this.state.creds.some(el => (el.account === user.username && el.password === user.password));
            const foundToken = this.state.tokens.some(el => el.account === user.username);
            if (foundAccount && !foundToken) {
                this.props.setUsername(user.username);
                fetch(`http://${server_addr}/get-token?username=${user.username}`)
                    .then(response => response.json())
                    .then(data => {
                        this.updateTokens(this.state.username, data.token);
                        this.props.setTok(data.token);
                    });
                fetch(`http://127.0.0.1:6001/get-dh`)
                    .then(response => response.json())
                    .then(data => {
                        this.props.setDh(data)
                    });
            } else if (foundAccount && foundToken) {
                this.props.setUsername(user.username);
                keytar.getPassword('stegchat-tokens', user.username)
                    .then(result => {
                        //fetch(`http://${server_addr}/get-token?username=${user.username}&token=${result}`)
                        fetch(`http://${server_addr}/get-token?username=${user.username}`, {
                           headers: {
                               'token': result
                           } 
                        })
                        .then(response => response.json())
                        .then(data => {
                            this.updateTokens(this.state.username, data.token);
                            this.props.setTok(data.token);
                            console.log(data);
                        });
                    });
                fetch(`http://127.0.0.1:6001/get-dh`)
                    .then(response => response.json())
                    .then(data => {
                        this.props.setDh(data)
                    });
            } else {
                this.setState({msg: "Incorrect username or password", msgColor: "red"});
            }
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h1" variant="h5">
                        {this.props.prompt}
                    </Typography>
                    <form className={classes.form} onSubmit={(e) => this.logPress(e)}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoFocus
                            onChange={(e) => this.fieldChange(e.target.value, "username")}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            onChange={(e) => this.fieldChange(e.target.value, "password")}
                        />
                        <p style={{color: this.state.msgColor}}>{this.state.msg}</p>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={(e) => this.logPress(e)}
                        >
                            {this.props.prompt}
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.props.backPressed}
                        >
                            Back
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(LoginForm);
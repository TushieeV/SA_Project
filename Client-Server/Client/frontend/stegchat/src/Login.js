import { Button } from '@material-ui/core';
import React from 'react';
import LoginForm from './LoginForm';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const fs = require('electron').remote.require('fs');

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        position: 'absolute',
        top: '30%',
    },
    button: {
        margin: theme.spacing(3, 0, 2)
    }
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        var credentials;
        try {
            credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
        } catch(e) {
            console.log(e);
        }
        this.state = {
            username: null,
            password: null,
            creds: credentials.logins,
            signUp: false,
            signIn: false
        }
        console.log(this.state.creds);
        this.logPress = this.logPress.bind(this);
        this.render = this.render.bind(this);
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
        this.fieldChange = this.fieldChange.bind(this);
        this.resetBools = this.resetBools.bind(this);
    }
    logPress(e){
        e.preventDefault();
        if (this.state.username && this.state.password) {
            var user = {
                username: this.state.username,
                password: this.state.password
            }

            var newCreds = [...this.state.creds];
            newCreds.push(user);
            this.setState({creds: newCreds});
            const update = {
                logins: newCreds
            }
            try {
                fs.writeFileSync('credentials.json', JSON.stringify(update), 'utf-8');
            } catch(e) {
                console.log(e);
            }
            this.setState({loggedIn: true});
        }
    }
    toggleSignUp() {
        const newState = !this.state.signUp;
        this.setState({signUp: newState});
    }
    toggleSignIn() {
        const newState = !this.state.signIn;
        this.setState({signIn: newState});
    }
    fieldChange(value, field) {
        if (field === 'username') {
            this.setState({username: value});
        } else {
            this.setState({password: value});
        }
    }
    resetBools() {
        this.setState({
            signIn: false,
            signUp: false
        });
    }
    render() {
        const { classes } = this.props;
        if (!this.state.signUp && !this.state.signIn) {
            return (
                <Container className={ classes.paper }>
                    <CssBaseline />
                    <div className={ classes.form }>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.toggleSignUp}
                        >
                            Sign Up
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.toggleSignIn}
                        >
                            Sign In
                        </Button>
                    </div>
                </Container>
            )
        } else {
            const prompt = this.state.signIn ? 'Sign In' : 'Sign Up';
            return (
                <LoginForm
                    prompt={prompt}
                    logPress={this.logPress}
                    usernameChange={(value) => this.fieldChange(value, 'username')}
                    passwordChange={(value) => this.fieldChange(value, 'password')}
                    backPressed={this.resetBools}
                />
            );
        }
    }
}

export default withStyles(useStyles, {withTheme: true})(Login);
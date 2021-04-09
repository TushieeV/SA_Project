import { Button } from '@material-ui/core';
import React from 'react';
import LoginForm from './LoginForm';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = theme => ({
    paper: {
        //marginTop: theme.spacing(8),
        //marginTop: "50%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '50%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        position: 'absolute',
        //top: '40%',
    },
    button: {
        margin: theme.spacing(3, 0, 2)
    }
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signUp: false,
            signIn: false
        }
        this.render = this.render.bind(this);
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
        this.resetBools = this.resetBools.bind(this);
    }
    toggleSignUp() {
        const newState = !this.state.signUp;
        this.setState({signUp: newState});
    }
    toggleSignIn() {
        const newState = !this.state.signIn;
        this.setState({signIn: newState});
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
                    backPressed={this.resetBools}
                    setUsername={this.props.setUsername}
                    setTok={this.props.setTok}
                    setDh={this.props.setDh}
                    socket={this.props.socket}
                />
            );
        }
    }
}

export default withStyles(useStyles, {withTheme: true})(Login);
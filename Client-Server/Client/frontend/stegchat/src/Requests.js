import React from 'react';
import RequestsSent from './RequestsSent';
import RequestsReceived from './RequestsReceived';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';


const useStyles = theme => ({
    root: {
        width: "25%",
        margin: "1%"
    }
});

class Requests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: []
        };
        this.addSession = this.addSession.bind(this);
    }
    addSession(user, sid) {
        var newSessions = [...this.state.sessions];
        newSessions.push({
            username: user,
            ses_id: sid
        });
        this.setState({sessions: newSessions});
    }
    render() {
        const { classes } = this.props;
        return(
            <Container className={classes.root}>
                <RequestsSent 
                    username={this.props.username}
                    token={this.props.token}
                    addSession={this.addSession}
                />
                <RequestsReceived 
                    username={this.props.username}
                    token={this.props.token}
                    addSession={this.addSession}
                />
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(Requests);



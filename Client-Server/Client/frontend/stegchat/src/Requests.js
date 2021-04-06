import React from 'react';
import RequestsSent from './RequestsSent';
import RequestsReceived from './RequestsReceived';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Chats from './Chats';

const useStyles = theme => ({
    root: {
        width: "25%",
        margin: "1%"
    }
});

class Requests extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;
        return(
            <Container className={classes.root}>
                <RequestsSent 
                    username={this.props.username}
                    token={this.props.token}
                    addSession={this.props.addSession}
                    socket={this.socket}
                />
                <RequestsReceived 
                    username={this.props.username}
                    token={this.props.token}
                    addSession={this.props.addSession}
                    socket={this.socket}
                />
                <Chats 
                    sessions={this.props.sessions}
                    setCurr={this.props.setCurr}    
                />
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(Requests);



import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { CssBaseline } from "@material-ui/core";
import MessageBar from './MessageBar';
import MessageBox from './MessageBox';
import Requests from './Requests';

const useStyles = theme => ({
    flexBoxRow: {
        display: "flex",
        flexDirection: "row",
        flexBasis: "100%"
    },
    flexBoxColumn: {
        display: "flex",
        flexDirection: "column",
        flexBasis: "100%"
    }
});

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            currSid: null,
            currReceiver: null,
            messages: [],
        };
        this.render = this.render.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.addSession = this.addSession.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.setCurr = this.setCurr.bind(this);
    }
    componentWillMount() {
        this.checkMsgs = setInterval(
            () => this.updateMessages(),
            3000
        );
    }
    componentWillUnmount() {
        clearInterval(this.checkMsgs);
    }
    setCurr(sid, user) {
        this.setState({currSid: sid, currReceiver: user});
        for (var i = 0; i < this.state.sessions.length; i++) {
            if (this.state.sessions[i].ses_id === this.state.currSid) {
                this.setState({messages: this.state.sessions[i].messages});
                break;
            }
        }
    }
    updateMessages() {
        this.state.sessions.map((obj) => {
            fetch(`http://1.40.77.213:5000/get-messages?ses_id=${obj.ses_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.messages) {
                        var newObj = obj;
                        newObj.messages = data.messages.map((obj) => {
                            return {
                                message: data.msg,
                                direction: (data.sender === this.props.username) ? "left" : "right",
                                date: obj.time,
                                username: obj.sender
                            }
                        });
                        var newSessions = [...this.state.sessions];
                        newSessions[this.state.sessions.indexOf(obj)] = newObj;
                        this.setState({sessions: newSessions});
                    }
                });
        });
    }
    addSession(user, sid) {
        var newSessions = [...this.state.sessions];
        newSessions.push({
            username: user,
            ses_id: sid,
            messages: []
        });
        this.setState({sessions: newSessions});
    }
    sendMessage(e, message) {
        e.preventDefault();
        /*var newMsgs = [...this.state.messages];
        newMsgs.push({
            message: message,
            direction: "left",
            username: this.props.username,
            date: (new Date()).toLocaleString()
        });
        this.setState({messages: newMsgs});*/
        fetch(`http://1.40.77.213:5000/message?msg=${encodeURIComponent(message)}&sender=${this.props.token}&receiver=${this.currReceiver}&time=${(new Date()).toLocaleString()}&ses_id=${this.state.currSid}`, {method: "POST"})
            .then(res => res.json())
            .then(data => {return;});
    }
    render() {
        const { classes } = this.props;
        return (
            <Container style={{width: "100%"}}>
                <CssBaseline />
                <div class={classes.flexBoxColumn}>
                    <div class={classes.flexBoxRow}>
                        <Requests
                            username={this.props.username}
                            token={this.props.token}
                            addSession={this.addSession} 
                            sessions={this.state.sessions}
                            setCurr={this.setCurr}   
                        />
                        <MessageBox messages={this.state.messages} />
                    </div>
                    <MessageBar sendMessage={this.sendMessage} />
                </div>
            </Container>
        );
    }
};

export default withStyles(useStyles, {withTheme: true})(Main);
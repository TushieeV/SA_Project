import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { CssBaseline } from "@material-ui/core";
import MessageBar from './MessageBar';
import MessageBox from './MessageBox';
import Requests from './Requests';
import { encrypt, decrypt } from "./encrypt_decrypt";
import { server_addr } from './server_addr';
import { sendMessageExt } from './sendMessage';
import { socket } from "./socket";

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
            currSession: null,
            messages: [],
            sending: false,
        };
        this.render = this.render.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.addSession = this.addSession.bind(this);
        this.updateMessages = this.updateMessages.bind(this);
        this.setCurr = this.setCurr.bind(this);
        this.handleGetPkey = this.handleGetPkey.bind(this);
        this.handleMsgCheck = this.handleMsgCheck.bind(this);
    }
    componentDidMount() {
        const body = {
            token: this.props.token,
            username: this.props.username
        };
        this.props.socket.emit('authenticate', body);
        this.props.socket.on('res-get-pkey', (data) => {
            this.handleGetPkey(data);
        });
        this.props.socket.on('res-start-message', (data) => {
            this.props.socket.emit('check-start-message', {
                task_id: data.task_id,
                receiver: data.receiver,
                ses_id: data.ses_id
            });
        });
        this.props.socket.on('res-check-start-message', (data) => {
            if (!data.done) {
                this.props.socket.emit('check-start-message', {
                    task_id: data.task_id,
                    receiver: data.receiver,
                    ses_id: data.ses_id
                });
            }
        });
        this.props.socket.on('check-messages', (data) => {
            this.handleMsgCheck(data);
        });
        this.props.socket.on('res-get-messages', (data) => {
            this.props.socket.emit('check-messages', {
                task_id: data.task_id
            });
        });
        this.props.socket.on('rest-check-messages', (data) => {
            if (!data.done) {
                this.props.socket.emit('check-messages', {
                    task_id: data.task_id
                });
            } else {
                this.updateMessages(data);
            }
        });
    }
    handleMsgCheck(data) {
        if (data.ses_id) {
            this.state.sessions.map((obj) => {
                if (obj.ses_id === data.ses_id) {
                    this.props.socket.emit('get-messages', {
                        ses_id: data.ses_id,
                        last_msg: obj.messages.length
                    });
                    return;
                }
            })
        }
    }
    componentWillMount() {
    //    this.checkMsgs = setInterval(
    //        () => this.updateMessages(),
    //        3000
    //    );
    }
    componentWillUnmount() {
    //    clearInterval(this.checkMsgs);
    }
    setCurr(user, sid, skey) {
        this.setState({currSession: {
            username: user,
            ses_id: sid,
            key: skey,
        }, messages: []}, () => {
            for (var i = 0; i < this.state.sessions.length; i++) {
                const obj = this.state.sessions[i];
                if (this.state.currSession && obj.ses_id === this.state.currSession.ses_id) {
                    this.setState({messages: obj.messages});
                    return;
                }
            }
        });
    }
    updateMessages(data) {
        /*this.state.sessions.map((obj) => {
            //fetch(`http://${server_addr}/get-messages?ses_id=${obj.ses_id}&last_msg=${obj.messages.length}`)
            fetch(`${server_addr}/get-messages?last_msg=${obj.messages.length}`, {
                headers: {
                    'ses_id': obj.ses_id
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.messages && data.messages.length > 0) {
                        var newObj = obj;
                        newObj.messages = obj.messages.concat(data.messages.map((obj) => {
                        return {
                                message: decrypt(obj.msg, newObj.key),
                                direction: (obj.sender === this.props.username) ? "left" : "right",
                                date: obj.time,
                                username: obj.sender,
                                type: obj.type,
                                steg: obj.steg
                            }
                        }));
                        if (this.state.currSession && obj.ses_id === this.state.currSession.ses_id) {
                            this.setState({messages: newObj.messages});
                        }
                        var newSessions = [...this.state.sessions];
                        newSessions[this.state.sessions.indexOf(obj)] = newObj;
                        this.setState({sessions: newSessions});
                    }
                });
        });*/

        this.state.sessions.map((obj) => {
            if (obj.ses_id = data.results.messages[0].ses_id && data.results.messages.length > 0) {
                var newObj = obj;
                newObj.messages = obj.messages.concat(data.results.messages.map((obj) => {
                    return {
                        message: decrypt(obj.msg, newObj.key),
                        direction: (obj.sender === this.props.username) ? "left" : "right",
                        date: obj.time,
                        username: obj.sender,
                        type: obj.type,
                        steg: obj.steg
                    }
                }));
                this.setState({message: newObj.messages});
                var newSessions = [...this.state.sessions];
                newSessions[this.state.sessions.indexOf(obj)] = newObj;
                this.setState({sessions: newSessions});
            }
        });
        
    }
    addSession(user, sid) {
        //fetch(`http://${server_addr}/get-pkey?ses_id=${sid}&target=${user}`)
        /*fetch(`${server_addr}/get-pkey?target=${user}`, {
            headers: {
                'ses_id': sid
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.pkey) {
                    fetch(`http://127.0.0.1:6001/get-shared?pkey=${data.pkey}`)
                        .then(res => res.json())
                        .then(data2 => {
                            if (data2.shared) {
                                var newSessions = [...this.state.sessions];
                                newSessions.push({
                                    username: user,
                                    ses_id: sid,
                                    messages: [],
                                    key: data2.shared
                                });
                                this.setState({sessions: newSessions});
                            }
                        });
                }
            });*/
        this.props.socket.emit('get-pkey', {
            ses_id: sid,
            target: user
        });
    }
    handleGetPkey(data) {
        if (data.pkey) {
            fetch(`http://127.0.0.1:6001/get-shared?pkey=${data.pkey}`)
                .then(res => res.json())
                .then(data2 => {
                    if (data2.shared) {
                        var newSessions = [...this.state.sessions];
                        newSessions.push({
                            username: data.target,
                            ses_id: data.ses_id,
                            messages: [],
                            key: data2.shared
                        });
                        this.setState({sessions: newSessions});
                    }
                });
        }
    }
    sendMessage(e, message, type, steg) {
        if (e) {
            e.preventDefault();
        }
        sendMessageExt(e, message, type, steg, this.state.currSession.key, this.props.token, this.state.currSession.username, this.state.currSession.ses_id);

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
                            socket={this.props.socket}
                        />
                        <MessageBox 
                            messages={this.state.messages}
                        />
                    </div>
                    <MessageBar 
                        sendMessage={this.sendMessage} 
                        session={this.state.currSession}
                    />
                </div>
            </Container>
        );
    }
};

export default withStyles(useStyles, {withTheme: true})(Main);
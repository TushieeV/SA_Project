import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { server_addr } from './server_addr';

const useStyles = theme => ({
    root: {
        width: "100%",
        height: "28vh"
    },
    list: {
        width: "100%",
        maxWidth: 360,
        maxHeight: 300,
        overflow: 'auto',
        marginTop: "5%"
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    listUser: {
        right: "20%"
    }
});

class RequestsSent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reqDialog: false,
            reqList: false,
            reqUser: "",
            loading: false,
            msg: null,
            msgColor: null,
            sentReqs: []
        }
        this.handleReqsClick = this.handleReqsClick.bind(this);
        this.handleReqDialogClick = this.handleReqDialogClick.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
        this.handleRequestRes = this.handleRequestRes.bind(this);
        this.updateReqs = this.updateReqs.bind(this);
        this.updateReq = this.updateReq.bind(this);
    }
    componentDidMount() {
        this.props.socket.on('request-res', (data) => {
            this.handleRequestRes(data);
        });
        this.props.socket.on('request-accepted', (data) => {
            this.updateReqs(data.req_id);
        });
    }
    handleRequestRes(data) {
        if (data.Success) {
            this.setState({msg: `Successfully sent chat request to ${data.user}`, msgColor: "green", loading: false});
            var newReqs = [...this.state.sentReqs];
            newReqs.push({
                username: data.user,
                req_id: data.req_id
            });
            this.setState({sentReqs: newReqs});
        } else {
            this.setState({msg: data.Message, msgColor: "red", loading: false});
        }
    }
    componentWillMount() {
        //this.checkReqs = setInterval(
        //    () => this.updateReqs(),
        //    5000
        //);
    }
    componentWillUnmount() {
        //clearInterval(this.checkReqs);
    }
    updateReqs(req_id) {
        this.state.sentReqs.map((obj) => {
            //fetch(`http://${server_addr}/check-request?req_id=${obj.req_id}&token=${this.props.token}`)
            if (obj.req_id == req_id) {
                fetch(`${server_addr}/check-request?req_id=${obj.req_id}`, {
                    headers: {
                        'token': this.props.token
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.ses_id) {
                            var newSentReqs = [...this.state.sentReqs];
                            newSentReqs.splice(this.state.sentReqs.indexOf(obj));
                            this.setState({sentReqs: newSentReqs});
                            this.props.addSession(obj.username, data.ses_id);
                        }
                    });
            }
        });
    }
    handleDialogClose() {
        this.setState({
            reqDialog: false,
            reqUser: "",
            loading: false,
            msg: null
        });
    }
    handleDialogSubmit() {
        this.setState({loading: true})
        if ((this.state.reqUser === this.props.username) || (this.state.reqUser === "")) {
            if (this.state.reqUser === this.props.username) {
                this.setState({msg: "Cannot send chat request to yourself!", msgColor: "red", loading: false});
            } else {
                this.setState({msg: "Please enter a username", msgColor: "red", loading: false});
            }
        } else {
            //fetch(`http://${server_addr}/request?requestor=${this.props.token}&requesting=${this.state.reqUser}`, {method: 'POST'})
            /*fetch(`${server_addr}/request?requesting=${this.state.reqUser}`, {
                method: 'POST',
                headers: {
                    'token': this.props.token
                }
            })
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                    if (data.Success) {
                        this.setState({msg: `Successfully sent chat request to ${this.state.reqUser}`, msgColor: "green", loading: false});
                        var newReqs = [...this.state.sentReqs];
                        newReqs.push({
                            username: this.state.reqUser,
                            req_id: data.req_id
                        });
                        this.setState({sentReqs: newReqs});
                    } else {
                        this.setState({msg: data.Message, msgColor: "red", loading: false});
                    }
                });*/
            this.props.socket.emit('request', {
                token: this.props.token,
                requesting: this.state.reqUser
            });
        }
    }
    handleReqDialogClick() {
        this.setState({reqDialog: !this.state.reqDialog});
    }
    handleReqsClick() {
        this.setState({reqList: !this.state.reqList})
    }
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.root}>
                <Dialog
                    open={this.state.reqDialog}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Send chat request</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter the username of the person you want to send a chat request to.
                            Note: They will have to accept your chat request in order for a chat
                            session to begin.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="username"
                            label="Enter username"
                            fullWidth
                            value={this.state.reqUser}
                            onChange={(e) => {this.setState({reqUser: e.target.value})}}
                        />
                        <p style={{color: this.state.msgColor}}>{this.state.msg}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleDialogClose} color="primary">
                            Close
                        </Button>
                        <Button variant="contained" onClick={this.handleDialogSubmit} color="primary">
                            Send request
                        </Button>
                        {this.state.loading && <CircularProgress />}
                    </DialogActions>
                </Dialog>
                <Grid container justify="center">
                    <Button
                        color="primary"
                        variant="contained"
                        style={{marginTop: "3%"}}
                        onClick={this.handleReqDialogClick}
                    >
                        Send chat request
                    </Button>
                    <List
                        component="nav"
                        aria-labelledby="list-subheader"
                        className={classes.list}
                        subheader={
                            <ListSubheader component="div" id="list-subheader" style={{backgroundColor: "#303030"}}>
                                My sent requests:
                            </ListSubheader>
                        }
                    >
                        <li>
                            <ul>
                                {this.state.sentReqs.map((obj, i = 0) => (
                                    <ListItem button className={classes.listUser} key={i}>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText primary={obj.username} />
                                    </ListItem>
                                ))}
                                {(this.state.sentReqs.length === 0) && 
                                    <ListItem className={classes.listUser} >
                                        <ListItemText primary="None pending" />
                                    </ListItem>
                                }
                            </ul>
                        </li>
                    </List>
                </Grid>
            </Card>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(RequestsSent);
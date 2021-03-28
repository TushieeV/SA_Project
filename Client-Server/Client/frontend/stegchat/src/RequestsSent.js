import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

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
            sentReqs: [],
        }
        this.handleReqsClick = this.handleReqsClick.bind(this);
        this.handleReqDialogClick = this.handleReqDialogClick.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
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
        if (this.state.reqUser === this.props.username) {
            this.setState({msg: "Cannot send chat request to yourself!", msgColor: "red", loading: false})
        } else {
            fetch(`http://1.40.77.213:5000/request?requestor=${this.props.token}&requesting=${this.state.reqUser}`, {method: 'POST'})
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
                                    <ListItem button className={classes.listUser}>
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
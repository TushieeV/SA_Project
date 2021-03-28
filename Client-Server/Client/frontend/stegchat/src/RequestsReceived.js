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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Card from '@material-ui/core/Card';

const useStyles = theme => ({
    root: {
        width: "100%",
        //border: "1px solid gray",
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

class RequestsReceived extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myReqs: []
        };
        this.render = this.render.bind(this);
        this.updateReqs = this.updateReqs.bind(this);
        this.acceptReq = this.acceptReq.bind(this);
        this.rejectReq = this.rejectReq.bind(this);
    }
    componentWillMount() {
        this.checkReqs = setInterval(
            () => this.updateReqs(),
            5000
        );
    }
    componentWillUnmount() {
        clearInterval(this.checkReqs);
    }
    updateReqs() {
        fetch(`http://1.40.77.213:5000/my-requests?token=${this.props.token}`)
            .then(resp => resp.json())
            .then(data => {
                if (data.requests) {
                    data.requests.map((obj) => {
                        const found = this.state.myReqs.some(el => el.req_id === obj.req_id);
                        if (!found && obj.requestor) {
                            var newMyReqs = [...this.state.myReqs];
                            newMyReqs.push({
                                username: obj.requestor,
                                req_id: obj.req_id
                            });
                            console.log(data);
                            this.setState({myReqs: newMyReqs});
                        }    
                    });
                }
            });
    }
    acceptReq(obj) {
        fetch(`http://1.40.77.213:5000/accept-request?req_id=${obj.req_id}&token=${this.props.token}`, {method: "POST"})
            .then(res => res.json())
            .then(data => {
                if (data.ses_id) {
                    this.props.addSession(obj.username, data.ses_id);
                    var newMyReqs = [...this.state.myReqs];
                    newMyReqs.splice(this.state.myReqs.indexOf(obj));
                    this.setState({myReqs: newMyReqs});
                }
            });
    }
    rejectReq(obj) {
        var newMyReqs = [...this.state.myReqs];
        newMyReqs.splice(this.state.myReqs.indexOf(obj));
        this.setState({myReqs: newMyReqs});
    }
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.root}>
                <List
                    component="nav"
                    aria-labelledby="list-subheader"
                    className={classes.list}
                    subheader={
                        <ListSubheader component="div" id="list-subheader" style={{backgroundColor: "#303030"}}>
                            My received requests:
                        </ListSubheader>
                    }
                >
                    <li>
                        <ul>
                            {this.state.myReqs.map((obj, i = 0) => (
                                <ListItem className={classes.listUser} key={i}>
                                    <ListItemIcon>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary={obj.username} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {this.acceptReq(obj)}}
                                        >
                                            <CheckCircleIcon />
                                        </IconButton>
                                        <IconButton
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => {this.rejectReq(obj)}}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            {(this.state.myReqs.length === 0) && 
                                <ListItem className={classes.listUser} >
                                    <ListItemText primary="None pending" />
                                </ListItem>
                            }
                        </ul>
                    </li>
                </List>
            </Card>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(RequestsReceived);
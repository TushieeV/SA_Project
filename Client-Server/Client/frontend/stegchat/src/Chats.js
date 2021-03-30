import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
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

class Chats extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }
    render() {
        const { classes } = this.props;
        return (
            <Card className={classes.root}>
                <List
                    component="nav"
                    aria-labelledby="chat-list-subheader"
                    className={classes.list}
                    subheader={
                        <ListSubheader component="div" id="chat-list-subheader" style={{backgroundColor: "#303030"}}>
                            Chats:
                        </ListSubheader>
                    }
                >
                    <li>
                        <ul>
                            {this.props.sessions.map((obj, i = 0) => (
                                <ListItem 
                                    button 
                                    className={classes.listUser} 
                                    key={`chat${i}`}
                                    onClick={(e) => {this.props.setCurr(obj.username, obj.ses_id, obj.key)}}
                                >
                                    <ListItemIcon>
                                        <AccountCircle />
                                    </ListItemIcon>
                                    <ListItemText primary={obj.username} />
                                </ListItem>
                            ))}
                            {(this.props.sessions.length === 0) &&
                                <ListItem className={classes.listUser} >
                                    <ListItemText primary="No chats" />
                                </ListItem>
                            }
                        </ul>
                    </li>
                </List>
            </Card>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(Chats);
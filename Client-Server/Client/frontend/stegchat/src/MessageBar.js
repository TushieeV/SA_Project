import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendSharpIcon from '@material-ui/icons/SendSharp';
import ImageIcon from '@material-ui/icons/Image';
import LockIcon from '@material-ui/icons/Lock';
import StegDialog from "./StegDialog";

const useStyles = theme => ({
    textField: {
        width: "80%",
        color: "white"
    },
    button: {
        top: "20px",
    },
    input: {
        color: "white",
        borderColor: "white"
    },
    msgInput: {
        borderTop: "1px solid",
        textAlign: "center",
        padding: "10px",
        position: "absolute",
        left: "0",
        bottom: "0",
        right: "0",
        height: "7%",
        maxHeight: "20%",
        width: "100%",
    }
});

class MessageBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            open: false
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.render = this.render.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.sendMsg(e);
        }
    }
    sendMsg(e) {
        this.props.sendMessage(e, this.state.message);
        this.setState({message: ""});
    }
    handleClose() {
        this.setState({open: false});
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.msgInput}>
                <StegDialog 
                    handleClose={this.handleClose}
                    open={this.state.open}    
                />
                <TextField 
                    variant="outlined"
                    margin="normal"
                    id="message"
                    label="Enter message"
                    name="message"
                    autoFocus
                    multiline
                    value={this.state.message}
                    className={classes.textField}
                    InputProps={{
                        className: classes.input
                    }}
                    onChange={(e) => this.setState({message: e.target.value})}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                />
                <IconButton 
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={(e) => this.sendMsg(e)}
                >
                    <SendSharpIcon />
                </IconButton>
                <IconButton
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                    <ImageIcon />
                </IconButton>
                <IconButton
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={(e) => {this.setState({open: true})}}
                >
                    <LockIcon />
                </IconButton>
            </div>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBar);
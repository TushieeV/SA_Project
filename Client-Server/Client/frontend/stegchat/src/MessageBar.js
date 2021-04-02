import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendSharpIcon from '@material-ui/icons/SendSharp';
import ImageIcon from '@material-ui/icons/Image';
import LockIcon from '@material-ui/icons/Lock';
import StegDialog from "./StegDialog";

const fs = require('fs');

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
        this.fileInput = React.createRef();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.render = this.render.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.getB64Img = this.getB64Img.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    handleKeyPress(e, type, steg) {
        if (e.key === "Enter") {
            this.sendMsg(e, type, steg);
        }
    }
    sendMsg(e, type, steg) {
        this.props.sendMessage(e, this.state.message, type, steg);
        this.setState({message: ""});
    }
    handleClose() {
        this.setState({open: false});
    }
    getB64Img(e) {
        const contents = fs.readFileSync(e.target.files[0].path, {encoding: 'base64'});
        console.log(contents);
        this.setState({message: contents}, () => {this.sendMsg(e, "image")});
    }
    handleFileChange(e) {
        if (e.target.files[0]) {
            //this.getB64Img(e);
            const contents = fs.readFileSync(e.target.files[0].path, {encoding: 'base64'});
            console.log(contents);
            this.setState({message: contents}, () => {this.sendMsg(e, "image")});
        }
    }
    triggerInput() {
        document.querySelector("input[type='file']").click();
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.msgInput}>
                <StegDialog 
                    handleClose={this.handleClose}
                    open={this.state.open}
                    sendMessage={this.sendMsg}    
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
                    onKeyPress={(e) => this.handleKeyPress(e, "text", "None")}
                />
                <IconButton 
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={(e) => {this.sendMsg(e, "text", "None")}}
                >
                    <SendSharpIcon />
                </IconButton>
                <input type="file" accept="image/*" ref={this.fileInput} style={{display: "none"}} onChange={this.handleFileChange}/>
                <IconButton
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={this.triggerInput}
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
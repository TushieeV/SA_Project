import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendSharpIcon from '@material-ui/icons/SendSharp';
import ImageIcon from '@material-ui/icons/Image';
import LockIcon from '@material-ui/icons/Lock';
import MicIcon from '@material-ui/icons/Mic';
import StegDialog from "./StegDialog";
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Mic from './Mic';
import Grid from '@material-ui/core/Grid';

const fs = require('fs');

const useStyles = theme => ({
    textField: {
        width: "100%",
        color: "white",
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
            type: null,
            open: false,
            steg: "None",
            img: null
        };
        this.fileInput = React.createRef();
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.render = this.render.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.getB64Img = this.getB64Img.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.sendM = this.sendM.bind(this);
        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.openDialog = this.openDialog.bind(this);
    }
    sendM(e, msg, type, steg) {
        //this.setState({message: msg}, () => {this.sendMsg(e, type, steg)});
        this.props.sendMessage(e, msg, type, steg);
    }
    handleKeyPress(e, type, steg) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.sendMsg(e, type, steg);
        }
    }
    sendMsg(e, type, steg) {
        var msg = this.state.message;
        this.setState({message: ""}, () => {this.props.sendMessage(e, msg, type, steg)});
    }
    handleClose() {
        this.setState({open: false});
    }
    getB64Img(e) {
        const contents = fs.readFileSync(e.target.files[0].path, {encoding: 'base64'});
        console.log(contents);
        //this.setState({message: contents}, () => {this.sendMsg(e, "image")});
    }
    handleFileChange(e) {
        if (e.target.files[0]) {
            const contents = fs.readFileSync(e.target.files[0].path, {encoding: 'base64'});
            console.log(contents);
            this.props.sendMessage(e, contents, "image", "None");
        }
    }
    triggerInput() {
        document.getElementById('messagebar').click()
    }
    handleMsgChange(e) {
        this.setState({message: e.target.value, type: "text"});
    }
    openDialog() {
        this.setState({open: true});
    }
    setAudio(b64) {
        this.props.sendMessage(null, b64, "audio/webm", "None");
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.msgInput}>
                <StegDialog 
                    handleClose={this.handleClose}
                    open={this.state.open}
                    sendMessage={this.sendM}    
                />
                <Grid
                    container
                    spacing={1}
                    style={{
                        paddingLeft: "10%"
                    }}
                >
                    <Grid item xs={9}>
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
                            disabled={this.props.session ? false : true}
                            onChange={(e) => this.handleMsgChange(e)}
                            onKeyPress={(e) => this.handleKeyPress(e, "text", "None")}
                        />
                    </Grid>
                    <Grid item>
                        <IconButton 
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={this.props.session ? false : true}
                            onClick={(e) => {this.sendMsg(e, "text", "None")}}
                        >
                            <SendSharpIcon />
                        </IconButton>
                    </Grid>
                    <input type="file" accept="image/*" id="messagebar" ref={this.fileInput} style={{display: "none"}} onChange={this.handleFileChange}/>
                    <Grid item>
                        <IconButton
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={this.props.session ? false : true}
                            onClick={this.triggerInput}
                        >
                            <ImageIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <PopupState variant="popover" popupId="popup-popover">
                            {(popupState) => (
                                <div>
                                    <IconButton
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        disabled={this.props.session ? false : true}
                                        {...bindTrigger(popupState)}
                                    >
                                        <MicIcon />
                                    </IconButton>
                                    <Popover
                                        {...bindPopover(popupState)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center'
                                        }}
                                    >
                                        <Mic setAudio={this.setAudio} />
                                    </Popover>
                                </div>
                            )}
                        </PopupState>
                    </Grid>
                    <Grid item>
                        <IconButton
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={this.props.session ? false : true}
                            onClick={this.openDialog}
                        >
                            <LockIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBar);
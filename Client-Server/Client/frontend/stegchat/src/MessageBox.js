import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { encrypt } from './encrypt_decrypt';

const useStyles = theme => ({
    container: {
        width: "75%",
        height: "84vh",
        maxHeight: "84vh",
        //border: "1px solid gray",
        marginTop: "1%",
        overflow: 'auto'
    },
    bubbleContainer: {
        width: "100%",
        display: "flex",
        maxHeight: "80%",
    },
    bubble: {
        border: "0.5px solid black",
        borderRadius: "10px",
        margin: "5px",
        padding: "20px",
        display: "inline-block"
    },
    leftMsg: {
        borderRadius: "15px",
        background: "#3461eb",
        padding: "10px",
        display: "inline-block",
        color: "white",
        maxWidth: "100%",
    },
    rightMsg: {
        borderRadius: "15px",
        background: "#9c34eb",
        padding: "10px",
        display: "inline-block",
        color: "white",
        maxWidth: "100%"
    },
    flexBoxRow: {
        display: "flex",
        flexDirection: "row",
        flexBasis: "100%"
    },
    flexBoxColumn: {
        display: "flex",
        flexDirection: "column",
        flexBasis: "100%"
    },
    topBubble: {
        fontSize: "11px",
        color: "gray"
    }
});

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            steg: "",
            type: "",
            message: "",
            encpwd: "",
            decoded: "",
            decodedType: ""
        }
        this.messagesEnd = React.createRef();
        this.render = this.render.bind(this);
        this.decode = this.decode.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    scrollToBottom() {
        //this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        document.getElementById("endscroll").scrollIntoView({ behavior: "smooth" });
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    handleClose() {
        this.setState({
            open: false,
            steg: "",
            type: "",
            message: "",
            encpwd: "",
            decoded: "",
            decodedType: "",
            loading: false
        });
    }
    decode() {
        this.setState({loading: true});
        if (this.state.steg === "txtEimg") {
            //fetch(`http://127.0.0.1:6001/img-D-txt?img=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/img-D-txt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    img: this.state.message,
                    seed: this.state.encpwd
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.hidden) {
                        this.setState({decoded: data.hidden, decodedType: "text", loading: false});
                    }
                });
        } else if (this.state.steg === "imgEtxt") {
            //fetch(`http://127.0.0.1:6001/txt-D-img?txt=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/txt-D-img`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    msg: this.state.message,
                    seed: this.state.encpwd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.hidden) {
                    this.setState({decoded: data.hidden, decodedType: "image", loading: false});
                }
            });
        } else if (this.state.steg === "txtEaudio") {
            //fetch(`http://127.0.0.1:6001/audio-D-txt?audio=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/audio-D-txt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audio: this.state.message,
                    seed: this.state.encpwd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.hidden) {
                    this.setState({decoded: data.hidden, decodedType: "text", loading: false});
                }
            });
        } else if (this.state.steg === "imgEaudio") {
            //fetch(`http://127.0.0.1:6001/audio-D-img?audio=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/audio-D-img`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    audio: this.state.message,
                    seed: this.state.encpwd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.hidden) {
                    this.setState({decoded: data.hidden, decodedType: "image", loading: false});
                }
            });
        } else if (this.state.steg === "audioEimg") {
            //fetch(`http://127.0.0.1:6001/img-D-audio?img=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/img-D-audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    img: this.state.message,
                    seed: this.state.encpwd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.hidden) {
                    this.setState({decoded: data.hidden, decodedType: "audio/wav", loading: false});
                }
            });
        } else if (this.state.steg === "audioEtxt") {
            //fetch(`http://127.0.0.1:6001/txt-D-audio?txt=${encodeURIComponent(this.state.message)}&seed=${this.state.encpwd}`)
            fetch(`http://127.0.0.1:6001/txt-D-audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    msg: this.state.message,
                    seed: this.state.encpwd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.hidden) {
                    this.setState({decoded: data.hidden, decodedType: "audio/wav", loading: false});
                }
            });
        }
    }
    render() {
        const { classes } = this.props;
        const chatBubbles = this.props.messages.map((obj, i = 0) => (
            <div style={{marginLeft: "1%", marginRight: "1%"}}>
                <div className={`${classes.bubbleContainer} ${obj.direction}`}>
                    <p style={{fontSize: "11px", color: "gray"}}>
                        {`${obj.username} @ ${obj.date}`}
                    </p>
                </div>
                <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
                    <div key={i++} className={(obj.direction === 'left') ? classes.leftMsg : classes.rightMsg}>
                        {(obj.type === "text") && obj.message.replace(/[^ -~]+/g, "")}
                        {(obj.type === "image") && <img src={`data:image/png;base64, ${obj.message}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
                        {(obj.type.split('/')[0] === 'audio') && <audio controls src={`data:${obj.type};base64, ${obj.message}`} />}
                        {!(obj.steg === "None") && 
                            <IconButton
                                variant="contained"
                                color="primary"
                                onClick={(e) => {this.setState({steg: obj.steg, open: true, type: obj.type, message: obj.message})}}
                            >
                                <LockIcon />
                            </IconButton>
                        }
                    </div>
                </div>
            </div>
        ));
        return (
            <Card className={classes.container}>
                <Dialog 
                    open={this.state.open}
                    aria-labelledby="msgbox-dialog"
                    onClose={this.handleClose}
                    fullScreen
                >
                    <DialogContent>
                        <DialogTitle id="msgbox-dialog" style={{textAlign: "center"}}>Decode message</DialogTitle>
                        <div style={{flexGrow: 1}}>
                            <Grid 
                                container 
                                spacing={3}
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs={10}>
                                    {(this.state.type === "text") && this.state.message.replace(/[^ -~]+/g, "")}
                                    {(this.state.type === "image") && <img src={`data:image/png;base64, ${this.state.message}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
                                    {(this.state.type.split('/')[0] === "audio") && <audio controls src={`data:${this.state.type};base64, ${this.state.message}`} />}
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        id="encpwd"
                                        type="password"
                                        label="Enter encryption password"
                                        name="encpwd"
                                        autoFocus
                                        fullWidth
                                        value={this.state.encpwd}
                                        onChange={(e) => {this.setState({encpwd: e.target.value, decoded: null})}}
                                    />
                                </Grid>
                                <Grid item xs={10}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={this.decode}
                                    >
                                        Decode
                                    </Button>
                                    {this.state.loading && <CircularProgress />}
                                </Grid>
                                <Grid>
                                    {(this.state.decodedType === "text") && this.state.decoded}
                                    {(this.state.decodedType === "image") && <img src={`data:image/png;base64, ${this.state.decoded}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
                                    {(this.state.decodedType == "audio/wav") && <audio controls src={`data:audio/wav;base64, ${this.state.decoded}`} />}
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContent>
                </Dialog>
                {(this.props.messages.length > 0) && chatBubbles}
                {(this.props.messages.length === 0) && `No messages yet`}
                <div id="endscroll" style={{float: "left", clear: "both"}} ref={this.messagesEnd}></div>
            </Card>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBox);
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Mic from './Mic';

const fs = require('fs');

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
    },
    root: {
        flexGrow: 1,
        minHeight: "30vh",
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      textField: {
          width: "80%"
      }
});

class StegDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steg: "txtEimg",
            steg1: "txt",
            steg2: "img",
            msgToEncode: "",
            msgEncodedIn: "",
            loading: false,
            encoded: null,
            audio: null
        }
        this.fileInput = React.createRef();
        this.getB64Img = this.getB64Img.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.render = this.render.bind(this);
        this.handleEncodeClick = this.handleEncodeClick.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
    }
    getB64Img(urlImg, num) {
        const contents = fs.readFileSync(urlImg, {encoding: 'base64'});
        console.log(contents);
        if (num === 1) {
            this.setState({msgToEncode: contents});
        } else {
            this.setState({msgEncodedIn: contents});
        }
    }
    triggerInput() {
        //document.querySelector("input[type='file' id='stegdialog']").click();
        document.getElementById('stegdialog').click()
    }
    handleFileChange(e, num) {
        if (e.target.files[0]) {
            this.getB64Img(e.target.files[0].path);
        }
    }
    handleSelectChange(e) {
        const vals = e.target.value.split('E');
        this.setState({msgToEncode: "", msgEncodedIn: "", steg: e.target.value, steg1: vals[0], steg2: vals[1]});
    }
    handleEncodeClick() {
        this.setState({loading: true});
        //fetch(`http://127.0.0.1:6001/txt-E-img?img=${encodeURIComponent(this.state.img)}&msg=${encodeURIComponent(this.state.msg)}&seed=${encodeURIComponent(this.state.encpwd)}`)
        const route = this.state.steg1 + 'E' + this.state.steg2;
        fetch(`http://127.0.0.1:6001/${route}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                msgToEncode: this.state.msgToEncode,
                msgEncodedIn: this.state.msgEncodedIn,
                seed: this.state.encpwd
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({encoded: data.encoded_image, loading: false});
                console.log(data.encoded_image.length);
            });
    }
    handleSendClick() {
        var type = "";
        const msg = this.state.encoded;
        const steg = this.state.steg;
        if (this.state.steg === "txtEimg" || this.state.steg === "audioEimg") {
            type = "image";
        } else if (this.state.steg === "imgEtxt" || this.state.steg === "audioEtxt") {
            type = "text";
        } else if (this.state.steg === "txtEaudio" || this.state.steg === "imgEaudio") {
            type = "audio";
        }
        this.setState({
            steg: "txtEimg",
            steg1: "txt",
            steg2: "img",
            loading: false,
            encoded: null,
            msgToEncode: "",
            msgEncodedIn: "",
            encpwd: "",
            audio: null
        }, () => {
            this.props.sendMessage(null, msg, type, steg);
            this.props.handleClose();
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <Dialog 
                open={this.props.open} 
                onClose={(e) => {
                    this.setState({
                        msgToEncode: "",
                        msgEncodedIn: "",
                        steg: "txtEimg",
                        steg1: "txt",
                        steg2: "img",
                        loading: false,
                        encoded: null,
                        encpwd: "",
                        audio: null
                    });
                    this.props.handleClose();
                }} 
                aria-labelledby="form-dialog-title"
                scroll="paper"
                fullScreen
            >
                <DialogContent>
                    <DialogTitle id="form-dialog-title" style={{textAlign: "center"}}>
                        <h1>Steganography</h1>
                    </DialogTitle>
                    <div className={classes.root}>
                        <Grid 
                            container 
                            spacing={3}
                            direction="column"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item xs={10}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id="encpwd"
                                    type="password"
                                    label="Encryption password"
                                    name="encpwd"
                                    autoFocus
                                    fullWidth
                                    value={this.state.encpwd}
                                    onChange={(e) => {this.setState({encpwd: e.target.value})}}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                <Select
                                    value={this.state.steg}
                                    onChange={(e) => {this.handleSelectChange(e)}}
                                    style={{textAlign: "center"}}
                                >
                                    <MenuItem value="txtEimg">Encode text within image</MenuItem>
                                    <MenuItem value="txtEaudio">Encode text within audio</MenuItem>
                                    <MenuItem value="imgEtxt">Encode image within text</MenuItem>
                                    <MenuItem value="imgEaudio">Encode image within audio</MenuItem>
                                    <MenuItem value="audioEimg">Encode audio within image</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12} className={(this.state.steg1 === "txt") ? classes.textField : null}>
                                {(this.state.steg1 === "txt") &&
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        id="message"
                                        label="Enter message"
                                        name="message"
                                        autoFocus
                                        multiline
                                        fullWidth
                                        value={this.state.msgToEncode}
                                        onChange={(e) => {this.setState({msgToEncode: e.target.value})}}
                                    />
                                }
                                {(this.state.steg1 === "img") && 
                                    <div>
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <input type="file" accept="image/*" id="stegdialog" ref={this.fileInput} style={{display: "none"}} onChange={(e) => {this.handleFileChange(e, 1)}}/>
                                            <Grid item xs={12}>
                                                <img src={`data:image/png;base64, ${this.state.msgToEncode}`} style={{maxWidth: "400px", maxHeight: "400px"}} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    onClick={this.triggerInput}
                                                    color="primary"
                                                    variant="contained"
                                                >
                                                    Upload Image
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                }
                                {(this.state.steg1 === "audio") && <Mic />}
                            </Grid>
                            <Grid item xs={12} className={(this.state.steg2 === "txt") ? classes.textField : null}>
                                {(this.state.steg2 === "txt") &&
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        id="message"
                                        label="Enter message"
                                        name="message"
                                        autoFocus
                                        multiline
                                        fullWidth
                                        value={this.state.msgEncodedIn}
                                        onChange={(e) => {this.setState({msgEncodedIn: e.target.value})}}
                                    />
                                }
                                {(this.state.steg2 === "img") && 
                                    <div>
                                        <Grid
                                            container
                                            spacing={3}
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <input type="file" accept="image/*" id="stegdialog" ref={this.fileInput} style={{display: "none"}} onChange={(e) => {this.handleFileChange(e, 2)}}/>
                                            <Grid item xs={12}>
                                                <img src={`data:image/png;base64, ${this.state.msgEncodedIn}`} style={{maxWidth: "400px", maxHeight: "400px"}} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    onClick={this.triggerInput}
                                                    color="primary"
                                                    variant="contained"
                                                >
                                                    Upload Image
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                }
                                {(this.state.steg2 === "audio") && <Mic />}
                            </Grid>
                            <Grid item xs={10}>
                                {(this.state.msgToEncode && this.state.msgEncodedIn) && 
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={this.handleEncodeClick}
                                    >
                                        Encode
                                    </Button>
                                }
                                {this.state.loading && <CircularProgress />}
                            </Grid>
                            <Grid item xs={10}>
                                {this.state.encoded && <p>Encoded:</p>}
                            </Grid>
                            <Grid>
                                {(this.state.encoded && (this.state.steg2 === "img")) && <img src={`data:image/png;base64, ${this.state.encoded}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
                            </Grid>
                            <Grid item xs={10}>
                                {this.state.encoded && 
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={this.handleSendClick}
                                    >
                                        Send
                                    </Button>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(StegDialog);
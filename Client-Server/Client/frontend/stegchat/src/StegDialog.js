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
            img: null,
            encImg: null,
            steg: "txtEimg",
            msg: "",
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
    getB64Img(urlImg) {
        const contents = fs.readFileSync(urlImg, {encoding: 'base64'});
        console.log(contents);
        this.setState({img: contents});
    }
    triggerInput() {
        //document.querySelector("input[type='file' id='stegdialog']").click();
        document.getElementById('stegdialog').click()
    }
    handleFileChange(e) {
        if (e.target.files[0]) {
            this.getB64Img(e.target.files[0].path);
        }
    }
    handleSelectChange(e) {
        this.setState({steg: e.target.value});
    }
    handleEncodeClick() {
        this.setState({loading: true});
        //fetch(`http://127.0.0.1:6001/txt-E-img?img=${encodeURIComponent(this.state.img)}&msg=${encodeURIComponent(this.state.msg)}&seed=${encodeURIComponent(this.state.encpwd)}`)
        fetch(`http://127.0.0.1:6001/txt-E-img`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                img: this.state.img,
                msg: this.state.msg,
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
            img: null,
            encImg: null,
            steg: "txtEimg",
            loading: false,
            encoded: null,
            msg: "",
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
                        img: null,
                        encImg: null,
                        steg: "txtEimg",
                        loading: false,
                        encoded: null,
                        msg: "",
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
                                <Select
                                    value={this.state.steg}
                                    onChange={(e) => {this.handleSelectChange(e)}}
                                    style={{textAlign: "center"}}
                                >
                                    <MenuItem value="txtEimg">Encode text within image</MenuItem>
                                    <MenuItem value="imgEtxt">Encode image within text</MenuItem>
                                    <MenuItem value="audioEimg">Encode audio within image</MenuItem>
                                </Select>
                            </Grid>
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
                                {(this.state.steg === "txtEimg" || this.state.steg === "imgEtxt" || this.state.steg === "audioEimg") && <img src={`data:image/png;base64, ${this.state.img}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
                            </Grid>
                            <Grid item xs>
                                {(this.state.steg === "txtEimg" || this.state.steg === "imgEtxt" || this.state.steg === "audioEimg") &&
                                    <div>
                                        <input type="file" accept="image/*" id="stegdialog" ref={this.fileInput} style={{display: "none"}} onChange={this.handleFileChange}/>
                                        <Button 
                                            onClick={this.triggerInput}
                                            color="primary"
                                            variant="contained"
                                        >
                                            Upload Image
                                        </Button>
                                    </div>
                                }
                            </Grid>
                            <Grid item xs={12} className={(this.state.steg === "txtEimg" || this.state.steg === "imgEtxt") ? classes.textField : null}>
                                {(this.state.steg === "txtEimg" || this.state.steg === "imgEtxt") &&
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        id="message"
                                        label="Enter message"
                                        name="message"
                                        autoFocus
                                        multiline
                                        fullWidth
                                        value={this.state.msg}
                                        onChange={(e) => {this.setState({msg: e.target.value})}}
                                    />
                                }
                                {(this.state.steg === "audioEimg") && <Mic />}
                            </Grid>
                            <Grid item xs={10}>
                                {(this.state.img && this.state.msg) && 
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
                                {this.state.encoded && <img src={`data:image/png;base64, ${this.state.encoded}`} style={{maxWidth: "400px", maxHeight: "400px"}} />}
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
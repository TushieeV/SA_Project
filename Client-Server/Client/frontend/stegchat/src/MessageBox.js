import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import SendSharpIcon from '@material-ui/icons/SendSharp';
import { CssBaseline } from "@material-ui/core";

const useStyles = theme => ({
    container: {
        //bottom: 0,
        width: "75%",
        height: "92vh",
        border: "1px solid white"
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
        maxWidth: "40%",
    },
    rightMsg: {
        borderRadius: "10px",
        background: "#9c34eb",
        padding: "10px",
        display: "inline-block",
        color: "white",
        maxWidth: "40%"
    },
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
    }
});

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: ""
        }
        this.render = this.render.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    sendMessage(e) {
        e.preventDefault();
        var newMsgs = [...this.state.messages];
        newMsgs.push({
            message: this.state.message,
            direction: "left"
        });
        this.setState({messages: newMsgs});
    }
    handleKeyPress(e) {
        if (e.key === "Enter") {
            this.sendMessage(e);
            this.setState({message: ""});
        }
    }
    render() {
        const { classes } = this.props;
        const chatBubbles = this.state.messages.map((obj, i = 0) => (
            <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
                <div key={i++} className={(obj.direction === 'left') ? classes.leftMsg : classes.rightMsg}>
                    {obj.message}
                </div>
            </div>
        ));
        return (
            <Container>
                <CssBaseline />
                <div class={classes.flexBoxColumn}>
                    <div class={classes.flexBoxRow}>
                        <div style={{width: "25%", border: "1px solid white"}}>

                        </div>
                        <div className={classes.container}>
                            {chatBubbles}
                        </div>
                    </div>
                    <div className={classes.msgInput}>
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
                            onClick={(e) => this.sendMessage(e)}
                        >
                            <SendSharpIcon />
                        </IconButton>
                    </div>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBox);
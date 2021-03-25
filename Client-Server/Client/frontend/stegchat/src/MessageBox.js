import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import SendSharpIcon from '@material-ui/icons/SendSharp';

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
        padding: "20px",
        position: "fixed",
        left: "0",
        bottom: "0",
        height: "60px",
        width: "100%",
    },
    flexBox: {
        display: "flex",
        flexDirection: "row",
        flexBasis: "100%"
    }
});

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dummyData: [
                {
                    message: "1: This should be in left feaf wefawefaewfawefawefawefawef",
                    direction: "left"
                },
                {
                    message: "2: This should be in right feafewfaw faew awfewa fwaf",
                    direction: "right"
                },
                {
                    message: "3: This should be in left againf aewfeawfwafaw faw waf awfawf w",
                    direction: "left"
                },
                {
                    message: "4: This should be in right againf eawfawf wf wf waf afeawfawfwfawf eawfwa",
                    direction: "right"
                }
            ],
            message: null
        }
        this.render = this.render.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    sendMessage() {
        var newMsgs = [...this.state.dummyData];
        newMsgs.push({
            message: this.state.message,
            direction: "left"
        });
        this.setState({dummyData: newMsgs});
    }
    render() {
        const { classes } = this.props;
        const chatBubbles = this.state.dummyData.map((obj, i = 0) => (
            <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
                <div key={i++} className={(obj.direction === 'left') ? classes.leftMsg : classes.rightMsg}>
                    {obj.message}
                </div>
            </div>
        ));
        return (
            <Container maxWidth="100%">
                <div class={classes.flexBox}>
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
                        className={classes.textField}
                        InputProps={{
                            className: classes.input
                        }}
                        onChange={(e) => {this.setState({message: e.target.value})}}
                    />
                    <IconButton 
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.sendMessage}
                    >
                        <SendSharpIcon />
                    </IconButton>
                </div>
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBox);
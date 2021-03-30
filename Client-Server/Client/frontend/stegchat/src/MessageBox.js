import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

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
    }
    render() {
        const { classes } = this.props;
        var messages = [];
        if (this.props.currSession) {
            for (var i = 0; i < this.props.sessions.length; i++) {
                const obj = this.props.sessions[i];
                if (obj.ses_id === this.props.currSession.ses_id) {
                    messages = obj.messages;
                    break;
                }
            }
        }
        const chatBubbles = messages.map((obj, i = 0) => (
            <div style={{marginLeft: "1%", marginRight: "1%"}}>
                <div className={`${classes.bubbleContainer} ${obj.direction}`}>
                    <p style={{fontSize: "11px", color: "gray"}}>
                        {`${obj.username} @ ${obj.date}`}
                    </p>
                </div>
                <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
                    <div key={i++} className={(obj.direction === 'left') ? classes.leftMsg : classes.rightMsg}>
                        {obj.message}
                    </div>
                </div>
            </div>
        ));
        return (
            <Card className={classes.container}>
                {(this.props.messages.length > 0) && chatBubbles}
                {(this.props.messages.length === 0) && `No messages yet`}
            </Card>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MessageBox);
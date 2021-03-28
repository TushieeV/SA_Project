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
        borderRadius: "10px",
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
    }
});

class MessageBox extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { classes } = this.props;
        const chatBubbles = this.props.messages.map((obj, i = 0) => (
            <div style={{marginLeft: "1%"}}>
                <p style={{fontSize: "11px", color: "gray"}}>
                    {`${obj.username} @ ${obj.date}`}
                </p>
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
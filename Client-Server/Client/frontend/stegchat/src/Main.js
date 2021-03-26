import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { CssBaseline } from "@material-ui/core";
import MessageBar from './MessageBar';
import MessageBox from './MessageBox'

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
    }
});

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };
        this.render = this.render.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    sendMessage(e, message) {
        e.preventDefault();
        var newMsgs = [...this.state.messages];
        newMsgs.push({
            message: message,
            direction: "left"
        });
        this.setState({messages: newMsgs});
    }
    render() {
        const { classes } = this.props;
        return (
            <Container>
                <CssBaseline />
                <div class={classes.flexBoxColumn}>
                    <div class={classes.flexBoxRow}>
                        <MessageBox messages={this.state.messages} />
                    </div>
                    <MessageBar sendMessage={this.sendMessage} />
                </div>
            </Container>
        );
    }
};

export default withStyles(useStyles, {withTheme: true})(Main);
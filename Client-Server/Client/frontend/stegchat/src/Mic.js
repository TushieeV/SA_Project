import React from 'react';
import { ReactMic } from 'react-mic';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';

export default class Mic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    }
  }

  startRecording = () => {
    this.setState({ record: true });
  }

  stopRecording = () => {
    this.setState({ record: false });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
    /*var reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob);
    reader.onloadend = function () {
        var base64string = reader.result;
        console.log(base64string);
    }*/
    recordedBlob.blob.arrayBuffer().then(res => console.log(res));

  }

  render() {
    return (
      <div>
        <div>
          <ReactMic
            record={this.state.record}
            className="sound-wave"
            onStop={this.onStop}
            onData={this.onData}
            strokeColor="#000000"
            backgroundColor="#FF4081"
            mimeType="audio/wav"
          />
        </div>
        <IconButton
          variant="contained"
          color="secondary"
          onClick={this.startRecording}
          disabled={this.state.record}
        >
          <MicIcon />
        </IconButton>
        <IconButton
          variant="contained"
          color="secondary"
          onClick={this.stopRecording}
          disabled={!this.state.record}
        >
          <StopIcon />
        </IconButton>
      </div>
    );
  }
}
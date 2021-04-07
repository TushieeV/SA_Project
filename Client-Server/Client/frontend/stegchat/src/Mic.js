import React from 'react';
import { ReactMic } from 'react-mic';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';

const fs = require('electron').remote.require('fs');

export default class Mic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      audio: null
    }
    this.onStop = this.onStop.bind(this);
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
    var reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob);
      
    recordedBlob.blob.arrayBuffer().then(res => {
      var buffer = Buffer.from(res);
      this.props.setAudio(buffer.toString('base64'));
    })

    //reader.onloadend = function () {
    //    var base64string = reader.result;
        
        //this.props.setAudio(base64string);
        //console.log(base64string);
        //console.log(base64string.length);
    //}
    /*recordedBlob.blob.arrayBuffer().then(res => {
      fs.writeFileSync('test.wav', Buffer(new Uint8Array(res)));
      console.log(res);
      var binary = '';
      var bytes = new Uint8Array(res);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      console.log(window.btoa(binary));
    });*/
    
    //recordedBlob.blob.arrayBuffer().then(res => {
    //  fs.writeFileSync('test.wav', Buffer(new Uint8Array(res)));
    //});
  
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
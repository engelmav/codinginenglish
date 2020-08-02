import React from 'react';
import Jitsi from 'react-jitsi';




const handleAPI = (JitsiMeetAPI) => {
  // JitsiMeetAPI.executeCommand('toggleVideo')
  window.JitsiAPI = JitsiMeetAPI;
}

const VideoCall = () =>
  <Jitsi
    containerStyle={{ width: '600', height: '400px' }}
    roomName={"cievideo"}
  // displayName={"Jisti display name"}
  // // password={password}
  onAPILoad={handleAPI}
  />;




export default VideoCall;
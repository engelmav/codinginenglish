import React, { useEffect } from 'react';
import axios from 'axios';
// import Jitsi from 'react-jitsi';
import { ZoomMtg } from '@zoomus/websdk';

// import("./math").then(math => {
//   console.log(math.add(16, 26));
// });
ZoomMtg.setZoomJSLib('node_modules/@zoomus/websdk/dist/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

// const handleAPI = (JitsiMeetAPI) => {
//   // JitsiMeetAPI.executeCommand('toggleVideo')
//   console.log("jitsimeet api")
//   console.log(JitsiMeetAPI);
// }

// const VideoCall = () =>
//   <Jitsi
//     containerStyle={{ width: '600', height: '400px' }}
//     roomName={"Coding in English Video"}
//   // displayName={"Jisti display name"}
//   // // password={password}
//   // onAPILoad={handleAPI}
//   />;

function joinMeeting(meetingNumber, password) {
  let userName = "user123";
  if (userName === null) {
    userName = document.getElementById('display_name').value;
  }
  console.log('joinMeeting() got userName', userName);

  axios.get(`/api/zoom/signature/${meetingNumber}/${Date.now()}`)
    .then((res) => {
      const { signature, apiKey } = res.data;
      console.log(`Joining user ${userName} to zoom ID ${meetingNumber}`);
      ZoomMtg.init({
        leaveUrl: 'http://127.0.0.1:5000/',
        isSupportAV: true,
        success() {
          ZoomMtg.join(
            {
              meetingNumber,
              userName,
              signature,
              apiKey,
              userEmail: 'email@gmail.com',
              passWord: password,
              success() {
                console.log('join meeting success');
              },
              error(err) {
                console.log(err);
              }
            }
          );
        },
        error(err) {
          console.log(err);
        }
      });
    });
}



class VideoCall extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}



export default VideoCall;
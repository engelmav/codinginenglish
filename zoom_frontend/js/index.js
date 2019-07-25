import { ZoomMtg } from 'zoomus-jssdk';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

console.log('checkSystemRequirements');
console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

function getUserName() {
  const params = window.location.href.split('?')[1].split('&');
  const data = {};

  params.forEach((param) => {
    const splitParam = param.split('=');
    const key = splitParam[0];
    const value = splitParam[1];
    data[key] = value;
  });
  if ('userName' in data) {
    return data.userName;
  }
  return null;
}


function joinMeeting(meetingNumber) {
  let userName = getUserName();
  if (userName === null) {
    userName = document.getElementById('display_name').value;
  }
  console.log('joinMeeting() got userName', userName);

  axios.get(`/zoom/signature/${meetingNumber}/${Date.now()}`)
    .then((res) => {
      const { signature, apiKey } = res.data;
      console.log(`Joining user ${userName} to zoom ID ${meetingNumber}`);
      ZoomMtg.init({
        leaveUrl: 'http://127.0.0.1:5002/',
        isSupportAV: true,
        success() {
          ZoomMtg.join(
            {
              meetingNumber,
              userName,
              signature,
              apiKey,
              userEmail: 'email@gmail.com',
              passWord: '',
              success() {
                $('#nav-tool').hide();
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

const addZoom = () => {
  document.getElementById('join_meeting').addEventListener('click', (e) => {
    e.preventDefault();
    const meetingNumber = parseInt(document.getElementById('meeting_number').value, 10);
    joinMeeting(meetingNumber);
  });
};


class ZoomApp extends Component {
  componentDidMount() {
    addZoom();
    const source = new EventSource('/stream');
    source.onmessage = (event) => {
      const eventData = event.data;
      console.log(eventData);
      if (eventData !== '1') {
        joinMeeting(eventData);
      }
    };
  }

  render() {
    return (
      <div>
        hi
      </div>
    );
  }
}

ReactDOM.render(<ZoomApp />, document.getElementById('root'));

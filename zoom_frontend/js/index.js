import { ZoomMtg } from 'zoomus-jssdk';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

console.log('checkSystemRequirements');
console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const addZoom = () => {
  document.getElementById('join_meeting').addEventListener('click', (e) => {
    e.preventDefault();
    const meetingNumber = parseInt(document.getElementById('meeting_number').value, 10);
    axios.get(`/zoom/signature/${meetingNumber}/${Date.now()}`)
      .then((res) => {
        const { signature, apiKey } = res.data;
        const userName = document.getElementById('display_name').value;
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
  });
};


class ZoomApp extends Component {
  componentWillMount() {
    addZoom();
    const source = new EventSource('/stream');
    source.addEventListener('greeting', (event) => {
      const data = JSON.parse(event.data);
      console.log('Event data!:', data);
    }, false);
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

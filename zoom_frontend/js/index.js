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
            // add a timeout here somehow453605633333320
            setTimeout(() => {
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
                  error(res) {
                    console.log(res);
                  }
                }
              );
            }, 5000);
          },
          error(res) {
            console.log(res);
          }
        });
      });
  });
};


class ZoomApp extends Component {

  componentWillMount() {
    addZoom();
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

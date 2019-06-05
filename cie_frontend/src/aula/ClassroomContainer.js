import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import Chat from '../Chat/Chat'


const userData = {
  name: "Vincenzo"
}

export default class ClassroomContainer extends Component {
  render() {
    return (
      <div className="classroomcontainer">
        <div className="classroomview" id="zoomView">
          <Iframe
            url="http://0.0.0.0:5002/"
            width="840"
            height="450px" />
        </div>
        <div className="classroomview" id="slidesView">
          <Iframe
            url="http://slides.com/vincentengelmann/interview-strategy/embed" 
              width="576" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </div>
        <div className="classroomview" id="chatView">
          {/* <Chat userData={userData}/> */}
          <Iframe
            url="https://codinginenglish.rocket.chat/channel/general?layout=embedded"
            id="classroomcontainer__chat-iframe"
          />
        </div>
        <div className="classroomview" id="codeView">
          Code
        </div>
      </div>
    )
  }
}

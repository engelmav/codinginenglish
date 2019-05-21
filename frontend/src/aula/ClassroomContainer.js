import React, { Component } from 'react'
import './ClassroomContainer.css';

export default class ClassroomContainer extends Component {
  render() {
    return (
      <>
        <div className="classroomview" id="zoomView">
          Zoom
        </div>
        <div className="classroomview" id="slidesView">
          Slides
        </div>
        <div className="classroomview" id="chatView">
          Chat
        </div>
        <div className="classroomview" id="codeView">
          Code
        </div>
      </>
    )
  }
}

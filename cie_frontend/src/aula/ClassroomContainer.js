import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import ChatView from './ChatView';


export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let userFirstName = null;
    if (this.props.authData !== null){
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }
    return (
      <div className="classroomcontainer">
        <div className="classroomview" id="zoomView">
          <Iframe
            url={`http://0.0.0.0:9999?userName=${userFirstName}`}
            width="100%"
            height="100%"
          />
        </div>
        <div className="classroomview">
          <Iframe
            id="slidesView"
            url="http://slides.com/vincentengelmann/interview-strategy/embed"
            width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </div>
        <div className="classroomview" id="chatView">
          <ChatView authData={this.props.authData} />
        </div>
        <div className="classroomview" id="codeView">
          <Iframe
            width="100%"
            height="100%"
            src="https://repl.it/@VincentEngelman/Module002-MenusAndFunctions-Web?lite=true">

          </Iframe>

        </div>
      </div>
    )
  }
}

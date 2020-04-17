import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FaGripLines } from 'react-icons/fa'
import { Rnd } from 'react-rnd';
import settings from '../settings';


let channelName = "general";
let slideName = '001-devteamsloops';


export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);

    this.setGuacViewerRef = element => {
      this.guacViewer = element;
    };

    this.focusGuacViewer = () => {
      if (this.guacViewer) this.guacViewer.focus();
    }
  }

  render() {
    let userFirstName = null;
    if (this.props.authData !== null) {
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }

    return (
      <>
        <div style={{ border: "1px solid black" }}>test thing</div>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div style={{ background: "white" }}><FaGripLines />Slides</div>
          <Iframe
            id="slidesView"
            url={`${settings.slidesUrl}/${slideName}/embed}`}
            width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </Rnd>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div style={
            {
              border: "1px solid black"
            }
          }><FaGripLines />Chat</div>
          <Iframe
            url={`${settings.rocketchatUrl}/${channelName}?layout=embedded`}
            id="classroomcontainer__chat-iframe"
            width="100%" height="500px"
          />
        </Rnd>
        <Rnd
          default={{
            x: 0,
            y: 0,
            width: 600,
            height: 400
          }}
        >
          <div><FaGripLines />Video</div>
          <Iframe
            url={`./zoomIndex.html?userName=${userFirstName}`}
            width="100%"
            height="100%"
          />
        </Rnd>
        <Rnd
          default={{
            x: 605,
            y: 0,
            width: 800,
            height: 600
          }}
        >
          <div><FaGripLines />Dev</div>
          <Iframe
            ref={this.setGuacViewerRef}
            onClick={this.focusGuacViewer}
            id="guac-view"
            url={settings.guacUrl}
            width="100%"
            height="100%"
            scrolling="auto"
            frameborder="10"
          />
        </Rnd>
      </>
    )
  }
}

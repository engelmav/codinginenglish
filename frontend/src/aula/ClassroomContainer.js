import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Window } from '../UtilComponents/Window';
import { Button } from '../UtilComponents/Button';
import { FaGripLines } from 'react-icons/fa'
import { Rnd } from 'react-rnd';
import settings from '../settings';



let channelName = "general";
let slideName = '001-devteamsloops';


export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guacViewer: true
    };

    this.setGuacViewerRef = element => {
      this.guacViewer = element;
    };

    this.focusGuacViewer = () => {
      if (this.guacViewer) this.guacViewer.focus();
    }
  }

  toggleGuacViewer = () => {
    this.setState({ guacViewer: !this.state.guacViewer})
  }

  render() {
    const { guacViewer } = this.state;
    const { toggleGuacViewer } = this;
    let userFirstName = null;
    if (this.props.authData !== null) {
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }

    return (
      <div>
        {!guacViewer && <Button>Dev Environment</Button>}
        {guacViewer && <p>Coding in English</p>}
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
        {guacViewer && <Rnd
          default={{
            x: 605,
            y: 0,
            width: 800,
            height: 600
          }}
        >
          <Window title="Dev Environment" onClose={toggleGuacViewer}/>
          <Iframe
            ref={this.setGuacViewerRef}
            onClick={this.focusGuacViewer}
            id="guac-view"
            url={settings.guacUrl}
            width="100%"
            height="100%"
            scrolling="auto"
            frameborder="10"
            style={{border: "10px solid black"}}
          />
          <div style={{border: "1px solid black"}}>thing</div>
        </Rnd>}
      </div>
    )
  }
}

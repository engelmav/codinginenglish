import React, { Component } from 'react'
import './ClassroomContainer.css';
import Iframe from 'react-iframe';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styled from 'styled-components';
import { Window } from '../UtilComponents/Window';
import { Button } from '../UtilComponents/Button';
import { Rnd } from 'react-rnd';
import settings from '../settings';


let channelName = "general";
let prezzieName = '001-devteamsloops';
const rocketChatUrl = `${settings.rocketchatUrl}${channelName}?layout=embedded`;
const slidesUrl = `${settings.slidesUrl}/${prezzieName}/embed?postMessageEvents=true}`
console.log(`Using slides url ${slidesUrl}`);
console.log(`Using rocketchat url ${rocketChatUrl}`);
const slidesWindowTop = "slidesWindow";
const videoWindowTop = "videoWindow";
const guacWindowTop = "guacWindow";
const chatWindowTop = "chatWindow";

const Taskbar = styled.div`
  border-radius: 3px;
  margin-top: 3px;
  margin-left: 3px;
  padding: 4px;
`;

export default class ClassroomContainer extends Component {
  constructor(props) {
    super(props);
    this.slidesWindow = React.createRef();

    this.state = {
      guacWindow: true,
      chatWindow: true,
      slidesWindow: true,
      videoWindow: true,
      onTop: null
    };

    this.setGuacViewerRef = element => {
      this.guacViewer = element;
    };

    this.focusGuacViewer = () => {
      if (this.guacViewer) this.guacViewer.focus();
    }
  }
  // TODO: convert to hooks
  toggleGuac = () => {
    this.setState({ guacWindow: !this.state.guacWindow })
  }
  toggleChat = () => {
    this.setState({ chatWindow: !this.state.chatWindow })
  }
  toggleVideo = () => {
    this.setState({ videoWindow: !this.state.videoWindow })
  }

  render() {
    const { guacWindow, chatWindow, slidesWindow, videoWindow, onTop } = this.state;
    const { toggleGuac, toggleChat, toggleVideo } = this;
    let userFirstName = null;
    if (this.props.authData !== null) {
      userFirstName = this.props.authData.idTokenPayload.given_name;
    }

    return (
      <div>
        <Taskbar>
          {!guacWindow && <Button mr={2} onClick={() => this.toggleGuac()}>Dev Environment</Button>}
          {!chatWindow && <Button mr={2} onClick={() => this.toggleChat()}>Chat</Button>}
          {!videoWindow && <Button mr={2} onClick={() => this.toggleVideo()}>Video</Button>}
          {guacWindow && chatWindow && videoWindow && <p>Coding in English</p>}
        </Taskbar>

        <Rnd
          default={{
            x: 0,
            y: 50,
            width: 600,
            height: 400
          }}
          style={{zIndex: (onTop === slidesWindowTop) ? 200: 0}}
          onClick={() => this.setState({onTop: slidesWindowTop})}
        >
          <Window title="Slides" hideClose={true} />
          <Iframe
            id="slidesView"
            url={slidesUrl}
            width="100%" height="100%" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />
        </Rnd>
        {chatWindow && <Rnd
          default={{
            x: 0,
            y: 450,
            width: 600,
            height: 400
          }}
          style={{zIndex: (onTop === chatWindowTop) ? 200: 0}}
          onClick={() => this.setState({onTop: chatWindowTop})}
        >
          <Window title="CIE Chat" onClose={toggleChat} />
          <Iframe
            url={rocketChatUrl}
            id="classroomcontainer__chat-iframe"
            width="100%" height="500px"
          />
        </Rnd>}
        {videoWindow && <Rnd
          default={{
            x: 600,
            y: 450,
            width: 600,
            height: 400
          }}
          style={{zIndex: (onTop === videoWindowTop) ? 200: 0}}
          onClick={() => this.setState({onTop: videoWindowTop})}
        >
          <Window title="Video" onClose={toggleVideo} />
          <Iframe
            url={`./zoomIndex.html?userName=${userFirstName}`}
            width="100%"
            height="100%"
          />
        </Rnd>}
        {guacWindow && <Rnd
          default={{
            x: 605,
            y: 0,
            width: 800,
            height: 600
          }}
          style={{zIndex: (onTop === guacWindowTop) ? 200: 0}}
          onClick={() => this.setState({onTop: guacWindowTop})}
        >
          <Window title="Dev Environment" onClose={toggleGuac} />
          <Iframe
            ref={this.setGuacViewerRef}
            onClick={this.focusGuacViewer}
            id="guac-view"
            url={settings.guacUrl}
            width="100%"
            height="100%"
            scrolling="yes"
            frameborder="10"
            style={{
              border: "10px solid black",
              top: 0,
              left: 0,
              height: "100%"
            }}
            style={{zIndex: (onTop === guacWindowTop) ? 200: 0}}
            onClick={() => this.setState({onTop: guacWindowTop})}
          />
        </Rnd>}
      </div>
    )
  }
}

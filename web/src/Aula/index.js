import React, { Component, Suspense, useEffect, useRef } from "react";
import "./styles.css";
import Iframe from "react-iframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styled from "styled-components";
import { Window, Button } from "../UtilComponents";
import { Rnd } from "react-rnd";
import { observer } from "mobx-react";
import Bounce from "react-reveal/Bounce";
import { browserDetect } from "../util";
import { DraggableCore } from "react-draggable";

const VideoCall = React.lazy(() => import("../VideoConference"));

const ChatSignIn = (props) => {
  const divRef = useRef(null);
  const authenticateChat = () => {
    const chatIframe = divRef.current.firstElementChild;
    chatIframe.addEventListener("load", function () {
      setTimeout(() => {
        console.log("posting message with", props.appStore.rocketchatAuthToken);
        this.contentWindow.postMessage(
          {
            externalCommand: "login-with-token",
            token: props.appStore.rocketchatAuthToken,
          },
          "*"
        );
      }, 8000);
    });
  };
  useEffect(() => authenticateChat(), []);
  return <div ref={divRef}>{props.children}</div>;
};

const Taskbar = styled.div`
  border-radius: 3px;
  margin-top: 3px;
  margin-left: 3px;
  padding: 4px;
`;

const CoverWindowOnDrag = styled.div`
  height: 100%;
  width: 100%;
  z-index: 101;
  position: absolute;
  background-color: lightGray;
`;

@observer
class Aula extends Component {
  constructor(props) {
    super(props);
    this.slidesWindow = React.createRef();

    this.state = {
      activityData: null,
      guacWindow: true,
      chatWindow: true,
      slidesWindow: true,
      videoWindow: true,
      popupActivityWindow: false,
      isWindowDragging: false,

      rocketchatAuthToken: null,
      chatChannel: null,
      prezzieLink: null,
      exerciseContent: null,
      onTop: null,
    };

    this.setGuacViewerRef = (element) => {
      this.guacViewer = element;
    };

    this.focusGuacViewer = () => {
      if (this.guacViewer) this.guacViewer.focus();
    };
    this.configureActiveSession = this.configureActiveSession.bind(this);
    this.chatIframeRef = React.createRef();
  }

  async configureActiveSession() {
    const { appStore, cieApi } = this.props;
    const activeSessionData = await cieApi.getActiveSessionByUserId(
      appStore.userId
    );

    const {
      chat_channel,
      prezzie_link,
      video_channel,
    } = activeSessionData.data;

    this.setState({
      chatChannel: chat_channel,
      prezzieLink: prezzie_link,
      videoChannel: video_channel,
    });
  }

  componentDidMount() {
    this.configureActiveSession();
    this.props.websocket.addEventListener("message", (event) => {
      const { data } = event;
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(
            "Aula: received websocket event data. Here it is, unparsed:",
            reader.result
          );
          let commmandData;
          try {
            commmandData = JSON.parse(reader.result);
            console.log(commmandData);
          } catch (ex) {
            console.error("Failed to parse websocket event data.", ex.stack);
            console.log(reader.result);
            return;
          }

          if (
            commmandData.hasOwnProperty("command") &&
            commmandData.command.name === "SHOW_ACTIVITY_POPUP"
          ) {
            this.setState(
              { activityData: commmandData.command.data },
              this.togglePopupActivity
            );
          }
        };
        reader.readAsText(data);
      }
    });
  }

  toggleGuac = () => {
    this.setState({ guacWindow: !this.state.guacWindow });
  };
  toggleChat = () => {
    this.setState({ chatWindow: !this.state.chatWindow });
  };
  toggleSlides = () => {
    this.setState({ slidesWindow: !this.state.slidesWindow });
  };
  toggleVideo = () => {
    this.setState({ videoWindow: !this.state.videoWindow });
  };
  togglePopupActivity = () => {
    this.setState({ popupActivityWindow: !this.state.popupActivityWindow });
  };

  handleWindowMove = (windowName) => {
    this.setState({ onTop: windowName, isWindowDragging: true });
  };
  handleWindowRelease = () => {
    this.setState({ isWindowDragging: false });
  };

  render() {
    const { appStore, settings, PopupActivity } = this.props;
    const {
      guacWindow,
      chatWindow,
      slidesWindow,
      videoWindow,
      popupActivityWindow,

      activityData,
      chatChannel,
      prezzieLink,
      videoChannel,

      onTop,
      isWindowDragging,
    } = this.state;

    const {
      toggleGuac,
      toggleChat,
      toggleSlides,
      toggleVideo,
      togglePopupActivity,
    } = this;

    const rocketChatUrl = `${settings.rocketchatUrl}${chatChannel}?layout=embedded`;
    const slidesWindowTop = "slidesWindow";
    const videoWindowTop = "videoWindow";
    const guacWindowTop = "guacWindow";
    const chatWindowTop = "chatWindow";
    const activityWindowOnTop = "activityWindow";

    return (
      <div>
        <Taskbar>
          {!slidesWindow && (
            <Button mr={2} onClick={this.toggleSlides}>
              Slides
            </Button>
          )}
          {!guacWindow && (
            <Button mr={2} onClick={this.toggleGuac}>
              Dev Environment
            </Button>
          )}
          {!chatWindow && (
            <Button mr={2} onClick={this.toggleChat}>
              Chat
            </Button>
          )}
          {!videoWindow && (
            <Button mr={2} onClick={this.toggleVideo}>
              Video
            </Button>
          )}
          {guacWindow && chatWindow && videoWindow && slidesWindow && <></>}
        </Taskbar>
        {popupActivityWindow && (
          <DraggableCore>
            <div>
              <PopupActivity
                activities={activityData}
                onClose={togglePopupActivity}
              />
            </div>
          </DraggableCore>
        )}
        {slidesWindow && prezzieLink && (
          <Rnd
            default={{
              x: 0,
              y: 50,
              width: 600,
              height: 400,
            }}
            style={{ zIndex: onTop === slidesWindowTop ? 200 : 0 }}
            onMouseDown={() => this.handleWindowMove(slidesWindowTop)}
            onDragStop={this.handleWindowRelease}
          >
            <Window title="Slides" hideClose={false} onClose={toggleSlides} />
            {isWindowDragging && <CoverWindowOnDrag />}
            <Iframe
              id="slidesView"
              url={prezzieLink}
              width="100%"
              height="100%"
              scrolling="no"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            />
          </Rnd>
        )}
        {chatWindow && chatChannel && (
          <Rnd
            default={{
              x: 0,
              y: 450,
              width: 600,
              height: 400,
            }}
            style={{ zIndex: onTop === chatWindowTop ? 200 : 0 }}
            onMouseDown={() => this.handleWindowMove(chatWindowTop)}
            onDragStop={this.handleWindowRelease}
          >
            <Window title="CIE Chat" onClose={toggleChat} />
            {isWindowDragging && <CoverWindowOnDrag />}
            <ChatSignIn appStore={this.props.appStore}>
              <Iframe
                url={rocketChatUrl}
                id="classroomcontainer__chat-iframe"
                width="100%"
                height="500px"
              />
            </ChatSignIn>
          </Rnd>
        )}

        {videoWindow && videoChannel && (
          <Rnd
            default={{
              x: 600,
              y: 450,
              width: 800,
              height: 400,
            }}
            style={{ zIndex: onTop === videoWindowTop ? 200 : 0 }}
            onMouseDown={() => this.handleWindowMove(videoWindowTop)}
            onDragStop={this.handleWindowRelease}
          >
            <Window title="Video" onClose={toggleVideo} />
            {isWindowDragging && <CoverWindowOnDrag />}
            <Suspense fallback={<div>Loading...</div>}>
              <VideoCall
                participantName={appStore.firstName}
                videoChannel={videoChannel}
              />
            </Suspense>
          </Rnd>
        )}

        {guacWindow && (
          <Rnd
            default={{
              x: 605,
              y: 0,
              width: 800,
              height: 600,
            }}
            style={{ zIndex: onTop === guacWindowTop ? 200 : 0 }}
            onMouseDown={() => this.handleWindowMove(guacWindowTop)}
            onDragStop={this.handleWindowRelease}
          >
            <Window title="Dev Environment" onClose={toggleGuac} />
            {isWindowDragging && <CoverWindowOnDrag />}
            {browserDetect.isSafari ? (
              <>
                <p>
                  It looks like you're using Safari. Try Chrome or Firefox. If
                  you REALLY want to try with Safari, this remote session window
                  won't work due to iframe constraints.
                </p>
                <button
                  onClick={() =>
                    window.open("https://remote.codinginenglish.com/guacamole")
                  }
                >
                  I'll try anyway.
                </button>
              </>
            ) : (
              <Iframe
                ref={this.setGuacViewerRef}
                id="guac-view"
                url={settings.guacUrl}
                width="100%"
                height="100%"
                scrolling="yes"
                frameborder="10"
                style={{ zIndex: onTop === guacWindowTop ? 200 : 0 }}
                onClick={() => {
                  this.focusGuacViewer();
                  this.setState({ onTop: guacWindowTop });
                }}
              />
            )}
          </Rnd>
        )}
      </div>
    );
  }
}

export { Aula };

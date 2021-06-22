import React, { Component, Suspense, useEffect, useRef } from "react";
import "./styles.css";
import Iframe from "react-iframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import * as S from "./styles";
import { Window, Button } from "../UtilComponents";
import { Rnd } from "react-rnd";
import { observer } from "mobx-react";
import { browserDetect } from "../util";
import _ from "lodash";
import { readSocketDataAnd } from "../messaging";
import { Link } from "react-router-dom";
import { ReadAndDo } from "../messaging";
import Dialog from "@material-ui/core/Dialog"

const VideoCall = React.lazy(() => import("../VideoConference"));

const ChatSignIn = (props) => {
  const divRef = useRef(null);
  const authenticateChat = () => {
    const chatIframe = divRef.current.firstElementChild;
    chatIframe.addEventListener("load", function () {
      setTimeout(() => {
        const result = this.contentWindow.postMessage(
          {
            externalCommand: "login-with-token",
            token: props.appStore.rocketchatAuthToken,
          },
          "*"
        );
        console.log("Result of contentWindow.postMessage:", result);
      }, 10000);
    });
  };
  useEffect(() => authenticateChat(), []);
  return <div ref={divRef}>{props.children}</div>;
};

const SlidesController = ({ websocketManager, activeSessionId, children }) => {
  const divRef = useRef(null);
  useEffect(() => {
    async function init() {
      const slidesSocket = await websocketManager.createWebsocket(
        activeSessionId + "-slides",
        "slides-client"
      );
      console.log("Created websocket", slidesSocket);
      function sendSlideCommand(eventData) {
        console.log("got slide command", eventData);
        slidesIframe.contentWindow.postMessage(
          JSON.stringify(eventData.command.data),
          "*"
        );
      }
      const handleWebsocketEvent = _.partial(
        readSocketDataAnd,
        sendSlideCommand
      );
      const slidesIframe = divRef.current.firstElementChild;
      slidesSocket.addEventListener("message", handleWebsocketEvent);
    }
    init();
  }, []);
  return (
    <div style={{ height: "100%" }} ref={divRef}>
      {children}
    </div>
  );
};

@observer
class Aula extends Component {
  constructor(props) {
    super(props);
    this.slidesWindow = React.createRef();

    this.state = {
      activityData: [],
      aulaWebsocket: null,
      guacWindow: true,
      chatWindow: true,
      slidesWindow: true,
      videoWindow: true,
      instructorPanel: true,
      popupActivityWindow: false,
      isWindowDragging: false,

      rocketchatAuthToken: null,
      chatChannel: null,
      prezzieLink: null,
      exerciseContent: null,
      onTop: null,

      roomChangeNotification: null
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
    const { appStore, cieApi, websocketManager } = this.props;
    const activeSessionData = await cieApi.getActiveSessionByUserId(
      appStore.userId
    );
    const activeSessionId = activeSessionData.data.id;
    appStore.activeSessionId = activeSessionId;

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

    const aulaWebsocket = await websocketManager.createWebsocket(
      `aula-${activeSessionId}`,
      appStore.userId
    );
    const handleAulaMessage = (eventData) => {
      console.log("handleAuthMessage eventData:", eventData);
      /**
       * todo: handle the aulaconfig messages here.
       */
      if (eventData.hasOwnProperty("command")) {
        const { name } = eventData.command;
        if (name === "SHOW_ACTIVITY_POPUP") {
          this.setState(
            { activityData: eventData.command.data },
            this.openPopupActivity()
          );
        } else if (name === "HIDE_ACTIVITY_POPUP") {
          this.closePopupActivity();
        }
        return;
      }
    };
    const readAndDo = new ReadAndDo(handleAulaMessage);
    aulaWebsocket.addEventListener("message", readAndDo.read);
    this.setState({ aulaWebsocket }, () => console.log("websocket set"));
  }

  componentDidMount() {
    this.configureActiveSession();
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

  toggleInstructorPanel = () =>
    this.setState({ instructorPanel: !this.state.instructorPanel });

  handleWindowMove = (windowName) => {
    this.setState({ onTop: windowName, isWindowDragging: true });
  };
  handleWindowRelease = () => {
    this.setState({ isWindowDragging: false });
  };

  openPopupActivity = () => this.setState({ popupActivityWindow: true });
  closePopupActivity = () =>
    this.setState({ popupActivityWindow: false, activityData: [] });

  render() {
    const {
      appStore,
      settings,
      InstructorPanel,
      PopupActivity,
      websocketManager,
    } = this.props;
    const {
      aulaWebsocket,

      guacWindow,
      chatWindow,
      slidesWindow,
      videoWindow,
      popupActivityWindow,
      instructorPanel,

      activityData,
      chatChannel,
      prezzieLink,
      videoChannel,

      onTop,
      isWindowDragging,

      roomChangeNotification
    } = this.state;

    const {
      toggleGuac,
      toggleChat,
      toggleSlides,
      toggleVideo,
      toggleInstructorPanel,
    } = this;

    const rocketChatUrl = `${settings.rocketchatUrl}${chatChannel}?layout=embedded`;
    const slidesWindowTop = "slidesWindow";
    const videoWindowTop = "videoWindow";
    const guacWindowTop = "guacWindow";
    const chatWindowTop = "chatWindow";
    const activityWindowOnTop = "activityWindow";

    const videoEnabled = false;

    const dialogOpen = roomChangeNotification; // && concatenate
    return (
      <S.ClassroomContainer>
        <S.ClassroomHeader>
          <Link to="/">
            <img
              style={{ height: "40px", display: "inline" }}
              alt="cie logo"
              src={`${settings.assets}/cie-logo-horizontal-black.png`}
            ></img>
          </Link>
          <S.Taskbar>
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
          </S.Taskbar>
        </S.ClassroomHeader>
        {popupActivityWindow && (
          <div>
            <PopupActivity
              activities={activityData || []}
              websocket={aulaWebsocket}
              onClose={this.closePopupActivity}
            />
          </div>
        )}
        {instructorPanel &&
          appStore.userRole === "instructor" &&
          aulaWebsocket && (
            <Rnd
              default={{
                x: 0,
                y: 50,
                width: 600,
                height: 560,
              }}
              style={{
                zIndex: onTop === slidesWindowTop ? 200 : 0,
                borderBottom: "1px black solid",
                backgroundColor: "white",
              }}
              onMouseDown={() => this.handleWindowMove(slidesWindowTop)}
              onDragStop={this.handleWindowRelease}
              dragHandleClassName={"drag-handle"}
            >
              <Window
                title="Instructor Panel"
                hideClose={false}
                onClose={toggleInstructorPanel}
              />
              <InstructorPanel />
            </Rnd>
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
            {isWindowDragging && <S.CoverWindowOnDrag />}
            <SlidesController
              activeSessionId={appStore.activeSessionId}
              websocketManager={websocketManager}
            >
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
            </SlidesController>
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
            {isWindowDragging && <S.CoverWindowOnDrag />}
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

        {videoWindow && videoChannel && videoEnabled && (
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
            {isWindowDragging && <S.CoverWindowOnDrag />}
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
            {isWindowDragging && <S.CoverWindowOnDrag />}
            {browserDetect.isSafari ? (
              <>
                <p>
                  It looks like you're using Safari. Try Chrome or Firefox. If
                  you REALLY want to try with Safari, this remote session window
                  won't work due to iframe constraints.
                </p>
                <Button
                  onClick={() =>
                    window.open("https://remote.codinginenglish.com/guacamole")
                  }
                >
                  I'll try anyway.
                </Button>
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
      <Dialog open={dialogOpen}>
        {roomChangeNotification && 
          <RoomChangeNotification appStore={appStore}/>
        }
      </Dialog>  
      </S.ClassroomContainer>
    );
  }
}

const RoomChangeNotification = ({appStore}) => {
  const goToRoom = () => {
    console.log("pretend going to room");
  }
  return (
    <div>
      <p>You've been invited to breakout room {appStore.currentRoom}.</p>
      <Button onClick={goToRoom}>Take me there!</Button>
    </div>
  )
}

export { Aula };

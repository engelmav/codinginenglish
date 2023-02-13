import React, { Component, useEffect, useRef, useState } from "react";
import Iframe from "react-iframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import * as S from "./styles";
import { Window, Button } from "animo-ui";
import { Rnd } from "react-rnd";
import { readSocketDataAnd, ReadAndDo } from "../messaging";
import { browserDetect } from "../util";
import settings from "../settings";
import { useAppStore } from "./store";
import InstructorPanel from "../InstructorPanel/InstructorPanel";
import { PopupActivity } from "../PopupActivity/PopupActivity";
const Dialog = React.lazy(() => import("@material-ui/core/Dialog"));
const VideoCall = React.lazy(() => import("../VideoConference"));

//   const { InstructorPanel, PopupActivity, websocketManager } = this.props;

const ChatSignIn = (props) => {
  useEffect(() => {}, [props.rocketChatAuthToken]);
  const divRef = useRef(null);
  const authenticateChat = () => {
    const chatIframe = divRef.current.firstElementChild;
    chatIframe.addEventListener("load", function () {
      setTimeout(() => {
        this.contentWindow.postMessage(
          {
            externalCommand: "login-with-token",
            token: props.rocketchatAuthToken,
          },
          "*"
        );
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
      const { partial } = await import("lodash");
      const handleWebsocketEvent = partial(readSocketDataAnd, sendSlideCommand);
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

const Aula = (props) => {
  const [rocketChatAuthToken, setRocketChatAuthToken] = useState();
  const [activeSessionSlug, setActiveSessionSlug] = useState();

  const [userId, setUserId] = useState();
  const [userRole, setUserRole] = useState();
  const [firstname, setFirstname] = useState();

  const [activeSessionId, setActiveSessionId] = useState();
  const [currentRoom, setCurrentRoom] = useState("main");

  const [activityPopupWindow, setActivityPopupWindow] = useState(false);
  const [activityPopupData, setActivityPopupData] = useState();
  const [guacWindow, setGuacWindow] = useState();
  const [aulaWebsocket, setAulaWebsocket] = useState();
  const [chatWindow, setChatWindow] = useState();
  const [chatChannel, setChatChannel] = useState(); // isn't this the same as currentRoom?
  const [slidesWindow, setSlidesWindow] = useState();
  const [videoWindow, setVideoWindow] = useState();
  const [videoChannel, setVideoChannel] = useState();
  const [instructorPanel, setInstructorPanel] = useState();
  const [prezzieLink, setPrezzieLink] = useState();
  const [onTop, setOnTop] = useState();
  const [windowDragging, setWindowDragging] = useState(false);
  const [roomChangeNotification, setRoomChangeNotification] = useState();

  function setChatChannel() {}
  function setVideoChannel() {}

  const slidesWindowRef = React.createRef();
  const chatIframeRef = React.createRef();

  const setGuacViewerRef = (element) => {
    guacViewer = element;
  };
  const focusGuacViewer = () => {
    if (guacViewer) guacViewer.focus();
  };

  useEffect(() => onMount(), []);

  function setChatChannel(name) {
    setChatChannel(`${name}-${appStore.activeSessionSlug}`);
  }

  function setVideoChannel(name) {
    appStore.setVideoChannel(
      `${name}-video-${this.props.appStore.activeSessionSlug}`
    );
  }

  const configureActiveSession = async () => {
    const { cieApi, websocketManager } = this.props;
    const activeSessionData = await cieApi.getActiveSessionByUserId(
      appStore.userId
    );

    setActiveSessionId(activeSessionData.data.id);
    const { prezzie_link, slug } = activeSessionData.data;

    setActiveSessionSlug(slug);

    setPrezzieLink(prezzie_link);
    setVideoChannel("main");
    setChatChannel("main");

    const aulaWebsocket = await websocketManager.createWebsocket(
      `aula-${activeSessionId}`,
      userId
    );
    const handleAulaMessage = (eventData) => {
      console.log("handleAuthMessage eventData:", eventData);
      if (eventData.hasOwnProperty("action")) {
        handleAulaAction(eventData);
        return;
      }
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
    this.setState({ aulaWebsocket });
  };

  const onMount = async () => {
    // dependency of PopupActivity
    const script = document.createElement("script");
    script.src = "https://unpkg.com/gifler@0.1.0/gifler.min.js";
    script.async = true;
    document.body.appendChild(script);

    configureActiveSession();
  };

  const handleAulaAction = (actionEvent) => {
    const { appStore } = this.props;
    console.log("action event:", actionEvent);
    if (
      actionEvent.action === "aula.move_student" &&
      actionEvent.data.student === appStore.userId
    ) {
      const { to_room: newRoom } = actionEvent.data;
      console.log("student move action");

      document.addEventListener("acceptBreakout", () => {
        this.setVideoChannel(newRoom);
        this.setChatChannel(newRoom);
        this.setState({
          dialogOpen: false,
          roomChangeNotification: false,
        });
      });

      openRoomChangePrompt(newRoom);
    }
  };
  const openRoomChangePrompt = async (roomName) => {
    this.props.appStore.currentRoom = roomName;
    this.setState({ dialogOpen: true, roomChangeNotification: true });
  };

  const toggleGuac = () => {
    this.setState({ guacWindow: !this.state.guacWindow });
  };
  const toggleChat = () => {
    this.setState({ chatWindow: !this.state.chatWindow });
  };
  const toggleSlides = () => {
    this.setState({ slidesWindow: !this.state.slidesWindow });
  };
  const toggleVideo = () => {
    this.setState({ videoWindow: !this.state.videoWindow });
  };
  const togglePopupActivity = () => {
    this.setState({ popupActivityWindow: !this.state.popupActivityWindow });
  };

  const toggleInstructorPanel = () =>
    this.setState({ instructorPanel: !this.state.instructorPanel });

  const handleWindowMove = (windowName) => {
    this.setState({ onTop: windowName, isWindowDragging: true });
  };
  const handleWindowRelease = () => {
    this.setState({ isWindowDragging: false });
  };

  const openPopupActivity = () => this.setState({ popupActivityWindow: true });
  const closePopupActivity = () => {
    appStore.setPopupActivityWindow(false);
    appStore.setActivityData([]);
  };

  const rocketChatUrl = `${settings.rocketchatUrl}${chatChannel}?layout=embedded`;

  // const slidesWindowTop = "slidesWindow";
  // const videoWindowTop = "videoWindow";
  // const guacWindowTop = "guacWindow";
  // const chatWindowTop = "chatWindow";
  // const activityWindowOnTop = "activityWindow";

  const showVideo = videoWindow && videoChannel;

  const dialogOpen = roomChangeNotification; // && concatenate
  return (
    <S.ClassroomContainer>
      <S.ClassroomHeader>
        <a href="http://www.codinginenglish.com">
          <img
            style={{ height: "40px", display: "inline" }}
            alt="cie logo"
            src={`${settings.assets}/cie-logo-horizontal-black.png`}
          />
        </a>

        <S.RoomStatus>
          <S.GroupIcon />
          {appStore.currentRoom || "main"}
        </S.RoomStatus>
        <S.Taskbar>
          {!slidesWindow && (
            <Button mr={2} onClick={toggleSlides}>
              Slides
            </Button>
          )}
          {!guacWindow && (
            <Button mr={2} onClick={toggleGuac}>
              Dev Environment
            </Button>
          )}
          {!chatWindow && (
            <Button mr={2} onClick={toggleChat}>
              Chat
            </Button>
          )}
          {!videoWindow && (
            <Button mr={2} onClick={toggleVideo}>
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
      {instructorPanel && appStore.userRole === "instructor" && aulaWebsocket && (
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
          <Window title={`CIE Chat (${chatChannel})`} onClose={toggleChat} />
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

      {showVideo && (
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
          <VideoCall
            key={videoChannel}
            participantName={appStore.firstName}
            videoChannel={videoChannel}
          />
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
                It looks like you're using Safari. Try Chrome or Firefox. If you
                REALLY want to try with Safari, this remote session window won't
                work due to iframe constraints.
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
              style={{
                zIndex: onTop === guacWindowTop ? 200 : 0,
              }}
              onClick={() => {
                this.focusGuacViewer();
                this.setState({ onTop: guacWindowTop });
              }}
            />
          )}
        </Rnd>
      )}
      <Dialog open={dialogOpen}>
        {roomChangeNotification && (
          <RoomChangeNotification
            appStore={appStore}
            onAccept={this.moveToNewRoom}
          />
        )}
      </Dialog>
    </S.ClassroomContainer>
  );
};

const RoomChangeNotification = ({ appStore, onAccept }) => {
  const goToRoom = () => {
    console.log("pretend going to room");
    const acceptBreakoutEvent = new Event("acceptBreakout");
    document.dispatchEvent(acceptBreakoutEvent);
  };
  return (
    <div>
      <p>You've been invited to breakout room {appStore.currentRoom}.</p>
      <Button onClick={goToRoom}>Take me there!</Button>
    </div>
  );
};

export { Aula };

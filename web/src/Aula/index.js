import React, { Component, Suspense, useEffect, useRef } from "react";
import "./styles.css";
import Iframe from "react-iframe";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styled from "styled-components";
import { Window, Button } from "../UtilComponents";
import { PopupActivity } from "../PopupActivity";
import { Rnd } from "react-rnd";
import { observer } from "mobx-react";
import Bounce from "react-reveal/Bounce";
import { browserDetect } from "../util";

const VideoCall = React.lazy(() => import("../VideoConference"));

const ChatSignIn = (props) => {
  const divRef = useRef(null);
  const authenticateChat = () => {
    const chatIframe = divRef.current.firstElementChild;
    chatIframe.addEventListener("load", function() {
     this.contentWindow.postMessage(
        {
          externalCommand: "login-with-token",
          token: props.appStore.rocketchatAuthToken,
        },
        "*"
      );
    });
    // divRef.current.firstElementChild.contentWindow.postMessage(
    //   {
    //     externalCommand: "login-with-token",
    //     token: props.appStore.rocketchatAuthToken,
    //   },
    //   "*"
    // );
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

      rocketchatAuthToken: null,
      chatChannel: null,
      prezzieLink: null,
      exerciseContent: null,
      onTop: null,
    };

    this.eventSource = new EventSource("/api/stream");

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
    /**
     * We want to check if a user already has a Rocketchat
     * login. For this, we'll need to get the user's
     * username from Auth0 and check Rocketchat.
     * --> do this on student  login, because we won't know
     * their login name ahead of time necessarily. the common key
     * is the user_id in the CIE database. If the username is present, just add the user
     * to the ActiveSession's chat channel, and just let the
     * SSO process take place with the Rocketchat iframe. If
     * it isn't present, create it, and only after it's created,
     * join the user to the chat channel and let the SSO take place.
     */
    const { appStore, cieApi } = this.props;
    const activeSessionData = await cieApi.getActiveSessionByUserId(
      appStore.userId
    );
    const {
      chat_channel,
      prezzie_link,
      video_channel,
    } = activeSessionData.data;

    console.log(
      "activeSessionData destructured:",
      chat_channel,
      prezzie_link,
      video_channel
    );

    // channel was already created by admin app
    // const resp = await cieApi.configureRocketchat();
    /**
     * We need to go create the channel in the util.py code.
     * util.py acts like the admin console. When that's created,
     * we only need to ADD the user to the chat channel.
     * When we;re done changing util.py, come back here and
     * add the call to addUserToChannel(). I think that, because
     * addUserToChannel requires a roomId, we should save it in
     * the database so we can use it here.
     */

    this.setState(
      {
        chatChannel: chat_channel,
        prezzieLink: prezzie_link,
        videoChannel: video_channel,
      },
      () => console.log("state updated:", this.state)
    );
    console.log("After set state");
  }

  componentDidMount() {
    this.configureActiveSession();
    this.eventSource.addEventListener("classUpdate", (e) => {
      console.log("received SSE event data:");
      const { data } = e;
      let commmandData;
      try {
        commmandData = JSON.parse(data);
        console.log(commmandData);
      } catch (ex) {
        console.error("Exception thrown", ex.stack);
        console.log(e);
        console.log(data);
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
    });
  }

  toggleGuac = () => {
    this.setState({ guacWindow: !this.state.guacWindow });
  };
  toggleChat = () => {
    this.setState({ chatWindow: !this.state.chatWindow });
  };
  toggleSlides = () => {
    console.log("toggle slides");
    this.setState({ slidesWindow: !this.state.slidesWindow });
  };
  toggleVideo = () => {
    this.setState({ videoWindow: !this.state.videoWindow });
  };
  togglePopupActivity = () => {
    this.setState({ popupActivityWindow: !this.state.popupActivityWindow });
  };

  render() {
    const { appStore, settings } = this.props;
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

    return (
      <div>
        <button onClick={this.authenticateChat}>Login Rocketchat</button>
        <h1>{this.state.event}</h1>
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

        {slidesWindow && prezzieLink && (
          <Rnd
            default={{
              x: 0,
              y: 50,
              width: 600,
              height: 400,
            }}
            style={{ zIndex: onTop === slidesWindowTop ? 200 : 0 }}
            onClick={() => this.setState({ onTop: slidesWindowTop })}
          >
            <Window title="Slides" hideClose={false} onClose={toggleSlides} />
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
            onClick={() => this.setState({ onTop: chatWindowTop })}
          >
            <Window title="CIE Chat" onClose={toggleChat} />
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
            onClick={() => this.setState({ onTop: videoWindowTop })}
          >
            <Window title="Video" onClose={toggleVideo} />
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
            onClick={() => this.setState({ onTop: guacWindowTop })}
          >
            <Window title="Dev Environment" onClose={toggleGuac} />

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
        {popupActivityWindow && (
          <Bounce left>
            <Rnd
              default={{
                x: 605,
                y: 0,
                width: 800,
              }}
              style={{ zIndex: 300 }}
            >
              <Window
                className="rnd-header"
                title="Vocab Exercise"
                onClose={togglePopupActivity}
              />
              <PopupActivity
                activities={activityData}
                onClose={togglePopupActivity}
              />
            </Rnd>
          </Bounce>
        )}
      </div>
    );
  }
}

export { Aula };

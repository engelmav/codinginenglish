import React from "react";
import { Jutsu } from "./jitsiReact";

const room = "cie";
const password = "hardcodednonsense";
const VideoCall = (props) => {
  const { participantName, videoChannel } = props;
  console.log("Rendering Jutsu with participantName", participantName);
  return (
    <Jutsu
      roomName={videoChannel}
      displayName={participantName}
      password={password}
      onMeetingEnd={() => console.log("Meeting has ended")}
      loadingComponent={<p>loading ...</p>}
      errorComponent={<p>Oops, something went wrong</p>}
    />
  );
};

export default VideoCall;

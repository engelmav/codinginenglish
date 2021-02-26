import React from "react";
import { Jutsu } from "./jitsiReact";

const room = "cie";
const password = "what";
const VideoCall = (props) => {
  const { participantName } = props;
  return (
    <Jutsu
      roomName={room}
      displayName={participantName}
      password={password}
      onMeetingEnd={() => console.log("Meeting has ended")}
      loadingComponent={<p>loading ...</p>}
      errorComponent={<p>Oops, something went wrong</p>}
    />
  );
};

export default VideoCall;

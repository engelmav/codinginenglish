import React, { useEffect } from "react";
import { Jutsu } from "./jitsiReact";

const password = "hardcodednonsense";
const VideoCall = ({ participantName, videoChannel }) => {
  console.log("videoChannel:", videoChannel)
  useEffect(() => {}, [participantName, videoChannel]);
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

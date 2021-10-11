import React, { useEffect } from "react";
import { Jutsu } from "./jitsiReact";

const password = "hardcodednonsense";
const VideoCall = ({ participantName, videoChannel }) => {
  console.log("videoChannel:", videoChannel)
  
  useEffect(() => {}, [participantName, videoChannel]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.body.appendChild(script);
  return () => {
      document.body.removeChild(script);
    }
  }, []);
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

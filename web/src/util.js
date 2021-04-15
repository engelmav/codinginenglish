/* global window, navigator */

import { DateTime, Duration, Interval } from "luxon";
let userAgentString = navigator.userAgent;
let isChrome = userAgentString.indexOf("Chrome") > -1;
let isSafari = userAgentString.indexOf("Safari") > -1;

// Discard Safari since it also matches Chrome
if (isChrome && isSafari) isSafari = false;

const browserDetect = {
  // isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,

  // Firefox 1.0+
  // isFirefox: typeof InstallTrigger !== 'undefined',

  // Safari 3.0+ "[object HTMLElementConstructor]"
  isSafari: isSafari,
  // Internet Explorer 6-11
  // isIE: /*@cc_on!@*/false || !!document.documentMode,

  // Edge 20+
  // isEdge: !isIE && !!window.StyleMedia,

  // Chrome 1 - 71
  isChrome: isChrome,

  // Blink engine detection
  // isBlink: (isChrome || isOpera) && !!window.CSS
};

/**
 * Returns whether or not a class in session right now.
 * @param {number} timeWindowHours integer expressing number of hours from a given time.
 * @param {string} startDateTime string of the datetime a class is starting
 */
const isInSession = (startDateTime, durationMinutes) => {
  let nowUtc = DateTime.utc();
  const duration = Duration.fromObject({ minutes: durationMinutes });
  const start = DateTime.fromISO(startDateTime);
  const end = start.plus(duration);
  const interval = Interval.fromDateTimes(start, end);
  return interval.contains(nowUtc);
};

function hasActiveSession(userSessions) {
  let _hasActiveSession = false;
  userSessions.forEach((userSession) => {
    if (isInSession(userSession.start_time)) {
      console.log("User has an active session!");
      _hasActiveSession = true;
    }
  });
  return _hasActiveSession;
}

class StudentSessionManager {
  constructor(_EventSource) {
    this.EventSource = _EventSource;
    this.start = this.start.bind(this);
    this.onSessionStartCallbacks = [];
  }

  addOnSessionStart(callback) {
    this.onSessionStartCallbacks.push(callback);
  }
  onSessionStart(event) {
    this.onSessionStartCallbacks.forEach((cb) => cb(event));
  }
  onSessionEnd(callback) {
    this.onSessionEndCallback = callback;
  }
  start() {
    const socket = new WebSocket("ws://127.0.0.1:5000/ws/stream");
    socket.onerror = (err) => console.log("websockets error:", err);
    socket.onclose = (msg) => console.log("websockets close:", msg);
    socket.onopen = () => console.log("Connected to /ws/stream");
    socket.onmessage = (e) => {
      if (e.data instanceof Blob){
        const reader = new FileReader()
        reader.onload = () => console.log(reader.result);
        reader.readAsText(e.data)
      }
    };
  }
}

export function toLocalTime(dt) {
  var dtFromISO = DateTime.fromISO(dt);
  const localDt = dtFromISO.toLocaleString(DateTime.DATETIME_FULL);
  return localDt;
}

export { browserDetect, hasActiveSession, isInSession, StudentSessionManager };

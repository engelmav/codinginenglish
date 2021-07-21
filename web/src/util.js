/* global window, navigator */

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
const isInSession = async (startDateTime, durationMinutes) => {
  const luxonModule = await import(/* webpackChunkName: "luxon" */ "luxon");
  const { DateTime, Duration, Interval } = luxonModule;
  let nowUtc = DateTime.utc();
  const duration = Duration.fromObject({ minutes: durationMinutes });
  const start = DateTime.fromISO(startDateTime);
  const end = start.plus(duration);
  const interval = Interval.fromDateTimes(start, end);
  return interval.contains(nowUtc);
};

async function hasActiveSession(userSessions) {
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
  constructor(websocket) {
    this.websocket = websocket;
    this.start = this.initialize.bind(this);
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

  delegateEvent(data) {
    try {
      const eventData = JSON.parse(data);
      console.log("Event data:", eventData);
      const isStartEvent =
        eventData.hasOwnProperty("event_type") &&
        eventData.event_type === "session_start";
      if (isStartEvent) {
        console.log("Received sessionStart event");
        this.onSessionStart(eventData);
      }
    } catch (ex) {
      console.log("student-session-manager unable to parse event data:", data);
      throw ex;
    }
  }

  initialize() {
    console.log("websocket object:", this.websocket);
    this.websocket.addEventListener("message", (event) => {
      const { data } = event;
      if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          this.delegateEvent(reader.result);
        };
        reader.readAsText(data);
      }
    });
  }
}

export async function toLocalTime(dt) {
  const luxonModule = await import(/* webpackChunkName: "luxon" */ "luxon");
  const { DateTime } = luxonModule;
  var dtFromISO = DateTime.fromISO(dt);
  const localDt = dtFromISO.toLocaleString(DateTime.DATETIME_FULL);
  return localDt;
}

export { browserDetect, hasActiveSession, isInSession, StudentSessionManager };

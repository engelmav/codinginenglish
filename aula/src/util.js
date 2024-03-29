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
      _hasActiveSession = true;
    }
  });
  return _hasActiveSession;
}

export async function toLocalTime(dt) {
  const luxonModule = await import(/* webpackChunkName: "luxon" */ "luxon");
  const { DateTime } = luxonModule;
  var dtFromISO = DateTime.fromISO(dt);
  const localDt = dtFromISO.toLocaleString(DateTime.DATETIME_FULL);
  return localDt;
}

function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(
    (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
  );
}


export { browserDetect, hasActiveSession, isInSession };

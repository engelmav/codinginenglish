/* global window, navigator */

let userAgentString = navigator.userAgent;
let isChrome = userAgentString.indexOf("Chrome") > -1; 
let isSafari = userAgentString.indexOf("Safari") > -1; 
  
// Discard Safari since it also matches Chrome 
if ((isChrome) && (isSafari)) isSafari = false; 

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
}

export {
  browserDetect
};

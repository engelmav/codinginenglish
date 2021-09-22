import { css } from "styled-components";
import { css as compiledCss } from "@compiled/react"

export const debugBorder = css`
  /* border: 1px dotted blue; */
`;

const fontColor = css`
  color: #373737;
`;

export const ctaBlue = "#0095FF";
export const lightGray = "#f6f6f6";

export const darkGray = "#3d3636";
export const darkGrayRgb = "61,54,54";
/**
 * https://coolors.co/ff3e00
 */
export const cieOrange = "#ff3e00";
export const darkCieOrangeText = "#370E00";
export const lightCieOrangeBg = "#FFF1ED";
export const cieYellowAnalogous = "#FFEA00";
export const ciePurpleTemp = "#801F80";

export const fontFamily = "'Roboto', sans-serif";
const font = css`
  font-family: ${fontFamily};
  ${fontColor}
`;

export const fontMonospace = css`
  font-family: Roboto Mono, monospace;
`;

const orangeBgColor = css`
  background: #ff3e00;
`;

export const whenSmallScreen = (...args) => css`
  @media only screen and (max-width: 40em) {
    ${css(...args)}
  }
`;


export const smMediaQuery = "(max-width: 40em)";
export const smInputFontSize = "16px"; // using absolutes because of stripe nonsense
export const lgInputFontSize = "16px";
export const inputPadding = "15px";




export { font, fontColor, orangeBgColor };

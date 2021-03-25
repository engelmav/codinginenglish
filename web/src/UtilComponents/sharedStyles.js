import { css } from 'styled-components';

export const debugBorder = css`
  // border: 1px dotted blue;
`;

const fontColor = css`
  color: #373737;
`;


const lightGray = css`
  color: #6e6e6e;
`;

export const darkGray = "#3d3636";
export const cieOrange = "#ff3e00";

const font = css`
  font-family: 'Roboto', serif;
  ${fontColor}  
`;

const orangeBgColor = css`
  background: #ff3e00;
`;

export {
  font,
  fontColor,
  lightGray,
  orangeBgColor
 };
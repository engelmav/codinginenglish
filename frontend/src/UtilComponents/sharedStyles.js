import { css } from 'styled-components';

// darkGray for copy
const fontColor = css`
  color: #373737;
`;


const lightGray = css`
  color: #6e6e6e;
`;

const font = css`
  font-family: 'Roboto', serif;
  ${fontColor}  
`;

export {
  font,
  fontColor,
  lightGray
 };
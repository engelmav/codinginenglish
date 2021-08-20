import { css } from "styled-components";
import {
  debugBorder,
} from "./UtilComponents/sharedStyles";
import styled from "styled-components";
import { boxy } from "./UtilComponents";
import { typography } from "styled-system"


export const navbarCommonStyle = css`
  ${debugBorder}
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-family: "Roboto Mono", monospace;
  font-size: clamp(1rem, 1.25vw, 1.25rem);
  list-style-type: none;
  padding: 0;
  margin: 0;
  align-self: center;
  li {
    display: inline-block;
    padding-right: 10px;
  }
`;

export const LI = styled.li`
  ${boxy}
  list-style-type: none;
  a {
    ${typography}
    color: white;
    font-weight: 900;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    font-family: "Roboto Mono", monospace;
    padding-right: 4px;
    padding-left: 4px;
  }
  a:hover {
    background-color: #ff3e00;
    color: white;
    padding: 4px;
  }
`;
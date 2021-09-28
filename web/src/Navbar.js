import { css } from "styled-components";
import { styled } from "@compiled/react";

export const navbarCommonStyle = css`
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
  list-style-type: none;
  a {
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

import styled from "styled-components";
import {
  lightGray,
  orangeBgColor,
  darkGray,
  debugBorder,
  cieOrange,
} from "../UtilComponents/sharedStyles";

const BlockQuote = styled.blockquote`
  ${lightGray}
  font-family: serif;
  font-size: 1.5rem;

  p {
    background: #f9f9f9;
    border-left: 10px solid #ccc;
    margin: 1.5em 10px;
    margin-top:0px;
    padding: 30px;
    margin-bottom: 0;
    font-size: clamp(1rem, 1.25vw, 1.25rem);
  }

  p:before {
    color: #ccc;
    content: open-quote;
    font-size: 2em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
  }

  footer {
    font-size: 0.7em;
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    margin-top: 0;
  }

  a {
    text-decoration: none;
  }
`;

export default BlockQuote;

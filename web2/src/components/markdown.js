import { styled } from "@linaria/react";
import { Article } from "./layout";
import { minWidth } from "./responsive";
import { cieOrange } from "./colors";
import { H1, smFont } from "./typography";

export const MdArticle = styled(Article)`
  display: flex;
  flex-direction: column;
  padding: 2em;
  ${H1} {
    padding: 1em 0px 0.4em;
  }
  p {
    padding-bottom: 0.8em;
  }
  ul {
    padding-bottom: 0.8em;
  }
  table {
    align-self: center;
    border-collapse: collapse;
    margin-bottom: 0.8em;
    min-width: 100%;
    ${minWidth(["100%", "400px", "400px", "400px"])}
  }
  table tr {
    border-bottom: 1px solid
      ${(props) => (props.borderColor ? props.borderColor : cieOrange)};
  }
  table td {
    padding: 1em;
    font-size: ${smFont};
    color: ${(props) => (props.fontColor ? props.fontColor : "black")};
  }
  table th {
    padding: 5px;
    color: ${(props) => (props.headerColor ? props.headerColor : "black")};
  }
  .center {
    margin-top: 2em;
    align-self: center;
  }
  img {
    max-width: 64px;
  }
`;

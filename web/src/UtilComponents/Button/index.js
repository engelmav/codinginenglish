import styled from "styled-components";
import { space, flexbox } from "styled-system";
import { font, cieOrange } from "../sharedStyles";

const Button = styled.button`
  ${font}
  background-color: ${cieOrange};
  border: solid #ff3e00;
  border-width: 1px;
  color: white;
  padding: 8px;
  border-radius: 2px;
  cursor: pointer;
  ${space}
  ${flexbox}
  &:disabled,
  &[disabled]{
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    &:hover {  };
  };
  &:hover:enabled { 
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, .4);
  };
`;

/** @component */
export { Button };

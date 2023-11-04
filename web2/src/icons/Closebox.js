import styled from "styled-components";
import { darkGray } from "../UtilComponents/sharedStyles";
import { whenSmallScreen } from "../UtilComponents/sharedStyles";
import React from "react";

const CloseBoxStyle = styled.svg`
  display: none;
  color: white;
  background-color: ${darkGray};
  align-self: flex-end;
  cursor: pointer;
  transition: 0.2s;
  :hover {
    background-color: ${darkGray};
    color: white;
  }
  ${whenSmallScreen`
      display: block;`}
`;

const Closebox = (props) => {
  return (
    <CloseBoxStyle
      {...props}
      id="svg2"
      viewBox="0 0 744.09 1052.4"
      version="1.1"
    >
      <g id="layer1">
        <path
          id="path2989"
          d="m814.29 606.65a314.29 314.29 0 1 1 -628.57 0 314.29 314.29 0 1 1 628.57 0z"
          stroke="#000"
          stroke-width="5"
          transform="matrix(1.1048 0 0 1.1048 -179.21 -162.53)"
        />
        <g
          id="g3763"
          transform="matrix(.91837 0 0 .91837 47.587 10.944)"
          stroke="#fff"
          stroke-linecap="round"
          stroke-width="133.87"
          fill="none"
        >
          <path id="path2991" d="m176.51 362.87 356.13 356.13" />
          <path id="path2993" d="m532.64 362.87-356.13 356.13" />
        </g>
      </g>
    </CloseBoxStyle>
  );
};

export { Closebox };

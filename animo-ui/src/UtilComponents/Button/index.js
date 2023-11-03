import styled, { css } from "styled-components";
import {
  border,
  color,
  space,
  flexbox,
  typography,
  background,
  backgroundColor,
  boxShadow,
  layout,
} from "styled-system";
import {
  font,
  fontMonospace,
  cieOrange,
  darkGray,
  ctaBlue,
  whenSmallScreen,
  cieYellowAnalogous,
} from "../sharedStyles";
import { boxy } from "../Box";

import React from "react";

const commonStyles = css`
  ${font}
  ${space}
  ${flexbox}
  ${typography}
  ${background}
  background-color: ${cieOrange};
  border-radius: 2px;
  color: white;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
`;

const hoverStyles = css`
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
`;

export const LinkButton = styled.a`
  ${commonStyles}
  ${font}
  text-decoration: none;
  display: inline-block;
  text-align: center;
  padding: 10px;

  &:hover {
    ${hoverStyles}
  }
`;


const commonApply = css`
  font-family: Arial, Helvetica, sans-serif;
  border: 1px ${cieOrange} solid;
  border-radius: 5px;
  font-weight: 600;
  ${boxy}
  ${color}
  ${typography}
  ${flexbox} 
  ${border}
`;

export const Button = styled.button`
  ${commonApply}
  outline: 0;
  cursor: pointer;
  &:focus {
    outline: none;
    outline-offset: -4px;
  }
  &:active {
    transform: scale(0.99);
  }
`;
Button.defaultProps = {
  bg: cieOrange,
  py: 3,
  color: cieYellowAnalogous,
  borderColor: darkGray,
};

const StyledApplyLink = styled.a`
  ${commonApply}
  text-align: center;
  text-decoration: none;

  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  &:active {
    transform: scale(0.99);
  }
`;
StyledApplyLink.defaultProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

};
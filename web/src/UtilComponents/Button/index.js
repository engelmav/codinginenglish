import styled, { css } from "styled-components";
import { color, space, flexbox, typography } from "styled-system";
import { font, fontMonospace, cieOrange, ctaBlue, whenSmallScreen } from "../sharedStyles";
import { boxy } from "../Box";
import Link from "next/link";
import React from "react";

const commonStyles = css`
  ${font}
  ${space}
  ${flexbox}
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

const Button = styled.button.attrs((props) => {
  return { ...props };
})`
  ${boxy}
  ${space}
  ${commonStyles}
  font-family: Roboto;
  border: solid #ff3e00;
  border-width: 1px;
  &:disabled,
  &[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    &:hover {
    }
  }
  &:hover:enabled {
    ${hoverStyles}
  }
  ${color}
`;
Button.defaultProps = {
  fontSize: [1, 2, 2, 2],
  padding: [3, 3, 3, 3, 3]
}


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

const StyledLink = styled.a`
  ${boxy}
  text-align: center;
  color: white;
  ${typography}
  border-radius: 4px;
  background-color: ${cieOrange};
  text-decoration: none;
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);

  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
`;

StyledLink.defaultProps = {
  fontSize: [1, 2, 2, 2],
  padding: [3, 3, 3, 3, 3]
}

export const RegisterLink = (props) => {
  const { children, href, ...otherProps } = props;
  return (
    <Link href={href} passHref>
      <StyledLink {...otherProps}>{children}</StyledLink>
    </Link>
  );
};

export const ApplyButton = styled.button`
  background-color: rgba(255,255,255, 0);
  ${typography}
  ${color}
  ${flexbox}
  ${boxy}
  font-family: Roboto Mono;
  outline: 0;
  cursor: pointer;
  border: 2px black solid;
  border-radius: 2px;
  box-shadow: 1px 1px 1px yellow, 0 0 1em gray, 1px 1px 1px yellow;

  &:focus {
    outline: none;
    outline-offset: -4px;
  }

  &:active {
    transform: scale(0.99);
  }
  margin-left: 6px;
`;


export const NextRegisterLink = styled(Link);

export { Button };

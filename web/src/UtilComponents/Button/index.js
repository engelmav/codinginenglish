import styled, { css } from "styled-components";
import { border, color, space, flexbox, typography, background, backgroundColor, boxShadow } from "styled-system";
import { font, fontMonospace, cieOrange, ctaBlue, whenSmallScreen } from "../sharedStyles";
import { boxy } from "../Box";
import Link from "next/link";
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
  fontSize: [1, 1, 1, 1],
  p: 2
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

const commonApply = css`  
  font-family: Roboto Mono;
  border: 2px black solid;
  border-radius: 2px;
  ${color}
  ${typography}
  ${flexbox}
  ${boxy}
  ${border}
`

export const ApplyButton = styled.button`
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
ApplyButton.defaultProps = {
  py: 3
}

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
  py: 3
}

export const ApplyLink = (props) => {
  const { children, href, ...otherProps } = props;
  return (
    <Link href={href} passHref>
      <StyledApplyLink {...otherProps}>{children}</StyledApplyLink>
    </Link>
  );
};


export const NextRegisterLink = styled(Link);

export { Button };

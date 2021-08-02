import styled, { css } from "styled-components";
import { space, flexbox } from "styled-system";
import { font, fontMonospace, cieOrange } from "../sharedStyles";
import { boxy } from "../Box";
import Link from 'next/link'

const commonStyles = css`
  ${font}
  ${space}
  ${flexbox}
  background-color: ${cieOrange};
  border-radius: 2px;
  color: white;
  cursor: pointer;
`;

const hoverStyles = css`
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
`;

const Button = styled.button.attrs((props) => {
  return { ...props };
})`
  ${space}
  ${commonStyles}
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
`;
Button.defaultProps = {
  p: 2,
};

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

export const RegisterLink = styled(Link)`
  ${boxy}
  text-decoration: none;
  text-align: center;
  padding: 10px;
  color: white;
  border-radius: 2px;
  background: ${cieOrange};
  ${fontMonospace}
  a {
    color: ${cieOrange};
  }
  &:hover:enabled {
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
`;

export const NextRegisterLink = styled(Link)

export { Button };

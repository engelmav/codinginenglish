import { styled } from "@linaria/react";
import * as colors from "./colors"
import { fontSize } from "./responsive";


const headerFont = "Lato";
export const smFont = ".8em";

const color = {
  color: colors.darkGray
}

export const H1 = styled.h1`
  font-family: ${headerFont};
  ${color}
  font-size: 20px;
  ${fontSize([4, 5, 6])}
`;

export const H2 = styled.h2`
  font-family: ${headerFont};
  ${color}
  font-size: 16px;
  ${fontSize([3, 5, 6])}
`;

export const Title = styled.title`
  font-family: ${headerFont};
  color: ${props => props.color}
`;

export const UL = styled.ul`
  list-style-type: none;
  margin: 0;
`
export const Strong = styled.span`
  /* background: linear-gradient(to left, yellow, yellow 100%);
  background-position: 0 50%;
  background-size: 100% 0.8em;
  background-repeat: repeat-x; */
  color: ${colors.cieOrange};
`;
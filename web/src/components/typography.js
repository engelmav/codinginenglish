import { styled } from "@linaria/react";
import * as colors from "./colors"
import { fontSize } from "./responsive";


const headerFont = "Roboto Mono";
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
  ${color}
`;

export const UL = styled.ul`
  list-style-type: none;
  margin: 0;
`

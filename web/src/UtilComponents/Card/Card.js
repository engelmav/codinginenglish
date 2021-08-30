import styled from "styled-components";
import { whenSmallScreen, darkGray, lightGray } from "../sharedStyles";
import { Box, boxy } from "../Box";
import { typography, fontColor } from 'styled-system'

export const Card = styled.div`
  ${boxy}
  border-radius: 4px;
  background-color: ${lightGray};
`;

export const CardTitle = styled.h1`
  ${boxy}
  text-transform: uppercase;
  font-weight: 800;
  ${fontColor}
  ${typography}
`;

CardTitle.defaultProps = {
  fontFamily: "Roboto Mono"
}

export const CardContent = styled.div`
  ${boxy}

  ${whenSmallScreen`
  
`}
  align-self: center;
  display: flex;
  flex-direction: column;
`;

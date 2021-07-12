import styled from "styled-components";
import { whenSmallScreen, darkGray, lightGray } from "../sharedStyles";
import { Box } from "../Box";
import { P } from "../Typography/Typography";

export const Card = styled(Box)`
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  ${whenSmallScreen`
    padding: 10px;
  `}
  border-radius: 4px;
  background-color: ${lightGray}
`;

export const CardTitle = styled(P)`
  text-transform: uppercase;
  font-weight: 800;
  color: ${darkGray}
`;

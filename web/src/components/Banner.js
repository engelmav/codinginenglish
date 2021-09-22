import styled from "styled-components";
import { whenSmallScreen } from "../UtilComponents/sharedStyles"
export const Banner = styled.div`
  ${boxy}
  width: 100%;
  background: yellow;
  display: flex;
  justify-content: center;
  align-items: center;
  ${whenSmallScreen`
      font-size: 12px;
      padding-left: 3px;
  padding-right: 3px;
      `}
`;

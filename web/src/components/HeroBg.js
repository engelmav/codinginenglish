import styled from "styled-components";
import {boxy} from "../UtilComponents";
import {background } from "styled-system"
export const HeroBg = styled.div`
  width: 100vw;
  height: 30%;
  max-width: 100%;
  background-size: cover;
  ${background}
  ${boxy}
  h1 {
    text-shadow: 0.8px 0.5px 0.5px black, 0 0 1em black;
  }
`;
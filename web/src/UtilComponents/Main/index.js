import styled from 'styled-components';
import { boxy } from '../Box';
import { width } from "styled-system"


const Main = styled.main`
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  justify-content: center;
  flex: 1;
  ${boxy}
  ${width}
`;

Main.defaultProps = {
  width: ["100%"]
}

export { Main };

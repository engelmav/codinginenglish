import styled from 'styled-components';
import { boxy } from '../Box';
import { width } from "styled-system"


const Main = styled.main`

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  max-width: 800px;
  justify-content: center;
  flex: 1;
  ${boxy}
  ${width}
`;

Main.defaultProps = {
  width: ["100%"]
}

export { Main };

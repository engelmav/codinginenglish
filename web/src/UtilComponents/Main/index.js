import styled from 'styled-components';
import { boxy } from '../Box';
import { width } from "styled-system"


const Main = styled.main`
  ${boxy}
  ${width}
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  max-width: 800px;
  justify-content: center;
`;

Main.defaultProps = {
  px: [3],
  width: ["100%"]
}

export { Main };

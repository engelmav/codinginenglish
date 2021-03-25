import styled from 'styled-components';
import { space, flexbox } from 'styled-system';
import { font, cieOrange } from '../sharedStyles';


const Button = styled.button`
  ${font}
  background-color: ${cieOrange};
  border: solid #ff3e00;
  border-width: 1px;
  // color: #ff3e00;
  color: white;
  padding: 8px;
  border-radius: 2px;
  cursor: pointer;
  ${space}
  ${flexbox}
`

/** @component */
export { Button };
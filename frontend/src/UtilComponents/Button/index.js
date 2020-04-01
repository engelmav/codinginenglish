import styled from 'styled-components';
import { space, flexbox } from 'styled-system';


const Button = styled.button`
  font-family: 'Roboto', serif;
  background-color: white;
  border: solid #ff3e00;
  border-width: 2px;
  color: #ff3e00;
  padding: 8px;
  border-radius: 7px;
  &:hover {
    color: white;
    background-color: #ff3e00;
  }
  ${space}
  ${flexbox}
`

/** @component */
export { Button };
import React from 'react';
// import styles from './styles.css';
import styled from 'styled-components';
import { color, space } from 'styled-system';


const Button = styled.div`
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
`

export { Button };
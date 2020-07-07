import styled from 'styled-components';
import {
  Button,

  TextInput
} from '../UtilComponents';
import { font } from '../UtilComponents/sharedStyles';
export const PaymentInfo = styled.div`
  ${font}
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: 0.6em;
  align-items: center;
  grid-auto-flow: dense;
`;
export const NameField = styled(TextInput)`
  grid-column: 2 / 3;
  width: 100%;
  margin: 0;
  border: none;
  outline: none;
`;
export const PmtFormLabel = styled.label`
  align-self: start;
  text-align: right;
  width: auto;
  padding: 0;
  padding-top: 1px;
  margin: 0;
  font-size: 85%;
  font-weight: 600;
  white-space: nowrap;

`;
export const BuyButton = styled(Button)`
  grid-column: 2 / 3;
  border-color: black;
  background-color: black;
  color: white;
  &:hover {
    color: black;
    background-color: white;
  }
  margin-top: 6px;
  justify-self: start;
`;
export const CcySelect = styled.select`
  justify-self: start;
`;

export const Form = styled.form`

`;

export const EmailNote = styled.p`
  font-style: italic;
  font-size: .8em;
  margin: 0;
  padding-top: 1px;
  padding-bottom: 1px;
`;

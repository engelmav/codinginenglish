import styled from "styled-components";
import { debugBorder } from "../UtilComponents/sharedStyles";
import { Button, TextInput } from "../UtilComponents";
import { font } from "../UtilComponents/sharedStyles";

export const PaymentInfo = styled.div`
  ${font}
  display: flex;
  flex-wrap: wrap;
  ${debugBorder}
  max-width: 800px;
`;
export const PaymentInfoField = styled(TextInput)`
  width: 100%;
  margin-bottom: 10px;
`;
export const PmtFormLabel = styled.label`
  padding: 0;
  padding-top: 1px;
  margin: 0;
  font-size: 85%;
  font-weight: 600;
`;
export const BuyButton = styled(Button)`
  border-color: black;
  background-color: black;
  color: white;
  &:hover {
    color: black;
    background-color: white;
  }
  margin-top: 6px;
  width: 100%;
  justify-self: flex-end;
  padding: 15px;
  font-weight: 900;
`;
export const CcySelect = styled.select`

`;

export const Form = styled.form``;

export const EmailNote = styled.p`
  font-style: italic;
  font-size: 0.8rem;
  margin: 0;
  padding-top: 1px;
  padding-bottom: 10px;
`;

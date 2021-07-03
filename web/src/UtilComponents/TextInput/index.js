import styled from "styled-components";
import { space } from "styled-system";
import {
  fontFamily,
  inputPadding,
  lgInputFontSize,
  smInputFontSize,
  whenSmallScreen,
} from "../sharedStyles";

export const inputFormBorder = "1px dotted black";
export const inputFormBorderRadius = "3px";

export const TextInput = styled.input.attrs((props) => {
  return { ...props };
})`
  ${space}
  border: ${inputFormBorder};
  border-radius: ${inputFormBorderRadius};
  font-family: ${fontFamily};
  font-size: ${lgInputFontSize};
  padding: ${inputPadding};
  margin: 0;
  ${whenSmallScreen`
    font-size: ${smInputFontSize}
  `}
`;

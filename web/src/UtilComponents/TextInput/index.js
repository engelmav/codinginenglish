import styled from "styled-components";
import { space } from "styled-system";
import {
  fontFamily,
  lgInputFontSize,
  smInputFontSize,
  whenSmallScreen,
} from "../sharedStyles";

export const inputFormBorder = "1px dotted black";
export const inputFormBorderRadius = "3px";

const TextInput = styled.input.attrs((props) => {
  return { ...props };
})`
  ${space}
  border: ${inputFormBorder};
  border-radius: ${inputFormBorderRadius};
  font-family: ${fontFamily};
  font-size: ${lgInputFontSize};
  ${whenSmallScreen`
    font-size: ${smInputFontSize}
  `}
`;
TextInput.defaultProps = {
  p: 2,
};
export { TextInput };

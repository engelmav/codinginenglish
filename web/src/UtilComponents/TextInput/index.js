import styled from "styled-components";
import { space } from "styled-system";
import {
  darkGray,
  fontFamily,
  lgInputFontSize,
  smInputFontSize,
  whenSmallScreen,
} from "../sharedStyles";
import { boxy } from "../Box";
import React, { useEffect } from "react";
import { FaTimesCircle } from "@react-icons/all-files/fa/FaTimesCircle";

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

const ButtonDiv = styled.div`
  ${boxy}
  position: relative;
  input {
    width: 100%;
  }
  div {
    position: absolute;

    right: 11px;
    z-index: 2;
    border: none;
    top: 4px;
    height: 30px;
    cursor: pointer;
    color: ${darkGray};

    transform: translateX(2px);
  }
`;

const ZIndexWrapper = styled.div`
    z-index: 2;
`
export const ClearableTextInput = (props) => {
  useEffect(() => {}, [props.value]);
  const { id, name, onChange, value, button } = props;
  const { onClear, ...remainingProps } = props; // don't pass onClear to text field
  let derivedButton;
  if (button){
    derivedButton = <ZIndexWrapper>{button}</ZIndexWrapper>
  } else {
    derivedButton = <div onClick={onClear}>
    <FaTimesCircle />
  </div>
  }
    
 
  return (
    <ButtonDiv>
      <TextInput
        id={id}
        name={name}
        value={value || ""}
        {...remainingProps}
        onChange={onChange}
      />
      {derivedButton}
    </ButtonDiv>
  );
};

import React from "react";
import styled from "styled-components";
import { Box } from "../Box";
import { typography } from "styled-system";
import { fontFamily } from "../sharedStyles";

const StyledDiv = styled(Box)`
  border: 1px solid red;
  border-radius: 4px;
  color: red;
  ${typography}
  font-family: ${fontFamily};
`;

const AlertMessage = (props) => {
  const { text } = props;
  return <StyledDiv {...props}>{text}</StyledDiv>;
};

export { AlertMessage };

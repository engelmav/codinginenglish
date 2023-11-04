import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import styled from "styled-components";
import { color } from "styled-system";

const StyledScaleLoader = styled(ScaleLoader)`
  ${color}
`;

export const Spinner = (props) => {
  const { size } = props;
  const computedSize = size ? size : 10;
  return <StyledScaleLoader height={computedSize} loading={true} {...props} />;
};

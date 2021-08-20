import styled from "styled-components";
import { flexbox, space } from "styled-system";
import React from "react";

const AutoScaleImageStyle = styled.img`
  ${flexbox}
  ${space}
  height: auto; /* compute a height that preserves the aspect ratio */
`;

export const AutoScaleImage = (props) => {
  const { width, height, maxWidth, mt, mb, sizes } = props;
  return (
    <AutoScaleImageStyle
      mt={mt}
      mb={mb}
      style={{ maxWidth: maxWidth }}
      width={width}
      height={height}
      sizes={sizes}
      {...props}
    />
  );
};

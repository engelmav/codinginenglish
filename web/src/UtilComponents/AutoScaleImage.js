import styled from "styled-components";
import { flexbox, space } from "styled-system";
import React from "react";

const AutoScaleImageStyle = styled.img`
  ${flexbox}
  ${space}
  width: 100%; /* scale with content width */
  height: auto; /* compute a height that preserves the aspect ratio */
`;

export const AutoScaleImage = (props) => {
  const { width, height, maxWidth, mt, mb, sizes } = props;
  console.log("autoscale image props:", props)
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

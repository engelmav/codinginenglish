import styled from "styled-components";
import { flexbox, space } from "styled-system";
import React, { useRef, useState } from "react";
import { useIntersection } from "../lib/useIntersectionObserver";
import { styled as compiledStyled } from "@compiled/react"

const ImgContainer = compiledStyled.div`
  display: flex;
  justify-content: center;
`

const AutoScaleImageStyle = styled.img`
  ${flexbox}
  ${space}
  height: auto; /* compute a height that preserves the aspect ratio */
`;

export const AutoScaleImage = (props) => {
  const { width, height, maxWidth, minWidth, mt, mb, sizes } = props;
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  useIntersection(imgRef, () => setIsInView(true));
  return (
    <ImgContainer ref={imgRef}>
      {isInView && (
        <AutoScaleImageStyle
          mt={mt}
          mb={mb}
          style={{ maxWidth, minWidth }}
          width={width}
          height={height}
          sizes={sizes}
          {...props}
        />
      )}
    </ImgContainer>
  );
};

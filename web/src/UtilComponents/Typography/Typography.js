import styled from "styled-components";
import { typography, space, border, fontSize } from "styled-system";
import { boxy } from "../Box";
import { font, fontColor, debugBorder, darkGray } from "../sharedStyles";

export const Title = styled.h1`
  font-family: Noto Sans;
  ${space}
  ${fontColor}
  ${typography}
  font-size: max(1.75rem, min(2.5rem, 3vw));
  width: 100%;
`;
//Title.defaultProps = {}

export const TitleH1 = styled.h1`
  ${fontSize}
  ${space}
  ${fontColor}
  font-family: Noto Sans;
`;

TitleH1.defaultProps = {
  fontSize: ["35px", "40px", "60px", "65px"],
};

export const H2 = styled.h2`
  ${space}
  ${fontSize}
  ${fontColor}
  ${typography}
  font-family: Noto Sans;
  text-align: center;
`;
H2.defaultProps = {
  mt: 3,
  mb: 2,
  fontSize: ["30px", "35px", "40px", "50px"],
};

export const TitleH2 = styled.h2`
  ${boxy}
  ${space}
  ${fontColor}
  ${typography}

  font-size: max(1.45rem, min(2.0rem, 2.5vw));
`;

export const P = styled.p`
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}
  ${border}
  ${boxy}

  line-height: 1.5em;
  hyphens: auto;
`;

P.defaultProps = {
  mb: 2,
};

const Ol = styled.ol`
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}

  line-height: 1.5em;
  height: auto;

  li {
    margin-left: 50px;
  }
`;
Ol.defaultProps = {
  p: 3,
};
export { Ol };

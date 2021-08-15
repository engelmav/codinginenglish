import styled from "styled-components";
import { typography, space, border, fontSize } from "styled-system";
import { boxy } from "../Box";
import { font, fontColor, debugBorder } from "../sharedStyles";

export const Title = styled.h1`
  font-family: Andale Mono,AndaleMono,monospace;
  ${space}
  ${fontColor}
  ${typography}

  font-size: max(1.75rem, min(2.5rem, 3vw));
  width: 100%;
`;
//Title.defaultProps = {}

export const TitleH1 = styled.h1`
  ${space}
  ${fontColor}
  ${typography}

  font-family: Andale Mono,AndaleMono,monospace;
  font-size: 50px;
  margin: 35px 0;
`;

export const H2 = styled.h2`
  ${space}
  ${fontSize}
  ${fontColor}
  ${typography}

  font-family: Andale Mono,AndaleMono,monospace;
  font-size: 36px;
  margin: 15px 0;
  text-align: center;
`;

export const TitleH2 = styled.h2`
  ${boxy}
  ${space}
  ${fontColor}
  ${typography}

  font-size: max(1.45rem, min(2.0rem, 2.5vw));
`;
//TitleH2.defaultProps = {}

export const P = styled.p`
  ${font}
  ${fontColor}
  ${debugBorder}
  ${space}
  ${typography}
  ${border}

  line-height: 1.5em;
  hyphens: auto;
`;

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
